import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Price per night in cents (110 EUR = 11000 cents)
const PRICE_PER_NIGHT_CENTS = 11000;
// Price for bath cards in cents (22 EUR = 2200 cents)
const BATH_CARDS_PRICE_CENTS = 2200;

// Rate limiting: simple in-memory store (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10; // 10 attempts per hour
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(clientIp);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }
  
  record.count++;
  return false;
}

// Input validation schema
const checkoutSchema = z.object({
  nights: z.number().int().min(0, "Izberi veljavno možnost").max(7, "Največ 7 noči"),
  giverFirstName: z.string().min(2, "Ime mora imeti vsaj 2 znaka").max(100, "Ime je predolgo").trim(),
  giverLastName: z.string().min(2, "Priimek mora imeti vsaj 2 znaka").max(100, "Priimek je predolg").trim(),
  giverAddress: z.string().min(5, "Naslov mora imeti vsaj 5 znakov").max(255, "Naslov je predolg").trim(),
  giverPostalCode: z.string().min(4, "Poštna številka mora imeti vsaj 4 znake").max(20, "Poštna številka je predolga").trim(),
  giverCity: z.string().min(2, "Mesto mora imeti vsaj 2 znaka").max(100, "Mesto je predolgo").trim(),
  giverEmail: z.string().email("Neveljaven e-mail naslov").max(254, "E-mail je predolg"),
  recipientEmail: z.string().email("Neveljaven e-mail naslov prejemnika").max(254, "E-mail je predolg"),
  recipientMessage: z.string().min(10, "Sporočilo mora imeti vsaj 10 znakov").max(500, "Sporočilo je predolgo (max 500 znakov)").trim(),
  // Honeypot fields for bot detection (should be empty)
  company_name: z.string().max(0, "Invalid submission").optional().default(""),
  fax_number: z.string().max(0, "Invalid submission").optional().default(""),
});

type CheckoutRequest = z.infer<typeof checkoutSchema>;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    if (isRateLimited(clientIp)) {
      console.warn("[CREATE-CHECKOUT] Rate limit exceeded for IP:", clientIp);
      return new Response(
        JSON.stringify({ error: "Preveč zahtevkov. Prosimo, poskusite čez nekaj časa." }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("[CREATE-CHECKOUT] Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase configuration is missing");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Parse and validate input
    const rawData = await req.json();
    const parseResult = checkoutSchema.safeParse(rawData);
    
    if (!parseResult.success) {
      // Log detailed errors server-side only for debugging
      console.warn("[CREATE-CHECKOUT] Validation failed:", JSON.stringify(parseResult.error.errors));
      // Return generic error message to prevent information leakage
      return new Response(
        JSON.stringify({ error: "Prosimo, preverite vnesene podatke." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = parseResult.data;
    
    // Bot detection: honeypot fields should be empty
    if (data.company_name || data.fax_number) {
      console.warn("[CREATE-CHECKOUT] Bot detected via honeypot fields from IP:", clientIp);
      // Return a fake success to not alert bots
      return new Response(
        JSON.stringify({ url: "https://lavitarelax.lovable.app/gift-voucher?error=session" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    console.log("[CREATE-CHECKOUT] Validated data:", { 
      nights: data.nights, 
      giverEmail: data.giverEmail,
      recipientEmail: data.recipientEmail 
    });

    // Calculate total amount based on product type
    const isBathCards = data.nights === 0;
    const amountCents = isBathCards ? BATH_CARDS_PRICE_CENTS : data.nights * PRICE_PER_NIGHT_CENTS;
    console.log("[CREATE-CHECKOUT] Amount:", amountCents, "cents for", isBathCards ? "bath cards" : `${data.nights} nights`);

    // Generate a unique voucher code
    const voucherCode = `LV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    console.log("[CREATE-CHECKOUT] Generated voucher code:", voucherCode);

    // Create pending voucher in database
    const { data: voucher, error: voucherError } = await supabase
      .from("gift_vouchers")
      .insert({
        code: voucherCode,
        nights: data.nights,
        amount_cents: amountCents,
        giver_first_name: data.giverFirstName,
        giver_last_name: data.giverLastName,
        giver_address: data.giverAddress,
        giver_postal_code: data.giverPostalCode,
        giver_city: data.giverCity,
        giver_email: data.giverEmail,
        recipient_email: data.recipientEmail,
        recipient_message: data.recipientMessage,
        status: "pending",
      })
      .select()
      .single();

    if (voucherError) {
      console.error("[CREATE-CHECKOUT] Error creating voucher:", voucherError);
      throw new Error("Failed to create voucher record");
    }

    console.log("[CREATE-CHECKOUT] Voucher created:", voucher.id);

    // Create Stripe Checkout session
    const origin = req.headers.get("origin") || "https://lavitarelax.lovable.app";
    
    // Product name based on type
    const productName = isBathCards 
      ? "2x kopalne karte - La Vita Hiška"
      : `Darilni bon La Vita Hiška - ${data.nights} ${data.nights === 1 ? "noč" : data.nights < 5 ? "noči" : "noči"}`;
    
    const productDescription = isBathCards
      ? "2x Celodnevne karte za neomejen vstop v Termalni Kompleks Terme 3000"
      : `Darilni bon za ${data.nights} ${data.nights === 1 ? "nočitev" : "nočitev"} v La Vita Hiški v Termah 3000`;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: productName,
              description: productDescription,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/gift-voucher/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/gift-voucher?cancelled=true`,
      customer_email: data.giverEmail,
      metadata: {
        voucher_id: voucher.id,
        voucher_code: voucherCode,
        nights: data.nights.toString(),
        recipient_email: data.recipientEmail,
      },
    });

    console.log("[CREATE-CHECKOUT] Stripe session created:", session.id);

    // Update voucher with session ID
    await supabase
      .from("gift_vouchers")
      .update({ stripe_session_id: session.id })
      .eq("id", voucher.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("[CREATE-CHECKOUT] Error:", error);
    return new Response(
      JSON.stringify({ error: "Prišlo je do napake pri ustvarjanju plačila. Prosimo, poskusite znova." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

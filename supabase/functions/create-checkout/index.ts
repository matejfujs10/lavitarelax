import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRICE_PER_NIGHT_CENTS = 11000;
const BATH_CARDS_PRICE_CENTS = 2200;

// Rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(clientIp);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (record.count >= RATE_LIMIT_MAX) return true;
  record.count++;
  return false;
}

// Generate voucher code in format LVH-3000-YYYYMMDD-XXXX
function generateVoucherCode(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `LVH-3000-${y}${m}${d}-${suffix}`;
}

const checkoutSchema = z.object({
  nights: z.number().int().min(0).max(7),
  giverFirstName: z.string().min(2).max(100).trim(),
  giverLastName: z.string().min(2).max(100).trim(),
  giverAddress: z.string().min(5).max(255).trim(),
  giverPostalCode: z.string().min(4).max(20).trim(),
  giverCity: z.string().min(2).max(100).trim(),
  giverEmail: z.string().email().max(254),
  recipientFirstName: z.string().min(2).max(100).trim(),
  recipientLastName: z.string().min(2).max(100).trim(),
  recipientEmail: z.string().email().max(254),
  recipientMessage: z.string().min(10).max(500).trim(),
  company_name: z.string().max(0).optional().default(""),
  fax_number: z.string().max(0).optional().default(""),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || "unknown";
    
    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ error: "Preveč zahtevkov. Prosimo, poskusite čez nekaj časa." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) throw new Error("Supabase configuration is missing");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const rawData = await req.json();
    const parseResult = checkoutSchema.safeParse(rawData);
    
    if (!parseResult.success) {
      console.warn("[CREATE-CHECKOUT] Validation failed:", JSON.stringify(parseResult.error.errors));
      return new Response(
        JSON.stringify({ error: "Prosimo, preverite vnesene podatke." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = parseResult.data;
    
    // Bot detection
    if (data.company_name || data.fax_number) {
      return new Response(
        JSON.stringify({ url: "https://lavitarelax.lovable.app/gift-voucher?error=session" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isBathCards = data.nights === 0;
    const amountCents = isBathCards ? BATH_CARDS_PRICE_CENTS : data.nights * PRICE_PER_NIGHT_CENTS;

    // Generate unique voucher code with uniqueness check
    let voucherCode = generateVoucherCode();
    let attempts = 0;
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from("gift_vouchers")
        .select("id")
        .eq("code", voucherCode)
        .maybeSingle();
      if (!existing) break;
      voucherCode = generateVoucherCode();
      attempts++;
    }

    console.log("[CREATE-CHECKOUT] Generated voucher code:", voucherCode);

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
        recipient_first_name: data.recipientFirstName,
        recipient_last_name: data.recipientLastName,
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

    const origin = req.headers.get("origin") || "https://www.lavitaterme3000.com";
    
    const productName = isBathCards 
      ? "2x kopalne karte - La Vita Hiška"
      : `Darilni bon La Vita Hiška - ${data.nights} ${data.nights === 1 ? "noč" : "noči"}`;
    
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
        recipient_first_name: data.recipientFirstName,
        recipient_last_name: data.recipientLastName,
      },
    });

    await supabase
      .from("gift_vouchers")
      .update({ stripe_session_id: session.id })
      .eq("id", voucher.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("[CREATE-CHECKOUT] Error:", error);
    return new Response(
      JSON.stringify({ error: "Prišlo je do napake pri ustvarjanju plačila. Prosimo, poskusite znova." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

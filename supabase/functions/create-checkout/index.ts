import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Price per night in cents (110 EUR = 11000 cents)
const PRICE_PER_NIGHT_CENTS = 11000;

interface CheckoutRequest {
  nights: number;
  giverFirstName: string;
  giverLastName: string;
  giverAddress: string;
  giverPostalCode: string;
  giverCity: string;
  giverEmail: string;
  recipientEmail: string;
  recipientMessage: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const data: CheckoutRequest = await req.json();
    console.log("[CREATE-CHECKOUT] Received data:", { 
      nights: data.nights, 
      giverEmail: data.giverEmail,
      recipientEmail: data.recipientEmail 
    });

    // Validate nights (1-7)
    if (data.nights < 1 || data.nights > 7) {
      throw new Error("Invalid number of nights. Must be between 1 and 7.");
    }

    // Calculate total amount
    const amountCents = data.nights * PRICE_PER_NIGHT_CENTS;
    console.log("[CREATE-CHECKOUT] Amount:", amountCents, "cents for", data.nights, "nights");

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
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Darilni bon La Vita Hiška - ${data.nights} ${data.nights === 1 ? "noč" : data.nights < 5 ? "noči" : "noči"}`,
              description: `Darilni bon za ${data.nights} ${data.nights === 1 ? "nočitev" : "nočitev"} v La Vita Hiški v Termah 3000`,
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
  } catch (error: any) {
    console.error("[CREATE-CHECKOUT] Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

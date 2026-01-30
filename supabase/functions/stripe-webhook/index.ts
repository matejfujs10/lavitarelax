import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

// Generate PDF voucher as base64
function generateVoucherPDF(voucher: any): string {
  const validUntil = new Date(voucher.valid_until);
  const issuedAt = new Date(voucher.issued_at);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("sl-SI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const amountEur = voucher.amount_cents / 100;
  const nightsText = voucher.nights === 1 ? "noč" : voucher.nights < 5 ? "noči" : "noči";

  // Simple HTML template that will be converted to PDF-like content
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: A4 landscape; margin: 0; }
    body {
      font-family: 'Georgia', serif;
      margin: 0;
      padding: 40px;
      background: linear-gradient(135deg, #f5f5dc 0%, #e8dcc4 100%);
      min-height: 100vh;
      box-sizing: border-box;
    }
    .voucher {
      border: 3px solid #8b7355;
      border-radius: 20px;
      padding: 40px;
      background: white;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #8b7355;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .title {
      font-size: 36px;
      color: #5d4e37;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 3px;
    }
    .subtitle {
      font-size: 18px;
      color: #8b7355;
      margin-top: 10px;
    }
    .content {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .left-section, .right-section {
      flex: 1;
    }
    .label {
      font-size: 12px;
      color: #888;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .value {
      font-size: 18px;
      color: #333;
      margin-bottom: 20px;
    }
    .amount {
      font-size: 48px;
      color: #5d4e37;
      font-weight: bold;
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, #f5f5dc 0%, #e8dcc4 100%);
      border-radius: 10px;
      margin: 20px 0;
    }
    .code {
      text-align: center;
      font-size: 24px;
      font-family: monospace;
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      letter-spacing: 2px;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
    .message {
      font-style: italic;
      text-align: center;
      padding: 20px;
      background: #fafafa;
      border-radius: 10px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="voucher">
    <div class="header">
      <h1 class="title">Darilni Bon</h1>
      <p class="subtitle">La Vita Hiška • Terme 3000</p>
    </div>
    
    <div class="amount">
      ${voucher.nights} ${nightsText} • ${amountEur.toFixed(0)} €
    </div>
    
    <div class="content">
      <div class="left-section">
        <div class="label">Prejemnik</div>
        <div class="value">${voucher.recipient_email}</div>
        
        <div class="label">Datum izdaje</div>
        <div class="value">${formatDate(issuedAt)}</div>
      </div>
      
      <div class="right-section">
        <div class="label">Podarja</div>
        <div class="value">${voucher.giver_first_name} ${voucher.giver_last_name}</div>
        
        <div class="label">Veljavno do</div>
        <div class="value">${formatDate(validUntil)}</div>
      </div>
    </div>
    
    ${voucher.recipient_message ? `
    <div class="message">
      "${voucher.recipient_message}"
    </div>
    ` : ''}
    
    <div class="code">
      Koda bona: <strong>${voucher.code}</strong>
    </div>
    
    <div class="footer">
      <p>Ta bon je veljaven za nočitev v La Vita Hiški v Termah 3000.</p>
      <p>Za rezervacijo kontaktirajte: lavitarelax@gmail.com | rent@lavitaterme3000.com</p>
    </div>
  </div>
</body>
</html>`;

  // Convert to base64 for email attachment
  const encoder = new TextEncoder();
  const htmlBytes = encoder.encode(html);
  return btoa(String.fromCharCode(...htmlBytes));
}

// Send email with voucher
async function sendVoucherEmail(voucher: any, toEmail: string, isRecipient: boolean): Promise<void> {
  const amountEur = voucher.amount_cents / 100;
  const nightsText = voucher.nights === 1 ? "noč" : voucher.nights < 5 ? "noči" : "noči";
  
  const validUntil = new Date(voucher.valid_until);
  const formatDate = (date: Date) => date.toLocaleDateString("sl-SI");

  const subject = isRecipient 
    ? `🎁 Prejeli ste darilni bon za La Vita Hiško!`
    : `Potrditev nakupa darilnega bona - La Vita Hiška`;

  const recipientName = isRecipient ? "Spoštovani" : `${voucher.giver_first_name} ${voucher.giver_last_name}`;
  
  const bodyText = isRecipient
    ? `
${recipientName},

Prejeli ste čudovit darilni bon za oddih v La Vita Hiški v Termah 3000!

Podarja: ${voucher.giver_first_name} ${voucher.giver_last_name}

Vrednost bona: ${voucher.nights} ${nightsText} (${amountEur.toFixed(0)} €)
Koda bona: ${voucher.code}
Veljavnost: do ${formatDate(validUntil)}

${voucher.recipient_message ? `\nOsebno sporočilo:\n"${voucher.recipient_message}"\n` : ''}

Za rezervacijo termina nas kontaktirajte na:
📧 lavitarelax@gmail.com
📧 rent@lavitaterme3000.com

Veselimo se vašega obiska!

Lep pozdrav,
Ekipa La Vita Hiška
    `
    : `
Spoštovani ${recipientName},

Zahvaljujemo se vam za nakup darilnega bona za La Vita Hiško!

Podatki o bonu:
- Vrednost: ${voucher.nights} ${nightsText} (${amountEur.toFixed(0)} €)
- Koda bona: ${voucher.code}
- Veljavnost: do ${formatDate(validUntil)}
- Prejemnik: ${voucher.recipient_email}

Bon je bil poslan prejemniku na naslov ${voucher.recipient_email}.

Hvala za zaupanje!

Lep pozdrav,
Ekipa La Vita Hiška
    `;

  // Use Resend API if available, otherwise log
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  
  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "La Vita Hiška <noreply@lavitarelax.lovable.app>",
          to: [toEmail],
          subject: subject,
          text: bodyText,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[STRIPE-WEBHOOK] Resend error:", errorText);
      } else {
        console.log("[STRIPE-WEBHOOK] Email sent to:", toEmail);
      }
    } catch (error) {
      console.error("[STRIPE-WEBHOOK] Error sending email:", error);
    }
  } else {
    // Log email for debugging when Resend is not configured
    console.log("[STRIPE-WEBHOOK] Would send email to:", toEmail);
    console.log("[STRIPE-WEBHOOK] Subject:", subject);
    console.log("[STRIPE-WEBHOOK] Body:", bodyText);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!stripeKey || !webhookSecret) {
    console.error("[STRIPE-WEBHOOK] Missing Stripe configuration");
    return new Response(
      JSON.stringify({ error: "Stripe configuration missing" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("[STRIPE-WEBHOOK] Missing Supabase configuration");
    return new Response(
      JSON.stringify({ error: "Supabase configuration missing" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.error("[STRIPE-WEBHOOK] Missing signature");
      return new Response(
        JSON.stringify({ error: "Missing signature" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("[STRIPE-WEBHOOK] Signature verification failed:", err.message);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[STRIPE-WEBHOOK] Event received:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log("[STRIPE-WEBHOOK] Processing completed checkout:", session.id);
      console.log("[STRIPE-WEBHOOK] Metadata:", session.metadata);

      const voucherId = session.metadata?.voucher_id;
      const voucherCode = session.metadata?.voucher_code;

      if (!voucherId) {
        console.error("[STRIPE-WEBHOOK] Missing voucher_id in metadata");
        return new Response(
          JSON.stringify({ error: "Missing voucher_id in metadata" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Calculate validity (1 year from now)
      const now = new Date();
      const validUntil = new Date(now);
      validUntil.setFullYear(validUntil.getFullYear() + 1);

      // Update voucher status to paid
      const { data: voucher, error: updateError } = await supabase
        .from("gift_vouchers")
        .update({
          status: "paid",
          stripe_payment_intent_id: session.payment_intent as string,
          issued_at: now.toISOString(),
          valid_until: validUntil.toISOString(),
        })
        .eq("id", voucherId)
        .select()
        .single();

      if (updateError) {
        console.error("[STRIPE-WEBHOOK] Error updating voucher:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update voucher" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("[STRIPE-WEBHOOK] Voucher updated:", voucher.id, "Status:", voucher.status);

      // Send emails
      // 1. To recipient
      await sendVoucherEmail(voucher, voucher.recipient_email, true);
      
      // 2. To giver (confirmation)
      await sendVoucherEmail(voucher, voucher.giver_email, false);
      
      // 3. To admin
      await sendVoucherEmail(voucher, "lavitarelax@gmail.com", false);

      console.log("[STRIPE-WEBHOOK] Processing complete for voucher:", voucherCode);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("[STRIPE-WEBHOOK] Error:", error);
    return new Response(
      JSON.stringify({ error: "Napaka pri obdelavi webhook dogodka. Stripe bo poskusil znova." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

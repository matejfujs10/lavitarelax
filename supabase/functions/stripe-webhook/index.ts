import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

function formatDateSl(date: Date): string {
  return date.toLocaleDateString("sl-SI", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function getNightsText(nights: number): string {
  if (nights === 0) return "2x kopalni karti";
  return `${nights} ${nights === 1 ? "noč" : "noči"}`;
}

// Generate dynamic voucher HTML for bath cards (kopalne karte)
function generateBathCardsVoucherHtml(voucher: any): string {
  const safeRecipient = escapeHtml(`${voucher.recipient_first_name || ""} ${voucher.recipient_last_name || ""}`);
  const safeGiver = escapeHtml(`${voucher.giver_first_name || ""} ${voucher.giver_last_name || ""}`);

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">
<style>
  @page { size: A4 landscape; margin: 0; }
  body { font-family: 'Georgia', serif; margin: 0; padding: 40px; background: linear-gradient(135deg, #f5f5dc 0%, #e8dcc4 100%); min-height: 100vh; box-sizing: border-box; }
  .voucher { border: 3px solid #8b7355; border-radius: 20px; padding: 40px; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.1); max-width: 900px; margin: 0 auto; }
  .header { text-align: center; border-bottom: 2px solid #8b7355; padding-bottom: 20px; margin-bottom: 30px; }
  .title { font-size: 36px; color: #5d4e37; margin: 0; text-transform: uppercase; letter-spacing: 3px; }
  .subtitle { font-size: 18px; color: #8b7355; margin-top: 10px; }
  .amount { font-size: 42px; color: #5d4e37; font-weight: bold; text-align: center; padding: 20px; background: linear-gradient(135deg, #f5f5dc 0%, #e8dcc4 100%); border-radius: 10px; margin: 20px 0; }
  .fields { display: flex; flex-wrap: wrap; gap: 20px; margin: 30px 0; }
  .field { flex: 1; min-width: 200px; }
  .label { font-size: 12px; color: #888; text-transform: uppercase; margin-bottom: 5px; }
  .value { font-size: 18px; color: #333; }
  .code { text-align: center; font-size: 24px; font-family: monospace; background: #f5f5f5; padding: 15px; border-radius: 8px; letter-spacing: 2px; margin-top: 20px; }
  .footer { text-align: center; font-size: 12px; color: #888; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
</style>
</head>
<body>
<div class="voucher">
  <div class="header">
    <h1 class="title">Darilni Bon</h1>
    <p class="subtitle">La Vita Hiška • Terme 3000</p>
  </div>
  <div class="amount">2x Kopalni Karti</div>
  <div class="fields">
    <div class="field"><div class="label">Prejemnik</div><div class="value">${safeRecipient}</div></div>
    <div class="field"><div class="label">Podarja</div><div class="value">${safeGiver}</div></div>
    <div class="field"><div class="label">Vrsta</div><div class="value">2x Celodnevne kopalne karte za Termalni Kompleks Terme 3000</div></div>
    <div class="field"><div class="label">Datum izdaje</div><div class="value">${formatDateSl(new Date(voucher.issued_at))}</div></div>
  </div>
  <div class="code">Koda bona: <strong>${escapeHtml(voucher.code)}</strong></div>
  <div class="footer">
    <p>Bon velja 1 leto od datuma izdaje. Prevzem kart na Recepciji Kampa (doplačilo 6,50 €).</p>
    <p>Za rezervacijo kontaktirajte: rent@lavitaterme3000.com | www.lavitaterme3000.com</p>
  </div>
</div>
</body>
</html>`;
}

// Generate dynamic voucher HTML for "ŠTEVILO NOČI" type
function generateDynamicVoucherHtml(voucher: any): string {
  const safeRecipient = escapeHtml(`${voucher.recipient_first_name || ""} ${voucher.recipient_last_name || ""}`);
  const safeGiver = escapeHtml(`${voucher.giver_first_name || ""} ${voucher.giver_last_name || ""}`);
  const nightsText = getNightsText(voucher.nights);

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">
<style>
  @page { size: A4 landscape; margin: 0; }
  body { font-family: 'Georgia', serif; margin: 0; padding: 40px; background: linear-gradient(135deg, #f5f5dc 0%, #e8dcc4 100%); min-height: 100vh; box-sizing: border-box; }
  .voucher { border: 3px solid #8b7355; border-radius: 20px; padding: 40px; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.1); max-width: 900px; margin: 0 auto; }
  .header { text-align: center; border-bottom: 2px solid #8b7355; padding-bottom: 20px; margin-bottom: 30px; }
  .title { font-size: 36px; color: #5d4e37; margin: 0; text-transform: uppercase; letter-spacing: 3px; }
  .subtitle { font-size: 18px; color: #8b7355; margin-top: 10px; }
  .amount { font-size: 42px; color: #5d4e37; font-weight: bold; text-align: center; padding: 20px; background: linear-gradient(135deg, #f5f5dc 0%, #e8dcc4 100%); border-radius: 10px; margin: 20px 0; }
  .fields { display: flex; flex-wrap: wrap; gap: 20px; margin: 30px 0; }
  .field { flex: 1; min-width: 200px; }
  .label { font-size: 12px; color: #888; text-transform: uppercase; margin-bottom: 5px; }
  .value { font-size: 18px; color: #333; }
  .code { text-align: center; font-size: 24px; font-family: monospace; background: #f5f5f5; padding: 15px; border-radius: 8px; letter-spacing: 2px; margin-top: 20px; }
  .footer { text-align: center; font-size: 12px; color: #888; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
</style>
</head>
<body>
<div class="voucher">
  <div class="header">
    <h1 class="title">Darilni Bon</h1>
    <p class="subtitle">La Vita Hiška • Terme 3000</p>
  </div>
  <div class="amount">${nightsText}</div>
  <div class="fields">
    <div class="field"><div class="label">Prejemnik</div><div class="value">${safeRecipient}</div></div>
    <div class="field"><div class="label">Podarja</div><div class="value">${safeGiver}</div></div>
    <div class="field"><div class="label">Število noči / Vrednost</div><div class="value">${nightsText}</div></div>
    <div class="field"><div class="label">Datum izdaje</div><div class="value">${formatDateSl(new Date(voucher.issued_at))}</div></div>
  </div>
  <div class="code">Koda bona: <strong>${escapeHtml(voucher.code)}</strong></div>
  <div class="footer">
    <p>Bon velja 1 leto od datuma izdaje. Za rezervacijo kontaktirajte: rent@lavitaterme3000.com</p>
    <p>www.lavitaterme3000.com</p>
  </div>
</div>
</body>
</html>`;
}

// Send email via Resend
async function sendEmail(
  resendApiKey: string,
  to: string,
  subject: string,
  htmlBody: string,
  attachmentBase64?: string,
  attachmentFilename?: string
): Promise<boolean> {
  try {
    const payload: any = {
      from: "Hiška La Vita <rent@lavitaterme3000.com>",
      to: [to],
      subject,
      html: htmlBody,
    };
    if (attachmentBase64 && attachmentFilename) {
      payload.attachments = [{
        content: attachmentBase64,
        filename: attachmentFilename,
      }];
    }
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[STRIPE-WEBHOOK] Resend error:", errorText);
      return false;
    }
    console.log("[STRIPE-WEBHOOK] Email sent to:", to);
    return true;
  } catch (error) {
    console.error("[STRIPE-WEBHOOK] Error sending email:", error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const resendApiKey = Deno.env.get("RESEND_API_KEY");

  if (!stripeKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
    console.error("[STRIPE-WEBHOOK] Missing configuration");
    return new Response(JSON.stringify({ error: "Configuration missing" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(JSON.stringify({ error: "Missing signature" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("[STRIPE-WEBHOOK] Signature verification failed:", err.message);
      return new Response(JSON.stringify({ error: "Signature verification failed" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[STRIPE-WEBHOOK] Event received:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const voucherId = session.metadata?.voucher_id;

      if (!voucherId) {
        console.error("[STRIPE-WEBHOOK] Missing voucher_id in metadata");
        return new Response(JSON.stringify({ error: "Missing voucher_id" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const now = new Date();
      const validUntil = new Date(now);
      validUntil.setFullYear(validUntil.getFullYear() + 1);

      // Update voucher status
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

      if (updateError || !voucher) {
        console.error("[STRIPE-WEBHOOK] Error updating voucher:", updateError);
        return new Response(JSON.stringify({ error: "Failed to update voucher" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("[STRIPE-WEBHOOK] Voucher updated:", voucher.id);

      const isBathCards = voucher.nights === 0;
      const nightsText = getNightsText(voucher.nights);
      const recipientName = `${voucher.recipient_first_name || ""} ${voucher.recipient_last_name || ""}`.trim();
      const giverName = `${voucher.giver_first_name || ""} ${voucher.giver_last_name || ""}`.trim();

      // Generate voucher attachment
      let attachmentBase64: string | undefined;
      let attachmentFilename: string | undefined;

      if (isBathCards) {
        // Dynamic voucher for bath cards
        const voucherHtml = generateBathCardsVoucherHtml(voucher);
        const encoder = new TextEncoder();
        const bytes = encoder.encode(voucherHtml);
        attachmentBase64 = btoa(String.fromCharCode(...bytes));
        attachmentFilename = `Darilni-bon-kopalne-karte-${voucher.code}.html`;
        await supabase.from("gift_vouchers").update({ voucher_generated: true }).eq("id", voucher.id);
      } else {
        // Dynamic voucher for nights
        const voucherHtml = generateDynamicVoucherHtml(voucher);
        const encoder = new TextEncoder();
        const bytes = encoder.encode(voucherHtml);
        attachmentBase64 = btoa(String.fromCharCode(...bytes));
        attachmentFilename = `Darilni-bon-${voucher.nights}-noci-${voucher.code}.html`;
        await supabase.from("gift_vouchers").update({ voucher_generated: true }).eq("id", voucher.id);
      }

      // Email subjects per mapping table
      const recipientSubject = isBathCards
        ? "Darilni bon – Kopalne karte"
        : `Darilni bon – ${nightsText}`;

      const adminSubject = `NOV NAKUP DARILNEGA BONA – ${voucher.code}`;

      if (!resendApiKey) {
        console.warn("[STRIPE-WEBHOOK] RESEND_API_KEY not configured, skipping emails");
        await supabase.from("gift_vouchers").update({
          error_message: "RESEND_API_KEY not configured",
        }).eq("id", voucher.id);
      } else {
        // 1. Send to recipient
        const recipientHtml = `
          <h2>🎁 Prejeli ste darilni bon za La Vita Hiško!</h2>
          <p>Spoštovani ${escapeHtml(recipientName)},</p>
          <p>Nekdo posebno misli na vas! ${escapeHtml(giverName)} vam je podaril/a darilni bon za La Vita Hiško – Terme 3000.</p>
          <table style="border-collapse:collapse;margin:20px 0;">
            <tr><td style="padding:8px;font-weight:bold;">Podarja:</td><td style="padding:8px;">${escapeHtml(giverName)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Prejemnik:</td><td style="padding:8px;">${escapeHtml(recipientName)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Vrednost:</td><td style="padding:8px;">${nightsText}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Koda bona:</td><td style="padding:8px;font-family:monospace;font-size:18px;">${escapeHtml(voucher.code)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Datum izdaje:</td><td style="padding:8px;">${formatDateSl(now)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Veljavnost:</td><td style="padding:8px;">do ${formatDateSl(validUntil)}</td></tr>
          </table>
          ${voucher.recipient_message ? `<p><em>💌 Osebno sporočilo: "${escapeHtml(voucher.recipient_message)}"</em></p>` : ""}
          <p>Za rezervacijo nas kontaktirajte na <a href="mailto:rent@lavitaterme3000.com">rent@lavitaterme3000.com</a></p>
          <p>Topel pozdrav,<br/>Ekipa La Vita Hiška – Terme 3000</p>
        `;

        const recipientSent = await sendEmail(
          resendApiKey,
          voucher.recipient_email,
          recipientSubject,
          recipientHtml,
          attachmentBase64,
          attachmentFilename
        );

        await supabase.from("gift_vouchers").update({ recipient_email_sent: recipientSent }).eq("id", voucher.id);

        // 2. Send to giver (confirmation)
        const giverHtml = `
          <h2>Potrditev nakupa darilnega bona</h2>
          <p>Spoštovani ${escapeHtml(giverName)},</p>
          <p>Hvala za nakup darilnega bona za La Vita Hiško! 💚</p>
          <table style="border-collapse:collapse;margin:20px 0;">
            <tr><td style="padding:8px;font-weight:bold;">Vrednost:</td><td style="padding:8px;">${nightsText}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Koda bona:</td><td style="padding:8px;font-family:monospace;">${escapeHtml(voucher.code)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Prejemnik:</td><td style="padding:8px;">${escapeHtml(voucher.recipient_email)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Veljavnost:</td><td style="padding:8px;">do ${formatDateSl(validUntil)}</td></tr>
          </table>
          <p>Bon je bil poslan prejemniku na ${escapeHtml(voucher.recipient_email)}.</p>
          <p>Topel pozdrav,<br/>Ekipa La Vita Hiška – Terme 3000</p>
        `;

        await sendEmail(resendApiKey, voucher.giver_email, "Potrditev nakupa darilnega bona – La Vita Hiška", giverHtml);

        // 3. Send admin notification
        const adminHtml = `
          <h2>NOV NAKUP DARILNEGA BONA</h2>
          <table style="border-collapse:collapse;margin:20px 0;width:100%;">
            <tr><td style="padding:8px;font-weight:bold;">Prejemnik:</td><td style="padding:8px;">${escapeHtml(recipientName)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Email prejemnika:</td><td style="padding:8px;">${escapeHtml(voucher.recipient_email)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Podarja:</td><td style="padding:8px;">${escapeHtml(giverName)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Email darovalca:</td><td style="padding:8px;">${escapeHtml(voucher.giver_email)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Izbran produkt:</td><td style="padding:8px;">${isBathCards ? "Kopalne karte" : "Število noči"}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Število noči / Vrednost:</td><td style="padding:8px;">${nightsText} (${(voucher.amount_cents / 100).toFixed(0)} €)</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Sporočilo:</td><td style="padding:8px;">${escapeHtml(voucher.recipient_message || "-")}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Koda bona:</td><td style="padding:8px;font-family:monospace;">${escapeHtml(voucher.code)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Datum izdaje:</td><td style="padding:8px;">${formatDateSl(now)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Stripe Payment ID:</td><td style="padding:8px;">${session.payment_intent || "-"}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;">Naslov darovalca:</td><td style="padding:8px;">${escapeHtml(voucher.giver_address)}, ${escapeHtml(voucher.giver_postal_code)} ${escapeHtml(voucher.giver_city)}</td></tr>
          </table>
        `;

        const adminSent = await sendEmail(
          resendApiKey,
          "rent@lavitaterme3000.com",
          adminSubject,
          adminHtml,
          attachmentBase64,
          attachmentFilename
        );

        await supabase.from("gift_vouchers").update({ admin_email_sent: adminSent }).eq("id", voucher.id);
      }

      console.log("[STRIPE-WEBHOOK] Processing complete for voucher:", voucher.code);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("[STRIPE-WEBHOOK] Error:", error);
    return new Response(JSON.stringify({ error: "Webhook processing error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

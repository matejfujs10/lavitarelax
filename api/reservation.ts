import { Resend } from "resend";

// Prevent broken HTML / injection
function escapeHtml(input: unknown) {
  return String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

type Lang = "sl" | "en" | "de" | "hr";

function pickLang(input: unknown): Lang {
  const v = String(input ?? "sl").toLowerCase();
  if (v === "en" || v === "de" || v === "hr" || v === "sl") return v as Lang;
  return "sl";
}

function guestEmail(lang: Lang, name: string, checkIn: string, checkOut: string) {
  const safeName = escapeHtml(name);
  const safeIn = escapeHtml(checkIn);
  const safeOut = escapeHtml(checkOut);

  const T: Record<Lang, { subject: string; greeting: string; body: string; dates: string; signoff: string; team: string }> = {
    sl: {
      subject: "Zahvala za vašo rezervacijo – Hiška La Vita",
      greeting: `Pozdravljeni gospa/gospod ${safeName},`,
      body: "zahvaljujemo se vam za rezervacijo naše Počitniške Hiške v enem izmed najbolj priljubljenih kampov v Sloveniji. V kratkem času vas bomo kontaktirali.",
      dates: `Termin: ${safeIn} → ${safeOut}`,
      signoff: "Lep pozdrav,",
      team: "Ekipa Hiška La Vita",
    },
    en: {
      subject: "Thank you for your reservation – La Vita House",
      greeting: `Dear ${safeName},`,
      body: "thank you for booking our Holiday House in one of the most popular camps in Slovenia. We will contact you shortly.",
      dates: `Dates: ${safeIn} → ${safeOut}`,
      signoff: "Kind regards,",
      team: "The La Vita House Team",
    },
    de: {
      subject: "Vielen Dank für Ihre Reservierung – Haus La Vita",
      greeting: `Sehr geehrte/r Frau/Herr ${safeName},`,
      body: "vielen Dank für die Reservierung unseres Ferienhauses in einem der beliebtesten Campingplätze Sloweniens. Wir werden Sie in Kürze kontaktieren.",
      dates: `Termin: ${safeIn} → ${safeOut}`,
      signoff: "Mit freundlichen Grüßen,",
      team: "Ihr Team von Haus La Vita",
    },
    hr: {
      subject: "Hvala na Vašoj rezervaciji – Kućica La Vita",
      greeting: `Poštovani gospođo/gospodine ${safeName},`,
      body: "zahvaljujemo se na rezervaciji naše Kućice u jednom od najpopularnijih kampova u Sloveniji. Uskoro ćemo Vas kontaktirati.",
      dates: `Termin: ${safeIn} → ${safeOut}`,
      signoff: "Srdačan pozdrav,",
      team: "Ekipa Kućica La Vita",
    },
  };

  const t = T[lang];
  const html = `
    <div style="font-family:Arial,sans-serif;color:#222;line-height:1.6">
      <h2 style="color:#3a5a40">${t.greeting}</h2>
      <p>${t.body}</p>
      <p style="margin-top:16px"><b>${t.dates}</b></p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
      <p>${t.signoff}<br/><b>${t.team}</b></p>
      <p style="font-size:12px;color:#888">rent@lavitaterme3000.com · lavitaterme3000.com</p>
    </div>
  `;
  return { subject: t.subject, html };
}

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, hint: "Use POST /api/reservation" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ ok: false, error: "Missing RESEND_API_KEY on server" });
    }

    const resend = new Resend(apiKey);
    const body = req.body ?? {};

    const name = body.name;
    const email = body.email;
    const phone = body.phone;
    const checkIn = body.checkIn;
    const checkOut = body.checkOut;
    const guests = body.guests;
    const message = body.message;
    const priceTotal = body.priceTotal;
    const priceNights = body.priceNights;
    const pricePerNight = body.pricePerNight;
    const language = pickLang(body.language);

    if (!name || !email || !checkIn || !checkOut) {
      return res.status(400).json({
        ok: false,
        error: "Missing required fields (name, email, checkIn, checkOut)",
      });
    }

    const priceLine = priceTotal != null ? ` | Cena: ${priceTotal}€` : "";
    const subject = `Nova rezervacija: ${name} (${checkIn} → ${checkOut})${priceLine}`;

    const priceBlock =
      priceTotal != null
        ? `
      <hr/>
      <h3>Izračun cene</h3>
      <p><b>Število nočitev:</b> ${escapeHtml(priceNights)}</p>
      <p><b>Cena na noč:</b> ${escapeHtml(pricePerNight)}€</p>
      <p style="font-size:18px"><b>Končna cena: ${escapeHtml(priceTotal)}€</b></p>
    `
        : "";

    const html = `
      <h2>Nova rezervacija (La Vita Terme 3000)</h2>
      <p><b>Ime:</b> ${escapeHtml(name)}</p>
      <p><b>Email:</b> ${escapeHtml(email)}</p>
      <p><b>Telefon:</b> ${escapeHtml(phone || "-")}</p>
      <p><b>Prihod:</b> ${escapeHtml(checkIn)}</p>
      <p><b>Odhod:</b> ${escapeHtml(checkOut)}</p>
      <p><b>Št. oseb:</b> ${escapeHtml(guests ?? "-")}</p>
      <p><b>Jezik gosta:</b> ${escapeHtml(language)}</p>
      <p><b>Sporočilo:</b><br/>${escapeHtml(message || "-").replace(/\n/g, "<br/>")}</p>
      ${priceBlock}
      <hr/>
      <p>Poslano iz obrazca na lavitaterme3000.com</p>
    `;

    // 1) Notify owner
    const { error } = await resend.emails.send({
      from: "La Vita <rent@lavitaterme3000.com>",
      to: ["rent@lavitaterme3000.com"],
      replyTo: String(email),
      subject,
      html,
    });

    if (error) {
      return res.status(500).json({ ok: false, error });
    }

    // 2) Send thank-you to guest in their language (best-effort)
    try {
      const { subject: gSub, html: gHtml } = guestEmail(language, String(name), String(checkIn), String(checkOut));
      await resend.emails.send({
        from: "Hiška La Vita <rent@lavitaterme3000.com>",
        to: [String(email)],
        replyTo: "rent@lavitaterme3000.com",
        subject: gSub,
        html: gHtml,
      });
    } catch (e) {
      console.error("Guest confirmation email failed:", e);
    }

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      error: err?.message ?? "Server error",
    });
  }
}

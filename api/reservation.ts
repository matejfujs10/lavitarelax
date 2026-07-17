import { Resend } from "resend";
import { z } from "zod";

// Prevent broken HTML / injection
function escapeHtml(input: unknown) {
  return String(input ?? "")
    .split("&").join("&amp;")
    .split("<").join("&lt;")
    .split(">").join("&gt;")
    .split('"').join("&quot;")
    .split("'").join("&#039;");
}

type Lang = "sl" | "en" | "de" | "hr";

// ---- In-memory rate limiting (best-effort per serverless instance) ----
const ipHits = new Map<string, { count: number; resetAt: number }>();
const emailHits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const IP_MAX = 5;
const EMAIL_MAX = 3;

function rateLimited(
  key: string,
  store: Map<string, { count: number; resetAt: number }>,
  max: number,
): boolean {
  const now = Date.now();
  const rec = store.get(key);
  if (!rec || now > rec.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (rec.count >= max) return true;
  rec.count++;
  return false;
}

function getClientIp(req: any): string {
  const fwd = req.headers?.["x-forwarded-for"];
  const raw = Array.isArray(fwd) ? fwd[0] : fwd;
  if (typeof raw === "string" && raw.length) return raw.split(",")[0].trim();
  return req.headers?.["cf-connecting-ip"] || req.socket?.remoteAddress || "unknown";
}

// ---- Security event logging (structured logs + best-effort DB insert) ----
async function logSecurityEvent(
  event_type: string,
  severity: "info" | "warning" | "critical",
  ip: string,
  ua: string,
  details: Record<string, unknown>,
) {
  // Always emit a structured log — captured by the platform log stream.
  console.warn(
    `[security_event] ${JSON.stringify({ event_type, severity, source: "api/reservation", ip, ua, details })}`,
  );
  // Best-effort persist to Supabase if service creds are available at runtime.
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;
  try {
    await fetch(`${url}/rest/v1/security_events`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        event_type,
        severity,
        source: "api/reservation",
        ip,
        user_agent: ua,
        details,
      }),
    });
  } catch (e) {
    console.error("security_event persist failed:", e);
  }
}

// ---- Input validation ----
const reservationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid checkIn date").max(20),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid checkOut date").max(20),
  guests: z.union([z.string().max(20), z.number().int().min(1).max(50)]).optional(),
  message: z.string().max(2000).optional().or(z.literal("")),
  priceTotal: z.union([z.number(), z.string().max(20)]).optional().nullable(),
  priceNights: z.union([z.number(), z.string().max(20)]).optional().nullable(),
  pricePerNight: z.union([z.number(), z.string().max(20)]).optional().nullable(),
  language: z.enum(["sl", "en", "de", "hr"]).optional().default("sl"),
  // Honeypot fields — real users leave these empty
  website: z.string().max(0).optional().default(""),
  company: z.string().max(0).optional().default(""),
});

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

    // Rate limit by IP first (cheap check before parsing)
    const ip = getClientIp(req);
    if (rateLimited(ip, ipHits, IP_MAX)) {
      return res.status(429).json({ ok: false, error: "Too many requests. Please try again later." });
    }

    const rawBody = req.body ?? {};
    const parsed = reservationSchema.safeParse(rawBody);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: "Invalid input",
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const data = parsed.data;

    // Honeypot — pretend success to avoid signaling bots
    if (data.website || data.company) {
      return res.status(200).json({ ok: true });
    }

    // Rate limit by email
    if (rateLimited(data.email.toLowerCase(), emailHits, EMAIL_MAX)) {
      return res.status(429).json({ ok: false, error: "Too many requests for this email. Please try again later." });
    }

    // Validate date order
    if (new Date(data.checkOut) <= new Date(data.checkIn)) {
      return res.status(400).json({ ok: false, error: "checkOut must be after checkIn" });
    }

    const resend = new Resend(apiKey);
    const { name, email, phone, checkIn, checkOut, guests, message, priceTotal, priceNights, pricePerNight, language } = data;

    const priceLine = priceTotal != null && priceTotal !== "" ? ` | Cena: ${priceTotal}€` : "";
    const subject = `Nova rezervacija: ${name} (${checkIn} → ${checkOut})${priceLine}`;

    const priceBlock =
      priceTotal != null && priceTotal !== ""
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
      reply_to: String(email),
      subject,
      html,
    });

    if (error) {
      return res.status(500).json({ ok: false, error: "Failed to send notification" });
    }

    // 2) Send thank-you to guest in their language (best-effort)
    try {
      const { subject: gSub, html: gHtml } = guestEmail(language as Lang, String(name), String(checkIn), String(checkOut));
      await resend.emails.send({
        from: "Hiška La Vita <rent@lavitaterme3000.com>",
        to: [String(email)],
        reply_to: "rent@lavitaterme3000.com",
        subject: gSub,
        html: gHtml,
      });
    } catch (e) {
      console.error("Guest confirmation email failed:", e);
    }

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("reservation error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}

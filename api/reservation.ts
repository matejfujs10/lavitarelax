import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(input: unknown) {
  return String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const body = req.body ?? {};

    const name = body.name;
    const email = body.email;
    const phone = body.phone;
    const checkIn = body.checkIn;
    const checkOut = body.checkOut;
    const guests = body.guests;
    const message = body.message;

    if (!name || !email || !checkIn || !checkOut) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    const subject = `Nova rezervacija: ${name} (${checkIn} → ${checkOut})`;

    const html = `
      <h2>Nova rezervacija (La Vita Terme 3000)</h2>
      <p><b>Ime:</b> ${escapeHtml(name)}</p>
      <p><b>Email:</b> ${escapeHtml(email)}</p>
      <p><b>Telefon:</b> ${escapeHtml(phone || "-")}</p>
      <p><b>Prihod:</b> ${escapeHtml(checkIn)}</p>
      <p><b>Odhod:</b> ${escapeHtml(checkOut)}</p>
      <p><b>Št. oseb:</b> ${escapeHtml(guests ?? "-")}</p>
      <p><b>Sporočilo:</b><br/>${escapeHtml(message || "-").replace(/\n/g, "<br/>")}</p>
      <hr/>
      <p>Poslano iz obrazca na lavitaterme3000.com</p>
    `;

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

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message ?? "Server error" });
  }
}

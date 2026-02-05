import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Rate limiting: simple in-memory store (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
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
const guestSchema = z.object({
  name: z.string().min(1, "Ime gosta je obvezno").max(100, "Ime je predolgo").trim(),
  email: z.string().email("Neveljaven e-mail").max(254).optional().or(z.literal('')),
});

const bookingSchema = z.object({
  fullName: z.string().min(2, "Ime mora imeti vsaj 2 znaka").max(100, "Ime je predolgo").trim(),
  email: z.string().email("Neveljaven e-mail naslov").max(254),
  arrivalDate: z.string().min(1, "Datum prihoda je obvezen").max(50),
  departureDate: z.string().min(1, "Datum odhoda je obvezen").max(50),
  arrivalTime: z.string().max(50).default(""),
  guests: z.array(guestSchema).max(20, "Preveč gostov (max 20)").default([]),
  hasPets: z.boolean(),
  agreeTerms: z.boolean().refine(val => val === true, "Morate se strinjati s pogoji"),
  language: z.enum(['sl', 'en', 'de']).default('en'),
  // Honeypot fields for bot detection (should be empty)
  website: z.string().max(0, "Invalid submission").optional().default(""),
  phone_confirm: z.string().max(0, "Invalid submission").optional().default(""),
});

// Escape HTML to prevent injection in email templates
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Send email using Resend API
// Note: For production, verify your domain at https://resend.com/domains
// Currently using Resend's onboarding domain for testing
async function sendEmail(
  apiKey: string,
  to: string[],
  subject: string,
  text: string,
  replyTo?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Using Resend's onboarding domain for now
        // To use custom domain, verify lavitarelax.lovable.app at https://resend.com/domains
        from: "La Vita Hiška <onboarding@resend.dev>",
        to,
        subject,
        text,
        ...(replyTo && { reply_to: replyTo }),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend API error:", errorText);
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: String(error) };
  }
}

// Localized email content
const emailTemplates = {
  sl: {
    subject: (name: string, arrival: string, departure: string) => 
      `Nova rezervacija: ${name} (${arrival} - ${departure})`,
    ownerBody: (data: {
      name: string;
      email: string;
      arrivalDate: string;
      departureDate: string;
      arrivalTime: string;
      guestsList: string;
      hasPets: boolean;
    }) => `
Nova rezervacija za La Vita Hiško

Kontaktna oseba:
  Ime in priimek: ${data.name}
  E-mail: ${data.email}

Datumi:
  Prihod: ${data.arrivalDate}
  Odhod: ${data.departureDate}
  Okvirni čas prihoda: ${data.arrivalTime || 'Po dogovoru'}

Gostje:
${data.guestsList || '  Ni dodatnih gostov'}

Hišni ljubljenček: ${data.hasPets ? 'DA (+ 5€/noč)' : 'NE'}
    `.trim(),
    customerSubject: 'Potrditev rezervacije – La Vita Hiška',
    customerBody: (name: string) => `
Spoštovani ${name},

Hvala za vašo rezervacijo.
Vaše povpraševanje smo uspešno prejeli in vas bomo v najkrajšem možnem času kontaktirali.

Lep pozdrav,
Ekipa La Vita

---
La Vita Hiška
Kamp Terme 3000, Moravske Toplice
Tel: +386 68 169 430
E-pošta: rent@lavitaterme3000.com
    `.trim(),
    successMessage: 'Rezervacija uspešno poslana!',
  },
  en: {
    subject: (name: string, arrival: string, departure: string) => 
      `New reservation: ${name} (${arrival} - ${departure})`,
    ownerBody: (data: {
      name: string;
      email: string;
      arrivalDate: string;
      departureDate: string;
      arrivalTime: string;
      guestsList: string;
      hasPets: boolean;
    }) => `
New reservation for La Vita House

Contact person:
  Full name: ${data.name}
  Email: ${data.email}

Dates:
  Arrival: ${data.arrivalDate}
  Departure: ${data.departureDate}
  Approximate arrival time: ${data.arrivalTime || 'By agreement'}

Guests:
${data.guestsList || '  No additional guests'}

Pet: ${data.hasPets ? 'YES (+ €5/night)' : 'NO'}
    `.trim(),
    customerSubject: 'Booking Confirmation – La Vita House',
    customerBody: (name: string) => `
Dear ${name},

Thank you for your reservation.
We have successfully received your request and will contact you as soon as possible.

Best regards,
Team La Vita

---
La Vita House
Camp Terme 3000, Moravske Toplice
Phone: +386 68 169 430
Email: rent@lavitaterme3000.com
    `.trim(),
    successMessage: 'Reservation sent successfully!',
  },
  de: {
    subject: (name: string, arrival: string, departure: string) => 
      `Neue Reservierung: ${name} (${arrival} - ${departure})`,
    ownerBody: (data: {
      name: string;
      email: string;
      arrivalDate: string;
      departureDate: string;
      arrivalTime: string;
      guestsList: string;
      hasPets: boolean;
    }) => `
Neue Reservierung für Ferienhaus La Vita

Kontaktperson:
  Vollständiger Name: ${data.name}
  E-Mail: ${data.email}

Termine:
  Ankunft: ${data.arrivalDate}
  Abreise: ${data.departureDate}
  Ungefähre Ankunftszeit: ${data.arrivalTime || 'Nach Vereinbarung'}

Gäste:
${data.guestsList || '  Keine zusätzlichen Gäste'}

Haustier: ${data.hasPets ? 'JA (+ 5€/Nacht)' : 'NEIN'}
    `.trim(),
    customerSubject: 'Buchungsbestätigung – Ferienhaus La Vita',
    customerBody: (name: string) => `
Sehr geehrte/r ${name},

Vielen Dank für Ihre Reservierung.
Wir haben Ihre Anfrage erfolgreich erhalten und werden Sie so schnell wie möglich kontaktieren.

Mit freundlichen Grüßen,
Team La Vita

---
Ferienhaus La Vita
Camp Terme 3000, Moravske Toplice
Telefon: +386 68 169 430
E-Mail: rent@lavitaterme3000.com
    `.trim(),
    successMessage: 'Reservierung erfolgreich gesendet!',
  },
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";
    
    if (isRateLimited(clientIp)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return new Response(
        JSON.stringify({ 
          error: "Too many requests. Please try again later." 
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Parse and validate input
    const rawData = await req.json();
    const parseResult = bookingSchema.safeParse(rawData);
    
    if (!parseResult.success) {
      const errors = parseResult.error.errors.map(e => e.message).join(", ");
      console.warn("Validation failed:", errors);
      return new Response(
        JSON.stringify({ error: errors }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const bookingData = parseResult.data;
    const lang = bookingData.language;
    const template = emailTemplates[lang] || emailTemplates.en;
    
    // Bot detection: honeypot fields should be empty
    if (bookingData.website || bookingData.phone_confirm) {
      console.warn("Bot detected via honeypot fields from IP:", clientIp);
      // Return success to not alert bots, but don't process
      return new Response(
        JSON.stringify({ success: true, message: template.successMessage }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    console.log("Received valid booking request for:", bookingData.email, "language:", lang);

    // Escape all user inputs for safe template interpolation
    const safeName = escapeHtml(bookingData.fullName);
    const safeEmail = escapeHtml(bookingData.email);
    const safeArrivalDate = escapeHtml(bookingData.arrivalDate);
    const safeDepartureDate = escapeHtml(bookingData.departureDate);
    const safeArrivalTime = escapeHtml(bookingData.arrivalTime);

    // Format guests list with escaped values
    const guestsList = bookingData.guests
      .map((g, i) => {
        const guestName = escapeHtml(g.name);
        const safeGuestEmail = g.email ? escapeHtml(g.email) : '';
        return `  ${i + 1}. ${guestName}${safeGuestEmail ? ` (${safeGuestEmail})` : ''}`;
      })
      .join('\n');

    // Check if RESEND_API_KEY is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      // Log booking data for manual processing
      console.log("RESEND_API_KEY not configured - booking logged for manual processing");
      console.log("Booking date range:", safeArrivalDate, "to", safeDepartureDate);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: template.successMessage,
          note: "Email sending is pending configuration."
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Prepare email data
    const emailData = {
      name: safeName,
      email: safeEmail,
      arrivalDate: safeArrivalDate,
      departureDate: safeDepartureDate,
      arrivalTime: safeArrivalTime,
      guestsList,
      hasPets: bookingData.hasPets,
    };

    // Send email to owner (rent@lavitaterme3000.com)
    const ownerResult = await sendEmail(
      resendApiKey,
      ["rent@lavitaterme3000.com"],
      template.subject(safeName, safeArrivalDate, safeDepartureDate),
      template.ownerBody(emailData),
      bookingData.email
    );

    if (!ownerResult.success) {
      console.error("Failed to send owner email:", ownerResult.error);
      throw new Error("Failed to send notification email");
    }

    console.log("Owner notification email sent successfully");

    // Send confirmation email to customer
    const customerResult = await sendEmail(
      resendApiKey,
      [bookingData.email],
      template.customerSubject,
      template.customerBody(safeName)
    );

    if (!customerResult.success) {
      console.error("Failed to send customer email:", customerResult.error);
      // Don't throw - owner notification was sent, log but continue
      console.warn("Customer confirmation email failed but owner was notified");
    } else {
      console.log("Customer confirmation email sent successfully");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: template.successMessage
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: "An error occurred while processing your request. Please try again or contact us directly." 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

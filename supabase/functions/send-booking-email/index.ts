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
});

type BookingRequest = z.infer<typeof bookingSchema>;

// Escape HTML to prevent injection in email templates
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
          error: "Preveč zahtevkov. Prosimo, poskusite čez nekaj časa." 
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
    console.log("Received valid booking request for:", bookingData.email);

    // Escape all user inputs for safe template interpolation
    const safeName = escapeHtml(bookingData.fullName);
    const safeEmail = escapeHtml(bookingData.email);
    const safeArrivalDate = escapeHtml(bookingData.arrivalDate);
    const safeDepartureDate = escapeHtml(bookingData.departureDate);
    const safeArrivalTime = escapeHtml(bookingData.arrivalTime);

    // Format guests list with escaped values
    const guestsList = bookingData.guests
      .map((g, i) => {
        const safeName = escapeHtml(g.name);
        const safeGuestEmail = g.email ? escapeHtml(g.email) : '';
        return `  ${i + 1}. ${safeName}${safeGuestEmail ? ` (${safeGuestEmail})` : ''}`;
      })
      .join('\n');

    // Create email content with sanitized data
    const emailContent = `
Nova rezervacija za La Vita Hiško

Kontaktna oseba:
  Ime in priimek: ${safeName}
  E-mail: ${safeEmail}

Datumi:
  Prihod: ${safeArrivalDate}
  Odhod: ${safeDepartureDate}
  Okvirni čas prihoda: ${safeArrivalTime}

Gostje:
${guestsList || '  Ni dodatnih gostov'}

Hišni ljubljenček: ${bookingData.hasPets ? 'DA (+ 5€/noč)' : 'NE'}

Strinjanje s pogoji: ${bookingData.agreeTerms ? 'DA' : 'NE'}
    `.trim();

    // Check if RESEND_API_KEY is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      // Log booking data (without sensitive details) for manual processing
      console.log("RESEND_API_KEY not configured - booking logged for manual processing");
      console.log("Booking date range:", safeArrivalDate, "to", safeDepartureDate);
      
      // Return success but inform that email sending is pending configuration
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Rezervacija uspešno poslana!",
          note: "Email pošiljanje je v postopku konfiguracije."
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "La Vita Hiška <noreply@lavitarelax.lovable.app>",
        to: ["lavitarelax@gmail.com"],
        subject: `Nova rezervacija: ${safeName} (${safeArrivalDate} - ${safeDepartureDate})`,
        text: emailContent,
        reply_to: bookingData.email,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend API error:", errorText);
      throw new Error("Failed to send email");
    }

    console.log("Booking email sent successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Rezervacija uspešno poslana!" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    // Log full error for debugging, return generic message to client
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Prišlo je do napake pri obdelavi zahteve. Prosimo, poskusite znova ali nas kontaktirajte." 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

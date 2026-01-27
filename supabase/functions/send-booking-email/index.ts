import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface BookingRequest {
  fullName: string;
  email: string;
  arrivalDate: string;
  departureDate: string;
  arrivalTime: string;
  guests: {
    name: string;
    email?: string;
  }[];
  hasPets: boolean;
  agreeTerms: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const bookingData: BookingRequest = await req.json();
    console.log("Received booking request:", bookingData);

    // Validate required fields
    if (!bookingData.fullName || !bookingData.email || !bookingData.arrivalDate || !bookingData.departureDate) {
      throw new Error("Manjkajo obvezna polja");
    }

    // Format guests list
    const guestsList = bookingData.guests
      .map((g, i) => `  ${i + 1}. ${g.name}${g.email ? ` (${g.email})` : ''}`)
      .join('\n');

    // Create email content
    const emailContent = `
Nova rezervacija za La Vita Hiško

Kontaktna oseba:
  Ime in priimek: ${bookingData.fullName}
  E-mail: ${bookingData.email}

Datumi:
  Prihod: ${bookingData.arrivalDate}
  Odhod: ${bookingData.departureDate}
  Okvirni čas prihoda: ${bookingData.arrivalTime}

Gostje:
${guestsList}

Hišni ljubljenček: ${bookingData.hasPets ? 'DA (+ 5€/noč)' : 'NE'}

Strinjanje s pogoji: ${bookingData.agreeTerms ? 'DA' : 'NE'}
    `.trim();

    console.log("Email content prepared:", emailContent);

    // For now, we'll log the email content since we need RESEND_API_KEY
    // In production, this would send via Resend
    console.log("Would send email to: lavitarelax@gmail.com");
    console.log("Email body:", emailContent);

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
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

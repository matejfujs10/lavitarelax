import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Map countries to supported languages
// Slovenia -> sl, Austria/Germany/Switzerland -> de, all others -> en
const countryToLanguage: Record<string, string> = {
  'SI': 'sl', // Slovenia
  'AT': 'de', // Austria
  'DE': 'de', // Germany
  'CH': 'de', // Switzerland
  'LI': 'de', // Liechtenstein
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get client IP from various headers
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     req.headers.get("x-real-ip") ||
                     "unknown";

    console.log("Detecting language for IP:", clientIp);

    // Use Cloudflare headers if available (they pass country info)
    const cfCountry = req.headers.get("cf-ipcountry");
    
    if (cfCountry && cfCountry !== "XX") {
      const detectedLanguage = countryToLanguage[cfCountry] || 'en';
      console.log(`Cloudflare detected country: ${cfCountry}, language: ${detectedLanguage}`);
      
      return new Response(
        JSON.stringify({ 
          success: true,
          language: detectedLanguage,
          country: cfCountry,
          source: 'cloudflare'
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Fallback: Try to use free IP geolocation API
    try {
      const geoResponse = await fetch(`https://ipapi.co/${clientIp}/json/`, {
        headers: { 'User-Agent': 'LaVitaHouse/1.0' }
      });
      
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        const countryCode = geoData.country_code || geoData.country;
        
        if (countryCode) {
          const detectedLanguage = countryToLanguage[countryCode] || 'en';
          console.log(`ipapi.co detected country: ${countryCode}, language: ${detectedLanguage}`);
          
          return new Response(
            JSON.stringify({ 
              success: true,
              language: detectedLanguage,
              country: countryCode,
              source: 'ipapi'
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
      }
    } catch (geoError) {
      console.warn("Geo API error:", geoError);
    }

    // Default to English if all detection fails
    console.log("Geo detection failed, defaulting to English");
    return new Response(
      JSON.stringify({ 
        success: true,
        language: 'en',
        country: null,
        source: 'default'
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: unknown) {
    console.error("Error in detect-language function:", error);
    // Default to English on any error
    return new Response(
      JSON.stringify({ 
        success: true,
        language: 'en',
        country: null,
        source: 'error-fallback'
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

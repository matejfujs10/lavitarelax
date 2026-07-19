// Edge function: sync-status
// Public read-only diagnostic endpoint: last iCal sync, blocked-dates count,
// and whether the ICAL_BOOKING_URL secret is configured.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const icalConfigured = !!Deno.env.get("ICAL_BOOKING_URL");

  const { data: lastLog } = await supabase
    .from("ical_sync_log")
    .select("status, reservations_count, error_message, duration_ms, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const today = new Date().toISOString().slice(0, 10);
  const { count } = await supabase
    .from("booked_dates")
    .select("id", { count: "exact", head: true })
    .gte("end_date", today);

  return new Response(
    JSON.stringify({
      icalConfigured,
      lastSync: lastLog ?? null,
      upcomingBlockedRanges: count ?? 0,
      now: new Date().toISOString(),
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});

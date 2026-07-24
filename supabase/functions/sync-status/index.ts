// Edge function: sync-status
// Admin-only diagnostic endpoint. Requires a valid SYNC_SECRET token to be
// passed via the `x-admin-token` header or `?token=` query param. Returns
// generic 401 on mismatch (no info leakage).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const expected = Deno.env.get("SYNC_SECRET") ?? "";
  const url = new URL(req.url);
  const provided =
    req.headers.get("x-admin-token") ?? url.searchParams.get("token") ?? "";

  if (!expected || !provided || !timingSafeEqual(expected, provided)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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

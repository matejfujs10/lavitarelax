// Edge function: sync-ical
// Fetches the Booking.com iCal feed and upserts booked dates into the DB.
// Triggered via cron or manual POST.
//
// Hardening:
//   - Method must be POST (or OPTIONS for CORS preflight).
//   - Requires x-sync-secret matching SYNC_SECRET (fail-closed).
//   - Requires x-sync-timestamp within ±5 minutes to prevent replay.
//   - Optional HMAC-SHA256 signature via x-sync-signature (verified when
//     SYNC_HMAC_SECRET is set — hex(HMAC(secret, timestamp))).
//   - Every rejection is logged to public.security_events.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-sync-secret, x-sync-timestamp, x-sync-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ICAL_URL = Deno.env.get("ICAL_BOOKING_URL");
const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000; // 5 minutes

interface IcalEvent {
  uid: string;
  start: string;
  end: string;
  summary: string;
}

function parseIcal(text: string): IcalEvent[] {
  const unfolded = text.replace(/\r?\n[ \t]/g, "");
  const lines = unfolded.split(/\r?\n/);
  const events: IcalEvent[] = [];
  let current: Partial<IcalEvent> | null = null;

  const parseDate = (raw: string): string | null => {
    const value = raw.includes(":") ? raw.split(":").pop()! : raw;
    const match = value.trim().match(/^(\d{4})(\d{2})(\d{2})/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : null;
  };

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") current = {};
    else if (line === "END:VEVENT") {
      if (current?.uid && current.start && current.end) {
        events.push({
          uid: current.uid,
          start: current.start,
          end: current.end,
          summary: current.summary ?? "",
        });
      }
      current = null;
    } else if (current) {
      if (line.startsWith("UID")) current.uid = line.split(":").slice(1).join(":").trim();
      else if (line.startsWith("DTSTART")) {
        const d = parseDate(line);
        if (d) current.start = d;
      } else if (line.startsWith("DTEND")) {
        const d = parseDate(line);
        if (d) current.end = d;
      } else if (line.startsWith("SUMMARY")) {
        current.summary = line.split(":").slice(1).join(":").trim();
      }
    }
  }
  return events;
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function unauthorized(reason: string) {
  return { status: 401 as const, reason };
}

async function authorize(req: Request): Promise<{ ok: true } | { ok: false; status: number; reason: string }> {
  if (req.method !== "POST") {
    return { ok: false, status: 405, reason: "method_not_allowed" };
  }

  const expectedSecret = Deno.env.get("SYNC_SECRET");
  const provided = req.headers.get("x-sync-secret");
  if (!expectedSecret) return { ok: false, ...unauthorized("secret_not_configured") };
  if (!provided || !timingSafeEqual(provided, expectedSecret)) {
    return { ok: false, ...unauthorized("bad_secret") };
  }

  const tsHeader = req.headers.get("x-sync-timestamp");
  if (!tsHeader) return { ok: false, ...unauthorized("missing_timestamp") };
  const ts = Number(tsHeader);
  if (!Number.isFinite(ts)) return { ok: false, ...unauthorized("bad_timestamp") };
  if (Math.abs(Date.now() - ts) > MAX_CLOCK_SKEW_MS) {
    return { ok: false, ...unauthorized("timestamp_out_of_window") };
  }

  const hmacSecret = Deno.env.get("SYNC_HMAC_SECRET");
  if (hmacSecret) {
    const provSig = req.headers.get("x-sync-signature") ?? "";
    const expected = await hmacHex(hmacSecret, tsHeader);
    if (!timingSafeEqual(provSig, expected)) {
      return { ok: false, ...unauthorized("bad_signature") };
    }
  }

  return { ok: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "";

  const authResult = await authorize(req);
  if (!authResult.ok) {
    console.warn(`sync-ical rejected: ${authResult.reason} from ${ip}`);
    // Fire-and-forget audit log; never blocks response.
    supabase
      .from("security_events")
      .insert({
        event_type: "sync_ical_unauthorized",
        severity: authResult.status === 401 ? "warning" : "info",
        source: "sync-ical",
        ip,
        user_agent: ua,
        details: { reason: authResult.reason, method: req.method },
      })
      .then(() => {});
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: authResult.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const startTime = Date.now();
  try {
    if (!ICAL_URL) throw new Error("ICAL_BOOKING_URL secret is not configured");

    const resp = await fetch(ICAL_URL, { headers: { "User-Agent": "LaVitaHouse-Sync/1.0" } });
    if (!resp.ok) throw new Error(`iCal fetch failed: ${resp.status} ${resp.statusText}`);

    const text = await resp.text();
    const events = parseIcal(text);
    console.log(`Parsed ${events.length} events from iCal feed`);

    let upserted = 0;
    const seenUids: string[] = [];
    for (const ev of events) {
      seenUids.push(ev.uid);
      const { error } = await supabase.from("booked_dates").upsert(
        {
          external_uid: ev.uid,
          start_date: ev.start,
          end_date: ev.end,
          summary: ev.summary,
          source: "booking.com",
          last_synced_at: new Date().toISOString(),
        },
        { onConflict: "external_uid" },
      );
      if (error) console.error(`Upsert failed for ${ev.uid}:`, error.message);
      else upserted++;
    }

    if (seenUids.length > 0) {
      const { error: delError } = await supabase
        .from("booked_dates")
        .delete()
        .eq("source", "booking.com")
        .not("external_uid", "in", `(${seenUids.map((u) => `"${u}"`).join(",")})`);
      if (delError) console.warn("Stale-row cleanup failed:", delError.message);
    }

    const duration = Date.now() - startTime;
    await supabase.from("ical_sync_log").insert({
      status: "success",
      reservations_count: upserted,
      duration_ms: duration,
    });

    return new Response(
      JSON.stringify({ ok: true, synced: upserted, total: events.length, duration_ms: duration }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("sync-ical error:", message);
    await supabase
      .from("ical_sync_log")
      .insert({ status: "error", error_message: message, duration_ms: Date.now() - startTime })
      .then(() => {});
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

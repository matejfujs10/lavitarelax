// Edge function: sync-ical
// Fetches the Booking.com iCal feed and upserts booked dates into the DB.
// Can be triggered manually (POST/GET) or via cron.
// No JWT required — feed sync should be cron-callable.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ICAL_URL =
  "https://ical.booking.com/v1/export?t=2d947bac-8178-46ef-952f-e5015f212b00";

interface IcalEvent {
  uid: string;
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD (exclusive in iCal)
  summary: string;
}

/**
 * Minimal iCal VEVENT parser. Handles VALUE=DATE (all-day) and DATE-TIME formats.
 */
function parseIcal(text: string): IcalEvent[] {
  // Unfold lines: a line starting with whitespace continues the previous line
  const unfolded = text.replace(/\r?\n[ \t]/g, "");
  const lines = unfolded.split(/\r?\n/);

  const events: IcalEvent[] = [];
  let current: Partial<IcalEvent> | null = null;

  const parseDate = (raw: string): string | null => {
    // Strip parameters (e.g. "VALUE=DATE:20251201" -> "20251201")
    const value = raw.includes(":") ? raw.split(":").pop()! : raw;
    const compact = value.trim();
    // YYYYMMDD or YYYYMMDDTHHMMSSZ
    const match = compact.match(/^(\d{4})(\d{2})(\d{2})/);
    if (!match) return null;
    return `${match[1]}-${match[2]}-${match[3]}`;
  };

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = {};
    } else if (line === "END:VEVENT") {
      if (
        current &&
        current.uid &&
        current.start &&
        current.end
      ) {
        events.push({
          uid: current.uid,
          start: current.start,
          end: current.end,
          summary: current.summary ?? "",
        });
      }
      current = null;
    } else if (current) {
      if (line.startsWith("UID")) {
        current.uid = line.split(":").slice(1).join(":").trim();
      } else if (line.startsWith("DTSTART")) {
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    // 1. Fetch iCal feed
    const resp = await fetch(ICAL_URL, {
      headers: { "User-Agent": "LaVitaHouse-Sync/1.0" },
    });
    if (!resp.ok) {
      throw new Error(`iCal fetch failed: ${resp.status} ${resp.statusText}`);
    }
    const text = await resp.text();
    const events = parseIcal(text);

    console.log(`Parsed ${events.length} events from iCal feed`);

    // 2. Upsert each event
    let upserted = 0;
    const seenUids: string[] = [];
    for (const ev of events) {
      seenUids.push(ev.uid);
      const { error } = await supabase
        .from("booked_dates")
        .upsert(
          {
            external_uid: ev.uid,
            start_date: ev.start,
            end_date: ev.end,
            summary: ev.summary,
            source: "booking.com",
            last_synced_at: new Date().toISOString(),
          },
          { onConflict: "external_uid" }
        );
      if (error) {
        console.error(`Upsert failed for ${ev.uid}:`, error.message);
      } else {
        upserted++;
      }
    }

    // 3. Delete stale rows (events that disappeared from feed) — only for booking.com source
    if (seenUids.length > 0) {
      const { error: delError } = await supabase
        .from("booked_dates")
        .delete()
        .eq("source", "booking.com")
        .not("external_uid", "in", `(${seenUids.map((u) => `"${u}"`).join(",")})`);
      if (delError) {
        console.warn("Stale-row cleanup failed:", delError.message);
      }
    }

    const duration = Date.now() - startTime;

    // 4. Log success
    await supabase.from("ical_sync_log").insert({
      status: "success",
      reservations_count: upserted,
      duration_ms: duration,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        synced: upserted,
        total: events.length,
        duration_ms: duration,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("sync-ical error:", message);

    await supabase
      .from("ical_sync_log")
      .insert({
        status: "error",
        error_message: message,
        duration_ms: Date.now() - startTime,
      })
      .then(() => {});

    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

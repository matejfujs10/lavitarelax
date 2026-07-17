import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

export default defineTool({
  name: "check_availability",
  title: "Check house availability",
  description:
    "Check whether House La Vita in Kamp Terme 3000 is available between the given check-in and check-out dates (YYYY-MM-DD). Returns available: true only if no booked range overlaps.",
  inputSchema: {
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Check-in date, ISO YYYY-MM-DD"),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Check-out date, ISO YYYY-MM-DD"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ checkIn, checkOut }) => {
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const supabase = createClient(url, key, { auth: { persistSession: false } });

    const inD = new Date(checkIn + "T00:00:00");
    const outD = new Date(checkOut + "T00:00:00");
    if (!(outD > inD)) {
      return {
        content: [{ type: "text", text: "checkOut must be after checkIn" }],
        isError: true,
      };
    }

    const { data, error } = await supabase
      .from("booked_dates")
      .select("start_date,end_date")
      .lt("start_date", checkOut)
      .gt("end_date", checkIn);

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }

    const available = (data ?? []).length === 0;
    const payload = {
      available,
      checkIn,
      checkOut,
      conflictingRanges: data ?? [],
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload) }],
      structuredContent: payload,
    };
  },
});

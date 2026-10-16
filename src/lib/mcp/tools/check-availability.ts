import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

export default defineTool({
  name: "check_availability",
  title: "Check availability",
  description: "Check whether the La Vita house is free for a stay (check-in to check-out, YYYY-MM-DD).",
  inputSchema: {
    check_in: isoDate.describe("Arrival date, YYYY-MM-DD."),
    check_out: isoDate.describe("Departure date, YYYY-MM-DD (exclusive)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ check_in, check_out }) => {
    if (check_out <= check_in) throw new ToolError("check_out must be after check_in");
    const { data, error } = await supabaseAnon()
      .from("booked_dates")
      .select("start_date, end_date")
      .lt("start_date", check_out)
      .gt("end_date", check_in)
      .order("start_date");
    if (error) throw new ToolError("Could not load availability");
    const conflicts = (data ?? []).map((r) => ({ start_date: r.start_date as string, end_date: r.end_date as string }));
    const available = conflicts.length === 0;
    return {
      content: [{
        type: "text",
        text: available
          ? `Available from ${check_in} to ${check_out}.`
          : `Not available. Booked ranges overlapping: ${conflicts.map((c) => `${c.start_date}–${c.end_date}`).join(", ")}.`,
      }],
      structuredContent: { available, conflicts },
    };
  },
});

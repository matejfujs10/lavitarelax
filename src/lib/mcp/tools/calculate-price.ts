import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { computePrice } from "../../pricing";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

export default defineTool({
  name: "calculate_price",
  title: "Calculate stay price",
  description: "Calculate the price in EUR for a stay at the La Vita house, including long-stay discounts.",
  inputSchema: {
    check_in: isoDate.describe("Arrival date, YYYY-MM-DD."),
    check_out: isoDate.describe("Departure date, YYYY-MM-DD."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ check_in, check_out }) => {
    const p = computePrice(new Date(check_in + "T00:00:00"), new Date(check_out + "T00:00:00"));
    if (!p) throw new ToolError("check_out must be after check_in");
    const text = `${p.nights} nights × ${p.basePerNight} € = ${p.baseTotal} €` +
      (p.discountAmount ? `, discount ${Math.round(p.discountPct * 100)} % (−${p.discountAmount} €)` : "") +
      `. Total: ${p.finalTotal} €.`;
    return {
      content: [{ type: "text", text }],
      structuredContent: {
        nights: p.nights, base_per_night: p.basePerNight, base_total: p.baseTotal,
        discount_pct: p.discountPct, discount_amount: p.discountAmount, final_total: p.finalTotal, currency: "EUR",
      },
    };
  },
});

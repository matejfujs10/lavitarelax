import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { computePrice } from "@/lib/pricing";

export default defineTool({
  name: "calculate_price",
  title: "Calculate stay price",
  description:
    "Calculate the price for a stay at House La Vita. Uses seasonal nightly rate (June 95€, July/August 100€, otherwise 77€) and long-stay discount (3-4 nights 5%, 5-6 nights 10%, 7-9 nights 15%, 10+ nights 20%). Pets add 5€/night.",
  inputSchema: {
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    hasPet: z.boolean().default(false).describe("Add 5€/night if a pet is included"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ checkIn, checkOut, hasPet }) => {
    const inD = new Date(checkIn + "T00:00:00");
    const outD = new Date(checkOut + "T00:00:00");
    const breakdown = computePrice(inD, outD);
    if (!breakdown) {
      return {
        content: [{ type: "text", text: "Invalid date range" }],
        isError: true,
      };
    }
    const petFee = hasPet ? 5 * breakdown.nights : 0;
    const finalTotal = breakdown.finalTotal + petFee;
    const payload = { ...breakdown, petFee, finalTotal, currency: "EUR" };
    return {
      content: [{ type: "text", text: JSON.stringify(payload) }],
      structuredContent: payload,
    };
  },
});

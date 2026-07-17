import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "submit_reservation_inquiry",
  title: "Submit reservation inquiry",
  description:
    "Send a reservation inquiry for House La Vita to the owner (rent@lavitaterme3000.com). Does NOT block the dates — the owner confirms after receiving a deposit. Guest also gets a localized thank-you email.",
  inputSchema: {
    name: z.string().min(2).max(120),
    email: z.string().email(),
    phone: z.string().max(40).optional(),
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    guests: z.number().int().min(1).max(20).optional(),
    hasPet: z.boolean().default(false),
    message: z.string().max(2000).optional(),
    language: z.enum(["sl", "en", "de", "hr"]).default("en"),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
  handler: async (input) => {
    const res = await fetch("https://www.lavitaterme3000.com/api/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const text = await res.text();
    if (!res.ok) {
      return {
        content: [{ type: "text", text: `Failed (${res.status}): ${text}` }],
        isError: true,
      };
    }
    return {
      content: [
        {
          type: "text",
          text: "Inquiry sent. The owner will contact the guest shortly to confirm and arrange the deposit.",
        },
      ],
      structuredContent: { ok: true, response: text },
    };
  },
});

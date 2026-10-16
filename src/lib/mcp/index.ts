import { defineMcp } from "@lovable.dev/mcp-js";
import checkAvailability from "./tools/check-availability";
import calculatePrice from "./tools/calculate-price";

export default defineMcp({
  name: "la-vita-escape",
  title: "La Vita Escape",
  version: "0.1.0",
  instructions:
    "Tools for La Vita house in Kamp Terme 3000 (Moravske Toplice). Check free dates and calculate stay prices in EUR. To book, guests use the form at https://lavitarelax.lovable.app.",
  tools: [checkAvailability, calculatePrice],
});

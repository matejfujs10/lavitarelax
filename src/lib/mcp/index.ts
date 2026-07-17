import { defineMcp } from "@lovable.dev/mcp-js";
import checkAvailability from "./tools/check-availability";
import calculatePrice from "./tools/calculate-price";
import submitReservationInquiry from "./tools/submit-reservation-inquiry";

export default defineMcp({
  name: "house-la-vita-mcp",
  title: "House La Vita – Terme 3000",
  version: "0.1.0",
  instructions:
    "Tools for House La Vita, a holiday house in Kamp Terme 3000 (Moravske Toplice, Slovenia). Use `check_availability` to see if a date range is free, `calculate_price` for a seasonal quote with long-stay discount, and `submit_reservation_inquiry` to send a booking request to the owner. Dates are always YYYY-MM-DD. No user authentication required.",
  tools: [checkAvailability, calculatePrice, submitReservationInquiry],
});

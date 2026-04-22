/**
 * Pricing & booking utilities for La Vita House.
 *
 * - Base price per night depends on the season of the check-in date.
 * - Long-stay discount applies to the total amount based on number of nights.
 */

export interface PriceBreakdown {
  nights: number;
  basePerNight: number;
  baseTotal: number;
  discountPct: number; // 0..1
  discountAmount: number;
  finalTotal: number;
  season: "spring" | "summer" | "off";
}

/**
 * Returns the base nightly rate based on a check-in date.
 * - Summer (June, July, August): 100€
 * - Spring (April, May) and other months: 70€ (treated as off-season default)
 *
 * The hybrid pricing decision: spring covers April + May, summer covers Jun-Aug.
 */
export function getNightlyRate(checkIn: Date): { rate: number; season: PriceBreakdown["season"] } {
  const month = checkIn.getMonth(); // 0-indexed: 0 = Jan
  // June = 5, July = 6, August = 7
  if (month >= 5 && month <= 7) {
    return { rate: 100, season: "summer" };
  }
  // April = 3, May = 4 → spring
  if (month === 3 || month === 4) {
    return { rate: 70, season: "spring" };
  }
  // Default off-season: keep 70 (same as spring)
  return { rate: 70, season: "off" };
}

/**
 * Long-stay discount based on number of nights.
 * - 3-4 nights: 5%
 * - 5-6 nights: 10%
 * - 7-9 nights: 15%
 * - 10+ nights: 20%
 */
export function getLongStayDiscount(nights: number): number {
  if (nights >= 10) return 0.2;
  if (nights >= 7) return 0.15;
  if (nights >= 5) return 0.1;
  if (nights >= 3) return 0.05;
  return 0;
}

/**
 * Number of whole nights between two dates.
 */
export function nightsBetween(checkIn: Date, checkOut: Date): number {
  const ms = checkOut.getTime() - checkIn.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

/**
 * Compute full price breakdown for a stay.
 */
export function computePrice(checkIn: Date | undefined, checkOut: Date | undefined): PriceBreakdown | null {
  if (!checkIn || !checkOut) return null;
  const nights = nightsBetween(checkIn, checkOut);
  if (nights <= 0) return null;

  const { rate, season } = getNightlyRate(checkIn);
  const baseTotal = rate * nights;
  const discountPct = getLongStayDiscount(nights);
  const discountAmount = Math.round(baseTotal * discountPct);
  const finalTotal = baseTotal - discountAmount;

  return {
    nights,
    basePerNight: rate,
    baseTotal,
    discountPct,
    discountAmount,
    finalTotal,
    season,
  };
}

/**
 * Returns true if the given date falls inside any booked range.
 * iCal end_date is exclusive (checkout day is free), so we compare with `<` on end.
 */
export function isDateBooked(
  date: Date,
  bookedRanges: Array<{ start_date: string; end_date: string }>
): boolean {
  const t = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  for (const r of bookedRanges) {
    const start = new Date(r.start_date + "T00:00:00").getTime();
    const end = new Date(r.end_date + "T00:00:00").getTime();
    if (t >= start && t < end) return true;
  }
  return false;
}

/**
 * Format a number as EUR currency for display (no fractional cents).
 */
export function formatEur(amount: number): string {
  return `${amount}€`;
}

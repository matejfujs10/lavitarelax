import { describe, it, expect } from "vitest";
import { getNightlyRate, computePrice } from "@/lib/pricing";

describe("SEPTEMBER akcija – cena 95 €", () => {
  it("getNightlyRate septembra vrne 95 € (spring promo)", () => {
    const sep = new Date(2026, 8, 10);
    const { rate, season } = getNightlyRate(sep);
    expect(rate).toBe(95);
    expect(season).toBe("spring");
  });

  it("computePrice septembra (2 noči) vrne 190 €", () => {
    const checkIn = new Date(2026, 8, 10);
    const checkOut = new Date(2026, 8, 12);
    const b = computePrice(checkIn, checkOut);
    expect(b).not.toBeNull();
    expect(b!.basePerNight).toBe(95);
    expect(b!.baseTotal).toBe(190);
  });

  it("julija vrne 100 € (poletna sezona)", () => {
    const jul = new Date(2026, 6, 1);
    expect(getNightlyRate(jul).rate).toBe(100);
  });

  it("junija (off-season) vrne 77 €", () => {
    const jun = new Date(2026, 5, 1);
    expect(getNightlyRate(jun).rate).toBe(77);
  });
});

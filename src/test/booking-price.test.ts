import { describe, it, expect } from "vitest";
import { getNightlyRate, computePrice } from "@/lib/pricing";

describe("JUNIJ akcija – cena 95 €", () => {
  it("getNightlyRate junija vrne 95 € (spring promo)", () => {
    const jun = new Date(2026, 5, 10);
    const { rate, season } = getNightlyRate(jun);
    expect(rate).toBe(95);
    expect(season).toBe("spring");
  });

  it("computePrice junija (2 noči) vrne 190 €", () => {
    const checkIn = new Date(2026, 5, 10);
    const checkOut = new Date(2026, 5, 12);
    const b = computePrice(checkIn, checkOut);
    expect(b).not.toBeNull();
    expect(b!.basePerNight).toBe(95);
    expect(b!.baseTotal).toBe(190);
  });

  it("julija vrne 100 € (poletna sezona)", () => {
    const jul = new Date(2026, 6, 1);
    expect(getNightlyRate(jul).rate).toBe(100);
  });

  it("maja (off-season) vrne 77 €", () => {
    const may = new Date(2026, 4, 1);
    expect(getNightlyRate(may).rate).toBe(77);
  });
});

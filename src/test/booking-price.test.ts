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

describe("4+ nights bonus stays intact", () => {
  it("keeps the long-stay discount for 4-night stays in August and September", () => {
    const aug = computePrice(new Date(2026, 7, 29), new Date(2026, 8, 2));
    expect(aug?.nights).toBe(4);
    expect(aug?.basePerNight).toBe(100);
    expect(aug?.discountPct).toBe(0.05);
    expect(aug?.finalTotal).toBe(380);

    const sep = computePrice(new Date(2026, 8, 1), new Date(2026, 8, 5));
    expect(sep?.nights).toBe(4);
    expect(sep?.basePerNight).toBe(95);
    expect(sep?.discountPct).toBe(0.05);
    expect(sep?.finalTotal).toBe(361);
  });

  it("never drops below the 4-night discount as the stay grows", () => {
    let prev = 0;
    for (let n = 4; n <= 14; n++) {
      const b = computePrice(new Date(2026, 8, 1), new Date(2026, 8, 1 + n))!;
      expect(b.discountPct).toBeGreaterThanOrEqual(0.05);
      expect(b.discountPct).toBeGreaterThanOrEqual(prev);
      prev = b.discountPct;
    }
  });
});

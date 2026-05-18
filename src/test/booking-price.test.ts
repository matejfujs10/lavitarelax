import { describe, it, expect } from "vitest";
import { computePrice, getNightlyRate } from "@/lib/pricing";

describe("MAJ akcija – cena 77 €", () => {
  it("getNightlyRate maja vrne 77 € (spring)", () => {
    const may = new Date(2026, 4, 15); // May
    const { rate, season } = getNightlyRate(may);
    expect(rate).toBe(77);
    expect(season).toBe("spring");
  });

  it("computePrice za 2 noči v maju = 154 €, brez popusta", () => {
    const inD = new Date(2026, 4, 10);
    const outD = new Date(2026, 4, 12);
    const b = computePrice(inD, outD)!;
    expect(b.basePerNight).toBe(77);
    expect(b.nights).toBe(2);
    expect(b.finalTotal).toBe(154);
    expect(b.discountAmount).toBe(0);
  });

  it("aprila (off-spring) tudi 77 €", () => {
    const apr = new Date(2026, 3, 5);
    expect(getNightlyRate(apr).rate).toBe(77);
  });
});

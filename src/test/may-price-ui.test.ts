import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (p: string) => readFileSync(resolve(__dirname, "../../", p), "utf8");

describe("MAJ akcija – prikaz 77 € v UI", () => {
  it("HeroSection.tsx vsebuje '77 €'", () => {
    expect(read("src/components/HeroSection.tsx")).toMatch(/77\s*€/);
  });
  it("BookingSection.tsx vsebuje '77 €'", () => {
    expect(read("src/components/BookingSection.tsx")).toMatch(/77\s*€/);
  });
  it("PriceSummary uporablja computePrice (kalkulator)", () => {
    expect(read("src/components/PriceSummary.tsx")).toMatch(/computePrice/);
  });
});

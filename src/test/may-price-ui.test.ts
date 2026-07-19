import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf-8");

describe("SEPTEMBER akcija – prikaz 95 € v UI", () => {
  it("HeroSection.tsx vsebuje '95 €'", () => {
    expect(read("src/components/HeroSection.tsx")).toMatch(/95\s*€/);
  });
  it("BookingSection.tsx vsebuje '95 €'", () => {
    expect(read("src/components/BookingSection.tsx")).toMatch(/95\s*€/);
  });
  it("LanguageContext vsebuje 'SEPTEMBER AKCIJA'", () => {
    expect(read("src/contexts/LanguageContext.tsx")).toContain("SEPTEMBER AKCIJA");
  });
});

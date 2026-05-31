/**
 * Static SEO audit — equivalent to the head-related checks
 * Lighthouse / SEO crawlers run: valid <title>, meta description,
 * canonical, hreflang alternates and JSON-LD (LodgingBusiness).
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const html = readFileSync(resolve(__dirname, "../../index.html"), "utf-8");
const sitemap = readFileSync(resolve(__dirname, "../../public/sitemap.xml"), "utf-8");
const robots = readFileSync(resolve(__dirname, "../../public/robots.txt"), "utf-8");

describe("index.html SEO head", () => {
  it("has a descriptive <title>", () => {
    const m = html.match(/<title>([^<]+)<\/title>/);
    expect(m?.[1]).toBeTruthy();
    expect(m![1].length).toBeGreaterThan(20);
    expect(m![1].length).toBeLessThan(75);
    expect(m![1]).toMatch(/Moravske Toplice|Terme 3000/i);
  });

  it("has a meta description targeting key regions", () => {
    const m = html.match(/<meta name="description" content="([^"]+)"/);
    expect(m?.[1]).toBeTruthy();
    expect(m![1]).toMatch(/Moravske Toplice/);
    expect(m![1]).toMatch(/Terme 3000/);
    expect(m![1].length).toBeLessThan(200);
  });

  it("has canonical URL", () => {
    expect(html).toMatch(/<link rel="canonical" href="https:\/\/www\.lavitaterme3000\.com/);
  });

  it("declares hreflang for sl, en, de, hr and x-default", () => {
    for (const lang of ["sl", "en", "de", "hr", "x-default"]) {
      expect(html).toMatch(new RegExp(`hreflang="${lang}"`));
    }
  });

  it("ships JSON-LD LodgingBusiness with regions", () => {
    const m = html.match(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/);
    expect(m?.[1]).toBeTruthy();
    const data = JSON.parse(m![1]);
    expect(data["@type"]).toBe("LodgingBusiness");
    expect(data.address.addressLocality).toBe("Moravske Toplice");
    expect(data.areaServed).toEqual(
      expect.arrayContaining(["Moravske Toplice", "Murska Sobota", "Prekmurje", "Terme 3000"])
    );
  });
});

describe("sitemap.xml + robots.txt", () => {
  it("sitemap lists all location landing pages with hreflang", () => {
    for (const slug of ["moravske-toplice", "murska-sobota", "prekmurje"]) {
      expect(sitemap).toContain(`/${slug}</loc>`);
      expect(sitemap).toMatch(new RegExp(`hreflang="sl"[^>]*${slug}`));
      expect(sitemap).toMatch(new RegExp(`hreflang="de"[^>]*${slug}`));
      expect(sitemap).toMatch(new RegExp(`hreflang="hr"[^>]*${slug}`));
      expect(sitemap).toMatch(new RegExp(`hreflang="en"[^>]*${slug}`));
    }
  });

  it("robots.txt allows crawling and references the sitemap", () => {
    expect(robots).toMatch(/User-agent: \*/);
    expect(robots).toMatch(/Allow: \//);
    expect(robots).toMatch(/Sitemap: https:\/\/www\.lavitaterme3000\.com\/sitemap\.xml/);
  });
});

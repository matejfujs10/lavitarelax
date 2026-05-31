/**
 * End-to-end style test: simulates visitors from SI, DE, HR
 * and verifies that LanguageProvider auto-switches the UI
 * via the `detect-language` edge function.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

// Mock the supabase client used inside LanguageContext
const invokeMock = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: {
      invoke: (...args: unknown[]) => invokeMock(...args),
    },
  },
}));

const Probe = () => {
  const { language, t } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="cta">{t("hero.bookNow")}</span>
    </div>
  );
};

const expectedCta: Record<string, string> = {
  sl: "Rezerviraj svoj oddih",
  de: "Buchen Sie Ihren Urlaub",
  hr: "Rezervirajte svoj odmor",
  en: "Book your stay",
};

describe("Geo language auto-detection (SI / DE / HR / fallback)", () => {
  beforeEach(() => {
    localStorage.clear();
    invokeMock.mockReset();
  });

  const cases: Array<{ country: string; lang: "sl" | "de" | "hr" | "en" }> = [
    { country: "SI", lang: "sl" },
    { country: "DE", lang: "de" },
    { country: "AT", lang: "de" },
    { country: "HR", lang: "hr" },
    { country: "FR", lang: "en" },
  ];

  for (const { country, lang } of cases) {
    it(`visitor from ${country} -> language ${lang}`, async () => {
      invokeMock.mockResolvedValueOnce({
        data: { success: true, language: lang, country, source: "test" },
        error: null,
      });

      render(
        <LanguageProvider>
          <Probe />
        </LanguageProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("lang").textContent).toBe(lang);
      });
      expect(screen.getByTestId("cta").textContent).toBe(expectedCta[lang]);
      expect(invokeMock).toHaveBeenCalledWith("detect-language");
      // The auto-detection flag is persisted so we don't re-detect next visit
      expect(localStorage.getItem("lavita-language-auto-detected")).toBe("true");
    });
  }

  it("does not re-detect when user has manually chosen a language", async () => {
    localStorage.setItem("lavita-language", "en");
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );
    await new Promise((r) => setTimeout(r, 20));
    expect(invokeMock).not.toHaveBeenCalled();
    expect(screen.getByTestId("lang").textContent).toBe("en");
  });
});

import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { GallerySection } from "@/components/GallerySection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { BookingSection } from "@/components/BookingSection";
import { PromoBannerSection } from "@/components/PromoBannerSection";
import { FAQSection } from "@/components/FAQSection";
import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";
import { ActivitiesSection } from "@/components/ActivitiesSection";
import { CookieConsent } from "@/components/CookieConsent";
import { StickyMobileBar } from "@/components/StickyMobileBar";

export interface LocationMeta {
  slug: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  introDe: string;
}

const BASE_URL = "https://www.lavitaterme3000.com";

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export const LocationLanding: React.FC<{ meta: LocationMeta }> = ({ meta }) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = meta.title;
    setMeta("description", meta.description);
    setMeta("og:title", meta.title, "property");
    setMeta("og:description", meta.description, "property");
    setMeta("og:url", `${BASE_URL}/${meta.slug}`, "property");
    setCanonical(`${BASE_URL}/${meta.slug}`);
    return () => {
      document.title = previousTitle;
    };
  }, [meta]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ActivitiesSection />
      <GallerySection />
      <TestimonialsSection />
      <BookingSection />
      <PromoBannerSection />
      <FAQSection />
      <AboutSection />

      <section className="py-12 bg-muted/30 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-muted-foreground/70 text-sm leading-relaxed space-y-4">
            <h2 className="text-base font-semibold text-muted-foreground mb-4">{meta.heading}</h2>
            <p>{meta.intro}</p>
          </div>
          <div className="text-muted-foreground/70 text-sm leading-relaxed space-y-4 mt-8" lang="de">
            <p>{meta.introDe}</p>
          </div>
        </div>
      </section>

      <Footer />
      <CookieConsent />
      <StickyMobileBar />
    </div>
  );
};

export const LOCATIONS: Record<string, LocationMeta> = {
  "moravske-toplice": {
    slug: "moravske-toplice",
    title: "Nastanitev Moravske Toplice | Hiška La Vita – Terme 3000",
    description:
      "Počitniška hiška La Vita v Moravskih Toplicah – nastanitev v Termah 3000 z vključenima kopalnima kartama, 3x kolesi in zasebno teraso. Holiday house Moravske Toplice / Ferienhaus Moravske Toplice.",
    heading: "Nastanitev v Moravskih Toplicah – Hiška La Vita",
    intro:
      "Hiška La Vita se nahaja v Kampu Terme 3000 v Moravskih Toplicah – eni najbolj priljubljenih termalnih destinacij v Sloveniji. 50m² hiška za do 6 oseb, vključeni 2 kopalni karti.",
    introDe:
      "La Vita Ferienhaus in Moravske Toplice – komfortables 50m² Ferienhaus im Camping Terme 3000 mit 2 Thermenkarten und Fahrrädern.",
  },
  "murska-sobota": {
    slug: "murska-sobota",
    title: "Nastanitev Murska Sobota | Hiška La Vita – Terme 3000",
    description:
      "Počitniška hiška La Vita blizu Murske Sobote, v Kampu Terme 3000 Moravske Toplice. Accommodation Murska Sobota / Unterkunft Murska Sobota / smještaj Murska Sobota.",
    heading: "Nastanitev blizu Murske Sobote – Hiška La Vita",
    intro:
      "Hiška La Vita je le nekaj minut vožnje iz Murske Sobote, v srcu Pomurja. Idealna izhodiščna točka za odkrivanje Prekmurja in termalnih užitkov v Termah 3000.",
    introDe:
      "Unterkunft nahe Murska Sobota – Ferienhaus La Vita im Camping Terme 3000, nur wenige Minuten von Murska Sobota entfernt.",
  },
  "prekmurje": {
    slug: "prekmurje",
    title: "Dopust Prekmurje | Hiška La Vita Terme 3000",
    description:
      "Počitniška hiška v Prekmurju – La Vita v Termah 3000. Holiday house Prekmurje / Ferienhaus Prekmurje / smještaj Prekmurje. Dopust v Pomurju s kopalnimi kartami.",
    heading: "Dopust v Prekmurju – Hiška La Vita",
    intro:
      "Prekmurje je regija kulinaričnih užitkov, term in mirne narave. Hiška La Vita v Termah 3000 vam ponuja popolno izhodišče za raziskovanje Prekmurja in Pomurja.",
    introDe:
      "Urlaub in Prekmurje – Ferienhaus La Vita im Camping Terme 3000, idealer Ausgangspunkt für Thermen, Radtouren und regionale Küche.",
  },
};

export default LocationLanding;

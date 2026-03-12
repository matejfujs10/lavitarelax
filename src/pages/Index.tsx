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

const Index = () => {
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
      
      {/* SEO Text Section - visually subtle but crawlable */}
      <section className="py-12 bg-muted/30 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-muted-foreground/70 text-sm leading-relaxed space-y-4">
            <h2 className="text-base font-semibold text-muted-foreground mb-4">La Vita House – Holiday House at Terme 3000</h2>
            <p>Welcome to La Vita House, a comfortable 50m² holiday house located in Camping Terme 3000 in Moravske Toplice, Slovenia.</p>
            <p>Our accommodation is perfect for families, couples and friends looking for relaxing holidays near the famous Terme 3000 thermal spa.</p>
            <p>The house offers a spacious kitchen, comfortable beds, two terraces and plenty of space for relaxation. Guests also enjoy bikes for exploring the area, toys for children and sports equipment.</p>
            <p>One of the biggest advantages of La Vita House is its excellent location inside Camping Terme 3000, only a short walk from the thermal pools.</p>
            <p>The stay includes two thermal spa tickets, making it the perfect accommodation for guests who want to enjoy the thermal pools, nature and the peaceful atmosphere of Moravske Toplice.</p>
            <p>Moravske Toplice is one of the most popular thermal spa destinations in Slovenia and offers many activities such as cycling, golf, hiking and discovering local cuisine in the beautiful Prekmurje region.</p>
            <p>La Vita House is an ideal holiday house for guests visiting Terme 3000 and looking for comfortable accommodation in Slovenia.</p>
          </div>
          <div className="text-muted-foreground/70 text-sm leading-relaxed space-y-4 mt-8" lang="de">
            <h2 className="text-base font-semibold text-muted-foreground mb-4">La Vita House – Ferienhaus bei Terme 3000</h2>
            <p>La Vita House ist ein komfortables Ferienhaus im Camping Terme 3000 in Moravske Toplice, Slowenien.</p>
            <p>Das Haus ist 50m² groß und bietet Platz für bis zu 6 Personen. Es ist ideal für Familien, Paare oder Freunde, die einen entspannten Thermenurlaub verbringen möchten.</p>
            <p>Die Gäste genießen eine voll ausgestattete Küche, zwei Terrassen und Fahrräder für Ausflüge in die Umgebung.</p>
            <p>Ein großer Vorteil ist die Nähe zu den bekannten Thermalbädern Terme 3000, die nur wenige Minuten entfernt sind.</p>
            <p>Moravske Toplice ist eines der beliebtesten Thermenziele in Slowenien und bietet viele Aktivitäten wie Radfahren, Golf und hervorragende regionale Küche.</p>
          </div>
        </div>
      </section>

      <Footer />
      <CookieConsent />
    </div>
  );
};

export default Index;

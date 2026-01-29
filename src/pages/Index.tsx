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
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default Index;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

import slide1 from "@/assets/slide-1.jpg";
import slide2 from "@/assets/slide-2.jpg";
import slide3 from "@/assets/slide-3.jpg";
import slide4 from "@/assets/slide-4.jpg";
import slide5 from "@/assets/slide-5.jpg";
import slide6 from "@/assets/slide-6.jpg";
import slide7 from "@/assets/slide-7.jpg";
import slide8 from "@/assets/slide-8.jpg";

const heroSlides = [
  { src: slide1, alt: "La Vita Hiška - poletje" },
  { src: slide2, alt: "La Vita Hiška - zima" },
  { src: slide3, alt: "La Vita Hiška - večer" },
  { src: slide4, alt: "La Vita Hiška - noč" },
  { src: slide5, alt: "La Vita Hiška - zunanjost" },
  { src: slide6, alt: "Terme 3000 - bazeni" },
  { src: slide7, alt: "Terme 3000 - okolica" },
  { src: slide8, alt: "La Vita Hiška - LED spalnica" },
];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);
  const { t } = useLanguage();

  const features = [
    t('hero.badge.tickets'),
    t('hero.badge.bikes'),
    t('hero.badge.tv'),
    t('hero.badge.space'),
    t('hero.badge.camping'),
    t('hero.badge.teambuilding'),
    t('hero.badge.unique'),
    t('hero.badge.nature'),
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(featureInterval);
  }, [features.length]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <section id="domov" className="relative min-h-screen overflow-hidden">
      {/* Full-screen Slideshow Background */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <img
              src={heroSlides[currentSlide].src}
              alt={heroSlides[currentSlide].alt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/40" />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-card/80 hover:bg-card text-foreground p-3 md:p-4 rounded-full transition-all shadow-lavita-card hover:scale-110"
        aria-label="Prejšnja slika"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-card/80 hover:bg-card text-foreground p-3 md:p-4 rounded-full transition-all shadow-lavita-card hover:scale-110"
        aria-label="Naslednja slika"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-accent"
                : "w-2 bg-card/60 hover:bg-card"
            }`}
            aria-label={`Pojdi na sliko ${index + 1}`}
          />
        ))}
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Prominent "2x KOPALNI KARTI VKLJUČENI" Badge */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <div className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lavita-card">
                <span className="font-display text-base md:text-lg font-bold tracking-wide">
                  🎫 {t('banner.ticketsIncluded')} 🎫
                </span>
              </div>
            </motion.div>

            {/* Rotating Feature Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="inline-block bg-accent/95 text-accent-foreground px-6 py-3 rounded-full shadow-glow-accent"
                >
                  <span className="font-display text-lg md:text-xl font-semibold">
                    {features[currentFeature]}
                  </span>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            >
              <span className="text-card drop-shadow-lg">{t('hero.title1')}</span>{" "}
              <span className="text-gradient-primary drop-shadow-lg">{t('hero.title2')}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl lg:text-3xl text-card/90 font-body font-medium mb-8 drop-shadow-md"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* Price Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-4 mb-10"
            >
              <div className="bg-card/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lavita-card border border-border/30">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">❄️</span>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground font-medium">{t('hero.winterAction')}</p>
                    <p className="text-2xl font-display font-bold text-primary">80€<span className="text-base font-normal text-muted-foreground">{t('hero.perNight')}</span></p>
                  </div>
                </div>
              </div>
              <div className="bg-primary/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lavita-card">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">☀️</span>
                  <div className="text-left">
                    <p className="text-sm text-primary-foreground/80 font-medium">{t('hero.summerAction')}</p>
                    <p className="text-2xl font-display font-bold text-primary-foreground">110€<span className="text-base font-normal text-primary-foreground/80">{t('hero.perNight')}</span></p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 md:px-10 py-6 md:py-7 text-lg md:text-xl font-semibold rounded-full shadow-lavita-card hover:shadow-lg hover:scale-105 transition-all w-full sm:w-auto"
                asChild
              >
                <a href="#rezervacija">
                  <Ticket className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                  {t('hero.bookNow')}
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-card/90 backdrop-blur-sm border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 md:px-10 py-6 md:py-7 text-lg md:text-xl font-semibold rounded-full transition-all w-full sm:w-auto"
                asChild
              >
                <a href="#aktivnosti">
                  {t('hero.discoverActivities')}
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-card/80"
        >
          <span className="text-sm font-medium">{t('hero.discoverMore')}</span>
          <div className="w-6 h-10 border-2 border-card/50 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-accent rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

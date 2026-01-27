import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSlideshow } from "@/components/HeroSlideshow";

const rotatingTexts = [
  { icon: "🏡", text: "La Vita – vaš kotiček sprostitve in narave 🌿" },
  { icon: "🎫", text: "2x KOPALNI KARTI VKLJUČENI" },
  { icon: "⛺", text: "Doživi Kampiranje v La Vita Hiški do 6 oseb" },
  { icon: "📐", text: "50m² Velika hiška z dvema terasama" },
  { icon: "🍳", text: "Polno opremljena kuhinja" },
  { icon: "💡", text: "LED ambientna osvetlitev" },
  { icon: "🎵", text: "HI-FI sistem za sproščeno in zabavno vzdušje" },
  { icon: "🛏️", text: "DORMEO vrhunska ležišča" },
  { icon: "🚲", text: "3x BREZPLAČNA KOLESA" },
  { icon: "📺", text: "TV + Videorekorder s Filmi in Risankami" },
  { icon: "💑", text: "Primerno za pare, družine, prijatelje" },
  { icon: "⛺", text: "Možnost kampiranja prijateljev takoj ob hiški" },
  { icon: "🤝", text: "Team Buildingi" },
  { icon: "✨", text: "Kreativen Prostor" },
  { icon: "🌳", text: "Urejena Okolica" },
  { icon: "🏠", text: "Domačnost in Toplina" },
  { icon: "🪵", text: "Toplina Lesa" },
  { icon: "🎨", text: "Unikatno preurejeni prostori" },
];

const promoBanners = [
  {
    icon: "❄️",
    text: "ZIMSKA AKCIJA 80€ na noč z dvema kopalnima kartama + možnost eno dnevne nočitve",
    color: "bg-accent/90",
  },
  {
    icon: "☀️",
    text: "POLETNA AKCIJA 110€ na noč z dvema kopalnima kartama + 3x Kolesi + Športni Rekviziti",
    color: "bg-primary/90",
  },
  {
    icon: "🎁",
    text: "Pri bivanju 5+ več dni vam odobrimo poseben popust",
    color: "bg-accent/90",
  },
];

export const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % promoBanners.length);
    }, 5000);
    return () => clearInterval(bannerInterval);
  }, []);

  return (
    <section id="domov" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/la-vita-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />
      </div>

      {/* Background Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5 z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating Decorations */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-10 text-4xl opacity-30 z-[2]"
      >
        🌿
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-16 text-3xl opacity-30 z-[2]"
      >
        🌲
      </motion.div>
      <motion.div
        animate={{ y: [-5, 15, -5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 left-20 text-2xl opacity-20 z-[2]"
      >
        🍃
      </motion.div>

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left">
            {/* Rotating Promo Banners */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBanner}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                  className={`inline-flex items-center gap-3 ${promoBanners[currentBanner].color} text-accent-foreground px-6 py-3 rounded-full shadow-glow-accent`}
                >
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span className="font-display text-base md:text-lg font-semibold">
                    {promoBanners[currentBanner].icon} {promoBanners[currentBanner].text}
                  </span>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </motion.div>
              </AnimatePresence>
              
              {/* Banner Dots */}
              <div className="flex justify-center lg:justify-start gap-2 mt-3">
                {promoBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentBanner
                        ? "w-6 bg-accent"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            >
              <span className="text-gradient-primary">La Vita</span>
            </motion.h1>

            {/* Rotating Texts */}
            <div className="h-24 md:h-20 flex items-center justify-center lg:justify-start mb-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-card/80 backdrop-blur-sm rounded-2xl shadow-lavita-card border border-border/50"
                >
                  <span className="text-2xl md:text-3xl">{rotatingTexts[currentIndex].icon}</span>
                  <span className="font-body text-lg md:text-xl text-foreground font-medium">
                    {rotatingTexts[currentIndex].text}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center lg:justify-start gap-1.5 mb-10 flex-wrap max-w-md">
              {rotatingTexts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-6 bg-primary"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full shadow-lavita-card hover:shadow-lg transition-all"
                asChild
              >
                <a href="#rezervacija">
                  <Ticket className="w-5 h-5 mr-2" />
                  Rezerviraj zdaj
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg font-semibold rounded-full transition-all"
                asChild
              >
                <a href="#onas">
                  Spoznaj La Vita
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Right side - Slideshow */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-[400px] lg:h-[500px]"
          >
            <HeroSlideshow />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-sm font-medium">Odkrijte več</span>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

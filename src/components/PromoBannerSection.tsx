import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const promoTexts = [
  { icon: "🎫", text: "2x KOPALNI KARTI VKLJUČENI" },
  { icon: "📺", text: "TV + Videorekorder s Filmi in Risankami" },
  { icon: "💑", text: "Primerno za pare, družine, prijatelje" },
  { icon: "⛺", text: "Možnost kampiranja prijateljev takoj ob hiški" },
  { icon: "🤝", text: "Team Buildingi" },
  { icon: "✨", text: "Kreativen Prostor" },
  { icon: "🌳", text: "Urejena Okolica" },
  { icon: "🏠", text: "Domačnost in Toplina" },
  { icon: "🪵", text: "Toplina Lesa" },
  { icon: "🎨", text: "Unikatno preurejeni prostori" },
  { icon: "🚲", text: "3x BREZPLAČNA KOLESA" },
  { icon: "🎵", text: "HI-FI sistem za sproščeno in zabavno vzdušje" },
  { icon: "🛏️", text: "DORMEO vrhunska ležišča" },
  { icon: "💡", text: "LED ambientna osvetlitev" },
  { icon: "🍳", text: "Polno opremljena kuhinja" },
  { icon: "📐", text: "50m² Velika hiška z dvema terasama" },
];

export const PromoBannerSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Summer Offer Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 bg-accent/90 text-accent-foreground px-6 py-3 rounded-full shadow-glow-accent mb-8"
          >
            <span className="text-xl">☀️</span>
            <span className="font-display text-lg md:text-xl font-semibold">
              POLETNA AKCIJA 110€ na noč z dvema kopalnima kartama + 3x Kolesi + Športni Rekviziti
            </span>
            <span className="text-xl">☀️</span>
          </motion.div>

          {/* Rotating Features */}
          <div className="h-20 flex items-center justify-center mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-card/80 backdrop-blur-sm rounded-2xl shadow-lavita-card border border-border/50"
              >
                <span className="text-3xl">{promoTexts[currentIndex].icon}</span>
                <span className="font-body text-xl text-foreground font-medium">
                  {promoTexts[currentIndex].text}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-1.5">
            {promoTexts.map((_, index) => (
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
        </div>
      </div>
    </section>
  );
};

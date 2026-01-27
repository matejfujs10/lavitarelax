import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Ticket, Users, Home, Bed, Music, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";

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
];

export const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="domov" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating Decorations */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-10 text-4xl opacity-30"
      >
        🌿
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-16 text-3xl opacity-30"
      >
        🌲
      </motion.div>
      <motion.div
        animate={{ y: [-5, 15, -5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 left-20 text-2xl opacity-20"
      >
        🍃
      </motion.div>

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Winter Promo Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 bg-accent/90 text-accent-foreground px-6 py-3 rounded-full shadow-glow-accent">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="font-display text-lg md:text-xl font-semibold">
                ZIMSKA AKCIJA 80€ na noč z dvema kopalnima kartama
              </span>
              <Sparkles className="w-5 h-5 animate-pulse" />
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
          <div className="h-24 md:h-20 flex items-center justify-center mb-10">
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
          <div className="flex justify-center gap-2 mb-10">
            {rotatingTexts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-primary"
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
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
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
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
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

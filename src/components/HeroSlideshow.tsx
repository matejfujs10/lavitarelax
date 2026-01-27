import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import slide1 from "@/assets/slide-1.jpg";
import slide2 from "@/assets/slide-2.jpg";
import slide3 from "@/assets/slide-3.jpg";
import slide4 from "@/assets/slide-4.jpg";
import slide5 from "@/assets/slide-5.jpg";
import slide6 from "@/assets/slide-6.jpg";
import slide7 from "@/assets/slide-7.jpg";
import slide8 from "@/assets/slide-8.jpg";
import collageMain from "@/assets/collage-main.jpg";
import interiorDining from "@/assets/interior-dining.jpg";
import bedroomLed from "@/assets/bedroom-led.jpg";

const slides = [
  { src: slide1, alt: "La Vita Hiška - zunanjost poleti" },
  { src: slide2, alt: "La Vita Hiška - vhod" },
  { src: slide3, alt: "La Vita Hiška - zimska pravljica" },
  { src: slide4, alt: "La Vita Hiška - LED osvetlitev" },
  { src: slide5, alt: "La Vita Hiška - kuhinja" },
  { src: slide6, alt: "La Vita Hiška - otroške igrače" },
  { src: slide7, alt: "La Vita Hiška - večerna atmosfera" },
  { src: slide8, alt: "La Vita Hiška - spalnica" },
  { src: collageMain, alt: "La Vita Hiška - kolaž" },
  { src: interiorDining, alt: "La Vita Hiška - jedilnica" },
  { src: bedroomLed, alt: "La Vita Hiška - spalnica z LED" },
];

export const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lavita-card">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentSlide}
          src={slides[currentSlide].src}
          alt={slides[currentSlide].alt}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-2 rounded-full transition-all shadow-md"
        aria-label="Prejšnja slika"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background text-foreground p-2 rounded-full transition-all shadow-md"
        aria-label="Naslednja slika"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? "w-5 bg-primary"
                : "bg-background/60 hover:bg-background"
            }`}
            aria-label={`Pojdi na sliko ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

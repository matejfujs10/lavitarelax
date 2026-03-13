import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const testimonials = [
  {
    name: "Tina M.",
    date: "Oktober 2024",
    text: "Prijetna izkušnja. Hiška je lepa in udobna. Gostoljubnost lastnikov je na visokem nivoju. Priporočamo! 🌟",
    rating: 5,
    lang: "SI"
  },
  {
    name: "Stefan K.",
    date: "September 2024",
    text: "Wunderbare Unterkunft! Das Haus ist modern eingerichtet und sehr sauber. Die Therme ist nur wenige Gehminuten entfernt. Perfekt für Familien! 🏊‍♂️",
    rating: 5,
    lang: "AT"
  },
  {
    name: "Ana P.",
    date: "August 2024",
    text: "Odlična lokacija, čisto in urejeno. Kuhinja ima vse kar potrebuješ. Otroci so bili navdušeni nad kolesi in igračami. Vrnemo se! 🚲",
    rating: 5,
    lang: "SI"
  },
  {
    name: "Marco R.",
    date: "Juli 2024",
    text: "Skvělé ubytování blízko termálních lázní. Dům je krásně zařízený a velmi čistý. Děkujeme za krásný pobyt! ⭐",
    rating: 5,
    lang: "CZ"
  },
  {
    name: "Katarina D.",
    date: "Juni 2024",
    text: "Prekrasna kućica s svim što treba. Blizina termi je ogromna prednost. Preporučamo svima koji traže miran odmor! 🌿",
    rating: 5,
    lang: "HR"
  },
  {
    name: "Thomas W.",
    date: "Mai 2024",
    text: "Super Ferienhaus! Toll ausgestattet, die LED-Beleuchtung schafft eine tolle Atmosphäre. Die Fahrräder sind ein großer Bonus. Sehr empfehlenswert! 🌟",
    rating: 5,
    lang: "DE"
  },
];

export const TestimonialsSection = () => {
  const { t } = useLanguage();

  return (
    <section id="mnenja" className="py-20 bg-gradient-to-b from-lavita-cream to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            {t('testimonials.badge')}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-lavita hover:shadow-xl transition-all duration-300 border border-border relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{testimonial.date}</span>
                    <span className="px-2 py-0.5 bg-muted rounded text-xs font-medium">
                      {testimonial.lang}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed text-sm">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="https://www.facebook.com/hiskalavitaterme3000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1877F2] text-white rounded-full font-medium hover:bg-[#1877F2]/90 transition-colors"
          >
            {t('testimonials.moreReviews')}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

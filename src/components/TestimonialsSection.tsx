import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Tomislav Gomboc",
    date: "November 2025",
    text: "Wir verbrachten unseren Aufenthalt in Ferienhaus La Vita Hiška Therme 3000 in Slowenien. Der Gastgeber war nett und aufmerksam. Perfekt für Alleinstehende oder Familien: Fahrräder, Spielzeug für Kinder, voll ausgestattete Küche, sehr gemütliche Schlafplätze. Sehr sauber!",
    rating: 5,
    lang: "DE"
  },
  {
    name: "Katja Merzel Guzej",
    date: "September 2025",
    text: "Hiška La Vita v kampu Terme 3000 je idealna, je vse kar človek rabi na dopustu. Prostorna (za 6 oseb), čista, urejena hiška in okolica. Popolnoma opremljena, kuhinjski pripomočki, sveža posteljnina. Tudi za otroke je poskrbljeno - družabne igre, skiro, žoga. Pred hiško je manjša terasa, za hiško pa večja pokrita terasa.",
    rating: 5,
    lang: "SL"
  },
  {
    name: "Klemen Žiberna",
    date: "September 2025",
    text: "Lepo urejena hiška, 3 velike postelje, prijazen lastnik. Za hiško je velika terasa pa 3 kolesa. Priporočam! 😊",
    rating: 5,
    lang: "SL"
  },
  {
    name: "Kristina Štolfa",
    date: "Avgust 2025",
    text: "Zelo lepa, prostorna, dobro opremljena hiška. Super je, da so zraven kolesa, ki se lahko uporabljajo. Hiška je blizu vhoda v bazenski kompleks.",
    rating: 5,
    lang: "SL"
  },
  {
    name: "Nataša Vogrin",
    date: "Avgust 2025",
    text: "Lepo urejena hiška, prijazen lastnik. Za hiško velika terasa in 🚴. Priporočam 👍",
    rating: 5,
    lang: "SL"
  },
  {
    name: "Dominique Fiala",
    date: "Julij 2025",
    text: "Sehr Kinderfreundlich, Hilfsbereit und super Lage, Tolle Hütte!",
    rating: 5,
    lang: "DE"
  },
  {
    name: "Billi Enes Biloo",
    date: "Julij 2025",
    text: "Es war ein wunderbarer Aufenthalt! Sehr Sauber! Der Vermieter Matej ist sehr korrekt und sehr freundlich! Die Location ist sehr nahe bei der Terme 3000 ungefähr 100 m entfernt. Ich empfehle es jedem der sich mal entspannen möchte.",
    rating: 5,
    lang: "DE"
  },
  {
    name: "Andreja Ručman",
    date: "Junij 2025",
    text: "Lepo je urejena, čista, udobna, veliko prostora, prijetna okolica, zelo umirjena ali umirjeno je, tik čez cesto so bazena, sladoled... skratka vse imaš pri roki... za hiško je pa pohvalno odlično 10⭐⭐⭐",
    rating: 5,
    lang: "SL"
  },
  {
    name: "Davor Rojko",
    date: "Junij 2025",
    text: "Very cozy/comfortable, hospitality, affordable, good location. Good for backpackers!",
    rating: 5,
    lang: "EN"
  }
];

export const TestimonialsSection = () => {
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
            ⭐ 100% priporočajo (9+ ocen)
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Idealno za družine in pare
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Preberite izkušnje naših zadovoljnih gostov iz vse Evrope
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
            Več ocen na Facebook-u →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

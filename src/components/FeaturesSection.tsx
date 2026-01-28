import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Home, Users, UtensilsCrossed, Lightbulb, Music, Bed, Bike, Ticket, Maximize } from "lucide-react";

const features = [
  {
    icon: Home,
    title: "50m² Prostora",
    description: "Prostorna hiška z dvema terasama za popoln oddih v naravi",
  },
  {
    icon: Users,
    title: "Do 6 Gostov",
    description: "Idealno za družine in manjše skupine prijateljev",
  },
  {
    icon: UtensilsCrossed,
    title: "Opremljena Kuhinja",
    description: "Vse kar potrebujete za pripravo okusnih obrokov",
  },
  {
    icon: Lightbulb,
    title: "LED Osvetlitev",
    description: "Ambientna osvetlitev za romantične večere",
  },
  {
    icon: Music,
    title: "HI-FI Sistem",
    description: "Kakovostna glasba za sproščeno vzdušje",
  },
  {
    icon: Bed,
    title: "DORMEO Ležišča",
    description: "Vrhunska kvaliteta spanja za popolno regeneracijo",
  },
  {
    icon: Bike,
    title: "3x Brezplačna Kolesa",
    description: "Raziskujte okolico na dveh kolesih",
  },
  {
    icon: Ticket,
    title: "2x Kopalni Karti",
    description: "Vključen vstop v termalni kompleks",
  },
  {
    icon: Maximize,
    title: "Urejena Okolica",
    description: "Lepo vzdrževan prostor za sproščanje in uživanje",
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-card rounded-2xl p-6 shadow-lavita hover:shadow-lavita-card transition-all duration-300 border border-border/50 hover:border-primary/30 h-full">
        <div className="w-14 h-14 bg-lavita-mint-light rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <feature.icon className="w-7 h-7 text-primary" />
        </div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          {feature.title}
        </h3>
        <p className="text-muted-foreground font-body leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

export const FeaturesSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section className="py-20 bg-lavita-cream">
      <div className="container mx-auto px-4">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-medium text-sm tracking-wide uppercase mb-4">
            🌿 Kaj vas čaka
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Vse za Popoln Oddih
          </h2>
          <p className="text-muted-foreground text-lg">
            La Vita Hiška ponuja vse, kar potrebujete za nepozaben oddih sredi narave
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Home, Users, UtensilsCrossed, Lightbulb, Music, Bed, Bike, Ticket, Maximize, Dumbbell, BedDouble, LayoutGrid, LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Feature {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
}

const featuresList: Feature[] = [
  { icon: Home, titleKey: "features.space", descKey: "features.spaceDesc" },
  { icon: Users, titleKey: "features.guests", descKey: "features.guestsDesc" },
  { icon: UtensilsCrossed, titleKey: "features.kitchen", descKey: "features.kitchenDesc" },
  { icon: Lightbulb, titleKey: "features.led", descKey: "features.ledDesc" },
  { icon: Music, titleKey: "features.hifi", descKey: "features.hifiDesc" },
  { icon: Bed, titleKey: "features.dormeo", descKey: "features.dormeoDesc" },
  { icon: Bike, titleKey: "features.bikes", descKey: "features.bikesDesc" },
  { icon: Ticket, titleKey: "features.tickets", descKey: "features.ticketsDesc" },
  { icon: Maximize, titleKey: "features.area", descKey: "features.areaDesc" },
  { icon: Dumbbell, titleKey: "features.sports", descKey: "features.sportsDesc" },
  { icon: BedDouble, titleKey: "features.linen", descKey: "features.linenDesc" },
  { icon: LayoutGrid, titleKey: "features.terrace", descKey: "features.terraceDesc" },
];

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-card rounded-2xl p-4 md:p-6 shadow-lavita hover:shadow-lavita-card transition-all duration-300 border border-border/50 hover:border-primary/30 h-full">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-lavita-mint-light rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <feature.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
        </div>
        <h3 className="font-display text-lg md:text-xl font-semibold text-foreground mb-2">
          {t(feature.titleKey)}
        </h3>
        <p className="text-muted-foreground font-body leading-relaxed text-sm md:text-base">
          {t(feature.descKey)}
        </p>
      </div>
    </motion.div>
  );
};

export const FeaturesSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-20 bg-lavita-cream">
      <div className="container mx-auto px-4">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <span className="inline-block text-primary font-medium text-sm tracking-wide uppercase mb-4">
            {t('features.label')}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('features.title')}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuresList.map((feature, index) => (
            <FeatureCard key={feature.titleKey} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Waves, Ship, Wine, Bike, Mountain, TreePine, Building2,
  Utensils, Camera, Heart, Sparkles, MapPin, ChefHat, Castle, Leaf
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const activityKeys = [
  { icon: Waves, key: "terme", color: "bg-primary/10 text-primary" },
  { icon: Ship, key: "rafting", color: "bg-accent/15 text-accent-foreground" },
  { icon: Wine, key: "jeruzalem", color: "bg-primary/10 text-primary" },
  { icon: Bike, key: "goricko", color: "bg-accent/15 text-accent-foreground" },
  { icon: Mountain, key: "vinarium", color: "bg-primary/10 text-primary" },
  { icon: TreePine, key: "bukovnisko", color: "bg-accent/15 text-accent-foreground" },
  { icon: Building2, key: "expano", color: "bg-primary/10 text-primary" },
  { icon: Castle, key: "grad", color: "bg-accent/15 text-accent-foreground" },
  { icon: Sparkles, key: "vulkanija", color: "bg-primary/10 text-primary" },
  { icon: Leaf, key: "orchids", color: "bg-accent/15 text-accent-foreground" },
];

const culinaryKeys = [
  { icon: ChefHat, nameKey: "culinary.rajh", descKey: "culinary.rajhDesc" },
  { icon: Utensils, nameKey: "culinary.kodila", descKey: "culinary.kodilaDesc" },
  { icon: Heart, nameKey: "culinary.passero", descKey: "culinary.passeroDesc" },
  { icon: Wine, nameKey: "culinary.gibanica", descKey: "culinary.gibanicaDesc" },
];

export const ActivitiesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section id="aktivnosti" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 text-primary font-medium text-sm tracking-wide uppercase mb-4 bg-primary/10 px-4 py-2 rounded-full">
            <MapPin className="w-4 h-4" />
            {t('activities.label')}
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            {t('activities.title')}
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            {t('activities.subtitle')}
          </p>
        </motion.div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {activityKeys.map((activity, index) => (
            <motion.div
              key={activity.key}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-2xl p-6 shadow-lavita hover:shadow-lavita-card transition-all duration-300 hover:-translate-y-1 border border-border/50"
            >
              <div className={`w-14 h-14 rounded-xl ${activity.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <activity.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-1">
                {t(`activity.${activity.key}.title`)}
              </h3>
              <p className="text-primary text-sm font-medium mb-3">
                {t(`activity.${activity.key}.subtitle`)}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {t(`activity.${activity.key}.desc`)}
              </p>
              <span className="inline-block bg-accent/20 text-accent-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                {t(`activity.${activity.key}.highlight`)}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Culinary Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-card rounded-3xl p-8 md:p-12 shadow-lavita-card border border-border/50"
        >
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-accent-foreground font-medium text-sm tracking-wide uppercase mb-4 bg-accent/20 px-4 py-2 rounded-full">
              <Utensils className="w-4 h-4" />
              {t('activities.culinary')}
            </span>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('activities.culinaryTitle')}
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('activities.culinarySubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {culinaryKeys.map((item, index) => (
              <motion.div
                key={item.nameKey}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h4 className="font-display font-semibold text-foreground mb-2">
                  {t(item.nameKey)}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {t(item.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Romantic Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-4 md:gap-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 px-8 py-6 rounded-2xl">
            <span className="flex items-center gap-2 text-foreground font-medium">
              <Camera className="w-5 h-5 text-primary" />
              {t('activities.walks')}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="flex items-center gap-2 text-foreground font-medium">
              <Ship className="w-5 h-5 text-primary" />
              {t('activities.sup')}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="flex items-center gap-2 text-foreground font-medium">
              <Heart className="w-5 h-5 text-primary" />
              {t('activities.amazon')}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

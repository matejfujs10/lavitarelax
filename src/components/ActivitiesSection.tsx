import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Waves, Ship, Wine, Bike, Eye, Trees, Sparkles } from "lucide-react";

const activities = [
  {
    icon: Waves,
    title: "Terme 3000",
    description: "Razvajajte se v zdravilni črni termo-mineralni vodi, ki blagodejno vpliva na telo in duha. Odkrijte bogato wellness ponudbo in raznovrstne bazene.",
  },
  {
    icon: Ship,
    title: "Rafting na Muri",
    description: "Prepustite se toku reke Mure in doživite pustolovščino sredi neokrnjene narave. Idealna izbira za družine in ljubitelje vodnih doživetij.",
  },
  {
    icon: Wine,
    title: "Jeruzalem",
    description: "Obiščite slovito vinorodno deželo, kjer se prepletajo vrhunska bela vina in dih jemajoči razgledi po zelenih gričih Prlekije.",
  },
  {
    icon: Bike,
    title: "Kolesarjenje po Goričkem",
    description: "Raziščite slikovito pokrajino Goričkega na dveh kolesih. Odkrijte skrite kotičke, tradicionalne kmetije in mir podeželskega življenja.",
  },
  {
    icon: Eye,
    title: "Stolp Vinarium",
    description: "Povzpnite se na razgledni stolp in z enega mesta občudujte razglede na kar štiri države – Slovenijo, Madžarsko, Hrvaško in Avstrijo.",
  },
  {
    icon: Trees,
    title: "Bukovniško jezero",
    description: "Zatočišče miru ob jezeru, obdanem z gozdovi. Idealno za sprehode, opazovanje narave in trenutke tišine ob energijskih točkah.",
  },
  {
    icon: Sparkles,
    title: "Paviljon Expano",
    description: "Sodobni interaktivni paviljon ob Soboškem jezeru vas popelje skozi edinstvena doživetja narave, športa in pomurske kulinarike.",
  },
];

export const ActivitiesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="aktivnosti" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-primary font-medium text-sm tracking-wide uppercase mb-4">
            🏊 Aktivnosti v okolici
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Odkrijte Čarobno Pomurje
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Od termalnih užitkov do pustolovščin v naravi – Pomurje ponuja nepozabna doživetja za vsakogar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-lavita-card border border-border/50 hover:shadow-lg transition-all group"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <activity.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                {activity.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {activity.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

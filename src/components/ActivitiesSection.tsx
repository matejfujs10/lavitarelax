import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Waves, 
  Ship, 
  Wine, 
  Bike, 
  Mountain, 
  TreePine, 
  Building2,
  Utensils,
  Camera,
  Heart,
  Sparkles,
  MapPin,
  ChefHat,
  Castle,
  Leaf
} from "lucide-react";

const activities = [
  {
    icon: Waves,
    title: "Terme 3000",
    subtitle: "Zdravilna črna voda",
    description: "Potopite se v edinstveno črno termo-mineralno vodo z zdravilnimi učinki. Bazeni, savne, wellness in nepozabna sprostitev le nekaj korakov od vaše hiške.",
    highlight: "2x kopalni karti vključeni",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Ship,
    title: "Rafting na Muri",
    subtitle: "Avantura za vse",
    description: "Prepustite se toku najdaljše slovenske reke. Mirno veslanje skozi devištvo narave, kjer srečate bobra in obilje ptic. Popolno za družine in romantične pare.",
    highlight: "24 km od hiške",
    color: "bg-accent/15 text-accent-foreground",
  },
  {
    icon: Wine,
    title: "Jeruzalem",
    subtitle: "Vinorodna pravljica",
    description: "Slikovite vinorodne gorice s panoramskimi razgledi, ki jemljejo dih. Degustirajte vrhunska bela vina in uživajte v kulinaričnih dobrotah Prlekije.",
    highlight: "Najboljše vinorodne lege",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Bike,
    title: "Ride Goričko",
    subtitle: "Kolesarski raj",
    description: "Gričevnata pokrajina Goričkega vabi na kolesarske pustolovščine. Električna kolesa, lokalni vodniki in skrite poti vas popeljejo skozi zeleno srce Pomurja.",
    highlight: "3x kolesa brezplačno",
    color: "bg-accent/15 text-accent-foreground",
  },
  {
    icon: Mountain,
    title: "Stolp Vinarium",
    subtitle: "Razgled na 4 države",
    description: "Vzpnite se na 54-metrski razgledni stolp in uživajte v dih jemajočem 360° pogledu na Slovenijo, Madžarsko, Hrvaško in Avstrijo. Zipline za pogumne!",
    highlight: "Adrenalinski zipline",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: TreePine,
    title: "Bukovniško jezero",
    subtitle: "Energijske točke",
    description: "Skrivnostno jezero z 26 energijskimi točkami, obdano s stoletnim gozdom. Idealno za meditacijo, sprehode in ribolov v absolutnem miru narave.",
    highlight: "26 energijskih točk",
    color: "bg-accent/15 text-accent-foreground",
  },
  {
    icon: Building2,
    title: "Expano",
    subtitle: "Vrata v Pomurje",
    description: "Sodobni interaktivni paviljon ob Soboškem jezeru. Odkrijte zgodbo Pomurja skozi inovativne predstavitve narave, športa, tradicije in kulinarike.",
    highlight: "Ob Soboškem jezeru",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Castle,
    title: "Grad Grad",
    subtitle: "365 sob, 1 grad",
    description: "Največji baročni grad v Sloveniji s 365 sobami — ena za vsak dan v letu. Obiščite muzejske zbirke in odkrijte bogato zgodovino Goričkega.",
    highlight: "Največji grad v SLO",
    color: "bg-accent/15 text-accent-foreground",
  },
  {
    icon: Sparkles,
    title: "Park Vulkanija",
    subtitle: "Vulkanska pustolovščina",
    description: "Ste vedeli, da je zadnji vulkan v Sloveniji izbruhnil pred 3 milijoni let? Doživite interaktivno izkušnjo geološke zgodovine za celo družino.",
    highlight: "Edinstveno v Sloveniji",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Leaf,
    title: "Ocean Orchids",
    subtitle: "Tropski vrt",
    description: "Potujte v tropske kraje sredi Prekmurja. Občudujte orhideje z vsega sveta, eksotične rastline in subtropski ambient, ki vas bo očaral.",
    highlight: "Tropska oaza",
    color: "bg-accent/15 text-accent-foreground",
  },
];

const culinaryExperiences = [
  {
    icon: ChefHat,
    title: "Gostilna Rajh",
    description: "Četrta generacija s prekmursko tradicijo in sodobnim pridihom",
  },
  {
    icon: Utensils,
    title: "Kodila - Meet Meat Eat",
    description: "Raj za ljubitelje mesa in izbranih zrezkov",
  },
  {
    icon: Heart,
    title: "Čokoladnica Passero",
    description: "Prekmurski okusi v čokoladnih pralinejih in sladoledu",
  },
  {
    icon: Wine,
    title: "Hiša Gibanice",
    description: "Spoznajte skrivnosti prave prekmurske gibanice",
  },
];

export const ActivitiesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            Raziščite Pomurje
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Aktivnosti v okolici Term 3000
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            Prekmurje ni samo ravnica z reko Muro. Odkrijte gričevnato Goričko, 
            zdravilne termalne kopeli, kulinarične mojstrovine in skrivnostne kotičke, 
            kjer čas teče počasneje.
          </p>
        </motion.div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-2xl p-6 shadow-lavita hover:shadow-lavita-card transition-all duration-300 hover:-translate-y-1 border border-border/50"
            >
              <div className={`w-14 h-14 rounded-xl ${activity.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <activity.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-1">
                {activity.title}
              </h3>
              <p className="text-primary text-sm font-medium mb-3">
                {activity.subtitle}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {activity.description}
              </p>
              <span className="inline-block bg-accent/20 text-accent-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                {activity.highlight}
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
              Kulinarika
            </span>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Termalne izkušnje
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bil bi greh, če ne bi poskusili bograča, bujte repe, prekmurske gibanice, 
              domače šunke in drugih kulinaričnih dobrot te čarobne pokrajine.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {culinaryExperiences.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h4 className="font-display font-semibold text-foreground mb-2">
                  {item.title}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {item.description}
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
              Sprehodi v naravi
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="flex items-center gap-2 text-foreground font-medium">
              <Ship className="w-5 h-5 text-primary" />
              SUP & Surf na Soboškem jezeru
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="flex items-center gap-2 text-foreground font-medium">
              <Heart className="w-5 h-5 text-primary" />
              Amazon of Europe
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

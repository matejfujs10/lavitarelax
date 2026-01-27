import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import livingKitchen from "@/assets/living-kitchen.jpg";
import laVitaHouse from "@/assets/la-vita-house.png";

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="onas" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lavita-card">
              <img
                src={livingKitchen}
                alt="La Vita notranjost"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
            </div>
            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-6 rounded-2xl shadow-lg max-w-[200px]"
            >
              <span className="text-3xl font-display font-bold">100%</span>
              <p className="text-sm font-medium mt-1">Domačnost, Sprostitev, Oddih</p>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-block text-primary font-medium text-sm tracking-wide uppercase mb-4">
              🏡 O nas
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Vaš Dom Stran od Doma
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              La Vita Hiška je skrbno zasnovana počitniška nastanitev v srcu Kampa Terme 3000. 
              Naša 50m² velika hiška ponuja popolno ravnovesje med udobjem doma in čari kampiranja v naravi.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Z dvema terasama, vrhunsko opremo in neposrednim dostopom do termalnega kompleksa 
              vam zagotavljamo nepozabno doživetje za celo družino ali skupino prijateljev.
            </p>

            {/* La Vita House Image with Text */}
            <div className="mb-8 flex flex-col items-start">
              <img
                src={laVitaHouse}
                alt="La Vita Hiška"
                className="w-48 h-auto object-contain"
              />
              <span className="text-xs text-foreground font-medium mt-1">Travel - Enjoy - Explore</span>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-lavita-mint-light rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Lokacija</span>
                  <p className="font-medium text-foreground">Kamp Terme 3000, Moravske Toplice</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-lavita-mint-light rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Telefon</span>
                  <p className="font-medium text-foreground">+386 68 169 430</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-lavita-mint-light rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Email</span>
                  <p className="font-medium text-foreground">lavitarelax@gmail.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

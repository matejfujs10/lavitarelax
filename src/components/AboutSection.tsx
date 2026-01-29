import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Mail } from "lucide-react";

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="onas" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Video - Full Width */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative mb-12"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-lavita-card">
            <video
              src="/videos/la-vita-about.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto aspect-video object-contain bg-black"
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-block text-primary font-medium text-sm tracking-wide uppercase mb-4">
              🏡 O nas
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Vaš Dom Stran od Doma
            </h2>
            
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed mb-8">
              <p>
                La Vita Hiška je skrbno zasnovana počitniška nastanitev v srcu Kampa Terme 3000, kjer se udobje doma prepleta z naravno sproščenostjo kampiranja. Obdana je z lepo urejeno okolico, ki nudi mir, zasebnost in občutek pravega oddiha v naravi.
              </p>
              <p>
                Naša 50 m² velika hiška ponuja vrhunsko opremo, dve prijetni terasi ter veliko zasebno teraso, idealno za jutranjo kavo, sončenje ali večerne trenutke ob dobri družbi. Neposreden dostop do termalnega kompleksa pa poskrbi za popolno sprostitev v vsakem letnem času.
              </p>
              <p>
                Posebna prednost La Vita Hiške je izjemno ugodna cena – pri bivanju do 6 oseb znaša manj kot 19 € na osebo na noč, v ceno pa sta že vključeni dve kopalni karti za terme.
              </p>
              <div className="bg-lavita-mint-light/50 rounded-xl p-4 my-4">
                <p className="font-medium text-foreground mb-2">Za ostale osebe veljajo znižane cene vstopnic:</p>
                <ul className="space-y-1 text-base">
                  <li>• odrasli: 21,90 € na osebo na noč</li>
                  <li>• otroci od 6 do 14,99 let: 17,90 € na osebo na noč</li>
                  <li>• otroci do 5,99 let: brezplačno</li>
                </ul>
              </div>
              <p>
                Privoščite si ugoden oddih brez kompromisov – več udobja, več sprostitve in več nepozabnih trenutkov.
              </p>
              <p className="text-primary font-medium italic">
                ✨ Pobegnite od vsakdana in si ustvarite spomine, ki bodo trajali. Vljudno vabljeni v La Vita Hiško! ✨
              </p>
            </div>

          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-2xl shadow-lg overflow-hidden bg-accent/90 mb-8"
            >
              <div className="p-6 text-center text-accent-foreground">
                <span className="text-4xl font-display font-bold">100%</span>
                <p className="text-sm font-medium mt-2">Domačnost, Sprostitev, Oddih</p>
              </div>
            </motion.div>

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
                  <p className="font-medium text-foreground">rent@lavitaterme3000.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

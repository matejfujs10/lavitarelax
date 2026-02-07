import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { t } = useLanguage();

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

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-block text-primary font-medium text-sm tracking-wide uppercase mb-4">
              {t('about.label')}
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Lokacija in dostop
            </h2>
            
            <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
              <p>
                {t('about.text1')}
              </p>
              <p>
                {t('about.text2')}
              </p>
              <p>
                {t('about.text3')}
              </p>
              <div className="bg-lavita-mint-light/50 rounded-xl p-4 my-4">
                <p className="font-medium text-foreground mb-2">{t('about.priceTitle')}</p>
                <ul className="space-y-1 text-sm md:text-base">
                  <li>• {t('about.priceAdult')}</li>
                  <li>• {t('about.priceChild')}</li>
                  <li>• {t('about.priceFree')}</li>
                </ul>
              </div>
              <p>
                {t('about.text4')}
              </p>
              <p>
                {t('about.text5')}
              </p>
              <p className="text-primary font-medium italic">
                {t('about.cta')}
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
                <p className="text-sm font-medium mt-2">{t('about.stats')}</p>
              </div>
            </motion.div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-lavita-mint-light rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm text-muted-foreground">{t('about.location')}</span>
                  <p className="font-medium text-foreground break-words">{t('about.locationValue')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-lavita-mint-light rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm text-muted-foreground">{t('about.phone')}</span>
                  <p className="font-medium text-foreground">+386 68 169 430</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-lavita-mint-light rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm text-muted-foreground">{t('about.email')}</span>
                  <p className="font-medium text-foreground break-all">rent@lavitaterme3000.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

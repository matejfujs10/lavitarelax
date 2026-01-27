import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Ticket, Phone, Mail } from "lucide-react";

export const BookingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="rezervacija" className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card rounded-3xl shadow-lavita-card border border-border/50 overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Left - Info */}
              <div className="p-8 lg:p-12 bg-primary text-primary-foreground">
                <span className="inline-flex items-center gap-2 bg-primary-foreground/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Ticket className="w-4 h-4" />
                  Zimska ponudba
                </span>
                <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
                  Rezervirajte Vaš Pobeg
                </h2>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-display text-5xl font-bold">80€</span>
                  <span className="text-primary-foreground/80 text-lg">/ noč</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-primary-foreground/20 rounded-full flex items-center justify-center text-xs">✓</span>
                    2x kopalni karti vključeni
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-primary-foreground/20 rounded-full flex items-center justify-center text-xs">✓</span>
                    3x brezplačna kolesa
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-primary-foreground/20 rounded-full flex items-center justify-center text-xs">✓</span>
                    Polno opremljena kuhinja
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-primary-foreground/20 rounded-full flex items-center justify-center text-xs">✓</span>
                    Brezplačno parkiranje
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-5 h-5 bg-primary-foreground/20 rounded-full flex items-center justify-center text-xs">✓</span>
                    WiFi vključen
                  </li>
                </ul>
              </div>

              {/* Right - Contact */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                  Kontaktirajte Nas
                </h3>
                <p className="text-muted-foreground mb-8">
                  Za rezervacijo ali dodatne informacije nas kontaktirajte po telefonu ali e-pošti. 
                  Z veseljem vam bomo pomagali načrtovati vaš popoln oddih.
                </p>

                <div className="space-y-4 mb-8">
                  <a 
                    href="tel:+38668169430" 
                    className="flex items-center gap-4 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Pokličite nas</span>
                      <p className="font-semibold text-foreground">+386 68 169 430</p>
                    </div>
                  </a>

                  <a 
                    href="mailto:lavitarelax@gmail.com" 
                    className="flex items-center gap-4 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Pišite nam</span>
                      <p className="font-semibold text-foreground">lavitarelax@gmail.com</p>
                    </div>
                  </a>
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-xl"
                  asChild
                >
                  <a href="tel:+38668169430">
                    <Calendar className="w-5 h-5 mr-2" />
                    Rezerviraj Zdaj
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

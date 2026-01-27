import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Heart } from "lucide-react";
import logo from "@/assets/la-vita-logo.png";

export const Footer = () => {
  return (
    <footer className="bg-lavita-forest text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo & About */}
          <div>
            <img src={logo} alt="La Vita" className="h-20 w-auto mb-4 brightness-0 invert opacity-90" />
            <p className="text-primary-foreground/70 leading-relaxed">
              La Vita Hiška - vaš kotiček sprostitve in narave v Kampu Terme 3000. 
              Uživajte v udobju, naravi in termalnih doživetjih.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xl font-semibold mb-6">Hitri Dostop</h4>
            <ul className="space-y-3">
              <li>
                <a href="#domov" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Domov
                </a>
              </li>
              <li>
                <a href="#rezervacija" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Rezervacija
                </a>
              </li>
              <li>
                <a href="#aktivnosti" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Aktivnosti
                </a>
              </li>
              <li>
                <a href="#mnenja" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Mnenja gostov
                </a>
              </li>
              <li>
                <a href="#faq" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Pogosta vprašanja
                </a>
              </li>
              <li>
                <a href="#onas" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  O nas
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xl font-semibold mb-6">Kontakt</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-accent" />
                <span className="text-primary-foreground/70">
                  Kamp Terme 3000<br />
                  Moravske Toplice, Slovenija
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-accent" />
                <a href="tel:+38668169430" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  +386 68 169 430
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-accent" />
                <a href="mailto:lavitarelax@gmail.com" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  lavitarelax@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} La Vita Hiška. Vse pravice pridržane.
            </p>
            <p className="text-primary-foreground/60 text-sm flex items-center gap-1">
              Ustvarjeno z <Heart className="w-4 h-4 text-accent fill-accent" /> za najboljše goste
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

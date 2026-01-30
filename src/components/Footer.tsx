import { MapPin, Phone, Mail, Heart, ArrowRight } from "lucide-react";
import { TermsModal } from "./TermsModal";
import { PrivacyModal } from "./PrivacyModal";
import { CookiesModal } from "./CookiesModal";
import { openCookieSettings } from "./CookieConsent";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-lavita-forest text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ArrowRight className="w-6 h-6 text-accent" />
              <span className="font-display text-xl font-bold">Hiška La Vita</span>
            </div>
            <p className="text-primary-foreground/70 leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xl font-semibold mb-6">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              <li>
                <a href="#domov" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {t('footer.home')}
                </a>
              </li>
              <li>
                <a href="#rezervacija" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {t('footer.reservation')}
                </a>
              </li>
              <li>
                <a href="#aktivnosti" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {t('footer.activities')}
                </a>
              </li>
              <li>
                <a href="#mnenja" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {t('footer.reviews')}
                </a>
              </li>
              <li>
                <a href="#faq" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {t('footer.faq')}
                </a>
              </li>
              <li>
                <a href="#onas" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {t('footer.about')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xl font-semibold mb-6">{t('footer.contact')}</h4>
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
                <a href="mailto:rent@lavitaterme3000.com" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors break-all">
                  rent@lavitaterme3000.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-primary-foreground/20 pt-8 mb-8">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
            <TermsModal
              trigger={
                <button className="text-primary-foreground/70 hover:text-primary-foreground transition-colors underline-offset-4 hover:underline">
                  {t('footer.terms')}
                </button>
              }
            />
            <PrivacyModal
              trigger={
                <button className="text-primary-foreground/70 hover:text-primary-foreground transition-colors underline-offset-4 hover:underline">
                  {t('footer.privacy')}
                </button>
              }
            />
            <CookiesModal
              trigger={
                <button className="text-primary-foreground/70 hover:text-primary-foreground transition-colors underline-offset-4 hover:underline">
                  {t('footer.cookies')}
                </button>
              }
            />
            <button 
              onClick={openCookieSettings}
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors underline-offset-4 hover:underline"
            >
              {t('footer.cookieSettings')}
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} La Vita Hiška. {t('footer.rights')}
            </p>
            <p className="text-primary-foreground/60 text-sm flex items-center gap-1">
              {t('footer.madeWith')} <Heart className="w-4 h-4 text-accent fill-accent" /> {t('footer.forGuests')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

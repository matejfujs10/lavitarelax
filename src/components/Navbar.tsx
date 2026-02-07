import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Facebook, Instagram } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import laVitaLogo from "@/assets/la-vita-kamp-logo.png";

const languages: Language[] = ["sl", "en", "de"];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { label: t('nav.home'), href: "#domov", isExternal: false },
    { label: t('nav.booking'), href: "#rezervacija", isExternal: false },
    { label: t('nav.vouchers'), href: "/gift-voucher", isExternal: true },
    { label: t('nav.activities'), href: "#aktivnosti", isExternal: false },
    { label: t('nav.reviews'), href: "#mnenja", isExternal: false },
    { label: t('nav.faq'), href: "#faq", isExternal: false },
    { label: t('nav.about'), href: "#onas", isExternal: false },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar with Languages and Social */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "h-0 opacity-0 overflow-hidden" : "h-10 opacity-100"
      } bg-lavita-forest text-white`}>
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Language Buttons */}
          <div className="flex items-center gap-1">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  language === lang 
                    ? "bg-white/30 text-white" 
                    : "hover:bg-white/20"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/hiskalavitaterme3000"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://www.instagram.com/lavitaterme3000/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "top-0 glass-effect shadow-lavita py-2" : "top-10 bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo - Text Based with Energy Arrow */}
          <a href="#domov" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center"
            >
              <img
                src={laVitaLogo}
                alt="La Vita Hiška Kamp Terme 3000"
                className="h-12 md:h-14 lg:h-16 w-auto object-contain"
              />
            </motion.div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => (
              item.isExternal ? (
                <motion.div key={item.href}>
                  <Link
                    to={item.href}
                    className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-3/4 transition-all duration-300 rounded-full" />
                  </Link>
                </motion.div>
              ) : (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-3/4 transition-all duration-300 rounded-full" />
                </motion.a>
              )
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-effect border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {/* Mobile Language Buttons */}
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                      language === lang 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              {navItems.map((item) => (
                item.isExternal ? (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted rounded-lg transition-all"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-muted rounded-lg transition-all"
                  >
                    {item.label}
                  </a>
                )
              ))}
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Sticky bottom CTA bar for mobile devices.
 * Appears after the user scrolls past the hero section (~600px).
 */
export const StickyMobileBar = () => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border shadow-lavita-card px-4 py-3"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          <Button
            asChild
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-lavita-card text-base"
          >
            <a href="#rezervacija" className="flex items-center justify-center gap-2">
              <Ticket className="w-5 h-5" />
              {t("hero.bookNow")}
            </a>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

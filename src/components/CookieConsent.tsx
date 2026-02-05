import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X, Settings, Cookie } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const COOKIE_CONSENT_KEY = "lavita_cookie_consent";

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: "",
  });
  const { t } = useLanguage();

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!savedConsent) {
      setIsVisible(true);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    const consentData = {
      ...prefs,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    setIsVisible(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: "",
    });
  };

  const handleRejectNonEssential = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: "",
    });
  };

  const handleSaveSettings = () => {
    savePreferences(preferences);
  };

  // Function to reopen cookie settings (for footer link)
  useEffect(() => {
    const handleOpenSettings = () => {
      setIsVisible(true);
      setShowSettings(true);
    };

    window.addEventListener("openCookieSettings", handleOpenSettings);
    return () => window.removeEventListener("openCookieSettings", handleOpenSettings);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="bg-background border border-border rounded-2xl shadow-lg p-6">
              {!showSettings ? (
                // First layer - Banner
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                        {t('cookie.title')}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {t('cookie.description')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowSettings(true)}
                      className="gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      {t('cookie.settings')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleRejectNonEssential}
                    >
                      {t('cookie.rejectNonEssential')}
                    </Button>
                    <Button
                      onClick={handleAcceptAll}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {t('cookie.acceptAll')}
                    </Button>
                  </div>
                </div>
              ) : (
                // Second layer - Settings
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {t('cookie.settingsTitle')}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowSettings(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {t('cookie.settingsDescription')}
                  </p>
                  
                  <div className="space-y-4">
                    {/* Necessary cookies */}
                    <div className="flex items-start justify-between gap-4 p-4 bg-muted/50 rounded-xl">
                      <div>
                        <p className="font-medium text-foreground">{t('cookie.essential')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('cookie.essentialDesc')}
                        </p>
                      </div>
                      <Switch checked={true} disabled className="opacity-50" />
                    </div>

                    {/* Analytics cookies */}
                    <div className="flex items-start justify-between gap-4 p-4 bg-muted/50 rounded-xl">
                      <div>
                        <p className="font-medium text-foreground">{t('cookie.analytics')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('cookie.analyticsDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={preferences.analytics}
                        onCheckedChange={(checked) =>
                          setPreferences({ ...preferences, analytics: checked })
                        }
                      />
                    </div>

                    {/* Marketing cookies */}
                    <div className="flex items-start justify-between gap-4 p-4 bg-muted/50 rounded-xl">
                      <div>
                        <p className="font-medium text-foreground">{t('cookie.marketing')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('cookie.marketingDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={preferences.marketing}
                        onCheckedChange={(checked) =>
                          setPreferences({ ...preferences, marketing: checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-end pt-2">
                    <Button
                      variant="outline"
                      onClick={handleRejectNonEssential}
                    >
                      {t('cookie.rejectNonEssential')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSaveSettings}
                    >
                      {t('cookie.saveSettings')}
                    </Button>
                    <Button
                      onClick={handleAcceptAll}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {t('cookie.acceptAll')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Export helper to open settings from footer
export const openCookieSettings = () => {
  window.dispatchEvent(new CustomEvent("openCookieSettings"));
};

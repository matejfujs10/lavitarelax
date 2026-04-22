import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingDown, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  computePrice,
  formatEur,
  type PriceBreakdown,
} from "@/lib/pricing";

interface PriceSummaryProps {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  className?: string;
}

/**
 * Returns a contextual upsell message ("nudge") based on current night count,
 * encouraging the user to extend by one more night to reach the next discount tier.
 */
function getNudgeKey(nights: number): string | null {
  if (nights === 2) return "pricing.nudge.2to3";
  if (nights === 4) return "pricing.nudge.4to5";
  if (nights === 6) return "pricing.nudge.6to7";
  if (nights === 9) return "pricing.nudge.9to10";
  return null;
}

function seasonLabelKey(season: PriceBreakdown["season"]): string {
  return `pricing.season.${season}`;
}

export const PriceSummary = ({ checkIn, checkOut, className }: PriceSummaryProps) => {
  const { t } = useLanguage();
  const breakdown = computePrice(checkIn, checkOut);

  if (!breakdown) {
    return null;
  }

  const nudgeKey = getNudgeKey(breakdown.nights);
  const showValueMessage = breakdown.nights > 5 && breakdown.discountAmount > 0;
  const valueMessage = t("pricing.value").replace(
    "{amount}",
    String(breakdown.discountAmount),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-card to-accent/5 p-5 space-y-3",
        className,
      )}
    >
      {/* Title */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h4 className="font-display text-lg font-semibold text-foreground">
          {t("pricing.summary")}
        </h4>
      </div>

      {/* Nights + season */}
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">
          {breakdown.nights}{" "}
          {breakdown.nights === 1 ? t("pricing.night") : t("pricing.nights")}{" "}
          · {t(seasonLabelKey(breakdown.season))}
        </span>
        <span className="font-medium text-foreground">
          {formatEur(breakdown.basePerNight)} / {t("pricing.night")}
        </span>
      </div>

      {/* Subtotal */}
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">{t("pricing.baseTotal")}</span>
        <span
          className={cn(
            "text-foreground",
            breakdown.discountAmount > 0 && "line-through text-muted-foreground",
          )}
        >
          {formatEur(breakdown.baseTotal)}
        </span>
      </div>

      {/* Discount line */}
      <AnimatePresence>
        {breakdown.discountAmount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-baseline justify-between text-sm"
          >
            <span className="flex items-center gap-1.5 text-primary font-medium">
              <Gift className="w-4 h-4" />
              {t("pricing.giftLong")} ({Math.round(breakdown.discountPct * 100)}%)
            </span>
            <span className="text-primary font-semibold">
              −{formatEur(breakdown.discountAmount)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final total */}
      <div className="border-t border-border/60 pt-3 flex items-baseline justify-between">
        <span className="font-display font-semibold text-foreground">
          {t("pricing.finalTotal")}
        </span>
        <span className="font-display text-2xl font-bold text-primary">
          {formatEur(breakdown.finalTotal)}
        </span>
      </div>

      {/* Nudge message (encourages adding 1 more night) */}
      <AnimatePresence>
        {nudgeKey && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-start gap-2 bg-accent/15 text-accent-foreground rounded-xl p-3 text-sm"
          >
            <TrendingDown className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
            <span>{t(nudgeKey)}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Value message for stays > 5 nights */}
      <AnimatePresence>
        {showValueMessage && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-start gap-2 bg-primary/10 text-primary rounded-xl p-3 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{valueMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Ticket, Phone, Mail, Users, CalendarDays, Plus, X, Dog, Check, Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { sl, de, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import laVitaLogoNew from "@/assets/la-vita-logo-new.png";

import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface Guest {
  name: string;
  email: string;
}

export const BookingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { toast } = useToast();
  const { language, t } = useLanguage();
  
  // Get the appropriate date locale
  const dateLocale = language === 'sl' ? sl : language === 'de' ? de : enUS;
  
  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [departureDate, setDepartureDate] = useState<Date>();
  const [arrivalTime, setArrivalTime] = useState("");
  const [guests, setGuests] = useState<Guest[]>([{ name: "", email: "" }]);
  const [hasPets, setHasPets] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Slide show state
  const [currentOffer, setCurrentOffer] = useState(0);

  // Localized features
  const winterFeatures = [
    t('booking.winterOffer') === 'Zimska ponudba' ? "2x kopalni karti vključeni" : 
    t('booking.winterOffer') === 'Winterangebot' ? "2x Spa-Tickets inklusive" : "2x spa tickets included",
    t('booking.winterOffer') === 'Zimska ponudba' ? "Polno opremljena kuhinja" :
    t('booking.winterOffer') === 'Winterangebot' ? "Voll ausgestattete Küche" : "Fully equipped kitchen",
    t('booking.winterOffer') === 'Zimska ponudba' ? "Brezplačno parkiranje" :
    t('booking.winterOffer') === 'Winterangebot' ? "Kostenloses Parken" : "Free parking",
    t('booking.winterOffer') === 'Zimska ponudba' ? "WiFi vključen" :
    t('booking.winterOffer') === 'Winterangebot' ? "WLAN inklusive" : "WiFi included",
    t('booking.winterOffer') === 'Zimska ponudba' ? "Možnost eno dnevne nočitve" :
    t('booking.winterOffer') === 'Winterangebot' ? "Einzelübernachtung möglich" : "Single night stay possible",
    t('booking.winterOffer') === 'Zimska ponudba' ? "Posteljnina vključena" :
    t('booking.winterOffer') === 'Winterangebot' ? "Bettwäsche inklusive" : "Bed linen included",
    t('booking.winterOffer') === 'Zimska ponudba' ? "Končno čiščenje vključeno" :
    t('booking.winterOffer') === 'Winterangebot' ? "Endreinigung inklusive" : "Final cleaning included",
  ];

  const summerFeatures = [
    t('booking.summerOffer') === 'Poletna ponudba' ? "2x kopalni karti vključeni" :
    t('booking.summerOffer') === 'Sommerangebot' ? "2x Spa-Tickets inklusive" : "2x spa tickets included",
    t('booking.summerOffer') === 'Poletna ponudba' ? "3x brezplačna kolesa" :
    t('booking.summerOffer') === 'Sommerangebot' ? "3x kostenlose Fahrräder" : "3x free bicycles",
    t('booking.summerOffer') === 'Poletna ponudba' ? "Polno opremljena kuhinja" :
    t('booking.summerOffer') === 'Sommerangebot' ? "Voll ausgestattete Küche" : "Fully equipped kitchen",
    t('booking.summerOffer') === 'Poletna ponudba' ? "Brezplačno parkiranje" :
    t('booking.summerOffer') === 'Sommerangebot' ? "Kostenloses Parken" : "Free parking",
    t('booking.summerOffer') === 'Poletna ponudba' ? "Športni Rekviziti" :
    t('booking.summerOffer') === 'Sommerangebot' ? "Sportausrüstung" : "Sports equipment",
    t('booking.summerOffer') === 'Poletna ponudba' ? "Posteljnina vključena" :
    t('booking.summerOffer') === 'Sommerangebot' ? "Bettwäsche inklusive" : "Bed linen included",
    t('booking.summerOffer') === 'Poletna ponudba' ? "Končno čiščenje vključeno" :
    t('booking.summerOffer') === 'Sommerangebot' ? "Endreinigung inklusive" : "Final cleaning included",
    t('booking.summerOffer') === 'Poletna ponudba' ? "WiFi vključen" :
    t('booking.summerOffer') === 'Sommerangebot' ? "WLAN inklusive" : "WiFi included",
  ];

  const priceInfo = language === 'sl' ? [
    "ZNIŽANE KARTE za tretjo in ostale osebe 21,90€",
    "GRATIS za otroke do 6 leta",
    "Otroci do 15 leta 17,90€ po osebi na noč",
  ] : language === 'de' ? [
    "ERMÄSSIGTE TICKETS für dritte und weitere Personen 21,90€",
    "GRATIS für Kinder bis 6 Jahre",
    "Kinder bis 15 Jahre 17,90€ pro Person/Nacht",
  ] : [
    "REDUCED TICKETS for 3rd and additional persons €21.90",
    "FREE for children up to 6 years",
    "Children up to 15 years €17.90 per person/night",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % 2);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const addGuest = () => {
    setGuests([...guests, { name: "", email: "" }]);
  };

  const removeGuest = (index: number) => {
    if (guests.length > 1) {
      setGuests(guests.filter((_, i) => i !== index));
    }
  };

  const updateGuest = (index: number, field: keyof Guest, value: string) => {
    const newGuests = [...guests];
    newGuests[index][field] = value;
    setGuests(newGuests);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast({
        title: t('booking.error'),
        description: t('booking.errorTerms'),
        variant: "destructive",
      });
      return;
    }

    if (!fullName || !email || !arrivalDate || !departureDate) {
      toast({
        title: t('booking.error'),
        description: t('booking.errorFields'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Build extra info for the message field
      const extraParts: string[] = [];
      if (arrivalTime) extraParts.push(`Okvirni čas prihoda: ${arrivalTime}`);
      if (hasPets) extraParts.push("Hišni ljubljenček: Da (+5€/noč)");
      if (guests.length > 0) {
        const guestNames = guests
          .filter(g => g.name)
          .map((g, i) => `${i + 1}. ${g.name}${g.email ? ` (${g.email})` : ""}`)
          .join(", ");
        if (guestNames) extraParts.push(`Gostje: ${guestNames}`);
      }

      const payload = {
        name: fullName,
        email,
        phone: "",
        checkIn: format(arrivalDate, "yyyy-MM-dd"),
        checkOut: format(departureDate, "yyyy-MM-dd"),
        guests: String(guests.length),
        message: extraParts.join("\n"),
      };

      const resp = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok || data.ok !== true) {
        throw new Error(data.error || "Pošiljanje ni uspelo");
      }

      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Error submitting booking:", error);
      toast({
        title: t('booking.error'),
        description: error?.message || t('booking.errorGeneric'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="rezervacija" className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-card rounded-3xl shadow-lavita-card border border-border/50 p-12">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-primary" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                {t('booking.thankYou')}
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                {t('booking.willContact')}
              </p>
              <p className="font-display text-xl text-primary font-semibold">
                {t('booking.team')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="rezervacija" className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-card rounded-3xl shadow-lavita-card border border-border/50 overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Left - Info with Slideshow */}
              <div className="p-8 lg:p-12 bg-primary text-primary-foreground relative overflow-hidden">
                {/* Logo */}
                <div className="mb-6">
                  <img 
                    src={laVitaLogoNew} 
                    alt="La Vita" 
                    className="w-40 h-auto object-contain"
                  />
                </div>
                
                {/* Offer Slideshow */}
                <div className="relative min-h-[400px]">
                  {/* Winter Offer */}
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: currentOffer === 0 ? 1 : 0,
                      x: currentOffer === 0 ? 0 : -20,
                    }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                      "absolute inset-0",
                      currentOffer !== 0 && "pointer-events-none"
                    )}
                  >
                    <span className="inline-flex items-center gap-2 bg-primary-foreground/20 px-4 py-2 rounded-full text-sm font-medium mb-4">
                      <Ticket className="w-4 h-4" />
                      {t('booking.winterOffer')}
                    </span>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-display text-5xl font-bold">80€</span>
                      <span className="text-primary-foreground/80 text-lg">{t('booking.perNight')}</span>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {winterFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm">
                          <span className="w-5 h-5 bg-primary-foreground/20 rounded-full flex items-center justify-center text-xs">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="bg-primary-foreground/10 rounded-xl p-3 space-y-1">
                      {priceInfo.map((info, idx) => (
                        <p key={idx} className="text-xs">{info}</p>
                      ))}
                    </div>
                  </motion.div>

                  {/* Summer Offer */}
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: currentOffer === 1 ? 1 : 0,
                      x: currentOffer === 1 ? 0 : 20,
                    }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                      "absolute inset-0",
                      currentOffer !== 1 && "pointer-events-none"
                    )}
                  >
                    <span className="inline-flex items-center gap-2 bg-accent/90 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
                      <Ticket className="w-4 h-4" />
                      {t('booking.summerOffer')}
                    </span>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-display text-5xl font-bold">110€</span>
                      <span className="text-primary-foreground/80 text-lg">{t('booking.perNight')}</span>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {summerFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm">
                          <span className="w-5 h-5 bg-primary-foreground/20 rounded-full flex items-center justify-center text-xs">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="bg-primary-foreground/10 rounded-xl p-3 space-y-1">
                      {priceInfo.map((info, idx) => (
                        <p key={idx} className="text-xs">{info}</p>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Offer Dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {[0, 1].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentOffer(idx)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        idx === currentOffer
                          ? "w-6 bg-primary-foreground"
                          : "bg-primary-foreground/40"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Right - Booking Form */}
              <div className="p-8 lg:p-12">
                <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                  {t('booking.formTitle')}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t('booking.nameLabel')} *</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={language === 'sl' ? "Vnesite ime in priimek" : language === 'de' ? "Geben Sie Ihren Namen ein" : "Enter your full name"}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('booking.emailLabel')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={language === 'sl' ? "vas.email@primer.com" : language === 'de' ? "ihre.email@beispiel.com" : "your.email@example.com"}
                      required
                    />
                  </div>

                  {/* Date Pickers */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('booking.arrivalDate')} *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !arrivalDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {arrivalDate ? format(arrivalDate, "PPP", { locale: dateLocale }) : t('booking.select')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={arrivalDate}
                            onSelect={setArrivalDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('booking.departureDate')} *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !departureDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {departureDate ? format(departureDate, "PPP", { locale: dateLocale }) : t('booking.select')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={departureDate}
                            onSelect={setDepartureDate}
                            disabled={(date) => date < (arrivalDate || new Date())}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Arrival Time */}
                  <div className="space-y-2">
                    <Label htmlFor="arrivalTime">{t('booking.arrivalTime')}</Label>
                    <Select value={arrivalTime} onValueChange={setArrivalTime}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('booking.selectTime')}>
                          {arrivalTime && (
                            <span className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {arrivalTime}
                            </span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", t('booking.byAgreement')].map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Guests */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>{t('booking.guests')}</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addGuest}
                        className="gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        {t('booking.addGuest')}
                      </Button>
                    </div>
                    {guests.map((guest, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                          <Input
                            value={guest.name}
                            onChange={(e) => updateGuest(index, "name", e.target.value)}
                            placeholder={`${t('booking.guestName')} ${index + 1}`}
                          />
                        </div>
                        {guests.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeGuest(index)}
                            className="shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pets */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="pets"
                        checked={hasPets}
                        onCheckedChange={(checked) => setHasPets(checked as boolean)}
                      />
                      <Label htmlFor="pets" className="flex items-center gap-2 cursor-pointer">
                        <Dog className="w-4 h-4" />
                        {t('booking.pets')}
                      </Label>
                    </div>
                    {hasPets && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-sm text-accent-foreground bg-accent/20 p-3 rounded-lg ml-6"
                      >
                        {t('booking.petsNote')}
                      </motion.p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="flex items-start space-x-3 pt-2">
                    <Checkbox
                      id="terms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      {t('booking.terms')} *
                    </Label>
                  </div>

                  {/* Contact Options */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <a
                      href="tel:+38668169430"
                      className="flex items-center gap-3 p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Phone className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground">{t('booking.callUs')}</span>
                        <p className="font-semibold text-foreground text-xs">+386 68 169 430</p>
                      </div>
                    </a>

                    <a
                      href="mailto:lavitarelax@gmail.com"
                      className="flex items-center gap-3 p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail className="w-4 h-4 text-accent-foreground" />
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground">{t('booking.writeUs')}</span>
                        <p className="font-semibold text-foreground text-xs truncate">lavitarelax@gmail.com</p>
                      </div>
                    </a>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-xl"
                    disabled={!agreeTerms || isSubmitting}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    {isSubmitting ? t('booking.submitting') : t('booking.reserveNow')}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

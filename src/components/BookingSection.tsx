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
import { sl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import laVitaLogoNew from "@/assets/la-vita-logo-new.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Guest {
  name: string;
  email: string;
}

const winterFeatures = [
  "2x kopalni karti vključeni",
  "Polno opremljena kuhinja",
  "Brezplačno parkiranje",
  "WiFi vključen",
  "Možnost eno dnevne nočitve",
  "Posteljnina vključena",
  "Končno čiščenje vključeno",
];

const summerFeatures = [
  "2x kopalni karti vključeni",
  "3x brezplačna kolesa",
  "Polno opremljena kuhinja",
  "Brezplačno parkiranje",
  "Športni Rekviziti",
  "Posteljnina vključena",
  "Končno čiščenje vključeno",
  "WiFi vključen",
];

const priceInfo = [
  "ZNIŽANE KARTE za tretjo in ostale osebe 21,90€",
  "GRATIS za otroke do 6 leta",
  "Otroci do 15 leta 17,90€ po osebi na noč",
];

export const BookingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { toast } = useToast();
  
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
        title: "Napaka",
        description: "Prosimo, potrdite splošne pogoje poslovanja.",
        variant: "destructive",
      });
      return;
    }

    if (!fullName || !email || !arrivalDate || !departureDate) {
      toast({
        title: "Napaka",
        description: "Prosimo, izpolnite vsa obvezna polja.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-booking-email', {
        body: {
          fullName,
          email,
          arrivalDate: format(arrivalDate, "PPP", { locale: sl }),
          departureDate: format(departureDate, "PPP", { locale: sl }),
          arrivalTime: arrivalTime || "Po dogovoru",
          guests,
          hasPets,
          agreeTerms,
        },
      });

      if (error) throw error;

      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Napaka",
        description: "Prišlo je do napake. Prosimo, poskusite znova.",
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
                Hvala za Rezervacijo!
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                V najkrajšem možnem času vas bomo kontaktirali.
              </p>
              <p className="font-display text-xl text-primary font-semibold">
                Team La Vita
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
                      Zimska ponudba
                    </span>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-display text-5xl font-bold">80€</span>
                      <span className="text-primary-foreground/80 text-lg">/ noč</span>
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
                      Poletna ponudba
                    </span>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-display text-5xl font-bold">110€</span>
                      <span className="text-primary-foreground/80 text-lg">/ noč</span>
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
                  Rezervacijski Obrazec
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Ime in Priimek *</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Vnesite ime in priimek"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vas.email@primer.com"
                      required
                    />
                  </div>

                  {/* Date Pickers */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Datum prihoda *</Label>
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
                            {arrivalDate ? format(arrivalDate, "PPP", { locale: sl }) : "Izberi"}
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
                      <Label>Datum odhoda *</Label>
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
                            {departureDate ? format(departureDate, "PPP", { locale: sl }) : "Izberi"}
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
                    <Label htmlFor="arrivalTime">Okvirni čas prihoda</Label>
                    <Select value={arrivalTime} onValueChange={setArrivalTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Izberite čas">
                          {arrivalTime && (
                            <span className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {arrivalTime}
                            </span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "Po dogovoru"].map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Guests */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Gostje</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addGuest}
                        className="gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Dodaj osebo
                      </Button>
                    </div>
                    {guests.map((guest, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                          <Input
                            value={guest.name}
                            onChange={(e) => updateGuest(index, "name", e.target.value)}
                            placeholder={`Ime gosta ${index + 1}`}
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
                        Hišni ljubljenček
                      </Label>
                    </div>
                    {hasPets && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-sm text-accent-foreground bg-accent/20 p-3 rounded-lg ml-6"
                      >
                        Doplačilo za hišnega ljubljenčka: <strong>5€/noč</strong>
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
                      Z oddajo povpraševanja se strinjate s splošnimi pogoji poslovanja *
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
                        <span className="text-[10px] text-muted-foreground">Pokličite nas</span>
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
                        <span className="text-[10px] text-muted-foreground">Pišite nam</span>
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
                    {isSubmitting ? "Pošiljanje..." : "Rezerviraj Zdaj"}
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

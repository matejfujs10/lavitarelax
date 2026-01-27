import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Ticket, Phone, Mail, Users, CalendarDays } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { sl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import laVitaIllustration from "@/assets/la-vita-illustration.png";

export const BookingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [departureDate, setDepartureDate] = useState<Date>();
  const [guests, setGuests] = useState<string>("");
  const [agreeTerms, setAgreeTerms] = useState(false);

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
              {/* Left - Info with Image */}
              <div className="p-8 lg:p-12 bg-primary text-primary-foreground relative">
                {/* Illustration in top left */}
                <div className="absolute top-4 left-4 w-32 h-32 opacity-90">
                  <img 
                    src={laVitaIllustration} 
                    alt="La Vita ilustracija" 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="pt-28">
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
                    <li className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-primary-foreground/20 rounded-full flex items-center justify-center text-xs">✓</span>
                      Možnost eno dnevne nočitve
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right - Booking Form */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                  Rezervacijski Obrazec
                </h3>
                
                {/* Date Pickers */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="arrival" className="text-sm font-medium">Datum prihoda</Label>
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
                            {arrivalDate ? format(arrivalDate, "PPP", { locale: sl }) : "Izberi datum"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={arrivalDate}
                            onSelect={setArrivalDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="departure" className="text-sm font-medium">Datum odhoda</Label>
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
                            {departureDate ? format(departureDate, "PPP", { locale: sl }) : "Izberi datum"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={departureDate}
                            onSelect={setDepartureDate}
                            disabled={(date) => date < (arrivalDate || new Date())}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Guest Count */}
                  <div className="space-y-2">
                    <Label htmlFor="guests" className="text-sm font-medium">Število gostov</Label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Izberite število gostov">
                          {guests && (
                            <span className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {guests} {parseInt(guests) === 1 ? "gost" : parseInt(guests) < 5 ? "gostje" : "gostov"}
                            </span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "gost" : num < 5 ? "gostje" : "gostov"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-3 mb-6">
                  <Checkbox 
                    id="terms" 
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    Z oddajo povpraševanja se strinjate s splošnimi pogoji poslovanja
                  </Label>
                </div>

                {/* Contact Options */}
                <div className="space-y-3 mb-6">
                  <a 
                    href="tel:+38668169430" 
                    className="flex items-center gap-4 p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Pokličite nas</span>
                      <p className="font-semibold text-foreground text-sm">+386 68 169 430</p>
                    </div>
                  </a>

                  <a 
                    href="mailto:lavitarelax@gmail.com" 
                    className="flex items-center gap-4 p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Pišite nam</span>
                      <p className="font-semibold text-foreground text-sm">lavitarelax@gmail.com</p>
                    </div>
                  </a>
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-xl"
                  disabled={!agreeTerms}
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

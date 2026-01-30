import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Gift, ArrowLeft, CreditCard, Mail, User, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import paymentCardsImage from "@/assets/payment-cards.png";

const voucherSchema = z.object({
  giverFirstName: z.string().min(2, "Ime mora imeti vsaj 2 znaka"),
  giverLastName: z.string().min(2, "Priimek mora imeti vsaj 2 znaka"),
  giverAddress: z.string().min(5, "Vnesite veljaven naslov"),
  giverPostalCode: z.string().min(4, "Vnesite veljavno poštno številko"),
  giverCity: z.string().min(2, "Vnesite veljavno mesto"),
  giverEmail: z.string().email("Vnesite veljaven e-naslov"),
  recipientEmail: z.string().email("Vnesite veljaven e-naslov prejemnika"),
  recipientMessage: z.string().min(10, "Sporočilo mora imeti vsaj 10 znakov").max(500, "Sporočilo je predolgo"),
  nights: z.string().min(1, "Izberite število noči"),
});

type VoucherFormData = z.infer<typeof voucherSchema>;

// Fixed pricing: 110 EUR per night
const PRICE_PER_NIGHT = 110;

const nightOptions = [
  { value: "1", nights: 1, price: 110 },
  { value: "2", nights: 2, price: 220 },
  { value: "3", nights: 3, price: 330 },
  { value: "4", nights: 4, price: 440 },
  { value: "5", nights: 5, price: 550 },
  { value: "6", nights: 6, price: 660 },
  { value: "7", nights: 7, price: 770 },
];

const GiftVoucher = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const form = useForm<VoucherFormData>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      giverFirstName: "",
      giverLastName: "",
      giverAddress: "",
      giverPostalCode: "",
      giverCity: "",
      giverEmail: "",
      recipientEmail: "",
      recipientMessage: "",
      nights: "",
    },
  });

  const selectedNights = form.watch("nights");
  const selectedOption = nightOptions.find(opt => opt.value === selectedNights);

  const onSubmit = async (data: VoucherFormData) => {
    setIsProcessing(true);
    
    try {
      const { data: responseData, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          nights: parseInt(data.nights),
          giverFirstName: data.giverFirstName,
          giverLastName: data.giverLastName,
          giverAddress: data.giverAddress,
          giverPostalCode: data.giverPostalCode,
          giverCity: data.giverCity,
          giverEmail: data.giverEmail,
          recipientEmail: data.recipientEmail,
          recipientMessage: data.recipientMessage,
        },
      });

      if (error) {
        throw new Error(error.message || "Napaka pri ustvarjanju plačilne seje");
      }

      if (responseData?.url) {
        // Redirect to Stripe Checkout
        window.location.href = responseData.url;
      } else {
        throw new Error("Ni prejete URL za plačilo");
      }
    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast({
        title: "Napaka",
        description: error.message || "Prišlo je do napake pri obdelavi plačila. Prosimo, poskusite znova.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  // Check for cancelled payment return
  const urlParams = new URLSearchParams(window.location.search);
  const paymentCancelled = urlParams.get('cancelled') === 'true';

  if (paymentCancelled) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-lavita-cream to-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-3xl shadow-lavita-card p-8 md:p-12 max-w-lg text-center"
        >
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Plačilo preklicano
          </h1>
          <p className="text-muted-foreground mb-6">
            Plačilo je bilo preklicano. Lahko poskusite znova ali se vrnete na domačo stran.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => window.location.href = '/gift-voucher'}>
              Poskusi znova
            </Button>
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Domov
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavita-cream to-background">
      {/* Header */}
      <div className="bg-lavita-forest text-white py-4">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Nazaj na domačo stran</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-lavita-mint-light rounded-2xl flex items-center justify-center">
                <Gift className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Podari Dopust v Termah 3000
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Izpolni obrazec in pošlji darilni bon zdaj!
            </p>
            <p className="text-muted-foreground">
              Najboljše darilo za prijatelje in družino - nepozabni trenutki v La Vita Hiški
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-card rounded-3xl shadow-lavita-card p-6 md:p-10 border border-border/50">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Giver Info Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-primary" />
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        Darilni bon podarja
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="giverFirstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ime *</FormLabel>
                            <FormControl>
                              <Input placeholder="Vaše ime" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="giverLastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priimek *</FormLabel>
                            <FormControl>
                              <Input placeholder="Vaš priimek" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="giverAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Naslov *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ulica in hišna številka" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="giverPostalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Poštna številka *</FormLabel>
                            <FormControl>
                              <Input placeholder="1000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="giverCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kraj *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ljubljana" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="giverEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vaš e-naslov *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="vas@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Recipient Section */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Mail className="w-5 h-5 text-primary" />
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        Prejemnik bona
                      </h2>
                    </div>

                    <FormField
                      control={form.control}
                      name="recipientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-naslov prejemnika *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="prejemnik@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recipientMessage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sporočilo prejemniku *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Napišite osebno sporočilo za prejemnika darilnega bona..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Nights Selection Section */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        Vrednost bona
                      </h2>
                    </div>

                    <FormField
                      control={form.control}
                      name="nights"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Izberite število noči *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Izberite število noči" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {nightOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.nights} {option.nights === 1 ? "noč" : option.nights < 5 ? "noči" : "noči"} – {option.price} €
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedOption && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-lavita-mint-light/50 rounded-xl p-4 text-center"
                      >
                        <p className="text-sm text-muted-foreground mb-1">Skupna vrednost bona</p>
                        <p className="text-3xl font-bold text-primary">{selectedOption.price} €</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          ({selectedOption.nights} × {PRICE_PER_NIGHT} € na noč)
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Payment Info */}
                  <div className="bg-muted/50 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-4 mb-3">
                      <img 
                        src={paymentCardsImage} 
                        alt="Visa, Mastercard, Maestro" 
                        className="h-8 object-contain"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Varno kartično plačilo prek Stripe. Podprte kartice: Visa, Mastercard, Maestro.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90"
                    disabled={isProcessing || !selectedNights}
                  >
                    {isProcessing ? (
                      "Obdelava..."
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <CreditCard className="w-5 h-5" />
                        Plačaj s kartico in pošlji bon
                        <img 
                          src={paymentCardsImage} 
                          alt="" 
                          className="h-5 object-contain ml-2"
                        />
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default GiftVoucher;

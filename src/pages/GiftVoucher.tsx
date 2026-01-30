import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Gift, ArrowLeft, CreditCard, Mail, User, Eye } from "lucide-react";
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
import { useLanguage } from "@/contexts/LanguageContext";

import visaLogo from "@/assets/visa-logo.png";
import mastercardLogo from "@/assets/mastercard-logo.png";
import maestroLogo from "@/assets/maestro-logo.png";
import securePayment from "@/assets/secure-payment.png";
import trustedSeller from "@/assets/trusted-seller.jpg";

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
  const { t, language } = useLanguage();

  const voucherSchema = z.object({
    giverFirstName: z.string().min(2, t('validation.nameMin')),
    giverLastName: z.string().min(2, t('validation.surnameMin')),
    giverAddress: z.string().min(5, t('validation.addressMin')),
    giverPostalCode: z.string().min(4, t('validation.postalMin')),
    giverCity: z.string().min(2, t('validation.cityMin')),
    giverEmail: z.string().email(t('validation.emailInvalid')),
    recipientEmail: z.string().email(t('validation.recipientEmailInvalid')),
    recipientMessage: z.string().min(10, t('validation.messageMin')).max(500, t('validation.messageMax')),
    nights: z.string().min(1, t('validation.selectNights')),
  });

  type VoucherFormData = z.infer<typeof voucherSchema>;

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
            {t('voucher.cancelled')}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t('voucher.cancelledText')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => window.location.href = '/gift-voucher'}>
              {t('voucher.tryAgain')}
            </Button>
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90 w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('voucher.home')}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const getNightsLabel = (nights: number) => {
    if (language === 'sl') {
      return nights === 1 ? t('voucher.night') : t('voucher.nights');
    } else if (language === 'de') {
      return nights === 1 ? t('voucher.night') : t('voucher.nights');
    } else {
      return nights === 1 ? t('voucher.night') : t('voucher.nights');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavita-cream to-background">
      {/* Header */}
      <div className="bg-lavita-forest text-white py-4">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>{t('voucher.backHome')}</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-8 md:mb-12"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-lavita-mint-light rounded-2xl flex items-center justify-center">
                <Gift className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6">
              {t('voucher.title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-4">
              {t('voucher.subtitle')}
            </p>
            <p className="text-muted-foreground">
              {t('voucher.description')}
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
                        {t('voucher.giverTitle')}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="giverFirstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('voucher.firstName')} *</FormLabel>
                            <FormControl>
                              <Input placeholder={t('voucher.firstName')} {...field} />
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
                            <FormLabel>{t('voucher.lastName')} *</FormLabel>
                            <FormControl>
                              <Input placeholder={t('voucher.lastName')} {...field} />
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
                          <FormLabel>{t('voucher.address')} *</FormLabel>
                          <FormControl>
                            <Input placeholder={t('voucher.address')} {...field} />
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
                            <FormLabel>{t('voucher.postalCode')} *</FormLabel>
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
                            <FormLabel>{t('voucher.city')} *</FormLabel>
                            <FormControl>
                              <Input placeholder={t('voucher.city')} {...field} />
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
                          <FormLabel>{t('voucher.yourEmail')} *</FormLabel>
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
                        {t('voucher.recipientTitle')}
                      </h2>
                    </div>

                    <FormField
                      control={form.control}
                      name="recipientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('voucher.recipientEmail')} *</FormLabel>
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
                          <FormLabel>{t('voucher.message')} *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t('voucher.messagePlaceholder')}
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
                        {t('voucher.valueTitle')}
                      </h2>
                    </div>
                    
                    {/* Info text about voucher */}
                    <div className="bg-lavita-mint-light/30 rounded-lg p-3 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">{t('voucher.voucherIncludes')}</p>
                      <p>{t('voucher.priceInfo')}</p>
                    </div>

                    <FormField
                      control={form.control}
                      name="nights"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('voucher.selectNights')} *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('voucher.selectNights')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {nightOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.nights} {getNightsLabel(option.nights)} – {option.price} €
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
                        <p className="text-sm text-muted-foreground mb-1">{t('voucher.totalValue')}</p>
                        <p className="text-3xl font-bold text-primary">{selectedOption.price} €</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          ({selectedOption.nights} × {PRICE_PER_NIGHT} € {t('voucher.perNight')})
                        </p>
                      </motion.div>
                    )}
                    
                    {/* Preview Button */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        window.open('/voucher-preview', '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {t('voucher.previewButton')}
                    </Button>
                  </div>

                  {/* Payment Info - with uploaded images */}
                  <div className="bg-muted/50 rounded-xl p-4 space-y-4">
                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <img 
                        src={securePayment} 
                        alt="Secure Payment" 
                        className="h-12 md:h-16 object-contain"
                      />
                      <img 
                        src={trustedSeller} 
                        alt="Trusted Seller" 
                        className="h-12 md:h-16 object-contain"
                      />
                    </div>
                    
                    {/* Card Logos */}
                    <div className="flex items-center justify-center gap-3">
                      <img 
                        src={visaLogo} 
                        alt="Visa" 
                        className="h-8 md:h-10 object-contain"
                      />
                      <img 
                        src={mastercardLogo} 
                        alt="Mastercard" 
                        className="h-8 md:h-10 object-contain"
                      />
                      <img 
                        src={maestroLogo} 
                        alt="Maestro" 
                        className="h-8 md:h-10 object-contain"
                      />
                    </div>
                    
                    <p className="text-sm text-muted-foreground text-center">
                      {t('voucher.securePayment')}. {t('voucher.supportedCards')}.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-14 text-base md:text-lg font-semibold bg-primary hover:bg-primary/90"
                    disabled={isProcessing || !selectedNights}
                  >
                    {isProcessing ? (
                      t('voucher.processing')
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <CreditCard className="w-5 h-5" />
                        {t('voucher.payButton')}
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

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gift, ArrowLeft, CheckCircle, Mail } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const GiftVoucherSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavita-cream to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-3xl shadow-lavita-card p-8 md:p-12 max-w-lg text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-lavita-mint-light rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-primary" />
        </motion.div>
        
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">
          Hvala za nakup! 🎉
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Vaše plačilo je bilo uspešno obdelano. Darilni bon je bil poslan prejemniku na e-naslov.
        </p>

        <div className="bg-lavita-mint-light/50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">E-pošta poslana</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Prejemnik bo kmalu prejel e-pošto z darilnim bonom v PDF obliki.
            Kopijo bona smo poslali tudi na vaš e-naslov.
          </p>
        </div>

        <div className="bg-muted/50 rounded-xl p-4 mb-8">
          <p className="text-sm text-muted-foreground">
            <strong>Veljavnost bona:</strong> 1 leto od datuma nakupa
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Za rezervacijo termina naj prejemnik kontaktira:<br />
            <a href="mailto:lavitarelax@gmail.com" className="text-primary hover:underline">
              lavitarelax@gmail.com
            </a>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/gift-voucher">
            <Button variant="outline" className="w-full sm:w-auto">
              <Gift className="w-4 h-4 mr-2" />
              Kupi še en bon
            </Button>
          </Link>
          <Link to="/">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Nazaj na domačo stran
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default GiftVoucherSuccess;

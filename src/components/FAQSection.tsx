import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Kaj je vključeno v ceno nočitve?",
    answer: "V ceno nočitve sta vključeni 2 kopalni karti za termalni kompleks Terme 3000, uporaba 3 koles, popolnoma opremljena kuhinja, LED ambientna osvetlitev, HI-FI sistem, vrhunska DORMEO ležišča ter dostop do obeh teras. WiFi je na voljo brezplačno.",
  },
  {
    question: "Koliko oseb lahko prenočuje v La Vita Hiški?",
    answer: "Hiška je zasnovana za udobno nastanitev do 6 oseb. Idealna je za družine z otroki, pare ali manjše skupine prijateljev, ki iščejo sproščen oddih v naravi.",
  },
  {
    question: "Kakšne so možnosti parkiranja?",
    answer: "Brezplačno parkirišče je na voljo neposredno ob hiški. Za vsako rezervacijo je zagotovljeno parkirno mesto.",
  },
  {
    question: "Ali je dovoljeno prinesti hišne ljubljenčke?",
    answer: "Žal hišnih ljubljenčkov ne sprejemamo, saj želimo ohraniti čistočo in udobje za vse goste.",
  },
  {
    question: "Kakšni so pogoji za rezervacijo in odpoved?",
    answer: "Ob rezervaciji je potrebna kapara v višini 30% skupne cene. Brezplačna odpoved je možna do 7 dni pred prihodom. V primeru kasnejše odpovedi kapara ni povračljiva.",
  },
  {
    question: "Kdaj je možen prihod in odhod?",
    answer: "Prihod je možen od 15:00 naprej, odhod pa do 10:00. Po dogovoru je možna tudi prilagoditev urnika.",
  },
  {
    question: "Kako daleč so Terme 3000?",
    answer: "La Vita Hiška se nahaja neposredno v Kampu Terme 3000, kar pomeni, da ste le nekaj korakov stran od vseh termalnih doživetij in zabave.",
  },
  {
    question: "Ali je kuhinja polno opremljena?",
    answer: "Da! Kuhinja vsebuje hladilnik, štedilnik, mikrovalovno pečico, toaster, kuhalnik za vodo, kavni aparat ter vso potrebno posodo in pribor za pripravo obrokov.",
  },
];

export const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="faq" className="py-20 bg-lavita-cream">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block text-primary font-medium text-sm tracking-wide uppercase mb-4">
            ❓ Pogosta vprašanja
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Imate Vprašanja?
          </h2>
          <p className="text-muted-foreground text-lg">
            Tukaj najdete odgovore na najpogostejša vprašanja naših gostov
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border/50 rounded-xl px-6 shadow-lavita hover:shadow-lavita-card transition-shadow"
              >
                <AccordionTrigger className="text-left font-display text-lg font-semibold hover:text-primary transition-colors py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-body leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

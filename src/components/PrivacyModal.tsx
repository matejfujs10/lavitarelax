import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";

interface PrivacyModalProps {
  trigger: React.ReactNode;
}

const privacyContent = {
  sl: {
    title: "Pravilnik o zasebnosti",
    validFrom: "Veljavno od: 29. 01. 2026",
    intro: "Ta pravilnik o zasebnosti je pripravljen v skladu z Uredbo (EU) 2016/679 Evropskega parlamenta in Sveta z dne 27. aprila 2016 (Splošna uredba o varstvu podatkov – GDPR) ter veljavno nacionalno zakonodajo.",
    sections: [
      {
        title: "1. Upravljavec osebnih podatkov",
        content: "Upravljavec osebnih podatkov v smislu člena 4(7) GDPR je:",
        details: {
          name: "Hiška La Vita",
          website: "Spletna stran: www.lavitarelax.lovable.app",
          email: "E-pošta: lavitarelax@gmail.com"
        }
      },
      {
        title: "2. Vrste osebnih podatkov, ki se obdelujejo",
        content: "Upravljavec lahko obdeluje naslednje osebne podatke:",
        subsections: [
          {
            title: "2.1 Podatki, ki jih posameznik posreduje prostovoljno",
            items: [
              "ime in priimek",
              "e-poštni naslov",
              "telefonska številka",
              "naslov prebivališča ali naslov za izstavitev računa",
              "podatki, povezani z rezervacijo in plačilom"
            ]
          },
          {
            title: "2.2 Podatki, zbrani samodejno ob uporabi spletne strani",
            items: [
              "IP naslov",
              "vrsta in različica brskalnika",
              "vrsta naprave in operacijski sistem",
              "datum in čas dostopa",
              "obiskane podstrani in trajanje obiska"
            ]
          }
        ]
      },
      {
        title: "3. Nameni obdelave osebnih podatkov",
        content: "Osebni podatki se obdelujejo za naslednje namene:",
        items: [
          "izvajanje pogodbenega razmerja (obdelava in upravljanje rezervacij)",
          "komunikacija s posameznikom v zvezi s povpraševanji in rezervacijami",
          "izpolnjevanje zakonskih obveznosti upravljavca",
          "pošiljanje obvestil in promocijskih vsebin, kadar je bila podana izrecna privolitev",
          "zagotavljanje varnosti, tehnične stabilnosti in izboljševanje delovanja spletne strani"
        ]
      },
      {
        title: "4. Pravne podlage za obdelavo",
        content: "Upravljavec obdeluje osebne podatke na naslednjih pravnih podlagah v skladu s členom 6 GDPR:",
        items: [
          "izvajanje pogodbe ali izvajanje ukrepov na zahtevo posameznika pred sklenitvijo pogodbe",
          "izpolnjevanje zakonskih obveznosti upravljavca",
          "privolitev posameznika (npr. za prejemanje e-novic)",
          "zakoniti interesi upravljavca (npr. zagotavljanje varnosti spletne strani in izboljševanje uporabniške izkušnje)"
        ]
      },
      {
        title: "5. Obdobje hrambe osebnih podatkov",
        content: "Osebni podatki se hranijo le toliko časa, kolikor je potrebno za izpolnitev namena, za katerega so bili zbrani, oziroma v skladu z veljavnimi zakonskimi roki:",
        items: [
          "podatki, povezani z rezervacijami in računovodstvom: skladno z davčno in računovodsko zakonodajo",
          "podatki, obdelovani na podlagi privolitve: do preklica privolitve",
          "tehnični in analitični podatki: v anonimizirani ali agregirani obliki"
        ],
        note: "Po poteku obdobja hrambe se podatki izbrišejo ali trajno anonimizirajo."
      },
      {
        title: "6. Posredovanje osebnih podatkov tretjim osebam",
        content: "Upravljavec osebnih podatkov ne posreduje tretjim osebam, razen kadar je to nujno potrebno za izvedbo storitve ali kadar to zahteva zakon.",
        content2: "V posameznih primerih so osebni podatki lahko posredovani:",
        items: [
          "ponudnikom plačilnih storitev",
          "pristojnim državnim organom na podlagi zakonske obveznosti"
        ],
        note: "Vsi obdelovalci osebnih podatkov delujejo na podlagi pogodbe o obdelavi osebnih podatkov v skladu s členom 28 GDPR."
      }
    ],
    footer: {
      name: "Hiška La Vita",
      address: "Camp Terme 3000, 9226 Moravske Toplice",
      email: "E-pošta: lavitarelax@gmail.com"
    }
  },
  en: {
    title: "Privacy Policy",
    validFrom: "Valid from: January 29, 2026",
    intro: "This privacy policy has been prepared in accordance with Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 (General Data Protection Regulation – GDPR) and applicable national legislation.",
    sections: [
      {
        title: "1. Data Controller",
        content: "The data controller within the meaning of Article 4(7) GDPR is:",
        details: {
          name: "La Vita House",
          website: "Website: www.lavitarelax.lovable.app",
          email: "Email: lavitarelax@gmail.com"
        }
      },
      {
        title: "2. Types of Personal Data Processed",
        content: "The controller may process the following personal data:",
        subsections: [
          {
            title: "2.1 Data voluntarily provided by the individual",
            items: [
              "first and last name",
              "email address",
              "phone number",
              "residential address or billing address",
              "data related to reservation and payment"
            ]
          },
          {
            title: "2.2 Data collected automatically when using the website",
            items: [
              "IP address",
              "browser type and version",
              "device type and operating system",
              "date and time of access",
              "visited pages and duration of visit"
            ]
          }
        ]
      },
      {
        title: "3. Purposes of Personal Data Processing",
        content: "Personal data is processed for the following purposes:",
        items: [
          "execution of contractual relationship (processing and managing reservations)",
          "communication with the individual regarding inquiries and reservations",
          "fulfillment of legal obligations of the controller",
          "sending notifications and promotional content when explicit consent has been given",
          "ensuring security, technical stability and improving website performance"
        ]
      },
      {
        title: "4. Legal Bases for Processing",
        content: "The controller processes personal data on the following legal bases in accordance with Article 6 GDPR:",
        items: [
          "execution of a contract or implementation of measures at the request of the individual prior to concluding a contract",
          "fulfillment of legal obligations of the controller",
          "consent of the individual (e.g., for receiving newsletters)",
          "legitimate interests of the controller (e.g., ensuring website security and improving user experience)"
        ]
      },
      {
        title: "5. Personal Data Retention Period",
        content: "Personal data is retained only for as long as necessary to fulfill the purpose for which it was collected, or in accordance with applicable legal deadlines:",
        items: [
          "data related to reservations and accounting: in accordance with tax and accounting legislation",
          "data processed based on consent: until consent is withdrawn",
          "technical and analytical data: in anonymized or aggregated form"
        ],
        note: "After the retention period expires, data is deleted or permanently anonymized."
      },
      {
        title: "6. Disclosure of Personal Data to Third Parties",
        content: "The controller does not disclose personal data to third parties, except when strictly necessary to perform the service or when required by law.",
        content2: "In individual cases, personal data may be disclosed to:",
        items: [
          "payment service providers",
          "competent state authorities on the basis of legal obligation"
        ],
        note: "All data processors operate on the basis of a data processing agreement in accordance with Article 28 GDPR."
      }
    ],
    footer: {
      name: "La Vita House",
      address: "Camp Terme 3000, 9226 Moravske Toplice",
      email: "Email: lavitarelax@gmail.com"
    }
  },
  de: {
    title: "Datenschutzrichtlinie",
    validFrom: "Gültig ab: 29. Januar 2026",
    intro: "Diese Datenschutzrichtlinie wurde in Übereinstimmung mit der Verordnung (EU) 2016/679 des Europäischen Parlaments und des Rates vom 27. April 2016 (Datenschutz-Grundverordnung – DSGVO) und den geltenden nationalen Rechtsvorschriften erstellt.",
    sections: [
      {
        title: "1. Verantwortlicher für die Datenverarbeitung",
        content: "Verantwortlicher für die Datenverarbeitung im Sinne von Artikel 4(7) DSGVO ist:",
        details: {
          name: "Ferienhaus La Vita",
          website: "Website: www.lavitarelax.lovable.app",
          email: "E-Mail: lavitarelax@gmail.com"
        }
      },
      {
        title: "2. Arten der verarbeiteten personenbezogenen Daten",
        content: "Der Verantwortliche kann folgende personenbezogene Daten verarbeiten:",
        subsections: [
          {
            title: "2.1 Freiwillig vom Benutzer bereitgestellte Daten",
            items: [
              "Vor- und Nachname",
              "E-Mail-Adresse",
              "Telefonnummer",
              "Wohnadresse oder Rechnungsadresse",
              "Daten im Zusammenhang mit Reservierung und Zahlung"
            ]
          },
          {
            title: "2.2 Automatisch bei Nutzung der Website erfasste Daten",
            items: [
              "IP-Adresse",
              "Browsertyp und -version",
              "Gerätetyp und Betriebssystem",
              "Datum und Uhrzeit des Zugriffs",
              "besuchte Seiten und Besuchsdauer"
            ]
          }
        ]
      },
      {
        title: "3. Zwecke der Verarbeitung personenbezogener Daten",
        content: "Personenbezogene Daten werden für folgende Zwecke verarbeitet:",
        items: [
          "Durchführung des Vertragsverhältnisses (Bearbeitung und Verwaltung von Reservierungen)",
          "Kommunikation mit der Person bezüglich Anfragen und Reservierungen",
          "Erfüllung gesetzlicher Verpflichtungen des Verantwortlichen",
          "Versand von Benachrichtigungen und Werbeinhalten bei ausdrücklicher Einwilligung",
          "Gewährleistung der Sicherheit, technischen Stabilität und Verbesserung der Website-Leistung"
        ]
      },
      {
        title: "4. Rechtsgrundlagen für die Verarbeitung",
        content: "Der Verantwortliche verarbeitet personenbezogene Daten auf folgenden Rechtsgrundlagen gemäß Artikel 6 DSGVO:",
        items: [
          "Durchführung eines Vertrags oder Durchführung vorvertraglicher Maßnahmen auf Anfrage der Person",
          "Erfüllung gesetzlicher Verpflichtungen des Verantwortlichen",
          "Einwilligung der Person (z.B. für den Erhalt von Newslettern)",
          "berechtigte Interessen des Verantwortlichen (z.B. Gewährleistung der Website-Sicherheit und Verbesserung der Benutzererfahrung)"
        ]
      },
      {
        title: "5. Aufbewahrungsdauer personenbezogener Daten",
        content: "Personenbezogene Daten werden nur so lange aufbewahrt, wie es für die Erfüllung des Zwecks erforderlich ist, für den sie erhoben wurden, oder gemäß den geltenden gesetzlichen Fristen:",
        items: [
          "Daten im Zusammenhang mit Reservierungen und Buchhaltung: gemäß Steuer- und Buchhaltungsgesetzgebung",
          "auf Grundlage der Einwilligung verarbeitete Daten: bis zum Widerruf der Einwilligung",
          "technische und analytische Daten: in anonymisierter oder aggregierter Form"
        ],
        note: "Nach Ablauf der Aufbewahrungsfrist werden die Daten gelöscht oder dauerhaft anonymisiert."
      },
      {
        title: "6. Weitergabe personenbezogener Daten an Dritte",
        content: "Der Verantwortliche gibt personenbezogene Daten nicht an Dritte weiter, es sei denn, dies ist für die Erbringung der Dienstleistung unbedingt erforderlich oder gesetzlich vorgeschrieben.",
        content2: "In Einzelfällen können personenbezogene Daten weitergegeben werden an:",
        items: [
          "Zahlungsdienstleister",
          "zuständige staatliche Behörden auf der Grundlage gesetzlicher Verpflichtungen"
        ],
        note: "Alle Auftragsverarbeiter handeln auf der Grundlage einer Datenverarbeitungsvereinbarung gemäß Artikel 28 DSGVO."
      }
    ],
    footer: {
      name: "Ferienhaus La Vita",
      address: "Camp Terme 3000, 9226 Moravske Toplice",
      email: "E-Mail: lavitarelax@gmail.com"
    }
  }
};

export const PrivacyModal = ({ trigger }: PrivacyModalProps) => {
  const { language } = useLanguage();
  const content = privacyContent[language];

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-foreground">
            {content.title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p className="text-sm mb-4">
              <strong>Hiška La Vita</strong><br />
              {content.validFrom}
            </p>
            <p className="mb-6">{content.intro}</p>

            {content.sections.map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  {section.title}
                </h3>
                {section.content && <p className="mb-4">{section.content}</p>}
                {section.details && (
                  <p className="mb-4">
                    <strong>{section.details.name}</strong><br />
                    {section.details.website}<br />
                    {section.details.email}
                  </p>
                )}
                {section.subsections && section.subsections.map((sub, i) => (
                  <div key={i}>
                    <h4 className="font-medium text-foreground mt-4 mb-2">{sub.title}</h4>
                    <ul className="list-disc pl-6 mb-4 space-y-1">
                      {sub.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                {section.content2 && <p className="mb-3">{section.content2}</p>}
                {section.items && (
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    {section.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.note && <p className="mb-4">{section.note}</p>}
              </div>
            ))}

            <div className="mt-6 pt-4 border-t border-border">
              <p className="font-medium text-foreground">{content.footer.name}</p>
              <p>{content.footer.address}</p>
              <p>{content.footer.email}</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

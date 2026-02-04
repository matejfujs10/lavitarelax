import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";

interface TermsModalProps {
  trigger: React.ReactNode;
}

const termsContent = {
  sl: {
    title: "Splošni pogoji poslovanja",
    subtitle: "Oddaja počitniške hiške La Vita",
    intro: "Dobrodošli v počitniški hiški La Vita, skrbno urejeni nastanitvi v Kampu Terme 3000. Za zagotovitev prijetnega, varnega in brezskrbnega bivanja vas vljudno prosimo, da se pred prihodom seznanite s spodaj navedenimi splošnimi pogoji poslovanja.",
    sections: [
      {
        title: "1. Namestitev in kapacitete",
        content: "Počitniška hiška La Vita je sodobno in funkcionalno opremljena ter primerna za bivanje do 6 oseb.",
        subtitle: "Hiška obsega:",
        items: [
          "dve spalnici",
          "ena spalnica z udobno zakonsko posteljo",
          "ena spalnica z dvema velikima enojnima posteljama",
          "veliko jedilnico, primerno za skupne obroke in druženje",
          "polno opremljeno kuhinjo (velik hladilnik z zamrzovalnikom, mikrovalovna pečica, toaster, osnovna kuhinjska oprema)",
          "kopalnico v hiški",
          "skupne WC-je in tuše v kampu, kar omogoča pristno kamp doživetje",
          "klimatsko napravo",
          "ogrevanje z radiatorji v zimskem času",
          "TV z videorekorderjem ter izborom filmov in risank",
          "brezžični internet (Wi-Fi)",
          "otroške igrače",
          "športne rekvizite"
        ],
        subtitle2: "Zunanji prostor:",
        items2: [
          "dve terasi (ena pred hiško in ena večja, zasebna terasa za hiško)",
          "urejena in mirna okolica hiške, primerna za sprostitev, druženje in bivanje v naravi",
          "tri brezplačna kolesa za uporabo gostov"
        ]
      },
      {
        title: "2. Cena in kopalne karte",
        content: "Cena velja na noč za celotno hiško in ne glede na število oseb (do največ 6 oseb).",
        content2: "V ceno sta vključeni dve kopalni karti za Terme 3000.",
        subtitle: "Dodatne kopalne karte:",
        items: [
          "odrasli: 21,90 EUR na osebo na noč",
          "otroci od 6 do 14,99 let: 17,90 EUR na osebo na noč",
          "otroci do 5,99 let: brezplačno"
        ],
        content3: "Dodatne kopalne karte se kupijo na recepciji kampa po znižani ceni."
      },
      {
        title: "3. Rezervacija in plačilo",
        content: "Rezervacija je potrjena ob plačilu avansa v višini 50 % skupne vrednosti rezervacije. Preostali znesek se poravna ob prihodu."
      },
      {
        title: "4. Politika odpovedi rezervacije",
        content: "V primeru odpovedi ali spremembe rezervacije veljajo naslednji pogoji:",
        items: [
          "odpoved do 14 dni pred prihodom: brezplačna odpoved, vplačan avans se vrne ali prenese na drug termin, zmanjšan za administrativne stroške v višini 25 EUR; po dogovoru je možna izdaja darilnega bona",
          "odpoved 14 do 7 dni pred prihodom: zaračunamo 30 % vrednosti rezervacije",
          "odpoved 6 do 4 dni pred prihodom: zaračunamo 40 % vrednosti rezervacije",
          "odpoved 3 do 1 dan pred prihodom: zaračunamo 60 % vrednosti rezervacije",
          "odpoved na dan prihoda ali neprihod (no-show): zaračunamo 80 % vrednosti rezervacije"
        ]
      },
      {
        title: "5. Prijava in odjava (Check-in / Check-out)",
        content: "Prihod je možen že ob 9. uri, ko lahko že koristite kopanje v termalnem kompleksu. Namestitev v hiški je možna od 13:30 naprej, odhod pa do 11:00. V primeru, da je hiška naslednji dan prosta, je možno podaljšanje bivanja.",
        items: [
          "prijava (check-in): od 13:30 dalje",
          "odjava (check-out): do 11:00 ali po dogovoru"
        ],
        content2: "Ob prihodu na recepciji Kampa Terme 3000 ob predložitvi izpolnjene napotnice prejmete ključe hiške in zapestnice. V hiški so gostom na voljo posteljnina in kuhinjske krpe."
      },
      {
        title: "6. Dodatni stroški in pravila",
        items: [
          "turistična taksa in prijavnina se obračunata ob prihodu po veljavnem ceniku",
          "hišni ljubljenčki so dovoljeni ob doplačilu 5 EUR na noč",
          "kajenje v notranjih prostorih hiške ni dovoljeno"
        ]
      },
      {
        title: "7. Hišni red",
        content: "Gostje so dolžni spoštovati hišni red, ki je na voljo v hiški. Prosimo za skrbno ravnanje z opremo ter ohranjanje reda in čistoče. V primeru hujših kršitev si pridržujemo pravico do prekinitve bivanja brez vračila plačila."
      },
      {
        title: "8. Pomoč in reklamacije",
        content: "Za morebitna vprašanja, težave ali pomoč med bivanjem se lahko obrnete na recepcijo Kampa Terme 3000, kjer vam bodo nudili ustrezno pomoč."
      }
    ],
    thankYou: "Zahvaljujemo se vam za zaupanje in se veselimo vašega obiska v počitniški hiški La Vita.",
    comfort: "Vaše udobje in prijetno bivanje sta za nas na prvem mestu.",
    footer: {
      name: "Camp Terme 3000",
      address: "9226 Moravske Toplice",
      phone: "Telefon: +386 (0) 68 169 430",
      email: "E-pošta: rent@lavitaterme3000.com"
    }
  },
  en: {
    title: "Terms and Conditions",
    subtitle: "Holiday House La Vita Rental",
    intro: "Welcome to La Vita Holiday House, a carefully maintained accommodation at Camp Terme 3000. To ensure a pleasant, safe and carefree stay, we kindly ask you to familiarize yourself with the following terms and conditions before arrival.",
    sections: [
      {
        title: "1. Accommodation and Capacity",
        content: "La Vita Holiday House is modernly and functionally equipped, suitable for up to 6 guests.",
        subtitle: "The house includes:",
        items: [
          "two bedrooms",
          "one bedroom with a comfortable double bed",
          "one bedroom with two large single beds",
          "a large dining room, suitable for shared meals and socializing",
          "a fully equipped kitchen (large fridge with freezer, microwave, toaster, basic kitchen equipment)",
          "bathroom in the house",
          "shared toilets and showers at the camp, providing an authentic camping experience",
          "air conditioning",
          "heating with radiators in winter",
          "TV with video recorder and selection of movies and cartoons",
          "wireless internet (Wi-Fi)",
          "children's toys",
          "sports equipment"
        ],
        subtitle2: "Outdoor space:",
        items2: [
          "two terraces (one in front of the house and one larger, private terrace behind)",
          "well-maintained and peaceful surroundings, suitable for relaxation, socializing and living in nature",
          "three free bicycles for guest use"
        ]
      },
      {
        title: "2. Price and Spa Tickets",
        content: "The price applies per night for the entire house, regardless of the number of guests (up to 6 people).",
        content2: "Two spa tickets for Terme 3000 are included in the price.",
        subtitle: "Additional spa tickets:",
        items: [
          "adults: €21.90 per person per night",
          "children 6 to 14.99 years: €17.90 per person per night",
          "children up to 5.99 years: free"
        ],
        content3: "Additional spa tickets can be purchased at the camp reception at a reduced price."
      },
      {
        title: "3. Reservation and Payment",
        content: "The reservation is confirmed upon payment of a deposit of 50% of the total reservation value. The remaining amount is paid upon arrival."
      },
      {
        title: "4. Cancellation Policy",
        content: "In case of cancellation or change of reservation, the following conditions apply:",
        items: [
          "cancellation up to 14 days before arrival: free cancellation, deposit is refunded or transferred to another date, reduced by administrative costs of €25; a gift voucher can be issued by agreement",
          "cancellation 14 to 7 days before arrival: 30% of reservation value charged",
          "cancellation 6 to 4 days before arrival: 40% of reservation value charged",
          "cancellation 3 to 1 day before arrival: 60% of reservation value charged",
          "cancellation on arrival day or no-show: 80% of reservation value charged"
        ]
      },
      {
        title: "5. Check-in / Check-out",
        content: "Arrival is possible from 9:00 AM, when you can already use the thermal complex. Accommodation in the house is available from 1:30 PM, and departure by 11:00 AM. If the house is available the next day, extended stay is possible.",
        items: [
          "check-in: from 1:30 PM onwards",
          "check-out: by 11:00 AM or by agreement"
        ],
        content2: "Upon arrival at the Camp Terme 3000 reception, upon presenting the completed referral, you will receive house keys and wristbands. Bed linen and kitchen towels are available for guests in the house."
      },
      {
        title: "6. Additional Costs and Rules",
        items: [
          "tourist tax and registration fee are charged upon arrival according to valid price list",
          "pets are allowed with an additional charge of €5 per night",
          "smoking is not allowed inside the house"
        ]
      },
      {
        title: "7. House Rules",
        content: "Guests are obliged to respect the house rules available in the house. Please handle equipment carefully and maintain order and cleanliness. In case of serious violations, we reserve the right to terminate the stay without refund."
      },
      {
        title: "8. Assistance and Complaints",
        content: "For any questions, problems or assistance during your stay, you can contact the Camp Terme 3000 reception, where they will provide appropriate help."
      }
    ],
    thankYou: "We thank you for your trust and look forward to your visit at La Vita Holiday House.",
    comfort: "Your comfort and pleasant stay are our top priority.",
    footer: {
      name: "Camp Terme 3000",
      address: "9226 Moravske Toplice",
      phone: "Phone: +386 (0) 68 169 430",
      email: "Email: rent@lavitaterme3000.com"
    }
  },
  de: {
    title: "Allgemeine Geschäftsbedingungen",
    subtitle: "Vermietung des Ferienhauses La Vita",
    intro: "Willkommen im Ferienhaus La Vita, einer sorgfältig gepflegten Unterkunft im Camp Terme 3000. Um einen angenehmen, sicheren und sorgenfreien Aufenthalt zu gewährleisten, bitten wir Sie, sich vor Ihrer Ankunft mit den folgenden Allgemeinen Geschäftsbedingungen vertraut zu machen.",
    sections: [
      {
        title: "1. Unterkunft und Kapazität",
        content: "Das Ferienhaus La Vita ist modern und funktional ausgestattet und bietet Platz für bis zu 6 Gäste.",
        subtitle: "Das Haus umfasst:",
        items: [
          "zwei Schlafzimmer",
          "ein Schlafzimmer mit bequemem Doppelbett",
          "ein Schlafzimmer mit zwei großen Einzelbetten",
          "einen großen Essbereich, geeignet für gemeinsame Mahlzeiten und Geselligkeit",
          "eine voll ausgestattete Küche (großer Kühlschrank mit Gefrierfach, Mikrowelle, Toaster, Grundausstattung)",
          "Badezimmer im Haus",
          "gemeinsame Toiletten und Duschen im Camp für authentisches Camping-Erlebnis",
          "Klimaanlage",
          "Heizung mit Radiatoren im Winter",
          "TV mit Videorekorder und Auswahl an Filmen und Zeichentrickfilmen",
          "WLAN",
          "Kinderspielzeug",
          "Sportausrüstung"
        ],
        subtitle2: "Außenbereich:",
        items2: [
          "zwei Terrassen (eine vor dem Haus und eine größere, private Terrasse dahinter)",
          "gepflegte und ruhige Umgebung, ideal für Entspannung, Geselligkeit und Leben in der Natur",
          "drei kostenlose Fahrräder für Gäste"
        ]
      },
      {
        title: "2. Preis und Spa-Tickets",
        content: "Der Preis gilt pro Nacht für das gesamte Haus, unabhängig von der Anzahl der Gäste (bis zu 6 Personen).",
        content2: "Zwei Spa-Tickets für Terme 3000 sind im Preis inbegriffen.",
        subtitle: "Zusätzliche Spa-Tickets:",
        items: [
          "Erwachsene: 21,90 € pro Person/Nacht",
          "Kinder 6 bis 14,99 Jahre: 17,90 € pro Person/Nacht",
          "Kinder bis 5,99 Jahre: kostenlos"
        ],
        content3: "Zusätzliche Spa-Tickets können an der Camp-Rezeption zu ermäßigten Preisen erworben werden."
      },
      {
        title: "3. Reservierung und Zahlung",
        content: "Die Reservierung wird bei Zahlung einer Anzahlung von 50% des Gesamtbetrags bestätigt. Der Restbetrag wird bei Ankunft beglichen."
      },
      {
        title: "4. Stornierungsbedingungen",
        content: "Bei Stornierung oder Änderung der Reservierung gelten folgende Bedingungen:",
        items: [
          "Stornierung bis 14 Tage vor Ankunft: kostenlose Stornierung, Anzahlung wird erstattet oder auf einen anderen Termin übertragen, abzüglich Verwaltungskosten von 25 €; auf Wunsch kann ein Geschenkgutschein ausgestellt werden",
          "Stornierung 14 bis 7 Tage vor Ankunft: 30% des Reservierungswertes werden berechnet",
          "Stornierung 6 bis 4 Tage vor Ankunft: 40% des Reservierungswertes werden berechnet",
          "Stornierung 3 bis 1 Tag vor Ankunft: 60% des Reservierungswertes werden berechnet",
          "Stornierung am Anreisetag oder Nichterscheinen: 80% des Reservierungswertes werden berechnet"
        ]
      },
      {
        title: "5. Check-in / Check-out",
        content: "Die Anreise ist ab 9:00 Uhr möglich, wenn Sie bereits den Thermalkomplex nutzen können. Die Unterkunft im Haus ist ab 13:30 Uhr verfügbar, die Abreise bis 11:00 Uhr. Wenn das Haus am nächsten Tag frei ist, ist eine Verlängerung möglich.",
        items: [
          "Check-in: ab 13:30 Uhr",
          "Check-out: bis 11:00 Uhr oder nach Vereinbarung"
        ],
        content2: "Bei Ankunft an der Rezeption des Camp Terme 3000 erhalten Sie bei Vorlage der ausgefüllten Überweisung die Hausschlüssel und Armbänder. Bettwäsche und Küchentücher stehen den Gästen im Haus zur Verfügung."
      },
      {
        title: "6. Zusätzliche Kosten und Regeln",
        items: [
          "Kurtaxe und Anmeldegebühr werden bei Ankunft nach gültiger Preisliste berechnet",
          "Haustiere sind gegen einen Aufpreis von 5 € pro Nacht erlaubt",
          "Rauchen ist im Haus nicht gestattet"
        ]
      },
      {
        title: "7. Hausordnung",
        content: "Die Gäste sind verpflichtet, die im Haus verfügbare Hausordnung zu beachten. Bitte gehen Sie sorgfältig mit der Ausstattung um und halten Sie Ordnung und Sauberkeit. Bei schwerwiegenden Verstößen behalten wir uns das Recht vor, den Aufenthalt ohne Rückerstattung zu beenden."
      },
      {
        title: "8. Hilfe und Beschwerden",
        content: "Bei Fragen, Problemen oder Hilfebedarf während Ihres Aufenthalts können Sie sich an die Rezeption des Camp Terme 3000 wenden, wo Ihnen entsprechende Hilfe geleistet wird."
      }
    ],
    thankYou: "Wir danken Ihnen für Ihr Vertrauen und freuen uns auf Ihren Besuch im Ferienhaus La Vita.",
    comfort: "Ihr Komfort und ein angenehmer Aufenthalt haben für uns höchste Priorität.",
    footer: {
      name: "Camp Terme 3000",
      address: "9226 Moravske Toplice",
      phone: "Telefon: +386 (0) 68 169 430",
      email: "E-Mail: rent@lavitaterme3000.com"
    }
  }
};

export const TermsModal = ({ trigger }: TermsModalProps) => {
  const { language } = useLanguage();
  const content = termsContent[language];

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
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">
              {content.subtitle}
            </h2>
            <p className="mb-4">{content.intro}</p>

            {content.sections.map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
                  {section.title}
                </h3>
                {section.content && <p className="mb-3">{section.content}</p>}
                {section.content2 && <p className="mb-3">{section.content2}</p>}
                {section.subtitle && (
                  <p className="font-medium text-foreground mb-2">{section.subtitle}</p>
                )}
                {section.items && (
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    {section.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.subtitle2 && (
                  <p className="font-medium text-foreground mb-2">{section.subtitle2}</p>
                )}
                {section.items2 && (
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    {section.items2.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.content3 && <p className="mb-4">{section.content3}</p>}
              </div>
            ))}

            <div className="bg-lavita-mint-light p-4 rounded-xl mt-6">
              <p className="text-foreground font-medium mb-2">{content.thankYou}</p>
              <p className="text-foreground">{content.comfort}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="font-medium text-foreground">{content.footer.name}</p>
              <p>{content.footer.address}</p>
              <p>{content.footer.phone}</p>
              <p>{content.footer.email}</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";

interface CookiesModalProps {
  trigger: React.ReactNode;
}

const cookiesContent = {
  sl: {
    title: "Politika piškotkov",
    validFrom: "Veljavno od: 29. 01. 2026",
    whatAreCookies: {
      title: "Kaj so piškotki?",
      content: "Piškotki so majhne besedilne datoteke, ki se shranijo na vašo napravo ob obisku spletne strani. Omogočajo delovanje spletne strani in izboljšujejo uporabniško izkušnjo."
    },
    types: {
      title: "Vrste piškotkov",
      essential: {
        title: "Nujni piškotki",
        content: "Omogočajo osnovno delovanje spletne strani in varno uporabo storitev. Ti piškotki so vedno aktivni in so nujni za pravilno delovanje spletne strani. Ne zbirajo osebnih podatkov za trženjske namene."
      },
      analytics: {
        title: "Analitični piškotki",
        content: "Omogočajo zbiranje anonimnih statističnih podatkov o uporabi spletne strani z namenom izboljšanja njene vsebine in delovanja. Pomagajo nam razumeti, kako obiskovalci uporabljajo spletno stran."
      },
      advertising: {
        title: "Oglaševalski piškotki",
        content: "Omogočajo prikaz prilagojenih vsebin in oglasov glede na interese uporabnika. Lahko jih nastavijo naši oglaševalski partnerji."
      }
    },
    list: {
      title: "Seznam piškotkov",
      headers: ["Ime", "Vrsta", "Namen", "Trajanje"],
      rows: [
        ["cookie_consent", "Nujni", "Shranjuje vaše nastavitve piškotkov", "1 leto"],
        ["_ga", "Analitični", "Google Analytics - razlikuje uporabnike", "2 leti"],
        ["_gid", "Analitični", "Google Analytics - razlikuje uporabnike", "24 ur"]
      ]
    },
    management: {
      title: "Upravljanje piškotkov",
      content1: "Svoje nastavitve piškotkov lahko kadarkoli spremenite s klikom na povezavo \"Nastavitve piškotkov\" v nogi spletne strani.",
      content2: "Piškotke lahko tudi onemogočite ali izbrišete v nastavitvah svojega brskalnika. Upoštevajte, da lahko onemogočanje nekaterih piškotkov vpliva na delovanje spletne strani."
    },
    rights: {
      title: "Vaše pravice",
      content: "V skladu z GDPR imate pravico do:",
      items: [
        "dostopa do vaših osebnih podatkov",
        "popravka netočnih podatkov",
        "izbrisa vaših podatkov",
        "omejitve obdelave",
        "prenosljivosti podatkov",
        "ugovora proti obdelavi",
        "preklica privolitve"
      ]
    },
    footer: {
      title: "Kontakt",
      name: "Hiška La Vita",
      email: "E-pošta: lavitarelax@gmail.com"
    }
  },
  en: {
    title: "Cookie Policy",
    validFrom: "Valid from: January 29, 2026",
    whatAreCookies: {
      title: "What are cookies?",
      content: "Cookies are small text files that are stored on your device when you visit a website. They enable the website to function and improve the user experience."
    },
    types: {
      title: "Types of cookies",
      essential: {
        title: "Essential cookies",
        content: "Enable basic website functionality and secure use of services. These cookies are always active and are necessary for the website to function properly. They do not collect personal data for marketing purposes."
      },
      analytics: {
        title: "Analytics cookies",
        content: "Enable the collection of anonymous statistical data about website usage to improve its content and performance. They help us understand how visitors use the website."
      },
      advertising: {
        title: "Advertising cookies",
        content: "Enable the display of personalized content and ads based on user interests. They may be set by our advertising partners."
      }
    },
    list: {
      title: "Cookie list",
      headers: ["Name", "Type", "Purpose", "Duration"],
      rows: [
        ["cookie_consent", "Essential", "Stores your cookie preferences", "1 year"],
        ["_ga", "Analytics", "Google Analytics - distinguishes users", "2 years"],
        ["_gid", "Analytics", "Google Analytics - distinguishes users", "24 hours"]
      ]
    },
    management: {
      title: "Cookie management",
      content1: "You can change your cookie settings at any time by clicking on the \"Cookie Settings\" link in the website footer.",
      content2: "You can also disable or delete cookies in your browser settings. Please note that disabling some cookies may affect website functionality."
    },
    rights: {
      title: "Your rights",
      content: "Under GDPR, you have the right to:",
      items: [
        "access to your personal data",
        "correction of inaccurate data",
        "deletion of your data",
        "restriction of processing",
        "data portability",
        "object to processing",
        "withdraw consent"
      ]
    },
    footer: {
      title: "Contact",
      name: "La Vita House",
      email: "Email: lavitarelax@gmail.com"
    }
  },
  de: {
    title: "Cookie-Richtlinie",
    validFrom: "Gültig ab: 29. Januar 2026",
    whatAreCookies: {
      title: "Was sind Cookies?",
      content: "Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie eine Website besuchen. Sie ermöglichen das Funktionieren der Website und verbessern die Benutzererfahrung."
    },
    types: {
      title: "Arten von Cookies",
      essential: {
        title: "Notwendige Cookies",
        content: "Ermöglichen die grundlegende Funktionalität der Website und die sichere Nutzung der Dienste. Diese Cookies sind immer aktiv und für das ordnungsgemäße Funktionieren der Website erforderlich. Sie sammeln keine personenbezogenen Daten zu Marketingzwecken."
      },
      analytics: {
        title: "Analytische Cookies",
        content: "Ermöglichen die Erfassung anonymer statistischer Daten über die Website-Nutzung zur Verbesserung von Inhalt und Leistung. Sie helfen uns zu verstehen, wie Besucher die Website nutzen."
      },
      advertising: {
        title: "Werbe-Cookies",
        content: "Ermöglichen die Anzeige personalisierter Inhalte und Werbung basierend auf den Interessen des Benutzers. Sie können von unseren Werbepartnern gesetzt werden."
      }
    },
    list: {
      title: "Cookie-Liste",
      headers: ["Name", "Typ", "Zweck", "Dauer"],
      rows: [
        ["cookie_consent", "Notwendig", "Speichert Ihre Cookie-Einstellungen", "1 Jahr"],
        ["_ga", "Analytisch", "Google Analytics - unterscheidet Benutzer", "2 Jahre"],
        ["_gid", "Analytisch", "Google Analytics - unterscheidet Benutzer", "24 Stunden"]
      ]
    },
    management: {
      title: "Cookie-Verwaltung",
      content1: "Sie können Ihre Cookie-Einstellungen jederzeit ändern, indem Sie auf den Link \"Cookie-Einstellungen\" in der Fußzeile der Website klicken.",
      content2: "Sie können Cookies auch in Ihren Browsereinstellungen deaktivieren oder löschen. Bitte beachten Sie, dass das Deaktivieren einiger Cookies die Funktionalität der Website beeinträchtigen kann."
    },
    rights: {
      title: "Ihre Rechte",
      content: "Gemäß DSGVO haben Sie das Recht auf:",
      items: [
        "Zugang zu Ihren personenbezogenen Daten",
        "Berichtigung unrichtiger Daten",
        "Löschung Ihrer Daten",
        "Einschränkung der Verarbeitung",
        "Datenübertragbarkeit",
        "Widerspruch gegen die Verarbeitung",
        "Widerruf der Einwilligung"
      ]
    },
    footer: {
      title: "Kontakt",
      name: "Ferienhaus La Vita",
      email: "E-Mail: lavitarelax@gmail.com"
    }
  }
};

export const CookiesModal = ({ trigger }: CookiesModalProps) => {
  const { language } = useLanguage();
  const content = cookiesContent[language];

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

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
              {content.whatAreCookies.title}
            </h3>
            <p className="mb-4">{content.whatAreCookies.content}</p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
              {content.types.title}
            </h3>

            <h4 className="font-medium text-foreground mt-4 mb-2">
              {content.types.essential.title}
            </h4>
            <p className="mb-4">{content.types.essential.content}</p>

            <h4 className="font-medium text-foreground mt-4 mb-2">
              {content.types.analytics.title}
            </h4>
            <p className="mb-4">{content.types.analytics.content}</p>

            <h4 className="font-medium text-foreground mt-4 mb-2">
              {content.types.advertising.title}
            </h4>
            <p className="mb-4">{content.types.advertising.content}</p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
              {content.list.title}
            </h3>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-border">
                <thead>
                  <tr className="bg-muted">
                    {content.list.headers.map((header, i) => (
                      <th key={i} className="border border-border px-3 py-2 text-left text-foreground">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.list.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className="border border-border px-3 py-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
              {content.management.title}
            </h3>
            <p className="mb-4">{content.management.content1}</p>
            <p className="mb-4">{content.management.content2}</p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">
              {content.rights.title}
            </h3>
            <p className="mb-4">{content.rights.content}</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              {content.rights.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="font-medium text-foreground">{content.footer.title}</p>
              <p>{content.footer.name}</p>
              <p>{content.footer.email}</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

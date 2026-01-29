import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CookiesModalProps {
  trigger: React.ReactNode;
}

export const CookiesModal = ({ trigger }: CookiesModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-foreground">
            Politika piškotkov
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p className="text-sm mb-4">
              <strong>Hiška La Vita</strong><br />
              Veljavno od: 29. 01. 2026
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Kaj so piškotki?</h3>
            <p className="mb-4">
              Piškotki so majhne besedilne datoteke, ki se shranijo na vašo napravo ob obisku spletne strani. Omogočajo delovanje spletne strani in izboljšujejo uporabniško izkušnjo.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Vrste piškotkov</h3>

            <h4 className="font-medium text-foreground mt-4 mb-2">Nujni piškotki</h4>
            <p className="mb-4">
              Omogočajo osnovno delovanje spletne strani in varno uporabo storitev. Ti piškotki so vedno aktivni in so nujni za pravilno delovanje spletne strani. Ne zbirajo osebnih podatkov za trženjske namene.
            </p>

            <h4 className="font-medium text-foreground mt-4 mb-2">Analitični piškotki</h4>
            <p className="mb-4">
              Omogočajo zbiranje anonimnih statističnih podatkov o uporabi spletne strani z namenom izboljšanja njene vsebine in delovanja. Pomagajo nam razumeti, kako obiskovalci uporabljajo spletno stran.
            </p>

            <h4 className="font-medium text-foreground mt-4 mb-2">Oglaševalski piškotki</h4>
            <p className="mb-4">
              Omogočajo prikaz prilagojenih vsebin in oglasov glede na interese uporabnika. Lahko jih nastavijo naši oglaševalski partnerji.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Seznam piškotkov</h3>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-2 text-left text-foreground">Ime</th>
                    <th className="border border-border px-3 py-2 text-left text-foreground">Vrsta</th>
                    <th className="border border-border px-3 py-2 text-left text-foreground">Namen</th>
                    <th className="border border-border px-3 py-2 text-left text-foreground">Trajanje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-3 py-2">cookie_consent</td>
                    <td className="border border-border px-3 py-2">Nujni</td>
                    <td className="border border-border px-3 py-2">Shranjuje vaše nastavitve piškotkov</td>
                    <td className="border border-border px-3 py-2">1 leto</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">_ga</td>
                    <td className="border border-border px-3 py-2">Analitični</td>
                    <td className="border border-border px-3 py-2">Google Analytics - razlikuje uporabnike</td>
                    <td className="border border-border px-3 py-2">2 leti</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">_gid</td>
                    <td className="border border-border px-3 py-2">Analitični</td>
                    <td className="border border-border px-3 py-2">Google Analytics - razlikuje uporabnike</td>
                    <td className="border border-border px-3 py-2">24 ur</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Upravljanje piškotkov</h3>
            <p className="mb-4">
              Svoje nastavitve piškotkov lahko kadarkoli spremenite s klikom na povezavo "Nastavitve piškotkov" v nogi spletne strani.
            </p>
            <p className="mb-4">
              Piškotke lahko tudi onemogočite ali izbrišete v nastavitvah svojega brskalnika. Upoštevajte, da lahko onemogočanje nekaterih piškotkov vpliva na delovanje spletne strani.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Vaše pravice</h3>
            <p className="mb-4">
              V skladu z GDPR imate pravico do:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>dostopa do vaših osebnih podatkov</li>
              <li>popravka netočnih podatkov</li>
              <li>izbrisa vaših podatkov</li>
              <li>omejitve obdelave</li>
              <li>prenosljivosti podatkov</li>
              <li>ugovora proti obdelavi</li>
              <li>preklica privolitve</li>
            </ul>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="font-medium text-foreground">Kontakt</p>
              <p>Hiška La Vita</p>
              <p>E-pošta: lavitarelax@gmail.com</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

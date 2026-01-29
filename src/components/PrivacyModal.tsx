import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PrivacyModalProps {
  trigger: React.ReactNode;
}

export const PrivacyModal = ({ trigger }: PrivacyModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-foreground">
            Pravilnik o zasebnosti
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p className="text-sm mb-4">
              <strong>Hiška La Vita</strong><br />
              Veljavno od: 29. 01. 2026
            </p>
            <p className="mb-6">
              Ta pravilnik o zasebnosti je pripravljen v skladu z Uredbo (EU) 2016/679 Evropskega parlamenta in Sveta z dne 27. aprila 2016 (Splošna uredba o varstvu podatkov – GDPR) ter veljavno nacionalno zakonodajo.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">1. Upravljavec osebnih podatkov</h3>
            <p className="mb-4">
              Upravljavec osebnih podatkov v smislu člena 4(7) GDPR je:
            </p>
            <p className="mb-4">
              <strong>Hiška La Vita</strong><br />
              Spletna stran: www.lavitarelax.lovable.app<br />
              E-pošta: lavitarelax@gmail.com
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">2. Vrste osebnih podatkov, ki se obdelujejo</h3>
            <p className="mb-3">Upravljavec lahko obdeluje naslednje osebne podatke:</p>
            
            <h4 className="font-medium text-foreground mt-4 mb-2">2.1 Podatki, ki jih posameznik posreduje prostovoljno</h4>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>ime in priimek</li>
              <li>e-poštni naslov</li>
              <li>telefonska številka</li>
              <li>naslov prebivališča ali naslov za izstavitev računa</li>
              <li>podatki, povezani z rezervacijo in plačilom</li>
            </ul>

            <h4 className="font-medium text-foreground mt-4 mb-2">2.2 Podatki, zbrani samodejno ob uporabi spletne strani</h4>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>IP naslov</li>
              <li>vrsta in različica brskalnika</li>
              <li>vrsta naprave in operacijski sistem</li>
              <li>datum in čas dostopa</li>
              <li>obiskane podstrani in trajanje obiska</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">3. Nameni obdelave osebnih podatkov</h3>
            <p className="mb-3">Osebni podatki se obdelujejo za naslednje namene:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>izvajanje pogodbenega razmerja (obdelava in upravljanje rezervacij)</li>
              <li>komunikacija s posameznikom v zvezi s povpraševanji in rezervacijami</li>
              <li>izpolnjevanje zakonskih obveznosti upravljavca</li>
              <li>pošiljanje obvestil in promocijskih vsebin, kadar je bila podana izrecna privolitev</li>
              <li>zagotavljanje varnosti, tehnične stabilnosti in izboljševanje delovanja spletne strani</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">4. Pravne podlage za obdelavo</h3>
            <p className="mb-3">Upravljavec obdeluje osebne podatke na naslednjih pravnih podlagah v skladu s členom 6 GDPR:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>izvajanje pogodbe ali izvajanje ukrepov na zahtevo posameznika pred sklenitvijo pogodbe</li>
              <li>izpolnjevanje zakonskih obveznosti upravljavca</li>
              <li>privolitev posameznika (npr. za prejemanje e-novic)</li>
              <li>zakoniti interesi upravljavca (npr. zagotavljanje varnosti spletne strani in izboljševanje uporabniške izkušnje)</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">5. Obdobje hrambe osebnih podatkov</h3>
            <p className="mb-3">Osebni podatki se hranijo le toliko časa, kolikor je potrebno za izpolnitev namena, za katerega so bili zbrani, oziroma v skladu z veljavnimi zakonskimi roki:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>podatki, povezani z rezervacijami in računovodstvom: skladno z davčno in računovodsko zakonodajo</li>
              <li>podatki, obdelovani na podlagi privolitve: do preklica privolitve</li>
              <li>tehnični in analitični podatki: v anonimizirani ali agregirani obliki</li>
            </ul>
            <p className="mb-4">
              Po poteku obdobja hrambe se podatki izbrišejo ali trajno anonimizirajo.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">6. Posredovanje osebnih podatkov tretjim osebam</h3>
            <p className="mb-3">
              Upravljavec osebnih podatkov ne posreduje tretjim osebam, razen kadar je to nujno potrebno za izvedbo storitve ali kadar to zahteva zakon.
            </p>
            <p className="mb-3">V posameznih primerih so osebni podatki lahko posredovani:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>ponudnikom plačilnih storitev</li>
              <li>pristojnim državnim organom na podlagi zakonske obveznosti</li>
            </ul>
            <p className="mb-4">
              Vsi obdelovalci osebnih podatkov delujejo na podlagi pogodbe o obdelavi osebnih podatkov v skladu s členom 28 GDPR.
            </p>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="font-medium text-foreground">Hiška La Vita</p>
              <p>Camp Terme 3000, 9226 Moravske Toplice</p>
              <p>E-pošta: lavitarelax@gmail.com</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

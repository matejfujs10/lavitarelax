import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  trigger: React.ReactNode;
}

export const TermsModal = ({ trigger }: TermsModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-foreground">
            Splošni pogoji poslovanja
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-4">
              Oddaja počitniške hiške La Vita
            </h2>
            <p className="mb-4">
              Dobrodošli v počitniški hiški La Vita, skrbno urejeni nastanitvi v Kampu Terme 3000.
              Za zagotovitev prijetnega, varnega in brezskrbnega bivanja vas vljudno prosimo, da se pred prihodom seznanite s spodaj navedenimi splošnimi pogoji poslovanja.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">1. Namestitev in kapacitete</h3>
            <p className="mb-3">
              Počitniška hiška La Vita je sodobno in funkcionalno opremljena ter primerna za bivanje do 6 oseb.
            </p>
            <p className="font-medium text-foreground mb-2">Hiška obsega:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>dve spalnici</li>
              <li>ena spalnica z udobno zakonsko posteljo</li>
              <li>ena spalnica z dvema velikima enojnima posteljama</li>
              <li>veliko jedilnico, primerno za skupne obroke in druženje</li>
              <li>polno opremljeno kuhinjo (velik hladilnik z zamrzovalnikom, mikrovalovna pečica, toaster, osnovna kuhinjska oprema)</li>
              <li>kopalnico v hiški</li>
              <li>skupne WC-je in tuše v kampu, kar omogoča pristno kamp doživetje</li>
              <li>klimatsko napravo</li>
              <li>ogrevanje z radiatorji v zimskem času</li>
              <li>TV z videorekorderjem ter izborom filmov in risank</li>
              <li>brezžični internet (Wi-Fi)</li>
              <li>otroške igrače</li>
              <li>športne rekvizite</li>
            </ul>
            <p className="font-medium text-foreground mb-2">Zunanji prostor:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>dve terasi (ena pred hiško in ena večja, zasebna terasa za hiško)</li>
              <li>urejena in mirna okolica hiške, primerna za sprostitev, druženje in bivanje v naravi</li>
              <li>tri brezplačna kolesa za uporabo gostov</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">2. Cena in kopalne karte</h3>
            <p className="mb-3">
              Cena velja na noč za celotno hiško in ne glede na število oseb (do največ 6 oseb).
            </p>
            <p className="mb-3">
              V ceno sta vključeni dve kopalni karti za Terme 3000.
            </p>
            <p className="font-medium text-foreground mb-2">Dodatne kopalne karte:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>odrasli: 21,90 EUR na osebo na noč</li>
              <li>otroci od 6 do 14,99 let: 17,90 EUR na osebo na noč</li>
              <li>otroci do 5,99 let: brezplačno</li>
            </ul>
            <p className="mb-4">
              Dodatne kopalne karte se kupijo na recepciji kampa po znižani ceni.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">3. Rezervacija in plačilo</h3>
            <p className="mb-4">
              Rezervacija je potrjena ob plačilu avansa v višini 50 % skupne vrednosti rezervacije.
              Preostali znesek se poravna ob prihodu.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">4. Politika odpovedi rezervacije</h3>
            <p className="mb-3">V primeru odpovedi ali spremembe rezervacije veljajo naslednji pogoji:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li><strong>odpoved do 14 dni pred prihodom:</strong> brezplačna odpoved, vplačan avans se vrne ali prenese na drug termin, zmanjšan za administrativne stroške v višini 25 EUR; po dogovoru je možna izdaja darilnega bona</li>
              <li><strong>odpoved 14 do 7 dni pred prihodom:</strong> zaračunamo 30 % vrednosti rezervacije</li>
              <li><strong>odpoved 6 do 4 dni pred prihodom:</strong> zaračunamo 40 % vrednosti rezervacije</li>
              <li><strong>odpoved 3 do 1 dan pred prihodom:</strong> zaračunamo 60 % vrednosti rezervacije</li>
              <li><strong>odpoved na dan prihoda ali neprihod (no-show):</strong> zaračunamo 80 % vrednosti rezervacije</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">5. Prijava in odjava (Check-in / Check-out)</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li><strong>prijava (check-in):</strong> od 13:30 dalje</li>
              <li><strong>odjava (check-out):</strong> do 11:00 ali po dogovoru. V primeru, da je hiška prosta je možno podaljšanja bivanja.</li>
            </ul>
            <p className="mb-4">
              Ob prihodu na recepciji Kampa Terme 3000 ob predložitvi izpolnjene napotnice prejmete ključe hiške in zapestnice.
              V hiški so gostom na voljo posteljnina in kuhinjske krpe.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">6. Dodatni stroški in pravila</h3>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>turistična taksa in prijavnina se obračunata ob prihodu po veljavnem ceniku</li>
              <li>hišni ljubljenčki so dovoljeni ob doplačilu 5 EUR na noč</li>
              <li>kajenje v notranjih prostorih hiške ni dovoljeno</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">7. Hišni red</h3>
            <p className="mb-4">
              Gostje so dolžni spoštovati hišni red, ki je na voljo v hiški.
              Prosimo za skrbno ravnanje z opremo ter ohranjanje reda in čistoče.
              V primeru hujših kršitev si pridržujemo pravico do prekinitve bivanja brez vračila plačila.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">8. Pomoč in reklamacije</h3>
            <p className="mb-6">
              Za morebitna vprašanja, težave ali pomoč med bivanjem se lahko obrnete na recepcijo Kampa Terme 3000, kjer vam bodo nudili ustrezno pomoč.
            </p>

            <div className="bg-lavita-mint-light p-4 rounded-xl mt-6">
              <p className="text-foreground font-medium mb-2">
                Zahvaljujemo se vam za zaupanje in se veselimo vašega obiska v počitniški hiški La Vita.
              </p>
              <p className="text-foreground">
                Vaše udobje in prijetno bivanje sta za nas na prvem mestu.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="font-medium text-foreground">Camp Terme 3000</p>
              <p>9226 Moravske Toplice</p>
              <p>Telefon: +386 (0) 68 169 430</p>
              <p>E-pošta: lavitarelax@gmail.com</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

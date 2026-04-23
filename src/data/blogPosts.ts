import blogPrekmurje from "@/assets/blog/blog-prekmurje.jpg";
import blogThermalWater from "@/assets/blog/blog-thermal-water.jpg";
import blogHouseLavita from "@/assets/blog/blog-house-lavita.png";

export interface BlogSection {
  heading?: string;
  paragraphs?: string[];
  list?: { title: string; text: string }[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  intro: string;
  sections: BlogSection[];
  outro?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "popoln-oddih-moravske-toplice",
    title: "Popoln oddih v Moravskih Toplicah: Kaj početi poleg kopanja?",
    category: "Izleti in okolica",
    excerpt:
      "Moravske Toplice ponujajo veliko več kot le termalne vrelce. Odkrijte najboljše kolesarske poti, lokalno kulinariko in skrite kotičke Prekmurja.",
    image: blogPrekmurje,
    date: "2026-04-15",
    readTime: "5 min",
    intro:
      "Prekmurje je dežela štorkelj, neskončnih ravnic in gostoljubnih ljudi. Ob bivanju v House La Vita imate idealno izhodišče za raziskovanje najlepših kotičkov te edinstvene slovenske pokrajine.",
    sections: [
      {
        heading: "Kaj vas čaka v okolici House La Vita",
        list: [
          {
            title: "Kolesarjenje",
            text: "Raziskovanje naravnega parka Goričko po označenih kolesarskih poteh, ki vodijo skozi vinograde, gozdove in slikovite vasice.",
          },
          {
            title: "Gastronomija",
            text: "Obisk lokalnih čokoladnic, vinskih kleti in kmečkih turizmov, kjer boste okusili pristne prekmurske dobrote – od bograča do gibanice.",
          },
          {
            title: "Energijske točke",
            text: "Sprostitev ob Bukovniškem jezeru, kjer se nahaja eno najbolj znanih območij energijskih točk v Sloveniji.",
          },
        ],
      },
    ],
    outro:
      "House La Vita vam nudi mirno zavetje po aktivnem dnevu v naravi. Po dnevu odkrivanja se vrnete v udobno hiško sredi Kampa Terme 3000, kjer se lahko sprostite na zasebni terasi ali se osvežite v termalnem kompleksu.",
  },
  {
    id: "2",
    slug: "zdravilna-moc-crne-termalne-vode",
    title: "Zdravilna moč črne termalne vode v Termah 3000",
    category: "Zdravje in dobro počutje",
    excerpt:
      "Spoznajte blagodejne učinke unikatne črne termomineralne vode, ki pomaga pri revmatičnih obolenjih in popolni regeneraciji telesa.",
    image: blogThermalWater,
    date: "2026-04-10",
    readTime: "4 min",
    intro:
      "Črna termalna voda v Moravskih Toplicah je svetovni fenomen. Izvira iz globine več kot 1000 metrov in ima specifičen vonj po nafti, kar potrjuje njeno bogato sestavo z naravnimi minerali in organskimi snovmi.",
    sections: [
      {
        heading: "Blagodejni učinki črne vode",
        list: [
          {
            title: "Lajšanje bolečin v sklepih",
            text: "Voda je še posebej priporočljiva pri revmatičnih obolenjih, artrozah in po poškodbah gibalnega aparata.",
          },
          {
            title: "Boljša prekrvavitev",
            text: "Termalne kopeli izboljšujejo prekrvavitev, krepijo srčno-žilni sistem in pospešujejo regeneracijo telesa.",
          },
          {
            title: "Splošno dobro počutje",
            text: "Edinstvena sestava vode pomirja kožo, zmanjšuje stres in vam vrne energijo za nove izzive.",
          },
        ],
      },
    ],
    outro:
      "House La Vita se nahaja le korak stran od teh vrelcev, kar vam omogoča maksimalen izkoristek terapij. Z dvema vključenima kopalnima kartama lahko vsak dan uživate v zdravilnih kopelih.",
  },
  {
    id: "3",
    slug: "zakaj-izbrati-house-la-vita",
    title: "Zakaj izbrati House La Vita za vaš naslednji dopust?",
    category: "Novosti",
    excerpt:
      "Več kot le prenočišče – doživetje, ki združuje udobje, naravo in popoln odklop sredi termalnega raja v Kampu Terme 3000.",
    image: blogHouseLavita,
    date: "2026-04-05",
    readTime: "6 min",
    intro:
      "Če iščete nekaj več kot le prenočišče, potem je House La Vita v Kampu Terme 3000 prava izbira. To ni klasičen dopust – to je doživetje, ki združuje udobje, naravo in popoln odklop. Predstavljajte si jutro: ☕ kava na zasebni terasi, 🌿 tišina, narava in petje ptic, 🌊 sprostitev v termah le nekaj korakov stran. To je La Vita.",
    sections: [
      {
        heading: "Edinstvena kamping izkušnja – brez kompromisov",
        paragraphs: [
          "House La Vita ponuja popolno ravnovesje med avtentično kamping izkušnjo in udobjem sodobnega bivanja. Hiška je unikatno zasnovana, prijetna in prostorna, zato se gostje počutijo kot doma… ali še bolje.",
        ],
        list: [
          { title: "🏡 Prostorna hiška", text: "50 m² udobja za do 6 oseb – dovolj prostora za družino ali skupino prijateljev." },
          { title: "🚿 Sanitarije v bližini", text: "Hitro in praktično dostopne – vse na dosegu roke." },
          { title: "🌊 Termalni kompleks", text: "Tik ob kampu – le nekaj korakov do sprostitve v zdravilni vodi." },
          { title: "🚗 Lastno parkirišče", text: "Tik ob hiški – brez nepotrebnega prenašanja prtljage." },
        ],
      },
      {
        heading: "Več kot hiška – vaš zasebni kotiček za uživanje",
        paragraphs: [
          "🌅 Posebnost House La Vita sta DVE TERASI – velika prednost, ki jo drugje težko najdete. Manjša terasa pred hiško je idealna za jutranjo kavo, velika zasebna terasa za hiško pa omogoča druženje, pripravo jedi, piknike in večerne trenutke pod zvezdami.",
          "💥 Prav zaradi prostornosti hiške in velike terase je La Vita odlična tudi za manjše teambuildinge (do 6 oseb), druženja s prijatelji in praznovanja v intimnem krogu.",
        ],
      },
      {
        heading: "Kaj dobite za to ceno? (več kot pričakujete)",
        list: [
          { title: "🏡 Celotna hiška", text: "Najamete CELO hiško – ne samo sobo. Popolna zasebnost zagotovljena." },
          { title: "🛏️ Posteljnina vključena", text: "Sveža in kakovostna – brez dodatnih stroškov." },
          { title: "🍽️ Polno opremljena kuhinja", text: "Vse, kar potrebujete za pripravo obrokov kot doma." },
          { title: "💡 Ambientna LED osvetlitev", text: "Ustvarja prijetno vzdušje za sproščene večere." },
          { title: "🛌 Vrhunski Dormeo jogiji", text: "Za miren spanec in popolno regeneracijo." },
          { title: "🎶 HI-FI sistem", text: "Vaša najljubša glasba kot popoln zvočni dodatek vašemu oddihu." },
        ],
      },
      {
        heading: "CENA, ki vas bo presenetila",
        paragraphs: [
          "👉 NIZKA SEZONA: 80 € / noč",
          "👉 VISOKA SEZONA: 100 € / noč",
          "⚠️ Cena velja za CELOTNO hiško (do 6 oseb) – ne na osebo! To pomeni, da že pri 4 osebah plačate manj kot 25 € na osebo na noč.",
        ],
      },
      {
        heading: "BONUS, ki dejansko zniža ceno dopusta",
        paragraphs: [
          "🌊 2x CELODNEVNI KOPALNI KARTI – GRATIS za dva odrasla. Redna cena karte znaša 25 € na osebo, kar pomeni 50 € prihranka na dan. Že samo s kartami pokrijete velik del nočitve – ostalo je čisti dobitek.",
        ],
      },
      {
        heading: "Dodatne ugodnosti za goste",
        list: [
          { title: "🎟️ Znižane karte", text: "21,90 € za 3. in vse naslednje osebe." },
          { title: "👶 Otroci do 4,99 let", text: "GRATIS – brez doplačila za kopanje." },
          { title: "🧒 Otroci 5–14,99 let", text: "Le 17,90 € za celodnevno kopanje." },
          { title: "🚲 Brezplačna kolesa", text: "Za raziskovanje Prekmurja in okolice." },
          { title: "⚽ Športni rekviziti", text: "Za aktivne dni v naravi." },
          { title: "🧸 Otroške igrače", text: "Za nasmehe najmlajših gostov." },
        ],
      },
      {
        heading: "Raj za družine, pare in prijatelje",
        list: [
          { title: "👨‍👩‍👧‍👦 Družine", text: "Prostor, varnost in zabava za otroke – starši pa lahko končno zadihajo." },
          { title: "❤️ Pari", text: "Romantika, mir in večeri na terasi pod zvezdami – brez motenj." },
          { title: "🎉 Prijatelji", text: "Druženje, kuhanje in nepozabni trenutki v sproščenem vzdušju." },
        ],
      },
      {
        heading: "Več ostanete = več prihranite",
        paragraphs: [
          "💥 Pri bivanju 3 ali več noči vas čakajo DODATNI POPUSTI. Več dni pomeni nižjo ceno na noč in več časa za uživanje. Daljši oddih je hkrati cenejši IN bogatejši z doživetji – idealna kombinacija.",
        ],
      },
      {
        heading: "Gostje se vračajo – in to pove vse",
        paragraphs: [
          "Največ povejo izkušnje gostov. Naši obiskovalci pogosto izpostavijo brezhibno čistočo, odlično lokacijo tik ob termah, izjemno udobje in poseben občutek 'kot doma'. Mnogi se vračajo leto za letom – nekateri postanejo del naše družine.",
          "⭐ Preverite mnenja na naši Facebook strani: House La Vita Terme 3000.",
        ],
      },
      {
        heading: "To ni samo dopust. To je pametna izbira.",
        list: [
          { title: "💛 Več prostora kot hotel", text: "50 m² zasebnega kotička samo za vas." },
          { title: "💛 Več zasebnosti kot apartma", text: "Lastna hiška, lastni terasi, lasten ritem." },
          { title: "💛 Več doživetja kot klasičen oddih", text: "Termalna voda, narava in udobje na enem mestu." },
        ],
      },
    ],
    outro:
      "Rezervirajte zdaj – preden drugi zasedejo vaš termin. 📞 +386 68 169 430 · 💌 rent@lavitaterme3000.com · 🌐 www.lavitaterme3000.com. Najboljši termini gredo prvi, povpraševanje pa je veliko. Rezervirajte danes in si zagotovite TOP oddih po TOP ceni.",
  },
];

export const getBlogPostById = (id: string): BlogPost | undefined =>
  blogPosts.find((post) => post.id === id || post.slug === id);

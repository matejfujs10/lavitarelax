import blogPrekmurje from "@/assets/blog/blog-prekmurje.jpg";
import blogThermalWater from "@/assets/blog/blog-thermal-water.jpg";
import blogHouseLavita from "@/assets/blog/blog-house-lavita.jpg";

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
      "Udobje doma sredi termalnega raja. Preverite, zakaj se naši gostje vedno znova vračajo v naše apartmaje.",
    image: blogHouseLavita,
    date: "2026-04-05",
    readTime: "3 min",
    intro:
      "House La Vita združuje eleganco, sodobno opremo in neposredno bližino narave. Naši apartmaji so zasnovani tako, da vsakemu gostu zagotovijo edinstveno doživetje – ne glede na to, ali iščete družinski oddih ali romantičen pobeg.",
    sections: [
      {
        heading: "Za koga je House La Vita najboljša izbira",
        list: [
          {
            title: "Družine",
            text: "Družine, ki potrebujejo prostor in zasebnost – 50 m² udobja za do 6 oseb, otroške igrače in varna okolica.",
          },
          {
            title: "Pari",
            text: "Pari, ki iščejo romantičen in miren pobeg z LED ambientno osvetlitvijo in zasebno teraso pod zvezdami.",
          },
          {
            title: "Skupine prijateljev",
            text: "Popolna oprema, HI-FI sistem in prostorna kuhinja za nepozabne večere v dobri družbi.",
          },
        ],
      },
    ],
    outro:
      "Popolno opremljena kuhinja, udobna ležišča DORMEO in zlati detajli v interierju zagotavljajo, da se boste pri nas počutili kraljevsko. Pridružite se gostom, ki se k nam vračajo leto za letom.",
  },
];

export const getBlogPostById = (id: string): BlogPost | undefined =>
  blogPosts.find((post) => post.id === id || post.slug === id);

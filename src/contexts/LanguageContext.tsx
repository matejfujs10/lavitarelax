import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";

export type Language = 'sl' | 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isAutoDetected: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  sl: {
    // Navbar
    'nav.home': 'DOMOV',
    'nav.booking': 'REZERVIRAJ ODDIH',
    'nav.vouchers': 'DARILNI BONI',
    'nav.activities': 'AKTIVNOSTI',
    'nav.reviews': 'MNENJA GOSTOV',
    'nav.faq': 'POGOSTA VPRAŠANJA',
    'nav.about': 'O NAS',
    'nav.tagline': 'Travel·Enjoy·Explore',
    
    // Hero Section
    'hero.title1': 'Hiška',
    'hero.title2': 'La Vita',
    'hero.subtitle': 'Vaš kotiček sprostitve in narave v Termah 3000',
    'hero.winterAction': 'Zimska akcija',
    'hero.summerAction': 'Poletna akcija',
    'hero.perNight': '/noč',
    'hero.bookNow': 'Rezerviraj zdaj',
    'hero.discoverActivities': 'Odkrijte aktivnosti',
    'hero.discoverMore': 'Odkrijte več',
    'hero.badge.tickets': '🎫 2x Kopalni karti vključeni',
    'hero.badge.bikes': '🚲 3x Brezplačna kolesa',
    'hero.badge.tv': '📺 TV + Videorekorder',
    'hero.badge.space': '🏡 50m² prostora',
    'hero.badge.camping': '⛺ Kampiranje ob hiški',
    'hero.badge.teambuilding': '🤝 Team Buildingi',
    'hero.badge.unique': '✨ Unikatni prostori',
    'hero.badge.nature': '🌳 Urejena okolica',
    
    // Prominent Banner
    'banner.yourHome': 'Vaš Dom Stran od Doma',
    'banner.ticketsIncluded': '2x KOPALNI KARTI VKLJUČENI',
    
    // Features Section
    'features.label': '🌿 Kaj vas čaka',
    'features.title': 'Vse za Popoln Oddih',
    'features.subtitle': 'La Vita Hiška ponuja vse, kar potrebujete za nepozaben oddih sredi narave',
    'features.space': '50m² Prostora',
    'features.spaceDesc': 'Prostorna hiška z dvema terasama za popoln oddih v naravi',
    'features.guests': 'Do 6 Gostov',
    'features.guestsDesc': 'Idealno za družine in manjše skupine prijateljev',
    'features.kitchen': 'Opremljena Kuhinja',
    'features.kitchenDesc': 'Vse kar potrebujete za pripravo okusnih obrokov',
    'features.led': 'LED Osvetlitev',
    'features.ledDesc': 'Ambientna osvetlitev za romantične večere',
    'features.hifi': 'HI-FI Sistem',
    'features.hifiDesc': 'Kakovostna glasba za sproščeno vzdušje',
    'features.dormeo': 'DORMEO Ležišča',
    'features.dormeoDesc': 'Vrhunska kvaliteta spanja za popolno regeneracijo',
    'features.bikes': '3x Brezplačna Kolesa',
    'features.bikesDesc': 'Raziskujte okolico na dveh kolesih',
    'features.tickets': '2x Kopalni Karti',
    'features.ticketsDesc': 'Vključen vstop v termalni kompleks',
    'features.area': 'Urejena Okolica',
    'features.areaDesc': 'Lepo vzdrževan prostor za sproščanje in uživanje',
    'features.sports': 'Športni Rekviziti',
    'features.sportsDesc': 'Oprema za aktivno preživljanje prostega časa',
    'features.linen': 'Posteljnina Vključena',
    'features.linenDesc': 'Sveža posteljnina in brisače za vaše udobje',
    'features.terrace': '2x Terasa',
    'features.terraceDesc': 'Ena majhna spredaj in ena velika zasebna za hiško',
    
    // About Section
    'about.label': '🏡 O nas',
    'about.title': 'Vaš Dom Stran od Doma',
    'about.text1': 'La Vita Hiška je skrbno zasnovana počitniška nastanitev v srcu Kampa Terme 3000, kjer se udobje doma prepleta z naravno sproščenostjo kampiranja. Obdana je z lepo urejeno okolico, ki nudi mir, zasebnost in občutek pravega oddiha v naravi — daleč od hrupa težke industrije, v neokrnjenem okolju s prijaznimi ljudmi, odlično kulinariko in zdravilno termalno vodo.',
    'about.text2': 'Naša 50 m² velika hiška ponuja vrhunsko opremo, dve prijetni terasi ter veliko zasebno teraso, idealno za jutranjo kavo, sončenje ali večerne trenutke ob dobri družbi. Neposreden dostop do termalnega kompleksa pa poskrbi za popolno sprostitev v vsakem letnem času.',
    'about.text3': 'Posebna prednost La Vita Hiške je izjemno ugodna cena – pri bivanju do 6 oseb znaša manj kot 19 € na osebo na noč, v ceno pa sta že vključeni dve kopalni karti za terme.',
    'about.priceTitle': 'Za ostale osebe veljajo znižane cene vstopnic:',
    'about.priceAdult': 'odrasli: 21,90 € na osebo na noč',
    'about.priceChild': 'otroci od 6 do 14,99 let: 17,90 € na osebo na noč',
    'about.priceFree': 'otroci do 5,99 let: brezplačno',
    'about.text4': 'Za še bogatejše doživetje ponujamo možnost izposoje več koles, foto opreme ter PROFLIPP kombija za skupno raziskovanje čudovitega Pomurja — od vinogradov in naravnih lepot do lokalnih kulinaričnih zakladov.',
    'about.text5': 'Privoščite si ugoden oddih brez kompromisov – več udobja, več sprostitve in več nepozabnih trenutkov.',
    'about.cta': '✨ Pobegnite od vsakdana in si ustvarite spomine, ki bodo trajali. Vljudno vabljeni v La Vita Hiško! ✨',
    'about.stats': 'Domačnost, Sprostitev, Oddih',
    'about.location': 'Lokacija',
    'about.locationValue': 'Kamp Terme 3000, Moravske Toplice',
    'about.phone': 'Telefon',
    'about.email': 'Email',
    
    // Footer
    'footer.tagline': 'Vaš kotiček sprostitve in narave v Kampu Terme 3000. Uživajte v udobju, naravi in termalnih doživetjih.',
    'footer.quickLinks': 'Hitri Dostop',
    'footer.home': 'Domov',
    'footer.reservation': 'Rezervacija',
    'footer.activities': 'Aktivnosti',
    'footer.reviews': 'Mnenja gostov',
    'footer.faq': 'Pogosta vprašanja',
    'footer.about': 'O nas',
    'footer.contact': 'Kontakt',
    'footer.terms': 'Splošni pogoji poslovanja',
    'footer.privacy': 'Pravilnik o zasebnosti',
    'footer.cookies': 'Politika piškotkov',
    'footer.cookieSettings': 'Nastavitve piškotkov',
    'footer.rights': 'Vse pravice pridržane.',
    'footer.madeWith': 'Ustvarjeno z',
    'footer.forGuests': 'za najboljše goste',
    
    // Gift Voucher
    'voucher.title': 'Podari Dopust v Termah 3000',
    'voucher.subtitle': 'Izpolni obrazec in pošlji darilni bon zdaj!',
    'voucher.description': 'Najboljše darilo za prijatelje in družino - nepozabni trenutki v La Vita Hiški',
    'voucher.backHome': 'Nazaj na domačo stran',
    'voucher.giverTitle': 'Darilni bon podarja',
    'voucher.firstName': 'Ime',
    'voucher.lastName': 'Priimek',
    'voucher.address': 'Naslov',
    'voucher.postalCode': 'Poštna številka',
    'voucher.city': 'Kraj',
    'voucher.yourEmail': 'Vaš e-naslov',
    'voucher.recipientTitle': 'Prejemnik bona',
    'voucher.recipientEmail': 'E-naslov prejemnika',
    'voucher.message': 'Sporočilo prejemniku',
    'voucher.messagePlaceholder': 'Napišite osebno sporočilo za prejemnika darilnega bona...',
    'voucher.valueTitle': 'Vrednost bona',
    'voucher.voucherIncludes': 'Bon vključuje 2x kopalni karti.',
    'voucher.priceInfo': 'Cene so na noč. V hiški lahko biva do 6 oseb.',
    'voucher.selectNights': 'Izberite število noči',
    'voucher.night': 'noč',
    'voucher.nights': 'noči',
    'voucher.totalValue': 'Skupna vrednost bona',
    'voucher.perNight': 'na noč',
    'voucher.previewButton': 'Predogled bona',
    'voucher.securePayment': 'Varno kartično plačilo',
    'voucher.supportedCards': 'Podprte kartice: Visa, Mastercard, Maestro',
    'voucher.payButton': 'Plačaj s kartico in pošlji bon',
    'voucher.processing': 'Obdelava...',
    'voucher.cancelled': 'Plačilo preklicano',
    'voucher.cancelledText': 'Plačilo je bilo preklicano. Lahko poskusite znova ali se vrnete na domačo stran.',
    'voucher.tryAgain': 'Poskusite znova',
    'voucher.home': 'Domov',
    
    // Booking
    'booking.winterOffer': 'Zimska ponudba',
    'booking.summerOffer': 'Poletna ponudba',
    'booking.formTitle': 'Rezervacijski Obrazec',
    'booking.nameLabel': 'Ime in Priimek',
    'booking.emailLabel': 'E-mail',
    'booking.arrivalDate': 'Datum prihoda',
    'booking.departureDate': 'Datum odhoda',
    'booking.arrivalTime': 'Okvirni čas prihoda',
    'booking.selectTime': 'Izberite čas',
    'booking.byAgreement': 'Po dogovoru',
    'booking.guests': 'Gostje',
    'booking.addGuest': 'Dodaj osebo',
    'booking.guestName': 'Ime gosta',
    'booking.pets': 'Pripeljal/-a bom hišnega ljubljenčka',
    'booking.petsNote': 'Doplačilo za hišnega ljubljenčka: 5€/noč',
    'booking.terms': 'Strinjam se s splošnimi pogoji poslovanja',
    'booking.submit': 'Pošlji rezervacijo',
    'booking.submitting': 'Pošiljam...',
    'booking.thankYou': 'Hvala za vašo rezervacijo!',
    'booking.willContact': 'Vaše povpraševanje smo uspešno prejeli in vas bomo v najkrajšem možnem času kontaktirali.',
    'booking.team': 'Ekipa La Vita',
    'booking.select': 'Izberi',
    'booking.callUs': 'Pokličite nas',
    'booking.writeUs': 'Pišite nam',
    'booking.reserveNow': 'Rezerviraj Zdaj',
    'booking.perNight': '/ noč',
    'booking.error': 'Napaka',
    'booking.errorTerms': 'Prosimo, potrdite splošne pogoje poslovanja.',
    'booking.errorFields': 'Prosimo, izpolnite vsa obvezna polja.',
    'booking.errorGeneric': 'Prišlo je do napake. Prosimo, poskusite znova.',
    
    // Validation
    'validation.nameMin': 'Ime mora imeti vsaj 2 znaka',
    'validation.surnameMin': 'Priimek mora imeti vsaj 2 znaka',
    'validation.addressMin': 'Vnesite veljaven naslov',
    'validation.postalMin': 'Vnesite veljavno poštno številko',
    'validation.cityMin': 'Vnesite veljavno mesto',
    'validation.emailInvalid': 'Vnesite veljaven e-naslov',
    'validation.recipientEmailInvalid': 'Vnesite veljaven e-naslov prejemnika',
    'validation.messageMin': 'Sporočilo mora imeti vsaj 10 znakov',
    'validation.messageMax': 'Sporočilo je predolgo',
    'validation.selectNights': 'Izberite število noči',

    // Cookie Consent
    'cookie.title': 'Uporaba piškotkov',
    'cookie.description': 'Na spletni strani uporabljamo nujne piškotke za zagotavljanje pravilnega delovanja spletne strani ter analitične in oglaševalske piškotke za izboljšanje uporabniške izkušnje in prikaz prilagojenih vsebin. Več informacij je na voljo v Pravilniku o zasebnosti in Politiki piškotkov.',
    'cookie.settings': 'Nastavitve',
    'cookie.rejectNonEssential': 'Zavrni nenujne',
    'cookie.acceptAll': 'Sprejmi vse',
    'cookie.settingsTitle': 'Nastavitve piškotkov',
    'cookie.settingsDescription': 'Izberite, katere vrste piškotkov dovolite. Nujni piškotki so vedno omogočeni, saj so potrebni za delovanje spletne strani.',
    'cookie.essential': 'Nujni piškotki',
    'cookie.essentialDesc': 'Omogočajo osnovno delovanje spletne strani in varno uporabo storitev. Ti piškotki so vedno aktivni.',
    'cookie.analytics': 'Analitični piškotki',
    'cookie.analyticsDesc': 'Omogočajo zbiranje anonimnih statističnih podatkov o uporabi spletne strani z namenom izboljšanja njene vsebine in delovanja.',
    'cookie.marketing': 'Oglaševalski piškotki',
    'cookie.marketingDesc': 'Omogočajo prikaz prilagojenih vsebin in oglasov glede na interese uporabnika.',
    'cookie.saveSettings': 'Shrani nastavitve',
  },
  en: {
    // Navbar
    'nav.home': 'HOME',
    'nav.booking': 'BOOK YOUR STAY',
    'nav.vouchers': 'GIFT VOUCHERS',
    'nav.activities': 'ACTIVITIES',
    'nav.reviews': 'GUEST REVIEWS',
    'nav.faq': 'FAQ',
    'nav.about': 'ABOUT US',
    'nav.tagline': 'Travel·Enjoy·Explore',
    
    // Hero Section
    'hero.title1': 'House',
    'hero.title2': 'La Vita',
    'hero.subtitle': 'Your corner of relaxation and nature at Terme 3000',
    'hero.winterAction': 'Winter special',
    'hero.summerAction': 'Summer special',
    'hero.perNight': '/night',
    'hero.bookNow': 'Book now',
    'hero.discoverActivities': 'Discover activities',
    'hero.discoverMore': 'Discover more',
    'hero.badge.tickets': '🎫 2x Spa tickets included',
    'hero.badge.bikes': '🚲 3x Free bicycles',
    'hero.badge.tv': '📺 TV + Video recorder',
    'hero.badge.space': '🏡 50m² of space',
    'hero.badge.camping': '⛺ Camping nearby',
    'hero.badge.teambuilding': '🤝 Team Buildings',
    'hero.badge.unique': '✨ Unique spaces',
    'hero.badge.nature': '🌳 Well-maintained surroundings',
    
    // Prominent Banner
    'banner.yourHome': 'Your Home Away From Home',
    'banner.ticketsIncluded': '2x SPA TICKETS INCLUDED',
    
    // Features Section
    'features.label': '🌿 What awaits you',
    'features.title': 'Everything for a Perfect Getaway',
    'features.subtitle': 'La Vita House offers everything you need for an unforgettable retreat in nature',
    'features.space': '50m² of Space',
    'features.spaceDesc': 'Spacious house with two terraces for a perfect getaway in nature',
    'features.guests': 'Up to 6 Guests',
    'features.guestsDesc': 'Ideal for families and small groups of friends',
    'features.kitchen': 'Equipped Kitchen',
    'features.kitchenDesc': 'Everything you need to prepare delicious meals',
    'features.led': 'LED Lighting',
    'features.ledDesc': 'Ambient lighting for romantic evenings',
    'features.hifi': 'HI-FI System',
    'features.hifiDesc': 'Quality music for a relaxed atmosphere',
    'features.dormeo': 'DORMEO Mattresses',
    'features.dormeoDesc': 'Premium sleep quality for complete regeneration',
    'features.bikes': '3x Free Bicycles',
    'features.bikesDesc': 'Explore the surroundings on two wheels',
    'features.tickets': '2x Spa Tickets',
    'features.ticketsDesc': 'Entrance to the thermal complex included',
    'features.area': 'Well-maintained Area',
    'features.areaDesc': 'Beautifully maintained space for relaxation',
    'features.sports': 'Sports Equipment',
    'features.sportsDesc': 'Equipment for active leisure time',
    'features.linen': 'Linen Included',
    'features.linenDesc': 'Fresh bedding and towels for your comfort',
    'features.terrace': '2x Terrace',
    'features.terraceDesc': 'One small in front and one large private behind the house',
    
    // About Section
    'about.label': '🏡 About us',
    'about.title': 'Your Home Away From Home',
    'about.text1': 'La Vita House is a carefully designed holiday accommodation in the heart of Camp Terme 3000, where home comfort intertwines with natural camping relaxation. Surrounded by a beautifully maintained environment that offers peace, privacy and the feeling of a true retreat in nature — far from the noise of heavy industry, in an unspoiled environment with friendly people, excellent cuisine and healing thermal water.',
    'about.text2': 'Our 50 m² house offers top-notch equipment, two pleasant terraces and a large private terrace, ideal for morning coffee, sunbathing or evening moments with good company. Direct access to the thermal complex ensures complete relaxation in every season.',
    'about.text3': 'A special advantage of La Vita House is the extremely favorable price – for up to 6 people, it is less than 19 € per person per night, and two spa tickets are already included in the price.',
    'about.priceTitle': 'Reduced ticket prices apply for additional guests:',
    'about.priceAdult': 'adults: €21.90 per person per night',
    'about.priceChild': 'children 6 to 14.99 years: €17.90 per person per night',
    'about.priceFree': 'children up to 5.99 years: free',
    'about.text4': 'For an even richer experience, we offer the option of renting additional bicycles, photo equipment and a PROFLIPP van for joint exploration of the beautiful Pomurje — from vineyards and natural beauties to local culinary treasures.',
    'about.text5': 'Treat yourself to an affordable getaway without compromises – more comfort, more relaxation and more unforgettable moments.',
    'about.cta': '✨ Escape from everyday life and create memories that will last. Welcome to La Vita House! ✨',
    'about.stats': 'Comfort, Relaxation, Retreat',
    'about.location': 'Location',
    'about.locationValue': 'Camp Terme 3000, Moravske Toplice',
    'about.phone': 'Phone',
    'about.email': 'Email',
    
    // Footer
    'footer.tagline': 'Your corner of relaxation and nature at Camp Terme 3000. Enjoy comfort, nature and thermal experiences.',
    'footer.quickLinks': 'Quick Links',
    'footer.home': 'Home',
    'footer.reservation': 'Reservation',
    'footer.activities': 'Activities',
    'footer.reviews': 'Guest reviews',
    'footer.faq': 'FAQ',
    'footer.about': 'About us',
    'footer.contact': 'Contact',
    'footer.terms': 'Terms and Conditions',
    'footer.privacy': 'Privacy Policy',
    'footer.cookies': 'Cookie Policy',
    'footer.cookieSettings': 'Cookie Settings',
    'footer.rights': 'All rights reserved.',
    'footer.madeWith': 'Made with',
    'footer.forGuests': 'for the best guests',
    
    // Gift Voucher
    'voucher.title': 'Gift a Vacation at Terme 3000',
    'voucher.subtitle': 'Fill out the form and send a gift voucher now!',
    'voucher.description': 'The best gift for friends and family - unforgettable moments at La Vita House',
    'voucher.backHome': 'Back to home page',
    'voucher.giverTitle': 'Gift voucher from',
    'voucher.firstName': 'First name',
    'voucher.lastName': 'Last name',
    'voucher.address': 'Address',
    'voucher.postalCode': 'Postal code',
    'voucher.city': 'City',
    'voucher.yourEmail': 'Your email',
    'voucher.recipientTitle': 'Voucher recipient',
    'voucher.recipientEmail': 'Recipient email',
    'voucher.message': 'Message for recipient',
    'voucher.messagePlaceholder': 'Write a personal message for the gift voucher recipient...',
    'voucher.valueTitle': 'Voucher value',
    'voucher.voucherIncludes': 'Voucher includes 2x spa tickets.',
    'voucher.priceInfo': 'Prices are per night. Up to 6 people can stay in the house.',
    'voucher.selectNights': 'Select number of nights',
    'voucher.night': 'night',
    'voucher.nights': 'nights',
    'voucher.totalValue': 'Total voucher value',
    'voucher.perNight': 'per night',
    'voucher.previewButton': 'Preview voucher',
    'voucher.securePayment': 'Secure card payment',
    'voucher.supportedCards': 'Supported cards: Visa, Mastercard, Maestro',
    'voucher.payButton': 'Pay by card and send voucher',
    'voucher.processing': 'Processing...',
    'voucher.cancelled': 'Payment cancelled',
    'voucher.cancelledText': 'Payment was cancelled. You can try again or return to the home page.',
    'voucher.tryAgain': 'Try again',
    'voucher.home': 'Home',
    
    // Booking
    'booking.winterOffer': 'Winter offer',
    'booking.summerOffer': 'Summer offer',
    'booking.formTitle': 'Booking Form',
    'booking.nameLabel': 'Full Name',
    'booking.emailLabel': 'Email',
    'booking.arrivalDate': 'Arrival date',
    'booking.departureDate': 'Departure date',
    'booking.arrivalTime': 'Approximate arrival time',
    'booking.selectTime': 'Select time',
    'booking.byAgreement': 'By agreement',
    'booking.guests': 'Guests',
    'booking.addGuest': 'Add guest',
    'booking.guestName': 'Guest name',
    'booking.pets': 'I will bring a pet',
    'booking.petsNote': 'Pet surcharge: €5/night',
    'booking.terms': 'I agree to the terms and conditions',
    'booking.submit': 'Submit booking',
    'booking.submitting': 'Submitting...',
    'booking.thankYou': 'Thank you for your reservation!',
    'booking.willContact': 'We have successfully received your request and will contact you as soon as possible.',
    'booking.team': 'Team La Vita',
    'booking.select': 'Select',
    'booking.callUs': 'Call us',
    'booking.writeUs': 'Write to us',
    'booking.reserveNow': 'Book Now',
    'booking.perNight': '/ night',
    'booking.error': 'Error',
    'booking.errorTerms': 'Please agree to the terms and conditions.',
    'booking.errorFields': 'Please fill in all required fields.',
    'booking.errorGeneric': 'An error occurred. Please try again.',
    
    // Validation
    'validation.nameMin': 'Name must have at least 2 characters',
    'validation.surnameMin': 'Surname must have at least 2 characters',
    'validation.addressMin': 'Enter a valid address',
    'validation.postalMin': 'Enter a valid postal code',
    'validation.cityMin': 'Enter a valid city',
    'validation.emailInvalid': 'Enter a valid email',
    'validation.recipientEmailInvalid': 'Enter a valid recipient email',
    'validation.messageMin': 'Message must have at least 10 characters',
    'validation.messageMax': 'Message is too long',
    'validation.selectNights': 'Select number of nights',

    // Cookie Consent
    'cookie.title': 'Cookie usage',
    'cookie.description': 'We use essential cookies to ensure proper website functionality, as well as analytics and advertising cookies to improve user experience and display personalized content. More information is available in our Privacy Policy and Cookie Policy.',
    'cookie.settings': 'Settings',
    'cookie.rejectNonEssential': 'Reject non-essential',
    'cookie.acceptAll': 'Accept all',
    'cookie.settingsTitle': 'Cookie settings',
    'cookie.settingsDescription': 'Choose which types of cookies you allow. Essential cookies are always enabled as they are required for website functionality.',
    'cookie.essential': 'Essential cookies',
    'cookie.essentialDesc': 'Enable basic website functionality and secure use of services. These cookies are always active.',
    'cookie.analytics': 'Analytics cookies',
    'cookie.analyticsDesc': 'Enable collection of anonymous statistical data about website usage to improve content and performance.',
    'cookie.marketing': 'Advertising cookies',
    'cookie.marketingDesc': 'Enable display of personalized content and ads based on user interests.',
    'cookie.saveSettings': 'Save settings',
  },
  de: {
    // Navbar
    'nav.home': 'STARTSEITE',
    'nav.booking': 'AUFENTHALT BUCHEN',
    'nav.vouchers': 'GESCHENKGUTSCHEINE',
    'nav.activities': 'AKTIVITÄTEN',
    'nav.reviews': 'GÄSTEBEWERTUNGEN',
    'nav.faq': 'FAQ',
    'nav.about': 'ÜBER UNS',
    'nav.tagline': 'Travel·Enjoy·Explore',
    
    // Hero Section
    'hero.title1': 'Haus',
    'hero.title2': 'La Vita',
    'hero.subtitle': 'Ihre Ecke der Entspannung und Natur in Terme 3000',
    'hero.winterAction': 'Winterangebot',
    'hero.summerAction': 'Sommerangebot',
    'hero.perNight': '/Nacht',
    'hero.bookNow': 'Jetzt buchen',
    'hero.discoverActivities': 'Aktivitäten entdecken',
    'hero.discoverMore': 'Mehr entdecken',
    'hero.badge.tickets': '🎫 2x Spa-Tickets inklusive',
    'hero.badge.bikes': '🚲 3x Kostenlose Fahrräder',
    'hero.badge.tv': '📺 TV + Videorekorder',
    'hero.badge.space': '🏡 50m² Platz',
    'hero.badge.camping': '⛺ Camping in der Nähe',
    'hero.badge.teambuilding': '🤝 Teambuildings',
    'hero.badge.unique': '✨ Einzigartige Räume',
    'hero.badge.nature': '🌳 Gepflegte Umgebung',
    
    // Prominent Banner
    'banner.yourHome': 'Ihr Zuhause in der Ferne',
    'banner.ticketsIncluded': '2x SPA-TICKETS INKLUSIVE',
    
    // Features Section
    'features.label': '🌿 Was Sie erwartet',
    'features.title': 'Alles für einen perfekten Urlaub',
    'features.subtitle': 'Das La Vita Haus bietet alles, was Sie für einen unvergesslichen Rückzug in der Natur brauchen',
    'features.space': '50m² Platz',
    'features.spaceDesc': 'Geräumiges Haus mit zwei Terrassen für perfekte Erholung in der Natur',
    'features.guests': 'Bis zu 6 Gäste',
    'features.guestsDesc': 'Ideal für Familien und kleine Freundesgruppen',
    'features.kitchen': 'Ausgestattete Küche',
    'features.kitchenDesc': 'Alles was Sie für leckere Mahlzeiten brauchen',
    'features.led': 'LED-Beleuchtung',
    'features.ledDesc': 'Ambientebeleuchtung für romantische Abende',
    'features.hifi': 'HI-FI System',
    'features.hifiDesc': 'Qualitätsmusik für entspannte Atmosphäre',
    'features.dormeo': 'DORMEO Matratzen',
    'features.dormeoDesc': 'Premium-Schlafqualität für vollständige Regeneration',
    'features.bikes': '3x Kostenlose Fahrräder',
    'features.bikesDesc': 'Erkunden Sie die Umgebung auf zwei Rädern',
    'features.tickets': '2x Spa-Tickets',
    'features.ticketsDesc': 'Eintritt in den Thermalkomplex inklusive',
    'features.area': 'Gepflegter Bereich',
    'features.areaDesc': 'Schön gepflegter Raum zum Entspannen',
    'features.sports': 'Sportausrüstung',
    'features.sportsDesc': 'Ausrüstung für aktive Freizeitgestaltung',
    'features.linen': 'Bettwäsche inklusive',
    'features.linenDesc': 'Frische Bettwäsche und Handtücher für Ihren Komfort',
    'features.terrace': '2x Terrasse',
    'features.terraceDesc': 'Eine kleine vorne und eine große private hinter dem Haus',
    
    // About Section
    'about.label': '🏡 Über uns',
    'about.title': 'Ihr Zuhause in der Ferne',
    'about.text1': 'Das La Vita Haus ist eine sorgfältig gestaltete Ferienunterkunft im Herzen des Camps Terme 3000, wo Wohnkomfort mit natürlicher Camping-Entspannung verschmilzt. Umgeben von einer wunderschön gepflegten Umgebung, die Ruhe, Privatsphäre und das Gefühl eines echten Rückzugs in der Natur bietet — weit weg vom Lärm der Schwerindustrie, in einer unberührten Umgebung mit freundlichen Menschen, ausgezeichneter Küche und heilendem Thermalwasser.',
    'about.text2': 'Unser 50 m² großes Haus bietet erstklassige Ausstattung, zwei angenehme Terrassen und eine große private Terrasse, ideal für morgendlichen Kaffee, Sonnenbaden oder Abendstunden in guter Gesellschaft. Direkter Zugang zum Thermalkomplex sorgt für vollständige Entspannung in jeder Jahreszeit.',
    'about.text3': 'Ein besonderer Vorteil des La Vita Hauses ist der äußerst günstige Preis – für bis zu 6 Personen beträgt er weniger als 19 € pro Person und Nacht, und zwei Spa-Tickets sind bereits im Preis inbegriffen.',
    'about.priceTitle': 'Für zusätzliche Gäste gelten ermäßigte Ticketpreise:',
    'about.priceAdult': 'Erwachsene: 21,90 € pro Person/Nacht',
    'about.priceChild': 'Kinder 6 bis 14,99 Jahre: 17,90 € pro Person/Nacht',
    'about.priceFree': 'Kinder bis 5,99 Jahre: kostenlos',
    'about.text4': 'Für ein noch reichhaltigeres Erlebnis bieten wir die Möglichkeit, zusätzliche Fahrräder, Fotoausrüstung und einen PROFLIPP-Van zur gemeinsamen Erkundung des schönen Pomurje zu mieten — von Weinbergen und Naturschönheiten bis hin zu lokalen kulinarischen Schätzen.',
    'about.text5': 'Gönnen Sie sich einen erschwinglichen Urlaub ohne Kompromisse – mehr Komfort, mehr Entspannung und mehr unvergessliche Momente.',
    'about.cta': '✨ Entfliehen Sie dem Alltag und schaffen Sie Erinnerungen, die bleiben werden. Willkommen im La Vita Haus! ✨',
    'about.stats': 'Gemütlichkeit, Entspannung, Erholung',
    'about.location': 'Standort',
    'about.locationValue': 'Camp Terme 3000, Moravske Toplice',
    'about.phone': 'Telefon',
    'about.email': 'E-Mail',
    
    // Footer
    'footer.tagline': 'Ihre Ecke der Entspannung und Natur im Camp Terme 3000. Genießen Sie Komfort, Natur und Thermalerlebnisse.',
    'footer.quickLinks': 'Schnellzugriff',
    'footer.home': 'Startseite',
    'footer.reservation': 'Reservierung',
    'footer.activities': 'Aktivitäten',
    'footer.reviews': 'Gästebewertungen',
    'footer.faq': 'FAQ',
    'footer.about': 'Über uns',
    'footer.contact': 'Kontakt',
    'footer.terms': 'Allgemeine Geschäftsbedingungen',
    'footer.privacy': 'Datenschutzrichtlinie',
    'footer.cookies': 'Cookie-Richtlinie',
    'footer.cookieSettings': 'Cookie-Einstellungen',
    'footer.rights': 'Alle Rechte vorbehalten.',
    'footer.madeWith': 'Erstellt mit',
    'footer.forGuests': 'für die besten Gäste',
    
    // Gift Voucher
    'voucher.title': 'Urlaub in Terme 3000 verschenken',
    'voucher.subtitle': 'Füllen Sie das Formular aus und senden Sie jetzt einen Geschenkgutschein!',
    'voucher.description': 'Das beste Geschenk für Freunde und Familie - unvergessliche Momente im La Vita Haus',
    'voucher.backHome': 'Zurück zur Startseite',
    'voucher.giverTitle': 'Geschenkgutschein von',
    'voucher.firstName': 'Vorname',
    'voucher.lastName': 'Nachname',
    'voucher.address': 'Adresse',
    'voucher.postalCode': 'Postleitzahl',
    'voucher.city': 'Stadt',
    'voucher.yourEmail': 'Ihre E-Mail',
    'voucher.recipientTitle': 'Gutscheinempfänger',
    'voucher.recipientEmail': 'E-Mail des Empfängers',
    'voucher.message': 'Nachricht an Empfänger',
    'voucher.messagePlaceholder': 'Schreiben Sie eine persönliche Nachricht für den Geschenkgutschein-Empfänger...',
    'voucher.valueTitle': 'Gutscheinwert',
    'voucher.voucherIncludes': 'Gutschein beinhaltet 2x Spa-Tickets.',
    'voucher.priceInfo': 'Preise sind pro Nacht. Bis zu 6 Personen können im Haus übernachten.',
    'voucher.selectNights': 'Anzahl der Nächte wählen',
    'voucher.night': 'Nacht',
    'voucher.nights': 'Nächte',
    'voucher.totalValue': 'Gesamtwert des Gutscheins',
    'voucher.perNight': 'pro Nacht',
    'voucher.previewButton': 'Gutschein-Vorschau',
    'voucher.securePayment': 'Sichere Kartenzahlung',
    'voucher.supportedCards': 'Unterstützte Karten: Visa, Mastercard, Maestro',
    'voucher.payButton': 'Mit Karte bezahlen und Gutschein senden',
    'voucher.processing': 'Verarbeitung...',
    'voucher.cancelled': 'Zahlung abgebrochen',
    'voucher.cancelledText': 'Die Zahlung wurde abgebrochen. Sie können es erneut versuchen oder zur Startseite zurückkehren.',
    'voucher.tryAgain': 'Erneut versuchen',
    'voucher.home': 'Startseite',
    
    // Booking
    'booking.winterOffer': 'Winterangebot',
    'booking.summerOffer': 'Sommerangebot',
    'booking.formTitle': 'Buchungsformular',
    'booking.nameLabel': 'Vollständiger Name',
    'booking.emailLabel': 'E-Mail',
    'booking.arrivalDate': 'Anreisedatum',
    'booking.departureDate': 'Abreisedatum',
    'booking.arrivalTime': 'Ungefähre Ankunftszeit',
    'booking.selectTime': 'Zeit wählen',
    'booking.byAgreement': 'Nach Vereinbarung',
    'booking.guests': 'Gäste',
    'booking.addGuest': 'Gast hinzufügen',
    'booking.guestName': 'Gastname',
    'booking.pets': 'Ich bringe ein Haustier mit',
    'booking.petsNote': 'Haustierzuschlag: 5€/Nacht',
    'booking.terms': 'Ich stimme den AGB zu',
    'booking.submit': 'Buchung absenden',
    'booking.submitting': 'Wird gesendet...',
    'booking.thankYou': 'Vielen Dank für Ihre Reservierung!',
    'booking.willContact': 'Wir haben Ihre Anfrage erfolgreich erhalten und werden Sie so schnell wie möglich kontaktieren.',
    'booking.team': 'Team La Vita',
    'booking.select': 'Wählen',
    'booking.callUs': 'Rufen Sie uns an',
    'booking.writeUs': 'Schreiben Sie uns',
    'booking.reserveNow': 'Jetzt Buchen',
    'booking.perNight': '/ Nacht',
    'booking.error': 'Fehler',
    'booking.errorTerms': 'Bitte stimmen Sie den AGB zu.',
    'booking.errorFields': 'Bitte füllen Sie alle Pflichtfelder aus.',
    'booking.errorGeneric': 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    
    // Validation
    'validation.nameMin': 'Name muss mindestens 2 Zeichen haben',
    'validation.surnameMin': 'Nachname muss mindestens 2 Zeichen haben',
    'validation.addressMin': 'Geben Sie eine gültige Adresse ein',
    'validation.postalMin': 'Geben Sie eine gültige Postleitzahl ein',
    'validation.cityMin': 'Geben Sie eine gültige Stadt ein',
    'validation.emailInvalid': 'Geben Sie eine gültige E-Mail ein',
    'validation.recipientEmailInvalid': 'Geben Sie eine gültige Empfänger-E-Mail ein',
    'validation.messageMin': 'Nachricht muss mindestens 10 Zeichen haben',
    'validation.messageMax': 'Nachricht ist zu lang',
    'validation.selectNights': 'Anzahl der Nächte wählen',

    // Cookie Consent
    'cookie.title': 'Cookie-Nutzung',
    'cookie.description': 'Wir verwenden notwendige Cookies für die ordnungsgemäße Funktion der Website sowie Analyse- und Werbe-Cookies zur Verbesserung der Benutzererfahrung und Anzeige personalisierter Inhalte. Weitere Informationen finden Sie in unserer Datenschutzrichtlinie und Cookie-Richtlinie.',
    'cookie.settings': 'Einstellungen',
    'cookie.rejectNonEssential': 'Nicht-essentielle ablehnen',
    'cookie.acceptAll': 'Alle akzeptieren',
    'cookie.settingsTitle': 'Cookie-Einstellungen',
    'cookie.settingsDescription': 'Wählen Sie, welche Arten von Cookies Sie zulassen. Notwendige Cookies sind immer aktiviert, da sie für die Website-Funktionalität erforderlich sind.',
    'cookie.essential': 'Notwendige Cookies',
    'cookie.essentialDesc': 'Ermöglichen grundlegende Website-Funktionalität und sichere Nutzung der Dienste. Diese Cookies sind immer aktiv.',
    'cookie.analytics': 'Analytische Cookies',
    'cookie.analyticsDesc': 'Ermöglichen die Erfassung anonymer statistischer Daten zur Verbesserung von Inhalt und Leistung.',
    'cookie.marketing': 'Werbe-Cookies',
    'cookie.marketingDesc': 'Ermöglichen die Anzeige personalisierter Inhalte und Werbung basierend auf Benutzerinteressen.',
    'cookie.saveSettings': 'Einstellungen speichern',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'la-vita-language';
const LANGUAGE_AUTO_DETECTED_KEY = 'la-vita-language-auto-detected';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = async () => {
      // Check if user has manually set language before
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      const wasAutoDetected = localStorage.getItem(LANGUAGE_AUTO_DETECTED_KEY);
      
      if (savedLanguage && (savedLanguage === 'sl' || savedLanguage === 'en' || savedLanguage === 'de')) {
        // User has a saved preference, use it
        setLanguageState(savedLanguage);
        setIsAutoDetected(wasAutoDetected === 'true');
        setIsInitialized(true);
        return;
      }

      // No saved preference - try to auto-detect
      try {
        const response = await supabase.functions.invoke('detect-language');
        
        if (response.data?.language) {
          const detectedLang = response.data.language as Language;
          console.log('Auto-detected language:', detectedLang, 'from country:', response.data.country);
          setLanguageState(detectedLang);
          setIsAutoDetected(true);
          localStorage.setItem(LANGUAGE_STORAGE_KEY, detectedLang);
          localStorage.setItem(LANGUAGE_AUTO_DETECTED_KEY, 'true');
        } else {
          // Default to English if detection fails
          setLanguageState('en');
          localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
        }
      } catch (error) {
        console.error('Language detection failed:', error);
        // Default to English on error
        setLanguageState('en');
        localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
      }
      
      setIsInitialized(true);
    };

    initializeLanguage();
  }, []);

  // Update document language and save to storage when language changes
  useEffect(() => {
    if (isInitialized) {
      document.documentElement.lang = language;
    }
  }, [language, isInitialized]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setIsAutoDetected(false);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    localStorage.setItem(LANGUAGE_AUTO_DETECTED_KEY, 'false');
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isAutoDetected }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

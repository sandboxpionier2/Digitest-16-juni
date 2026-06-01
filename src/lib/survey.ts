export type ProfileName =
  | "De Digitale Verkenner"
  | "De Digitale Doorpakker"
  | "De Digitale Pionier";

export type Question = {
  theme: 1 | 2;
  themeLabel: string;
  text: string;
  options: { label: "A" | "B" | "C"; text: string; score: 1 | 2 | 3 }[];
};

export const QUESTIONS: Question[] = [
  {
    theme: 1,
    themeLabel: "Oplossen van problemen",
    text: "Hoe reageer je als een digitaal systeem of programma op je werk niet doet wat je wilt?",
    options: [
      {
        label: "A",
        text: "Ik vertrouw op de expertise van de IT-helpdesk of een handige collega, zodat ik snel weer verder kan met mijn eigen werk.",
        score: 1,
      },
      {
        label: "B",
        text: "Ik zoek eerst zelf even in de handleiding of probeer logisch na te denken, voordat ik hulp inschakel.",
        score: 2,
      },
      {
        label: "C",
        text: "Ik duik erin om de oorzaak te vinden, los het op, en kijk direct of we dit structureel kunnen verbeteren in ons proces.",
        score: 3,
      },
    ],
  },
  {
    theme: 1,
    themeLabel: "Oplossen van problemen",
    text: "Hoe zet jij digitale tools in om je dagelijkse werk makkelijker of beter te maken?",
    options: [
      {
        label: "A",
        text: "Ik werk het liefst met de vertrouwde systemen en bewezen methodes, want dan weet ik zeker dat het proces goed en veilig verloopt.",
        score: 1,
      },
      {
        label: "B",
        text: "Ik probeer regelmatig nieuwe handigheidjes uit in programma's die ik al ken (zoals sneltoetsen of nieuwe knoppen) om mijn werk net wat vlotter te maken.",
        score: 2,
      },
      {
        label: "C",
        text: "Ik ben continu op zoek naar nieuwe, innovatieve tools en experimenteer hier graag mee om het werk voor mij en mijn team makkelijker te maken.",
        score: 3,
      },
    ],
  },
  {
    theme: 1,
    themeLabel: "Oplossen van problemen",
    text: "Hoe zorg je dat je bijblijft met nieuwe digitale ontwikkelingen die je werk kunnen raken?",
    options: [
      {
        label: "A",
        text: "Ik focus me volledig op mijn kerntaken en leer een nieuw systeem aan wanneer de organisatie daar de tijd en training voor biedt.",
        score: 1,
      },
      {
        label: "B",
        text: "Ik lees de interne updates met interesse en sluit graag aan bij een workshop of training als het onderwerp me aanspreekt.",
        score: 2,
      },
      {
        label: "C",
        text: "Ik ga zelf actief op zoek naar technologische trends, weet precies wat ik nog wil leren en test de nieuwste ontwikkelingen graag in de praktijk.",
        score: 3,
      },
    ],
  },
  {
    theme: 2,
    themeLabel: "Communicatie en samenwerking",
    text: "Hoe werk jij het liefst samen met collega's of externe partners aan een document (bijv. een beleidsstuk of raadsvoorstel)?",
    options: [
      {
        label: "A",
        text: "Ik werk het liefst gefocust in mijn eigen concept en stuur de versie rond per mail wanneer deze echt klaar is voor feedback.",
        score: 1,
      },
      {
        label: "B",
        text: "Ik gebruik steeds vaker een linkje naar een gedeeld document, maar vind bijlagen sturen soms ook nog wel zo overzichtelijk.",
        score: 2,
      },
      {
        label: "C",
        text: "Ik werk standaard samen in de cloud (zoals in Teams); we typen tegelijk in hetzelfde bestand en reageren direct op elkaars opmerkingen.",
        score: 3,
      },
    ],
  },
  {
    theme: 2,
    themeLabel: "Communicatie en samenwerking",
    text: "Hoe gebruik jij digitale diensten om in contact te staan met inwoners, ondernemers of collega's?",
    options: [
      {
        label: "A",
        text: "Ik geloof sterk in persoonlijk contact en kies daarom het liefst voor een goed telefoongesprek of een fysieke afspraak.",
        score: 1,
      },
      {
        label: "B",
        text: "Ik kijk per situatie wat handig is en wissel fysieke afspraken in het stadhuis soepel af met een videobelletje of chatbericht.",
        score: 2,
      },
      {
        label: "C",
        text: "Ik zet slim verschillende digitale middelen in (van beeldbellen tot online samenwerkingsplatforms) om de communicatie zo efficiënt, breed en toegankelijk mogelijk te maken.",
        score: 3,
      },
    ],
  },
  {
    theme: 2,
    themeLabel: "Communicatie en samenwerking",
    text: "Ben je je bewust van je online identiteit en professionele reputatie op het internet?",
    options: [
      {
        label: "A",
        text: "Ik houd mijn werk en privé strikt gescheiden en besteed eigenlijk weinig aandacht aan een zichtbaar, professioneel profiel op het internet.",
        score: 1,
      },
      {
        label: "B",
        text: "Ik let wel op wat ik online deel en heb een basisprofiel staan, maar ik ben er niet wekelijks heel actief mee bezig.",
        score: 2,
      },
      {
        label: "C",
        text: "Zeker. Ik zet mijn digitale identiteit (zoals LinkedIn) bewust in om kennis te delen, mijn netwerk uit te breiden en de organisatie positief op de kaart te zetten.",
        score: 3,
      },
    ],
  },
];

export function getProfileFromScore(total: number): ProfileName {
  if (total <= 10) return "De Digitale Verkenner";
  if (total <= 14) return "De Digitale Doorpakker";
  return "De Digitale Pionier";
}

export const PROFILE_CONTENT: Record<
  ProfileName,
  {
    title: ProfileName;
    message: string;
    gradient: string;
    gradientLight: string;
    border: string;
    textColor: string;
    accent: string;
  }
> = {
  "De Digitale Verkenner": {
    title: "De Digitale Verkenner",
    message:
      "Jouw kracht ligt in betrouwbaarheid en zorgvuldigheid! Je doet je werk uitstekend met de vertrouwde systemen en zorgt daarmee voor de onmisbare stabiliteit binnen de gemeente Kampen. Je hoeft echt niet altijd voorop te lopen om van grote waarde te zijn. Wel ligt er een mooie, laagdrempelige kans om de komende tijd af en toe een kleine, nieuwe digitale stap te zetten. Vraag gerust een collega om je eens een handig trucje te laten zien in een programma dat je al gebruikt. Je zult merken: digitaal werken kan je dagelijkse werk soms nét iets makkelijker maken!",
    gradient: "from-blue-600 to-indigo-600",
    gradientLight: "from-blue-50 to-indigo-50",
    border: "border-blue-100",
    textColor: "text-blue-700",
    accent: "#2563eb",
  },
  "De Digitale Doorpakker": {
    title: "De Digitale Doorpakker",
    message:
      "Je bent hartstikke goed op weg! Je staat open voor de digitale wereld, pakt nieuwe ontwikkelingen vlot op en snapt als geen ander de waarde van slim samenwerken. Je bent hiermee de ideale brug tussen de vertrouwde manier van werken en de digitale vernieuwing. Met een klein beetje extra lef en door gewoon wat vaker te experimenteren met nieuwe tools, word jij binnen de kortste keren een digitale inspiratiebron voor je team. Ga zo door, je bent fantastisch bezig!",
    gradient: "from-teal-500 to-emerald-500",
    gradientLight: "from-teal-50 to-emerald-50",
    border: "border-teal-100",
    textColor: "text-teal-700",
    accent: "#14b8a6",
  },
  "De Digitale Pionier": {
    title: "De Digitale Pionier",
    message:
      "Jij bent een ware digitale koploper! Je omarmt vernieuwing, ziet overal kansen om processen te verbeteren en beweegt je moeiteloos door de online wereld. Voor de organisatie ben je onmisbaar in onze digitale transitie. Jouw grootste uitdaging nu? Neem je collega's mee in jouw enthousiasme! Deel je kennis, laat zien hoe leuk en efficiënt digitaal werken kan zijn, en help anderen om ook die volgende stap te zetten. Samen maken we de gemeente Kampen klaar voor de toekomst!",
    gradient: "from-amber-500 to-orange-500",
    gradientLight: "from-amber-50 to-orange-50",
    border: "border-amber-100",
    textColor: "text-amber-700",
    accent: "#f59e0b",
  },
};

export const PROFILE_COLORS: Record<ProfileName, string> = {
  "De Digitale Verkenner": "#2563eb",
  "De Digitale Doorpakker": "#14b8a6",
  "De Digitale Pionier": "#f59e0b",
};

export const ALL_PROFILES: ProfileName[] = [
  "De Digitale Verkenner",
  "De Digitale Doorpakker",
  "De Digitale Pionier",
];

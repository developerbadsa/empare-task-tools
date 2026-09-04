/**
 * Store Auto-Fill Engine v3 — PRO
 *
 * Multi-signal cross-validation detection system:
 *   - Domain TLD detection
 *   - Email domain detection
 *   - Address pattern matching (fuzzy)
 *   - Phone prefix detection
 *   - Currency symbol detection
 *   - Company suffix detection
 *   - Zip code format detection
 *   - Language name detection
 *   - Country name detection
 *   - Cross-field conflict resolution
 *   - Multi-signal voting with confidence scoring
 */

export interface AutoFillResult {
  country?: string;
  language?: string;
  currency?: string;
  company?: string;
  hours?: string;
  confidence: number;
  source: string;
}

// ─── Country Database (PRO) ──────────────────────────────────────────
export const COUNTRY_DB: Record<
  string,
  {
    country: string;
    language: string;
    currency: string;
    currencySymbols: string[];
    companySuffix: string[];
    tlds: string[];
    addressPatterns: string[];
    emailDomains: string[];
    phonePrefix: string[];
    hours: string;
    zipPattern: RegExp | null;
    zipExample: string;
  }
> = {
  poland: {
    country: "Poland",
    language: "Polish",
    currency: "PLN",
    currencySymbols: ["zł", "pln", "zloty", "złoty", "zlotych", "złotych"],
    companySuffix: ["sp. z o.o.", "sp. z o.o. sp. k.", "s.a.", "sp. k.", "spółka"],
    tlds: [".pl"],
    addressPatterns: [
      "ul.", "al.", "os.", "pl.", "rynek",
      "mazowieckie", "małopolskie", "śląskie", "wielkopolskie",
      "dolnośląskie", "łódzkie", "kujawsko-pomorskie", "lubelskie",
      "lubuskie", "opolskie", "podkarpackie", "podlaskie",
      "pomorskie", "świętokrzyskie", "warmińsko-mazurskie",
      "zachodniopomorskie",
      "polska", "poland",
      "katowice", "warszawa", "kraków", "krakow", "łódź", "lodz",
      "wrocław", "wroclaw", "poznań", "poznan", "gdańsk", "gdansk",
      "szczecin", "bydgoszcz", "lublin", "białystok", "bialystok",
      "czestochowa", "radom", "toruń", "torun", "kielce", "rzeszów",
      "rzeszow", "gliwice", "zabrze", "olsztyn", "bielsko", "opole",
      "zielona", "wałbrzych", "wloclawek", "tarnów", "koszalin",
      "konin", "płock", "plock", "radom", "legnica", "gliwice",
    ],
    emailDomains: [".pl"],
    phonePrefix: ["+48", "0048", "48"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: /^\d{2}-?\d{3}$/,
    zipExample: "40-101",
  },
  denmark: {
    country: "Denmark",
    language: "Danish",
    currency: "DKK",
    currencySymbols: ["kr", "dkk", "kr.", "danske kroner"],
    companySuffix: ["aps", "a/s", "ivs", "aps."],
    tlds: [".dk"],
    addressPatterns: [
      "vej", "gade", "allé", "alle", "stræde", "strae", "plads",
      "boulevard", "vænge", "vang", "have", "park", "skov",
      "hovedstaden", "midtjylland", "syddanmark", "sjælland", "sjaelland",
      "københavn", "kobenhavn", "koebenhavn", "copenhagen",
      "arhus", "aalborg", "odense", "esbjerg", "randers",
      "kolding", "horsens", "vejle", "roskilde", "helsingør",
      "helsingor", "silkeborg", "næstved", "naestved", "fredericia",
      "viborg", "køge", "koge", "holstebro", "slagelse", "hillerød",
      "hillerod", "hedensted", "middelfart", "struer", "fredensborg",
      "lyngby", "gentofte", "gladsaxe", "ballerup", "rødovre",
      "rodovre", "albertslund", "tårnby", "taarnby", "furesø",
      "danmark", "denmark",
    ],
    emailDomains: [".dk"],
    phonePrefix: ["+45", "0045", "45"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: /^\d{4}$/,
    zipExample: "2100",
  },
  sweden: {
    country: "Sweden",
    language: "Swedish",
    currency: "SEK",
    currencySymbols: ["kr", "sek", "kr.", "swedish kronor", "kronor"],
    companySuffix: ["ab", "hb", "kb"],
    tlds: [".se"],
    addressPatterns: [
      "gatan", "vägen", "vagen", "gränd", "grand", "plan",
      "leden", "backen", "torget", "torg",
      "stockholms", "västra götalands", "västra gotalands",
      "skåne", "skane", "ötalands", "otalands",
      "norrbottens", "västerbottens", "vasterbottens",
      "stockholm", "göteborg", "goteborg", "gothenburg",
      "malmö", "malmo", "uppsala", "linköping", "linkoping",
      "orebro", "västerås", "vasteras", "helsingborg",
      "jönköping", "jonkoping", "norrköping", "norrkoping",
      "lund", "umeå", "umea", "gävle", "gavle", "borås", "boras",
      "södertälje", "sodertalje", "eskilstuna", "halmstad",
      "växjö", "vaxjo", "karlstad", "sundsvall", "östersund",
      "ostersund", "trollhättan", "trollhattan", "luleå", "lulea",
      "upplands", "väsby", "vesby",
      "sverige", "sweden",
    ],
    emailDomains: [".se"],
    phonePrefix: ["+46", "0046", "46"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: /^\d{3}\s?\d{2}$/,
    zipExample: "111 20",
  },
  netherlands: {
    country: "Netherlands",
    language: "Dutch",
    currency: "EUR",
    currencySymbols: ["€", "eur", "euro", "euros"],
    companySuffix: ["b.v.", "n.v.", "bv", "nv"],
    tlds: [".nl"],
    addressPatterns: [
      "straat", "weg", "laan", "plein", "pad", "dijk",
      "amsterdam", "rotterdam", "den haag", "the hague",
      "utrecht", "groningen", "eindhoven", "tilburg", "almere",
      "breda", "nijmegen", "apeldoorn", "haarlem", "enschede",
      "arnhem", "zaanstad", "haarlemmermeer", "leiden",
      "delft", "dordrecht", "alkmaar", "maastricht",
      "nederland", "netherlands", "holland",
    ],
    emailDomains: [".nl"],
    phonePrefix: ["+31", "0031", "31"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: /^\d{4}\s?[A-Z]{2}$/,
    zipExample: "1012 AB",
  },
  uk: {
    country: "UK",
    language: "English",
    currency: "GBP",
    currencySymbols: ["£", "gbp", "pound", "pounds", "sterling"],
    companySuffix: ["ltd", "limited", "plc", "llp"],
    tlds: [".co.uk", ".uk"],
    addressPatterns: [
      "england", "scotland", "wales", "northern ireland",
      "greater london", "greater manchester", "west midlands",
      "west yorkshire", "hampshire", "kent", "essex", "surrey",
      "berkshire", "hertfordshire", "cheshire", "lancashire",
      "devon", "somerset", "norfolk", "suffolk", "sussex",
      "london", "manchester", "birmingham", "liverpool", "leeds",
      "bristol", "sheffield", "newcastle", "nottingham", "coventry",
      "bradford", "cardiff", "edinburgh", "glasgow", "belfast",
      "bath", "oxford", "cambridge", "brighton", "plymouth",
      "york", "chester", "exeter", "norwich", "reading",
      "united kingdom", "britain", "uk",
    ],
    emailDomains: [".co.uk", ".uk"],
    phonePrefix: ["+44", "0044", "44"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
    zipExample: "SW1A 1AA",
  },
  usa: {
    country: "USA",
    language: "English",
    currency: "USD",
    currencySymbols: ["$", "usd", "dollar", "dollars", "us dollar"],
    companySuffix: ["llc", "inc", "corp", "co.", "company"],
    tlds: [".us"],
    addressPatterns: [
      "new york", "los angeles", "chicago", "houston", "phoenix",
      "philadelphia", "san antonio", "san diego", "dallas", "austin",
      "miami", "seattle", "boston", "denver", "atlanta",
      "san jose", "jacksonville", "fort worth", "columbus",
      "charlotte", "indianapolis", "san francisco", "nashville",
      "portland", "las vegas", "memphis", "louisville", "baltimore",
      "milwaukee", "albuquerque", "tucson", "fresno", "sacramento",
      "mesa", "kansas city", "colorado springs", "omaha", "raleigh",
      "long beach", "virginia beach", "miami", "oakland", "minneapolis",
      "tampa", "tulsa", "arlington", "new orleans", "wichita",
      "california", "texas", "florida", "pennsylvania", "illinois",
      "ohio", "georgia", "north carolina", "michigan", "new jersey",
      "virginia", "washington", "arizona", "massachusetts", "tennessee",
      "indiana", "maryland", "missouri", "wisconsin", "colorado",
      "minnesota", "south carolina", "alabama", "louisiana", "kentucky",
      "oregon", "oklahoma", "connecticut", "utah", "iowa", "nevada",
      "arkansas", "mississippi", "kansas", "new mexico", "nebraska",
      "idaho", "west virginia", "hawaii", "new hampshire", "maine",
      "montana", "rhode island", "delaware", "south dakota",
      "north dakota", "alaska", "vermont", "wyoming", "district of columbia",
      "united states", "america", "usa",
    ],
    emailDomains: [".us"],
    phonePrefix: ["+1", "001", "1"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: /^\d{5}(-\d{4})?$/,
    zipExample: "90210",
  },
  germany: {
    country: "Germany",
    language: "German",
    currency: "EUR",
    currencySymbols: ["€", "eur", "euro", "euros"],
    companySuffix: ["gmbH", "gmbh", "ug", "kg", "ag", "e.k."],
    tlds: [".de"],
    addressPatterns: [
      "straße", "strasse", "str.", "gasse", "weg", "allee", "platz",
      "bayern", "nrw", "nordrhein", "baden-württemberg", "baden-wurttemberg",
      "niedersachsen", "hessen", "sachsen", "rheinland-pfalz",
      "thüringen", "thuringen", "brandenburg", "sachsen-anhalt",
      "schleswig-holstein", "mecklenburg", "saarland", "bremen", "hamburg",
      "berlin", "münchen", "munchen", "munich", "hamburg", "köln", "koln",
      "frankfurt", "stuttgart", "düsseldorf", "dusseldorf", "dortmund",
      "essen", "leipzig", "bremen", "dresden", "hannover", "nürnberg",
      "nurnberg", "duisburg", "bochum", "wuppertal", "bielefeld", "bonn",
      "münster", "munster", "karlsruhe", "mannheim", "augsburg", "wiesbaden",
      "kiel", "chemnitz", "halle", "magdeburg", "freiburg", "lübeck",
      "luebeck", "erfurt", "oberhausen", "rostock", "kassel",
      "deutschland", "germany",
    ],
    emailDomains: [".de"],
    phonePrefix: ["+49", "0049", "49"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: /^\d{5}$/,
    zipExample: "10115",
  },
  france: {
    country: "France",
    language: "French",
    currency: "EUR",
    currencySymbols: ["€", "eur", "euro", "euros"],
    companySuffix: ["sarl", "sas", "sa", "snc", "sci"],
    tlds: [".fr"],
    addressPatterns: [
      "rue", "avenue", "boulevard", "place", "impasse", "chemin",
      "île-de-france", "ile-de-france", "provence", "bretagne",
      "normandie", "occitanie", "nouvelle-aquitaine", "auvergne",
      "paris", "lyon", "marseille", "toulouse", "nice", "nantes",
      "strasbourg", "bordeaux", "lille", "rennes", "reims",
      "saint-étienne", "toulon", "le havre", "grenoble", "dijon",
      "angers", "nîmes", "clermont", "tours", "amiens", "limoges",
      "france",
    ],
    emailDomains: [".fr"],
    phonePrefix: ["+33", "0033", "33"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: /^\d{5}$/,
    zipExample: "75001",
  },
  norway: {
    country: "Norway",
    language: "Norwegian",
    currency: "NOK",
    currencySymbols: ["kr", "nok", "kr.", "norske kroner"],
    companySuffix: ["as", "ans", "da", "enk"],
    tlds: [".no"],
    addressPatterns: [
      "vei", "veien", "gate", "gaten", "plass", "vei", "allé",
      "oslo", "bergen", "trondheim", "stavanger", "drammen",
      "fredrikstad", "boras", "sandnes", "tromsø", "tromso",
      "sarpsborg", "skien", "ålesund", "alesund", "sandefjord",
      "haugesund", "tønsberg", "tonsberg", "moss", "hamar",
      "lillehammer", "norge", "norway",
    ],
    emailDomains: [".no"],
    phonePrefix: ["+47", "0047", "47"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: /^\d{4}$/,
    zipExample: "0123",
  },
  finland: {
    country: "Finland",
    language: "Finnish",
    currency: "EUR",
    currencySymbols: ["€", "eur", "euro", "euros"],
    companySuffix: ["oy", "oyj", "tmi", "asunto-osakeyhtiö"],
    tlds: [".fi"],
    addressPatterns: [
      "katu", "tie", "kuja", "polku", "tori",
      "helsinki", "espoo", "tampere", "vantaa", "oulu",
      "turku", "jyväskylä", "jyvaskyla", "lahti", "kuopio",
      "pori", "kajaani", "lohja", "hämeenlinna", "hameenlinna",
      "suomi", "finland",
    ],
    emailDomains: [".fi"],
    phonePrefix: ["+358", "00358", "358"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: /^\d{5}$/,
    zipExample: "00100",
  },
  italy: {
    country: "Italy",
    language: "Italian",
    currency: "EUR",
    currencySymbols: ["€", "eur", "euro", "euros"],
    companySuffix: ["s.r.l.", "s.p.a.", "snc", "sas"],
    tlds: [".it"],
    addressPatterns: [
      "via", "viale", "piazza", "corso", "largo", "vicolo",
      "roma", "milano", "napoli", "torino", "palermo",
      "genova", "bologna", "firenze", "catania", "venezia",
      "verona", "messina", "padova", "trieste", "bari",
      "italia", "italy",
    ],
    emailDomains: [".it"],
    phonePrefix: ["+39", "0039", "39"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: /^\d{5}$/,
    zipExample: "00100",
  },
  spain: {
    country: "Spain",
    language: "Spanish",
    currency: "EUR",
    currencySymbols: ["€", "eur", "euro", "euros"],
    companySuffix: ["s.l.", "s.a.", "sl", "sa"],
    tlds: [".es"],
    addressPatterns: [
      "calle", "avenida", "paseo", "plaza", "carrera", "ronda",
      "madrid", "barcelona", "sevilla", "valencia", "zaragoza",
      "málaga", "malaga", "murcia", "palma", "las palmas",
      "bilbao", "alicante", "córdoba", "cordoba", "valladolid",
      "vigo", "gijón", "gijon", "hospitalet", "granada",
      "españa", "spain",
    ],
    emailDomains: [".es"],
    phonePrefix: ["+34", "0034", "34"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: /^\d{5}$/,
    zipExample: "28001",
  },
  portugal: {
    country: "Portugal",
    language: "Portuguese",
    currency: "EUR",
    currencySymbols: ["€", "eur", "euro", "euros"],
    companySuffix: ["lda", "s.a.", "unipessoal"],
    tlds: [".pt"],
    addressPatterns: [
      "rua", "avenida", "largo", "praça", "praca", "travessa",
      "lisboa", "porto", "braga", "coimbra", "faro",
      "funchal", "setúbal", "setubal", "aveiro", "viseu",
      "portugal",
    ],
    emailDomains: [".pt"],
    phonePrefix: ["+351", "00351", "351"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: /^\d{4}-?\d{3}$/,
    zipExample: "1000-001",
  },
  czech: {
    country: "Czech Republic",
    language: "Czech",
    currency: "CZK",
    currencySymbols: ["kč", "czk", "koruna", "koruny"],
    companySuffix: ["s.r.o.", "a.s.", "v.o.s.", "k.s."],
    tlds: [".cz"],
    addressPatterns: [
      "ulice", "náměstí", "namesti", "třída", "trida",
      "praha", "brno", "ostrava", "plzeň", "plzen",
      "olomouc", "české budějovice", "ceske budejovice",
      "hradec králové", "hradec kralove", "ústí nad labem",
      "česko", "cesko", "czech republic",
    ],
    emailDomains: [".cz"],
    phonePrefix: ["+420", "00420", "420"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: /^\d{3}\s?\d{2}$/,
    zipExample: "110 00",
  },
  romania: {
    country: "Romania",
    language: "Romanian",
    currency: "RON",
    currencySymbols: ["ron", "lei", "leu"],
    companySuffix: ["s.r.l.", "s.a.", "pfa", "ii"],
    tlds: [".ro"],
    addressPatterns: [
      "strada", "str.", "bulevardul", "bd.", "calea",
      "bucurești", "bucuresti", "cluj", "timișoara", "timisoara",
      "iași", "iasi", "constanța", "constanta", "craiova",
      "brașov", "brasov", "galati", "ploiești", "ploiesti",
      "românia", "romania",
    ],
    emailDomains: [".ro"],
    phonePrefix: ["+40", "0040", "40"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: /^\d{6}$/,
    zipExample: "010001",
  },
  belgium: {
    country: "Belgium",
    language: "Dutch",
    currency: "EUR",
    currencySymbols: ["€", "eur", "euro", "euros"],
    companySuffix: ["bvba", "sprl", "nv", "sa", "scrl"],
    tlds: [".be"],
    addressPatterns: [
      "straat", "laan", "weg", "plein", "steeg",
      "brussel", "bruxelles", "antwerpen", "anvers",
      "gent", "ghent", "brugge", "bruges", "leuven",
      "liège", "liege", "namur", "namen", "mons",
      "belgië", "belgique", "belgium",
    ],
    emailDomains: [".be"],
    phonePrefix: ["+32", "0032", "32"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: /^\d{4}$/,
    zipExample: "1000",
  },
  ireland: {
    country: "Ireland",
    language: "English",
    currency: "EUR",
    currencySymbols: ["€", "eur", "euro", "euros"],
    companySuffix: ["ltd", "teo", "uc", "clg"],
    tlds: [".ie"],
    addressPatterns: [
      "dublin", "cork", "galway", "limerick", "waterford",
      "drogheda", "kilkenny", "sligo", "wexford", "carlow",
      "ireland", "éire",
    ],
    emailDomains: [".ie"],
    phonePrefix: ["+353", "00353", "353"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: null,
    zipExample: "",
  },
  canada: {
    country: "Canada",
    language: "English",
    currency: "CAD",
    currencySymbols: ["$", "cad", "canadian dollar", "dollars"],
    companySuffix: ["inc", "ltd", "corp", "co."],
    tlds: [".ca"],
    addressPatterns: [
      "toronto", "vancouver", "montreal", "montréal", "calgary",
      "ottawa", "edmonton", "mississauga", "winnipeg", "quebec",
      "victoria", "hamilton", "brampton", "surrey", "laval",
      "ontario", "quebec", "british columbia", "alberta", "manitoba",
      "saskatchewan", "nova scotia", "new brunswick",
      "canada",
    ],
    emailDomains: [".ca"],
    phonePrefix: ["+1", "001"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
    zipExample: "K1A 0B1",
  },
  australia: {
    country: "Australia",
    language: "English",
    currency: "AUD",
    currencySymbols: ["$", "aud", "australian dollar", "dollars"],
    companySuffix: ["pty ltd", "pty. ltd."],
    tlds: [".com.au", ".au"],
    addressPatterns: [
      "sydney", "melbourne", "brisbane", "perth", "adelaide",
      "gold coast", "canberra", "newcastle", "wollongong", "hobart",
      "queensland", "victoria", "new south wales", "western australia",
      "south australia", "tasmania",
      "australia",
    ],
    emailDomains: [".com.au", ".au"],
    phonePrefix: ["+61", "0061", "61"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    zipPattern: /^\d{4}$/,
    zipExample: "2000",
  },
};

// ─── Top Priority Countries ──────────────────────────────────────────
export const TOP_COUNTRIES = ["poland", "denmark", "sweden", "germany", "usa", "uk"];

// ─── Minimum Confidence Threshold ────────────────────────────────────
const MIN_CONFIDENCE = 0.7;

// ─── Fuzzy Match Helper ──────────────────────────────────────────────
/** Check if input partially matches any pattern (handles typos) */
function fuzzyMatch(input: string, patterns: string[]): number {
  const lower = input.toLowerCase().trim();
  let score = 0;

  for (const pattern of patterns) {
    const p = pattern.toLowerCase();
    // Exact match
    if (lower === p) { score += 3; continue; }
    // Contains match
    if (lower.includes(p) || p.includes(lower)) { score += 2; continue; }
    // Prefix match (at least 4 chars)
    if (p.length >= 4 && lower.length >= 4 && p.startsWith(lower.slice(0, 4))) { score += 1; continue; }
    // Levenshtein-like: if input is within 2 char edits of pattern
    if (lower.length >= 3 && p.length >= 3) {
      const maxLen = Math.max(lower.length, p.length);
      let matches = 0;
      for (let i = 0; i < Math.min(lower.length, p.length); i++) {
        if (lower[i] === p[i]) matches++;
      }
      if (matches / maxLen > 0.7) { score += 1; }
    }
  }
  return score;
}

// ─── Detection Functions ──────────────────────────────────────────────

/** Detect country from domain TLD */
export function detectFromDomain(domain: string): AutoFillResult | null {
  const clean = domain.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/^www\./, "");
  // Sort by TLD specificity (longer TLDs first, e.g. .co.uk before .uk)
  const allTlds: { key: string; tld: string; data: typeof COUNTRY_DB[string] }[] = [];
  for (const [key, data] of Object.entries(COUNTRY_DB)) {
    for (const tld of data.tlds) {
      allTlds.push({ key, tld, data });
    }
  }
  allTlds.sort((a, b) => b.tld.length - a.tld.length);

  for (const { tld, data } of allTlds) {
    if (clean.endsWith(tld) || clean.endsWith(tld + "/")) {
      return {
        country: data.country,
        language: data.language,
        currency: data.currency,
        hours: data.hours,
        confidence: 0.95,
        source: `domain TLD (${tld})`,
      };
    }
  }
  return null;
}

/** Detect country from email domain */
export function detectFromEmail(email: string): AutoFillResult | null {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  if (!domain) return null;

  // Skip generic TLDs
  const genericTlds = [".com", ".net", ".org", ".io", ".app", ".xyz", ".store", ".shop", ".online", ".site"];
  for (const g of genericTlds) {
    if (domain === g) return null;
    // Allow .com.au, .co.uk etc (country-specific under generic)
    if (domain.endsWith(g) && !domain.includes("." + g.slice(1))) return null;
  }

  for (const [key, data] of Object.entries(COUNTRY_DB)) {
    for (const ed of data.emailDomains) {
      if (domain.endsWith(ed)) {
        return {
          country: data.country,
          language: data.language,
          currency: data.currency,
          hours: data.hours,
          confidence: 0.9,
          source: `email domain (${ed})`,
        };
      }
    }
  }
  return null;
}

/** Detect country from address text (fuzzy matching) */
export function detectFromAddress(address: string): AutoFillResult | null {
  const lower = address.toLowerCase();
  let bestMatch: { key: string; score: number } | null = null;

  for (const [key, data] of Object.entries(COUNTRY_DB)) {
    let score = fuzzyMatch(lower, data.addressPatterns);
    // Bonus for zip code pattern match
    if (data.zipPattern && data.zipPattern.test(address.trim())) {
      score += 3;
    }
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { key, score };
    }
  }

  if (bestMatch && bestMatch.score >= 2) {
    const data = COUNTRY_DB[bestMatch.key];
    return {
      country: data.country,
      language: data.language,
      currency: data.currency,
      hours: data.hours,
      confidence: Math.min(0.5 + bestMatch.score * 0.1, 0.9),
      source: `address pattern (score: ${bestMatch.score})`,
    };
  }
  return null;
}

/** Detect country from phone prefix */
export function detectFromPhone(phone: string): AutoFillResult | null {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  for (const [key, data] of Object.entries(COUNTRY_DB)) {
    for (const prefix of data.phonePrefix) {
      if (cleaned.startsWith(prefix) || cleaned.startsWith("00" + prefix.slice(1))) {
        return {
          country: data.country,
          language: data.language,
          currency: data.currency,
          hours: data.hours,
          confidence: 0.92,
          source: `phone prefix (${prefix})`,
        };
      }
    }
  }
  return null;
}

/** Detect country from currency symbol/text */
export function detectFromCurrency(currency: string): AutoFillResult | null {
  const lower = currency.toLowerCase().trim();
  for (const [key, data] of Object.entries(COUNTRY_DB)) {
    for (const sym of data.currencySymbols) {
      if (lower === sym || lower.includes(sym)) {
        return {
          country: data.country,
          language: data.language,
          currency: data.currency,
          hours: data.hours,
          confidence: 0.88,
          source: `currency symbol (${sym})`,
        };
      }
    }
  }
  return null;
}

/** Detect country from company suffix */
export function detectFromCompany(company: string): AutoFillResult | null {
  const lower = company.toLowerCase().trim();
  for (const [key, data] of Object.entries(COUNTRY_DB)) {
    for (const suffix of data.companySuffix) {
      if (lower.endsWith(suffix) || lower.includes(suffix)) {
        return {
          country: data.country,
          language: data.language,
          currency: data.currency,
          hours: data.hours,
          confidence: 0.9,
          source: `company suffix (${suffix})`,
        };
      }
    }
  }
  return null;
}

/** Detect country from language name */
export function detectFromLanguage(language: string): AutoFillResult | null {
  const lower = language.toLowerCase().trim();
  for (const [key, data] of Object.entries(COUNTRY_DB)) {
    if (data.language.toLowerCase() === lower) {
      return {
        country: data.country,
        language: data.language,
        currency: data.currency,
        hours: data.hours,
        confidence: 0.85,
        source: `language name (${data.language})`,
      };
    }
  }
  return null;
}

/** Detect country from country name */
export function detectFromCountry(country: string): AutoFillResult | null {
  const lower = country.toLowerCase().trim();
  // Direct match
  if (COUNTRY_DB[lower]) {
    const data = COUNTRY_DB[lower];
    return {
      country: data.country,
      language: data.language,
      currency: data.currency,
      hours: data.hours,
      confidence: 1.0,
      source: `country name (${data.country})`,
    };
  }
  // Partial match
  for (const [key, data] of Object.entries(COUNTRY_DB)) {
    if (lower.includes(key) || key.includes(lower)) {
      return {
        country: data.country,
        language: data.language,
        currency: data.currency,
        hours: data.hours,
        confidence: 0.8,
        source: `country partial match (${data.country})`,
      };
    }
  }
  return null;
}

/** Suggest company suffix from country */
export function suggestCompanySuffix(country: string): string | null {
  const lower = country.toLowerCase().trim();
  for (const [key, data] of Object.entries(COUNTRY_DB)) {
    if (data.country.toLowerCase() === lower || key === lower) {
      return data.companySuffix[0] || null;
    }
  }
  return null;
}

/** Get all supported countries as options */
export function getSupportedCountries(): { key: string; country: string; language: string; currency: string }[] {
  return Object.entries(COUNTRY_DB).map(([key, data]) => ({
    key,
    country: data.country,
    language: data.language,
    currency: data.currency,
  }));
}

/**
 * Master auto-fill v3 — PRO
 *
 * MULTI-SIGNAL VOTING SYSTEM:
 *   Each detection method casts a "vote" for a country with a confidence score.
 *   The country with the most votes (weighted by confidence) wins.
 *
 * SIGNALS (in priority order):
 *   1. Domain TLD (0.95)
 *   2. Email domain (0.90)
 *   3. Phone prefix (0.92)
 *   4. Company suffix (0.90)
 *   5. Country name (1.00)
 *   6. Language name (0.85)
 *   7. Currency symbol (0.88)
 *   8. Address patterns (0.50–0.90, fuzzy)
 *
 * CONFLICT RESOLUTION:
 *   - If signals disagree, the highest-confidence signal wins
 *   - If confidence gap < 0.15, NO auto-fill (too uncertain)
 *   - Cross-validation: if winner has 2+ confirming signals, boost confidence
 */
export function autoFillStore(fields: {
  name?: string;
  logoText?: string;
  company?: string;
  address?: string;
  email?: string;
  domain?: string;
  country?: string;
  language?: string;
  currency?: string;
  hours?: string;
  phone?: string;
}): {
  filled: Partial<Record<string, string>>;
  suggestions: Partial<Record<string, string>>;
  sources: string[];
} {
  const filled: Partial<Record<string, string>> = {};
  const suggestions: Partial<Record<string, string>> = {};
  const sources: string[] = [];

  // Collect all detection signals
  const signals: AutoFillResult[] = [];

  if (fields.domain) {
    const r = detectFromDomain(fields.domain);
    if (r) signals.push(r);
  }
  if (fields.email) {
    const r = detectFromEmail(fields.email);
    if (r) signals.push(r);
  }
  if (fields.phone) {
    const r = detectFromPhone(fields.phone);
    if (r) signals.push(r);
  }
  if (fields.company) {
    const r = detectFromCompany(fields.company);
    if (r) signals.push(r);
  }
  if (fields.country) {
    const r = detectFromCountry(fields.country);
    if (r) signals.push(r);
  }
  if (fields.language) {
    const r = detectFromLanguage(fields.language);
    if (r) signals.push(r);
  }
  if (fields.currency) {
    const r = detectFromCurrency(fields.currency);
    if (r) signals.push(r);
  }
  if (fields.address) {
    const r = detectFromAddress(fields.address);
    if (r) signals.push(r);
  }

  // If no signals found, return empty
  if (signals.length === 0) {
    return { filled: {}, suggestions: {}, sources: [] };
  }

  // Group signals by country and sum confidence scores
  const countryScores: Record<string, { totalConfidence: number; signals: AutoFillResult[] }> = {};
  for (const sig of signals) {
    if (!sig.country) continue;
    const key = sig.country.toLowerCase();
    if (!countryScores[key]) {
      countryScores[key] = { totalConfidence: 0, signals: [] };
    }
    countryScores[key].totalConfidence += sig.confidence;
    countryScores[key].signals.push(sig);
  }

  // Find the winner (highest total confidence)
  let winnerKey = "";
  let winnerScore = 0;
  let runnerUpScore = 0;

  for (const [country, data] of Object.entries(countryScores)) {
    if (data.totalConfidence > winnerScore) {
      runnerUpScore = winnerScore;
      winnerScore = data.totalConfidence;
      winnerKey = country;
    } else if (data.totalConfidence > runnerUpScore) {
      runnerUpScore = data.totalConfidence;
    }
  }

  if (!winnerKey) {
    return { filled: {}, suggestions: {}, sources: [] };
  }

  // Conflict resolution: if top 2 are too close, don't auto-fill
  if (winnerScore - runnerUpScore < 0.15 && runnerUpScore > 0) {
    return { filled: {}, suggestions: {}, sources: [] };
  }

  const winnerData = countryScores[winnerKey];
  const winnerCountry = winnerData.signals[0].country!;
  const winnerLanguage = winnerData.signals[0].language!;
  const winnerCurrency = winnerData.signals[0].currency!;
  const winnerHours = winnerData.signals[0].hours!;

  // Cross-validation boost: if 2+ signals agree, boost confidence
  const hasCrossValidation = winnerData.signals.length >= 2;
  const avgConfidence = winnerData.totalConfidence / winnerData.signals.length;
  const finalConfidence = hasCrossValidation ? Math.min(avgConfidence + 0.1, 1.0) : avgConfidence;

  if (finalConfidence < MIN_CONFIDENCE) {
    return { filled: {}, suggestions: {}, sources: [] };
  }

  // Collect sources
  for (const sig of winnerData.signals) {
    sources.push(sig.source);
  }

  // Fill fields only if empty
  if (!fields.country) filled.country = winnerCountry;
  if (!fields.language) filled.language = winnerLanguage;
  if (!fields.currency) filled.currency = winnerCurrency;
  if (!fields.hours) filled.hours = winnerHours;

  // Company suffix suggestion
  if (winnerCountry && fields.name && !fields.company) {
    const suffix = suggestCompanySuffix(winnerCountry);
    if (suffix) {
      suggestions.company = `${fields.name} ${suffix}`;
      sources.push(`company suffix for ${winnerCountry}`);
    }
  }

  // Auto-set hours if country detected
  if (winnerCountry && !fields.hours) {
    const lower = winnerCountry.toLowerCase();
    for (const [key, data] of Object.entries(COUNTRY_DB)) {
      if (data.country.toLowerCase() === lower || key === lower) {
        filled.hours = data.hours;
        break;
      }
    }
  }

  const uniqueSources = [...new Set(sources)];
  return { filled, suggestions, sources: uniqueSources };
}

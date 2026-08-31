/**
 * Store Auto-Fill Engine
 * Detects country from partial inputs and auto-fills related fields.
 */

export interface AutoFillResult {
  country?: string;
  language?: string;
  currency?: string;
  company?: string;
  hours?: string;
  confidence: number; // 0–1
  source: string; // what triggered the detection
}

// ─── Country Database ────────────────────────────────────────────────
export const COUNTRY_DB: Record<
  string,
  {
    country: string;
    language: string;
    currency: string;
    companySuffix: string[];
    tlds: string[];
    addressPatterns: string[];
    emailDomains: string[];
    hours: string;
    phonePrefix: string;
    zipPattern: RegExp | null;
  }
> = {
  poland: {
    country: "Poland",
    language: "Polish",
    currency: "PLN",
    companySuffix: ["sp. z o.o.", "sp. z o.o. sp. k.", "S.A."],
    tlds: [".pl"],
    addressPatterns: ["ul.", "al.", "os.", "mazowieckie", "małopolskie", "śląskie", "wielkopolskie", "dolnośląskie", "polska"],
    emailDomains: [".pl"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+48",
    zipPattern: /^\d{2}-?\d{3}$/,
  },
  denmark: {
    country: "Denmark",
    language: "Danish",
    currency: "DKK",
    companySuffix: ["ApS", "A/S", "IVS"],
    tlds: [".dk"],
    addressPatterns: ["vej", "gade", "allé", "stræde", "plads", "københavn", "arhus", "odense", "danmark"],
    emailDomains: [".dk"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+45",
    zipPattern: /^\d{4}$/,
  },
  sweden: {
    country: "Sweden",
    language: "Swedish",
    currency: "SEK",
    companySuffix: ["AB", "HB"],
    tlds: [".se"],
    addressPatterns: ["gatan", "vägen", "gränd", "plan", "stockholm", "göteborg", "malmö", "sverige"],
    emailDomains: [".se"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+46",
    zipPattern: /^\d{3}\s?\d{2}$/,
  },
  netherlands: {
    country: "Netherlands",
    language: "Dutch",
    currency: "EUR",
    companySuffix: ["B.V.", "N.V."],
    tlds: [".nl"],
    addressPatterns: ["straat", "weg", "laan", "plein", "amsterdam", "rotterdam", "den haag", "utrecht", "nederland"],
    emailDomains: [".nl"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+31",
    zipPattern: /^\d{4}\s?[A-Z]{2}$/,
  },
  uk: {
    country: "UK",
    language: "English",
    currency: "GBP",
    companySuffix: ["Ltd", "Limited", "PLC"],
    tlds: [".co.uk", ".uk"],
    addressPatterns: ["london", "manchester", "birmingham", "liverpool", "leeds", "bristol", "united kingdom"],
    emailDomains: [".co.uk", ".uk"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+44",
    zipPattern: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
  },
  usa: {
    country: "USA",
    language: "English",
    currency: "USD",
    companySuffix: ["LLC", "Inc", "Corp"],
    tlds: [".com", ".us"],
    addressPatterns: ["street", "avenue", "boulevard", "drive", "lane", "new york", "los angeles", "chicago", "houston", "phoenix", "usa", "united states", "california", "texas", "florida"],
    emailDomains: [".com"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+1",
    zipPattern: /^\d{5}(-\d{4})?$/,
  },
  germany: {
    country: "Germany",
    language: "German",
    currency: "EUR",
    companySuffix: ["GmbH", "UG", "KG"],
    tlds: [".de"],
    addressPatterns: ["straße", "str.", "straße", "berlin", "münchen", "hamburg", "köln", "frankfurt", "deutschland"],
    emailDomains: [".de"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+49",
    zipPattern: /^\d{5}$/,
  },
  france: {
    country: "France",
    language: "French",
    currency: "EUR",
    companySuffix: ["SARL", "SAS", "SARL"],
    tlds: [".fr"],
    addressPatterns: ["rue", "avenue", "boulevard", "paris", "lyon", "marseille", "toulouse", "nice", "france"],
    emailDomains: [".fr"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+33",
    zipPattern: /^\d{5}$/,
  },
  norway: {
    country: "Norway",
    language: "Norwegian",
    currency: "NOK",
    companySuffix: ["AS", "ANS"],
    tlds: [".no"],
    addressPatterns: ["vei", "gate", "plass", "oslo", "bergen", "trondheim", "stavanger", "norge"],
    emailDomains: [".no"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+47",
    zipPattern: /^\d{4}$/,
  },
  finland: {
    country: "Finland",
    language: "Finnish",
    currency: "EUR",
    companySuffix: ["Oy", "Oyj"],
    tlds: [".fi"],
    addressPatterns: ["katu", "tie", "kuja", "helsinki", "espoo", "tampere", "suomi"],
    emailDomains: [".fi"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+358",
    zipPattern: /^\d{5}$/,
  },
  italy: {
    country: "Italy",
    language: "Italian",
    currency: "EUR",
    companySuffix: ["S.r.l.", "S.p.A."],
    tlds: [".it"],
    addressPatterns: ["via", "piazza", "corso", "roma", "milano", "napoli", "torino", "italia"],
    emailDomains: [".it"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+39",
    zipPattern: /^\d{5}$/,
  },
  spain: {
    country: "Spain",
    language: "Spanish",
    currency: "EUR",
    companySuffix: ["S.L.", "S.A."],
    tlds: [".es"],
    addressPatterns: ["calle", "avenida", "paseo", "madrid", "barcelona", "sevilla", "valencia", "españa"],
    emailDomains: [".es"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+34",
    zipPattern: /^\d{5}$/,
  },
  portugal: {
    country: "Portugal",
    language: "Portuguese",
    currency: "EUR",
    companySuffix: ["Lda", "S.A."],
    tlds: [".pt"],
    addressPatterns: ["rua", "avenida", "lisboa", "porto", "braga", "coimbra", "portugal"],
    emailDomains: [".pt"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+351",
    zipPattern: /^\d{4}-?\d{3}$/,
  },
  czech: {
    country: "Czech Republic",
    language: "Czech",
    currency: "CZK",
    companySuffix: ["s.r.o.", "a.s."],
    tlds: [".cz"],
    addressPatterns: ["ulice", "náměstí", "praha", "brno", "ostrava", "česko"],
    emailDomains: [".cz"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+420",
    zipPattern: /^\d{3}\s?\d{2}$/,
  },
  romania: {
    country: "Romania",
    language: "Romanian",
    currency: "RON",
    companySuffix: ["S.R.L.", "S.A."],
    tlds: [".ro"],
    addressPatterns: ["strada", "bucurești", "cluj", "timișoara", "românia"],
    emailDomains: [".ro"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+40",
    zipPattern: /^\d{6}$/,
  },
  belgium: {
    country: "Belgium",
    language: "Dutch",
    currency: "EUR",
    companySuffix: ["BVBA", "SPRL", "NV"],
    tlds: [".be"],
    addressPatterns: ["straat", "laan", "brussel", "antwerpen", "gent", "belgië"],
    emailDomains: [".be"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+32",
    zipPattern: /^\d{4}$/,
  },
  ireland: {
    country: "Ireland",
    language: "English",
    currency: "EUR",
    companySuffix: ["Ltd", "Teo", "UC"],
    tlds: [".ie"],
    addressPatterns: ["dublin", "cork", "galway", "limerick", "ireland"],
    emailDomains: [".ie"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+353",
    zipPattern: null,
  },
  canada: {
    country: "Canada",
    language: "English",
    currency: "CAD",
    companySuffix: ["Inc", "Ltd", "Corp"],
    tlds: [".ca"],
    addressPatterns: ["toronto", "vancouver", "montreal", "calgary", "ottawa", "canada", "ontario", "quebec"],
    emailDomains: [".ca"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+1",
    zipPattern: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
  },
  australia: {
    country: "Australia",
    language: "English",
    currency: "AUD",
    companySuffix: ["Pty Ltd"],
    tlds: [".com.au", ".au"],
    addressPatterns: ["sydney", "melbourne", "brisbane", "perth", "australia"],
    emailDomains: [".com.au", ".au"],
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
    phonePrefix: "+61",
    zipPattern: /^\d{4}$/,
  },
};

// ─── Detection Functions ──────────────────────────────────────────────

/** Detect country from domain TLD */
export function detectFromDomain(domain: string): AutoFillResult | null {
  const clean = domain.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/^www\./, "");
  for (const [key, data] of Object.entries(COUNTRY_DB)) {
    for (const tld of data.tlds) {
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
  }
  return null;
}

/** Detect country from email domain */
export function detectFromEmail(email: string): AutoFillResult | null {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  if (!domain) return null;

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

/** Detect country from address text */
export function detectFromAddress(address: string): AutoFillResult | null {
  const lower = address.toLowerCase();
  let bestMatch: { key: string; score: number } | null = null;

  for (const [key, data] of Object.entries(COUNTRY_DB)) {
    let score = 0;
    for (const pattern of data.addressPatterns) {
      if (lower.includes(pattern.toLowerCase())) {
        score++;
      }
    }
    // Bonus for zip code pattern
    if (data.zipPattern && data.zipPattern.test(address.trim())) {
      score += 2;
    }
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { key, score };
    }
  }

  if (bestMatch) {
    const data = COUNTRY_DB[bestMatch.key];
    return {
      country: data.country,
      language: data.language,
      currency: data.currency,
      hours: data.hours,
      confidence: Math.min(0.5 + bestMatch.score * 0.15, 0.9),
      source: `address pattern (score: ${bestMatch.score})`,
    };
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

/** Detect company suffix from country */
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
 * Master auto-fill: analyze all available fields and return best-guess completions.
 * Fields with higher confidence override lower.
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
}): {
  filled: Partial<Record<string, string>>;
  suggestions: Partial<Record<string, string>>;
  sources: string[];
} {
  const filled: Partial<Record<string, string>> = {};
  const suggestions: Partial<Record<string, string>> = {};
  const sources: string[] = [];
  const countryVotes: { country: string; confidence: number; source: string }[] = [];

  // 1. Domain detection
  if (fields.domain) {
    const result = detectFromDomain(fields.domain);
    if (result) {
      countryVotes.push({ country: result.country!, confidence: result.confidence, source: result.source });
      sources.push(result.source);
      if (!fields.country) filled.country = result.country;
      if (!fields.language) filled.language = result.language;
      if (!fields.currency) filled.currency = result.currency;
      if (!fields.hours) filled.hours = result.hours;
    }
  }

  // 2. Email detection
  if (fields.email) {
    const result = detectFromEmail(fields.email);
    if (result) {
      countryVotes.push({ country: result.country!, confidence: result.confidence, source: result.source });
      sources.push(result.source);
      if (!fields.country) filled.country = result.country;
      if (!fields.language) filled.language = result.language;
      if (!fields.currency) filled.currency = result.currency;
    }
  }

  // 3. Address detection
  if (fields.address) {
    const result = detectFromAddress(fields.address);
    if (result) {
      countryVotes.push({ country: result.country!, confidence: result.confidence, source: result.source });
      sources.push(result.source);
      if (!fields.country) filled.country = result.country;
      if (!fields.language) filled.language = result.language;
      if (!fields.currency) filled.currency = result.currency;
    }
  }

  // 4. Language detection
  if (fields.language) {
    const result = detectFromLanguage(fields.language);
    if (result) {
      countryVotes.push({ country: result.country!, confidence: result.confidence, source: result.source });
      sources.push(result.source);
      if (!fields.country) filled.country = result.country;
      if (!fields.currency) filled.currency = result.currency;
    }
  }

  // 5. Country detection (already set or manually entered)
  if (fields.country) {
    const result = detectFromCountry(fields.country);
    if (result) {
      countryVotes.push({ country: result.country!, confidence: result.confidence, source: result.source });
      sources.push(result.source);
      if (!fields.language) filled.language = result.language;
      if (!fields.currency) filled.currency = result.currency;
      if (!fields.hours) filled.hours = result.hours;
    }
  }

  // 6. Company suffix suggestion
  const finalCountry = filled.country || fields.country;
  if (finalCountry && fields.name && !fields.company) {
    const suffix = suggestCompanySuffix(finalCountry);
    if (suffix) {
      suggestions.company = `${fields.name} ${suffix}`;
      sources.push(`company suffix for ${finalCountry}`);
    }
  }

  // 7. Auto-set hours if country detected
  if (finalCountry && !fields.hours) {
    const lower = finalCountry.toLowerCase();
    for (const [key, data] of Object.entries(COUNTRY_DB)) {
      if (data.country.toLowerCase() === lower || key === lower) {
        filled.hours = data.hours;
        break;
      }
    }
  }

  // Deduplicate sources
  const uniqueSources = [...new Set(sources)];

  return { filled, suggestions, sources: uniqueSources };
}

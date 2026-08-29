export interface ParsedStoreResult {
  name: string;
  company: string;
  address: string;
  email: string;
  domain: string;
  country: string;
  language: string;
  currency: string;
  hours: string;
}

const COUNTRY_MAP: Record<string, { country: string; language: string; currency: string }> = {
  pl: { country: "Poland", language: "Polish", currency: "PLN" },
  poland: { country: "Poland", language: "Polish", currency: "PLN" },
  polska: { country: "Poland", language: "Polish", currency: "PLN" },
  dk: { country: "Denmark", language: "Danish", currency: "DKK" },
  denmark: { country: "Denmark", language: "Danish", currency: "DKK" },
  danmark: { country: "Denmark", language: "Danish", currency: "DKK" },
  se: { country: "Sweden", language: "Swedish", currency: "SEK" },
  sweden: { country: "Sweden", language: "Swedish", currency: "SEK" },
  no: { country: "Norway", language: "Norwegian", currency: "NOK" },
  norway: { country: "Norway", language: "Norwegian", currency: "NOK" },
  de: { country: "Germany", language: "German", currency: "EUR" },
  germany: { country: "Germany", language: "German", currency: "EUR" },
  nl: { country: "Netherlands", language: "Dutch", currency: "EUR" },
  us: { country: "United States", language: "English", currency: "USD" },
  usa: { country: "United States", language: "English", currency: "USD" },
  uk: { country: "United Kingdom", language: "English", currency: "GBP" },
};

export function parseStoreText(raw: string): ParsedStoreResult {
  const text = raw.trim();
  const res: ParsedStoreResult = {
    name: "",
    company: "",
    address: "",
    email: "",
    domain: "",
    country: "Poland",
    language: "Polish",
    currency: "PLN",
    hours: "Monday–Friday, 9:00 a.m.–5:00 p.m.",
  };

  if (!text) return res;

  // 1. Check if it's tab-separated (from Excel / Google Sheets copy paste)
  const tabTokens = text.split(/\t/).map((t) => t.trim()).filter(Boolean);
  if (tabTokens.length >= 3) {
    return parseTabTokens(tabTokens, res);
  }

  // 2. Otherwise parse from OCR/Freeform raw text line by line or space/delimiter separated
  // Normalize pipe/bar characters or newlines
  const tokens = text
    .split(/[\t|\n|]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (tokens.length >= 3) {
    return parseTabTokens(tokens, res);
  }

  // 3. Heuristic Regex fallback
  return parseHeuristic(text, res);
}

function parseTabTokens(tokens: string[], base: ParsedStoreResult): ParsedStoreResult {
  const res = { ...base };

  // Detect Country / Code in tokens
  for (const token of tokens) {
    const clean = token.toLowerCase().replace(/[^a-z]/g, "");
    if (COUNTRY_MAP[clean]) {
      res.country = COUNTRY_MAP[clean].country;
      res.language = COUNTRY_MAP[clean].language;
      res.currency = COUNTRY_MAP[clean].currency;
      break;
    }
  }

  // Detect Email
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  for (const token of tokens) {
    const m = token.match(emailRegex);
    if (m) {
      res.email = m[1];
      break;
    }
  }

  // Detect Domain
  const domainRegex = /\b([a-zA-Z0-9-]+\.(?:com|pl|dk|se|no|de|nl|store|shop|co|eu|org|net|io))\b/i;
  for (const token of tokens) {
    if (!token.includes("@")) {
      const m = token.match(domainRegex);
      if (m) {
        res.domain = m[1].toLowerCase();
        break;
      }
    }
  }

  // Detect Address (looks for "ul.", street, postal code \d{2}-\d{3}, or numbers + city)
  for (const token of tokens) {
    if (
      token.toLowerCase().includes("ul.") ||
      token.toLowerCase().includes("polska") ||
      token.toLowerCase().includes("poland") ||
      /\d{2}-\d{3}/.test(token) ||
      /\d{4,5}\s+[a-zA-Z]/.test(token)
    ) {
      res.address = token;
      break;
    }
  }

  // Detect Company Name (contains sp. z o.o., ApS, A/S, GmbH, LLC, Ltd, Inc, etc.)
  for (const token of tokens) {
    if (
      /sp\.?\s*z\s*o\.?\s*o\.?/i.test(token) ||
      /\b(aps|a\/s|gmbh|llc|ltd|inc|ab)\b/i.test(token)
    ) {
      res.company = token;
      break;
    }
  }

  // Detect Store Name
  // Look for remaining clean non-email, non-domain, non-country, non-address tokens
  for (const token of tokens) {
    const cleanLower = token.toLowerCase().replace(/[^a-z]/g, "");
    if (
      token !== res.email &&
      token !== res.domain &&
      token !== res.address &&
      token !== res.company &&
      !COUNTRY_MAP[cleanLower] &&
      token.length > 1 &&
      token.length < 35
    ) {
      res.name = token;
      break;
    }
  }

  // Fallbacks if missing
  if (!res.name && res.domain) {
    res.name = res.domain.split(".")[0];
    res.name = res.name.charAt(0).toUpperCase() + res.name.slice(1);
  }

  if (!res.company && res.name) {
    if (res.country === "Poland") res.company = `${res.name} sp. z o.o.`;
    else if (res.country === "Denmark") res.company = `${res.name} ApS`;
    else res.company = `${res.name} Ltd.`;
  }

  return res;
}

function parseHeuristic(text: string, base: ParsedStoreResult): ParsedStoreResult {
  const res = { ...base };

  // Email
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  if (emailMatch) res.email = emailMatch[1];

  // Domain
  const domainMatch = text.match(/(?:https?:\/\/)?([a-zA-Z0-9-]+\.(?:com|pl|dk|se|no|de|nl|store|shop|co|eu|org|net|io))/i);
  if (domainMatch && !domainMatch[0].includes("@")) res.domain = domainMatch[1].toLowerCase();

  // Country
  for (const [key, val] of Object.entries(COUNTRY_MAP)) {
    const regex = new RegExp(`\\b${key}\\b`, "i");
    if (regex.test(text)) {
      res.country = val.country;
      res.language = val.language;
      res.currency = val.currency;
      break;
    }
  }

  // Company
  const compMatch = text.match(/([A-Z][a-zA-Z0-9\s-]+\s+(?:sp\.?\s*z\s*o\.?\s*o\.?|ApS|A\/S|GmbH|LLC|Ltd|Inc))/i);
  if (compMatch) res.company = compMatch[1].trim();

  // Address
  const addrMatch = text.match(/(ul\.\s+[^,\n]+,\s*\d{2}-\d{3}\s+[^,\n]+(?:,\s*Polska|,?\s*Poland)?)/i);
  if (addrMatch) res.address = addrMatch[1].trim();

  // Store Name
  if (res.domain) {
    res.name = res.domain.split(".")[0];
    res.name = res.name.charAt(0).toUpperCase() + res.name.slice(1);
  }

  return res;
}

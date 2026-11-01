// Inhoudscontrole voor reviews. Geeft redenen terug; bij één of meer redenen
// komt de review in de wachtrij in plaats van direct online.

const LINK_RE = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|nl|net|org|io|ru|xyz|top|info|biz|shop|click|link|app|be|de)\b|@[a-z0-9-]+\.[a-z]{2,})/i;
const PHONE_RE = /(\+?\d[\d\s-]{8,}\d)/;
const HTML_RE = /<[^>]+>|\[url|\[\/url/i;

// Bewust een korte lijst: spamtermen en grof taalgebruik (NL/EN).
const BLOCKED_TERMS = [
  "casino", "viagra", "cialis", "crypto", "bitcoin", "forex", "loan", "lening snel", "porn", "porno",
  "xxx", "escort", "seo service", "backlink", "whatsapp me", "telegram", "betting", "gokken",
  "kanker", "tering", "tyfus", "hoer", "kut", "fuck", "shit", "bitch", "nazi", "idioot",
];

export function normalize(text: string) {
  return text.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

export function spamReasons(input: { name: string; company: string | null; body: string; elapsedMs: number }) {
  const reasons: string[] = [];
  const all = `${input.name} ${input.company ?? ""} ${input.body}`;
  const lower = all.toLowerCase();

  if (LINK_RE.test(all)) reasons.push("bevat-link-of-e-mail");
  if (PHONE_RE.test(input.body)) reasons.push("bevat-telefoonnummer");
  if (HTML_RE.test(all)) reasons.push("bevat-html");
  if (BLOCKED_TERMS.some((t) => new RegExp(`\\b${t}\\b`, "i").test(lower))) reasons.push("ongewenste-woorden");

  const letters = input.body.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (letters.length > 20 && letters.replace(/[^A-ZÀ-Þ]/g, "").length / letters.length > 0.6) reasons.push("veel-hoofdletters");
  if (/(.)\1{6,}/.test(input.body)) reasons.push("herhaalde-tekens");
  if (new Set(normalize(input.body).split(" ")).size < 3) reasons.push("weinig-inhoud");
  if (input.elapsedMs < 4000) reasons.push("te-snel-ingevuld");

  return reasons;
}

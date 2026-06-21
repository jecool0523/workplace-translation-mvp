import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data", "workplace-translation-mvp");
const pack = JSON.parse(readFileSync(join(dataDir, "site_slang_translation_pack.json"), "utf8"));

const headers = [
  "id",
  "canonical_ko",
  "variants_ko",
  "domain",
  "risk_level",
  "plain_ko",
  "translate_as_ko",
  "vi",
  "th",
  "id_translation",
  "ne",
  "km",
  "asr_corrections",
  "translation_rule",
  "confidence",
  "needs_field_review"
];

const csvEscape = (value) => {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const rows = pack.terms.map((term) => ({
  id: term.id,
  canonical_ko: term.canonical_ko,
  variants_ko: term.variants_ko,
  domain: term.domain,
  risk_level: term.risk_level,
  plain_ko: term.plain_ko,
  translate_as_ko: term.translate_as_ko,
  vi: term.translations.vi,
  th: term.translations.th,
  id_translation: term.translations.id,
  ne: term.translations.ne,
  km: term.translations.km,
  asr_corrections: term.asr_corrections,
  translation_rule: term.translation_rule,
  confidence: term.confidence,
  needs_field_review: term.needs_field_review
}));

const csv = [
  headers.join(","),
  ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
].join("\n");

writeFileSync(join(dataDir, "site_slang_translation_pack.csv"), `${csv}\n`, "utf8");
console.log(`Wrote ${rows.length} slang terms`);

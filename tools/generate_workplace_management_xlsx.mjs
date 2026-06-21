import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = process.cwd();
const dataRoot = `${root}/data/workplace-translation-mvp`;
const outputDir = `${root}/outputs/workplace-translation-mvp`;
const previewDir = `${outputDir}/previews`;
const outputPath = `${outputDir}/workplace_translation_management.xlsx`;

const readJson = async (path) => JSON.parse(await fs.readFile(path, "utf8"));

const vi = await readJson(`${dataRoot}/vi-priority/vietnamese_priority_dataset.json`);
const seed = await readJson(`${dataRoot}/workplace_translation_seed.json`);
const manufacturing = await readJson(`${dataRoot}/manufacturing_translation_pack.json`);
const slang = await readJson(`${dataRoot}/extended_site_slang_translation_pack.json`);

const workbook = Workbook.create();
workbook.comments.setSelf({ displayName: "User" });
await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const color = {
  navy: "#1F4E79",
  blue: "#D9EAF7",
  pale: "#F7FAFC",
  green: "#E2F0D9",
  yellow: "#FFF2CC",
  red: "#FCE4D6",
  gray: "#E7E6E6",
  border: "#D9E2EC",
  text: "#1F2933",
};

const colName = (index) => {
  let n = index + 1;
  let name = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    name = String.fromCharCode(65 + r) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
};

const rangeAddress = (rows, cols) => `A1:${colName(cols - 1)}${rows}`;

const stringify = (value) => {
  if (value == null) return "";
  if (Array.isArray(value)) return value.join(" | ");
  if (typeof value === "object") return JSON.stringify(value);
  return value;
};

const writeSheet = (name, headers, rows, options = {}) => {
  const sheet = workbook.worksheets.add(name);
  sheet.showGridLines = false;
  const matrix = [headers, ...rows.map((row) => headers.map((header) => stringify(row[header])))];
  sheet.getRangeByIndexes(0, 0, matrix.length, headers.length).values = matrix;
  const used = sheet.getRange(rangeAddress(matrix.length, headers.length));
  used.format = {
    font: { color: color.text },
    wrapText: true,
    verticalAlignment: "top",
  };
  sheet.getRangeByIndexes(0, 0, 1, headers.length).format = {
    fill: color.navy,
    font: { bold: true, color: "#FFFFFF" },
    horizontalAlignment: "center",
    verticalAlignment: "middle",
    wrapText: true,
  };
  sheet.getRangeByIndexes(0, 0, matrix.length, headers.length).format.borders = {
    preset: "all",
    style: "thin",
    color: color.border,
  };
  sheet.freezePanes.freezeRows(1);
  if (matrix.length > 1) {
    const table = sheet.tables.add(rangeAddress(matrix.length, headers.length), true, `${name.replace(/[^A-Za-z0-9]/g, "")}Table`);
    table.style = "TableStyleMedium2";
    table.showFilterButton = true;
  }
  const widths = options.widths ?? {};
  headers.forEach((header, index) => {
    const width = widths[header] ?? (["ko", "vi", "plain_ko", "normalized_ko", "translation_rule", "notes", "source_note"].includes(header) ? 210 : 120);
    sheet.getRangeByIndexes(0, index, 1, 1).format.columnWidthPx = width;
  });
  sheet.getRangeByIndexes(0, 0, matrix.length, headers.length).format.autofitRows();
  return sheet;
};

const summary = workbook.worksheets.add("Summary");
summary.showGridLines = false;
summary.getRange("A1:H1").merge();
summary.getRange("A1").values = [["Workplace Translation Management Workbook"]];
summary.getRange("A1").format = {
  fill: color.navy,
  font: { bold: true, color: "#FFFFFF", size: 16 },
  horizontalAlignment: "center",
};
summary.getRange("A3:D9").values = [
  ["Section", "Count", "Target Range", "Status"],
  ["VI core terms", vi.counts.core_terms, "300-1,000", "Ready for native/field review"],
  ["VI common sentences", vi.counts.common_sentences, "300-1,000", "Ready for native/field review"],
  ["VI emergency sentences", vi.counts.emergency_sentences, "100-300", "Ready for safety review"],
  ["VI slang variants", vi.counts.slang_variants, "100-500", "Ready for field review"],
  ["VI test utterances", vi.counts.test_utterances, "500-2,000", "Ready for STT/translation tests"],
  ["General seed terms", seed.counts.terms, "300", "UTF-8 source retained"],
];
summary.getRange("A3:D3").format = { fill: color.navy, font: { bold: true, color: "#FFFFFF" } };
summary.getRange("A3:D9").format.borders = { preset: "all", style: "thin", color: color.border };
summary.getRange("A11:H11").merge();
summary.getRange("A11").values = [["관리 원칙"]];
summary.getRange("A12:H17").values = [
  ["1. 앱/서버 원본은 UTF-8 JSON/CSV를 유지합니다."],
  ["2. 검수와 편집은 이 XLSX 파일에서 진행합니다."],
  ["3. status가 seed_needs_native_field_review인 항목은 베트남어 네이티브 및 현장 담당자 검수 대상입니다."],
  ["4. 긴급/위험 문장은 의미 보존이 우선이며, 자연스러운 의역보다 안전 지시의 명확성을 우선합니다."],
  ["5. 은어는 발음을 그대로 음차하지 않고 표준 의미로 정규화한 뒤 번역합니다."],
  ["6. 변경사항을 앱 데이터로 반영할 때는 JSON/CSV 재생성 스크립트 또는 별도 import 스크립트를 사용합니다."],
];
summary.getRange("A11").format = { fill: color.blue, font: { bold: true } };
summary.getRange("A12:H17").merge(true);
summary.getRange("A12:H17").format = { wrapText: true, verticalAlignment: "top" };
summary.getRange("A:A").format.columnWidthPx = 230;
summary.getRange("B:D").format.columnWidthPx = 160;

writeSheet(
  "Sources",
  ["title", "url", "note"],
  [...vi.sources, ...seed.sources, ...slang.sources].map((source) => ({
    title: source.title,
    url: source.url,
    note: source.note,
  })),
  { widths: { title: 240, url: 360, note: 520 } },
);

writeSheet(
  "VI_Terms",
  ["id", "domain", "priority", "ko", "vi", "plain_ko", "risk_level", "type", "status"],
  vi.terms,
  { widths: { id: 80, domain: 170, priority: 90, ko: 180, vi: 220, plain_ko: 300, status: 220 } },
);

writeSheet(
  "VI_Sentences",
  ["id", "domain", "risk_level", "ko", "vi", "normalized_ko", "term_refs", "status"],
  vi.common_sentences,
  { widths: { id: 80, domain: 170, ko: 340, vi: 360, normalized_ko: 340, status: 220 } },
);

writeSheet(
  "VI_Emergency",
  ["id", "domain", "risk_level", "ko", "vi", "output_channels", "repeat_recommended", "status"],
  vi.emergency_sentences,
  { widths: { id: 80, ko: 330, vi: 360, status: 220 } },
);

writeSheet(
  "VI_Slang",
  ["id", "canonical_ko", "vi", "variants_ko", "asr_likely_misrecognitions", "normalized_translation_rule", "status"],
  vi.slang_variants,
  { widths: { id: 80, canonical_ko: 160, vi: 260, variants_ko: 360, asr_likely_misrecognitions: 360, normalized_translation_rule: 420, status: 220 } },
);

writeSheet(
  "VI_Test",
  ["id", "source", "ko", "vi", "expected_normalized_ko", "direction", "tags", "status"],
  vi.test_utterances,
  { widths: { id: 80, source: 150, ko: 340, vi: 360, expected_normalized_ko: 340, direction: 160, tags: 210, status: 220 } },
);

writeSheet(
  "MFG_Terms",
  ["id", "domain", "risk_level", "ko", "plain_ko", "aliases", "vi", "th", "id_translation", "ne", "km", "manufacturing_context", "translation_status"],
  manufacturing.terms.map((term) => ({
    id: term.id,
    domain: term.domain,
    risk_level: term.risk_level,
    ko: term.ko,
    plain_ko: term.plain_ko,
    aliases: term.aliases,
    vi: term.translations.vi,
    th: term.translations.th,
    id_translation: term.translations.id,
    ne: term.translations.ne,
    km: term.translations.km,
    manufacturing_context: term.manufacturing_context,
    translation_status: term.translation_status,
  })),
  { widths: { ko: 150, plain_ko: 300, vi: 220, th: 220, id_translation: 220, ne: 220, km: 220, manufacturing_context: 420, translation_status: 220 } },
);

writeSheet(
  "Slang_Terms",
  ["id", "canonical_ko", "variants_ko", "domain", "risk_level", "plain_ko", "translate_as_ko", "vi", "th", "id_translation", "ne", "km", "asr_corrections", "translation_rule", "confidence", "needs_field_review"],
  slang.terms.map((term) => ({
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
    needs_field_review: term.needs_field_review,
  })),
  { widths: { canonical_ko: 150, variants_ko: 280, plain_ko: 330, translate_as_ko: 220, vi: 240, translation_rule: 440, asr_corrections: 280 } },
);

writeSheet(
  "Slang_Scenarios",
  ["id", "domain", "risk_level", "slang_sentence_ko", "normalized_ko", "term_refs", "translation_note", "output_channels", "status"],
  slang.scenarios,
  { widths: { slang_sentence_ko: 340, normalized_ko: 360, translation_note: 420, status: 220 } },
);

const errorScan = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "formula error scan",
  maxChars: 2000,
});
console.log(errorScan.ndjson);

for (const sheetName of ["Summary", "Sources", "VI_Terms", "VI_Sentences", "VI_Emergency", "VI_Slang", "VI_Test", "MFG_Terms", "Slang_Terms", "Slang_Scenarios"]) {
  const preview = await workbook.render({
    sheetName,
    range: "A1:H25",
    scale: 1,
    format: "png",
  });
  await fs.writeFile(`${previewDir}/${sheetName}.png`, new Uint8Array(await preview.arrayBuffer()));
}

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);
await fs.rm(`${outputPath}.inspect.ndjson`, { force: true });
console.log(outputPath);

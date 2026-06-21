import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data", "workplace-translation-mvp");
mkdirSync(dataDir, { recursive: true });

const seed = JSON.parse(readFileSync(join(dataDir, "workplace_translation_seed.json"), "utf8"));
const manufacturingCoreDomains = new Set(["machine", "welding", "quality"]);
const manufacturingRelatedDomains = new Set(["machine", "welding", "quality", "safety", "ppe", "electrical"]);

const translations = {
  프레스: ["máy dập", "เครื่องปั๊ม", "mesin press", "प्रेस मेसिन", "ម៉ាស៊ីនបុក/ចុច"],
  사출기: ["máy ép nhựa", "เครื่องฉีดพลาสติก", "mesin injeksi plastik", "प्लास्टिक इन्जेक्सन मेसिन", "ម៉ាស៊ីនចាក់ប្លាស្ទិក"],
  컨베이어: ["băng tải", "สายพานลำเลียง", "konveyor", "कन्वेयर बेल्ट", "ខ្សែបញ្ជូន"],
  롤러: ["con lăn", "ลูกกลิ้ง", "rol", "रोलर", "រ៉ូឡូ"],
  절단기: ["máy cắt", "เครื่องตัด", "mesin pemotong", "काट्ने मेसिन", "ម៉ាស៊ីនកាត់"],
  파쇄기: ["máy nghiền", "เครื่องบด/เครื่องย่อย", "mesin penghancur", "क्रसर मेसिन", "ម៉ាស៊ីនកម្ទេច"],
  압축기: ["máy ép nén", "เครื่องอัด", "mesin kompresi", "कम्प्रेस गर्ने मेसिन", "ម៉ាស៊ីនបង្ហាប់"],
  혼합기: ["máy trộn", "เครื่องผสม", "mesin pencampur", "मिक्सर मेसिन", "ម៉ាស៊ីនលាយ"],
  포장기: ["máy đóng gói", "เครื่องบรรจุภัณฑ์", "mesin pengemas", "प्याकिङ मेसिन", "ម៉ាស៊ីនវេចខ្ចប់"],
  선반: ["máy tiện", "เครื่องกลึง", "mesin bubut", "लेथ मेसिन", "ម៉ាស៊ីនក្រឡឹង"],
  밀링기: ["máy phay", "เครื่องกัด", "mesin frais", "मिलिङ मेसिन", "ម៉ាស៊ីនកាត់មីលីង"],
  드릴: ["máy khoan", "สว่าน", "bor", "ड्रिल", "ម៉ាស៊ីនខួង"],
  그라인더: ["máy mài", "เครื่องเจียร", "gerinda", "ग्राइन्डर", "ម៉ាស៊ីនកិន"],
  톱날: ["lưỡi cưa", "ใบเลื่อย", "mata gergaji", "आरा ब्लेड", "ផ្លែកាំបិតរណារ"],
  칼날: ["lưỡi dao", "ใบมีด", "mata pisau", "ब्लेड", "ផ្លែកាំបិត"],
  회전체: ["bộ phận quay", "ชิ้นส่วนหมุน", "bagian berputar", "घुम्ने भाग", "ផ្នែកបង្វិល"],
  동력전달부: ["bộ phận truyền động", "ส่วนส่งกำลัง", "bagian transmisi daya", "शक्ति प्रसारण भाग", "ផ្នែកបញ្ជូនកម្លាំង"],
  끼임점: ["điểm kẹp", "จุดหนีบ", "titik jepit", "च्यापिने बिन्दु", "ចំណុចគៀប"],
  방호덮개: ["nắp che bảo vệ", "ฝาครอบนิรภัย", "penutup pelindung", "सुरक्षा कभर", "គម្របការពារ"],
  인터록: ["khóa liên động an toàn", "ระบบอินเตอร์ล็อก", "interlock keselamatan", "सेफ्टी इन्टरलक", "ប្រព័ន្ធអ៊ីនធឺឡក់សុវត្ថិភាព"],
  센서: ["cảm biến", "เซนเซอร์", "sensor", "सेन्सर", "ឧបករណ៍ចាប់សញ្ញា"],
  비상정지버튼: ["nút dừng khẩn cấp", "ปุ่มหยุดฉุกเฉิน", "tombol berhenti darurat", "आपतकालीन रोक्ने बटन", "ប៊ូតុងបញ្ឈប់បន្ទាន់"],
  지그: ["đồ gá", "จิ๊กจับงาน", "jig", "जिग", "ជីក/ឧបករណ៍ចាប់តម្រង់"],
  금형: ["khuôn", "แม่พิมพ์", "cetakan", "मोल्ड", "ពុម្ព"],
  공압: ["khí nén", "ระบบลม", "pneumatik", "न्युम्याटिक", "ប្រព័ន្ធខ្យល់បង្ហាប់"],
  유압: ["thủy lực", "ระบบไฮดรอลิก", "hidrolik", "हाइड्रोलिक", "ប្រព័ន្ធហាយដ្រូលិក"],
  에어건: ["súng hơi", "ปืนลม", "air gun", "एयर गन", "កាំភ្លើងខ្យល់"],
  콤프레서: ["máy nén khí", "เครื่องอัดอากาศ", "kompresor", "कम्प्रेसर", "ម៉ាស៊ីនបង្ហាប់ខ្យល់"],
  작업대: ["bàn làm việc", "โต๊ะทำงาน", "meja kerja", "वर्कबेन्च", "តុធ្វើការ"],
  공구함: ["hộp dụng cụ", "กล่องเครื่องมือ", "kotak alat", "औजार बाकस", "ប្រអប់ឧបករណ៍"],
  용접: ["hàn", "การเชื่อม", "pengelasan", "वेल्डिङ", "ផ្សារដែក"],
  용접봉: ["que hàn", "ลวดเชื่อม", "elektroda las", "वेल्डिङ रड", "ដំបងផ្សារ"],
  용접불꽃: ["tia lửa hàn", "สะเก็ดไฟเชื่อม", "percikan las", "वेल्डिङको झिल्का", "ផ្កាភ្លើងផ្សារ"],
  불티: ["tia lửa", "สะเก็ดไฟ", "percikan api", "आगोको झिल्का", "ផ្កាភ្លើង"],
  가연물: ["vật dễ cháy", "วัสดุไวไฟ", "bahan mudah terbakar", "ज्वलनशील वस्तु", "វត្ថុងាយឆេះ"],
  인화성물질: ["chất dễ bắt lửa", "สารไวไฟ", "bahan mudah menyala", "छिटो आगो लाग्ने पदार्थ", "សារធាតុងាយឆេះ"],
  산소통: ["bình oxy", "ถังออกซิเจน", "tabung oksigen", "अक्सिजन सिलिन्डर", "ធុងអុកស៊ីសែន"],
  가스통: ["bình gas", "ถังแก๊ส", "tabung gas", "ग्यास सिलिन्डर", "ធុងហ្គាស"],
  역화방지기: ["van chống cháy ngược", "อุปกรณ์กันไฟย้อนกลับ", "alat pencegah api balik", "ब्याकफायर रोक्ने उपकरण", "ឧបករណ៍ការពារភ្លើងត្រឡប់"],
  환기: ["thông gió", "การระบายอากาศ", "ventilasi", "हावा आवतजावत", "ការបញ្ចេញខ្យល់"],
  불량: ["hàng lỗi", "ของเสีย/ชิ้นงานเสีย", "barang cacat", "खराब सामान", "ទំនិញខូច"],
  양품: ["hàng đạt chuẩn", "ของดี/ชิ้นงานผ่าน", "barang baik", "राम्रो सामान", "ទំនិញល្អ"],
  찍힘: ["vết lõm", "รอยบุบ", "penyok", "थिचिएको दाग", "ស្នាមបុក/ខូចខាត"],
  긁힘: ["vết xước", "รอยขีดข่วน", "goresan", "कोरिएको दाग", "ស្នាមឆ្កូត"],
  깨짐: ["bị vỡ", "แตก", "pecah", "फुटेको", "បែក"],
  누락: ["thiếu", "ขาด/ตกหล่น", "terlewat/hilang", "छुटेको", "ខ្វះ/បាត់"],
  오염: ["bị bẩn/nhiễm bẩn", "ปนเปื้อน", "terkontaminasi", "दूषित", "កខ្វក់"],
  변색: ["đổi màu", "สีเปลี่ยน", "perubahan warna", "रङ फेरिएको", "ប្រែពណ៌"],
  수량부족: ["thiếu số lượng", "จำนวนไม่พอ", "jumlah kurang", "संख्या कम", "ចំនួនខ្វះ"],
  재작업: ["làm lại", "ทำซ้ำ/แก้งาน", "kerja ulang", "फेरि काम गर्नु", "ធ្វើឡើងវិញ"],
  폐기: ["loại bỏ", "ทิ้ง/คัดทิ้ง", "buang", "फाल्नु", "បោះចោល"],
  샘플: ["mẫu", "ตัวอย่าง", "sampel", "नमूना", "គំរូ"],
  검사: ["kiểm tra", "ตรวจสอบ", "inspeksi", "जाँच", "ពិនិត្យ"],
  포장방향: ["hướng đóng gói", "ทิศทางการบรรจุ", "arah pengemasan", "प्याकिङ दिशा", "ទិសដៅវេចខ្ចប់"],
  로트번호: ["số lô", "หมายเลขล็อต", "nomor lot", "लट नम्बर", "លេខឡូត៍"]
};

const [vi, th, id, ne, km] = ["vi", "th", "id", "ne", "km"];

const guidanceByDomain = {
  machine: "Translate as manufacturing equipment or machine-part terminology. Prefer literal safety-critical wording over casual wording.",
  welding: "Translate in welding, cutting, fire-prevention context. Preserve fire/explosion hazard wording.",
  quality: "Translate in product inspection and defect-sorting context. Avoid translating as moral quality or personal evaluation."
};

const coreTerms = seed.terms
  .filter((term) => manufacturingCoreDomains.has(term.domain))
  .map((term) => {
    const row = translations[term.ko] ?? ["", "", "", "", ""];
    return {
      ...term,
      industry_tags: ["manufacturing"],
      manufacturing_context: guidanceByDomain[term.domain],
      translations: { [vi]: row[0], [th]: row[1], [id]: row[2], [ne]: row[3], [km]: row[4] },
      translation_status: "machine_seeded_needs_native_review"
    };
  });

const relatedTerms = seed.terms.filter((term) => manufacturingRelatedDomains.has(term.domain));

const pack = {
  name: "manufacturing_translation_pack",
  version: "0.1.0",
  generated_at: new Date().toISOString(),
  counts: {
    manufacturing_exact_domain: seed.terms.filter((term) => term.domain === "manufacturing").length,
    manufacturing_core_terms: coreTerms.length,
    manufacturing_related_terms: relatedTerms.length
  },
  definition: {
    manufacturing_core_domains: [...manufacturingCoreDomains],
    manufacturing_related_domains: [...manufacturingRelatedDomains],
    note: "The original seed does not use a standalone manufacturing domain. Manufacturing is represented by machine, welding, and quality terms; safety, PPE, and electrical terms are related support vocabulary."
  },
  terms: coreTerms
};

const csvEscape = (value) => {
  const text = Array.isArray(value) ? value.join("|") : String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const headers = [
  "id", "domain", "risk_level", "ko", "plain_ko", "aliases",
  "vi", "th", "id_translation", "ne", "km",
  "manufacturing_context", "translation_status"
];

const rows = coreTerms.map((term) => ({
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
  translation_status: term.translation_status
}));

const csv = [
  headers.join(","),
  ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
].join("\n");

writeFileSync(join(dataDir, "manufacturing_translation_pack.json"), `${JSON.stringify(pack, null, 2)}\n`, "utf8");
writeFileSync(join(dataDir, "manufacturing_terms_core_55_translated.csv"), `${csv}\n`, "utf8");

console.log(JSON.stringify(pack.counts, null, 2));

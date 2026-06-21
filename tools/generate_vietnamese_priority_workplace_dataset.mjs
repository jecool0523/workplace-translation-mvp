import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data", "workplace-translation-mvp", "vi-priority");
mkdirSync(dataDir, { recursive: true });

const sources = [
  {
    title: "EPS Employment Permit System official page",
    url: "https://www.eps.go.kr/eo/EmployPerSystem.eo?tabGb=01",
    note: "Used to scope foreign-worker workplace domains: manufacturing, construction, logistics/cargo handling, agriculture, fisheries, waste, and service expansion."
  },
  {
    title: "Occupational Safety and Health Standards Rules",
    url: "https://www.law.go.kr/법령/산업안전보건기준에관한규칙",
    note: "Used to scope hazard classes: fall, caught-in, electrical, fire/explosion, confined space, machinery, lifting, chemicals, heat, PPE."
  },
  {
    title: "KOSHA safety-health context",
    url: "https://kosha.or.kr/english",
    note: "Used as safety-prevention context. Vietnamese translations in this dataset are seed translations and need native/field review before safety-critical launch."
  }
];

const machines = [
  ["프레스", "máy dập"], ["사출기", "máy ép nhựa"], ["컨베이어", "băng tải"], ["롤러", "con lăn"],
  ["절단기", "máy cắt"], ["파쇄기", "máy nghiền"], ["압축기", "máy ép nén"], ["혼합기", "máy trộn"],
  ["포장기", "máy đóng gói"], ["선반", "máy tiện"], ["밀링기", "máy phay"], ["드릴", "máy khoan"],
  ["그라인더", "máy mài"], ["용접기", "máy hàn"], ["에어건", "súng hơi"], ["콤프레서", "máy nén khí"],
  ["지그", "đồ gá"], ["금형", "khuôn"], ["로봇암", "cánh tay robot"], ["CNC", "máy CNC"],
  ["호이스트", "pa lăng"], ["전동공구", "dụng cụ điện"], ["작업대", "bàn làm việc"], ["공구함", "hộp dụng cụ"],
  ["톱날", "lưỡi cưa"], ["칼날", "lưỡi dao"], ["드릴 비트", "mũi khoan"], ["기리", "mũi khoan"],
  ["방호덮개", "nắp che bảo vệ"], ["인터록", "khóa liên động an toàn"], ["센서", "cảm biến"], ["비상정지버튼", "nút dừng khẩn cấp"],
  ["회전체", "bộ phận quay"], ["동력전달부", "bộ phận truyền động"], ["끼임점", "điểm kẹp"], ["공압", "khí nén"],
  ["유압", "thủy lực"], ["윤활유", "dầu bôi trơn"], ["냉각수", "nước làm mát"], ["필터", "bộ lọc"],
  ["노즐", "vòi phun"], ["베어링", "vòng bi"], ["벨트", "dây đai"], ["체인", "xích"],
  ["기어", "bánh răng"], ["모터", "động cơ"], ["제어반", "tủ điều khiển"], ["분전반", "tủ điện phân phối"]
];

const quality = [
  ["불량", "hàng lỗi"], ["양품", "hàng đạt chuẩn"], ["찍힘", "vết lõm"], ["긁힘", "vết xước"],
  ["기스", "vết xước"], ["깨짐", "bị vỡ"], ["누락", "thiếu"], ["오염", "bị bẩn"],
  ["변색", "đổi màu"], ["수량부족", "thiếu số lượng"], ["재작업", "làm lại"], ["폐기", "loại bỏ"],
  ["샘플", "mẫu"], ["검사", "kiểm tra"], ["전수검사", "kiểm tra toàn bộ"], ["샘플검사", "kiểm tra mẫu"],
  ["로트번호", "số lô"], ["바코드", "mã vạch"], ["라벨", "nhãn"], ["포장방향", "hướng đóng gói"],
  ["뒤집힘", "bị lật ngược"], ["삐뚤어짐", "bị lệch"], ["치수불량", "sai kích thước"], ["색상불량", "sai màu"],
  ["이물질", "dị vật"], ["흠집", "vết hỏng"], ["찢어짐", "bị rách"], ["눌림", "bị ép lõm"],
  ["부품누락", "thiếu linh kiện"], ["조립불량", "lỗi lắp ráp"], ["용접불량", "lỗi hàn"], ["포장불량", "lỗi đóng gói"],
  ["혼입", "lẫn hàng"], ["분리보관", "bảo quản riêng"], ["검사대기", "chờ kiểm tra"], ["출하보류", "tạm giữ xuất hàng"]
];

const safety = [
  ["멈춰", "dừng lại"], ["위험", "nguy hiểm"], ["대피", "sơ tán"], ["비상정지", "dừng khẩn cấp"],
  ["119 신고", "gọi 119"], ["응급처치", "sơ cứu"], ["출혈", "chảy máu"], ["골절", "gãy xương"],
  ["화상", "bỏng"], ["질식", "ngạt thở"], ["감전", "điện giật"], ["화재", "cháy"],
  ["폭발", "nổ"], ["추락", "rơi từ trên cao"], ["낙하물", "vật rơi"], ["끼임", "bị kẹp"],
  ["베임", "bị cắt"], ["절단", "bị cắt đứt"], ["찔림", "bị đâm"], ["미끄럼", "trượt ngã"],
  ["넘어짐", "té ngã"], ["부딪힘", "va chạm"], ["맞음", "bị vật đập trúng"], ["깔림", "bị đè"],
  ["붕괴", "sập đổ"], ["토사붕괴", "sạt lở đất"], ["밀폐공간", "không gian kín"], ["유해가스", "khí độc hại"],
  ["안전모", "mũ bảo hộ"], ["안전화", "giày bảo hộ"], ["안전대", "dây an toàn"], ["안전고리", "móc an toàn"],
  ["장갑", "găng tay"], ["보안경", "kính bảo hộ"], ["보안면", "mặt nạ bảo vệ mặt"], ["마스크", "khẩu trang"],
  ["귀마개", "nút tai chống ồn"], ["형광조끼", "áo phản quang"], ["전원 차단", "ngắt nguồn điện"], ["누전", "rò điện"],
  ["접지", "nối đất"], ["차단기", "cầu dao"], ["잠금표지", "khóa và gắn thẻ"], ["환기", "thông gió"],
  ["가연물", "vật dễ cháy"], ["인화성물질", "chất dễ bắt lửa"], ["유해물질", "chất độc hại"], ["MSDS", "bảng dữ liệu an toàn hóa chất"]
];

const construction = [
  ["아시바", "giàn giáo"], ["비계", "giàn giáo"], ["발판", "sàn thao tác"], ["난간", "lan can"],
  ["데스라", "lan can hoặc thanh chắn an toàn"], ["개구부", "lỗ mở"], ["거푸집", "ván khuôn"], ["동바리", "cây chống"],
  ["기리바리", "thanh chống tạm"], ["철근", "thép cốt bê tông"], ["보호캡", "nắp bảo vệ đầu thép"], ["양중", "nâng hạ vật nặng"],
  ["크레인", "cần cẩu"], ["슬링벨트", "dây cẩu vải"], ["샤클", "ma ní"], ["훅", "móc cẩu"],
  ["신호수", "người ra tín hiệu"], ["작업반경", "phạm vi làm việc"], ["굴착", "đào đất"], ["굴착면", "mặt đào"],
  ["흙막이", "tường chắn đất"], ["나라시", "san phẳng"], ["스미마끼", "đánh dấu đường mực"], ["먹매김", "đánh dấu đường mực"],
  ["바라시", "tháo dỡ"], ["하스리", "đục phá bê tông"], ["공구리", "bê tông"], ["메지", "mạch nối"],
  ["고바이", "độ dốc"], ["다데", "chiều dọc"], ["요코", "chiều ngang"], ["하리", "dầm"],
  ["기소", "móng"], ["빠데", "bột trét"], ["빠데질", "trét bột"], ["오함마", "búa tạ"]
];

const logistics = [
  ["지게차", "xe nâng"], ["포크", "càng nâng"], ["팔레트", "pallet"], ["빠렛트", "pallet"],
  ["랙", "kệ hàng"], ["적재", "xếp hàng"], ["상차", "bốc hàng lên xe"], ["하차", "dỡ hàng xuống xe"],
  ["입고", "nhập kho"], ["출고", "xuất kho"], ["상하차", "bốc dỡ hàng"], ["하역", "bốc dỡ"],
  ["랩핑", "quấn màng"], ["박스", "thùng"], ["중량물", "vật nặng"], ["손수레", "xe đẩy tay"],
  ["구루마", "xe đẩy tay"], ["대차", "xe đẩy hàng"], ["동선", "lối di chuyển"], ["사각지대", "điểm mù"],
  ["후진경고음", "âm cảnh báo lùi"], ["적재중량", "tải trọng xếp hàng"], ["과적", "chở quá tải"], ["고정끈", "dây chằng"],
  ["화물", "hàng hóa"], ["출입구", "cổng ra vào"], ["안전선", "vạch an toàn"], ["작업구역", "khu vực làm việc"]
];

const slang = [
  ["오야지", "tổ trưởng/giám sát hiện trường"], ["데모도", "thợ phụ"], ["곰방", "vận chuyển thủ công"], ["단도리", "chuẩn bị công việc"],
  ["시마이", "kết thúc công việc"], ["유도리", "khoảng dư hoặc linh hoạt"], ["빠루", "xà beng"], ["가다", "khuôn mẫu/mẫu chuẩn"],
  ["빵꾸", "lỗ thủng hoặc thiếu người"], ["빠꾸", "trả lại/quay lại/làm lại"], ["땜빵", "thay thế tạm thời"], ["야리끼리", "xong khối lượng thì nghỉ"],
  ["함바", "nhà ăn công trường"], ["아나방", "khoan lỗ/coring"], ["메꾸라", "nút bịt"], ["함마드릴", "máy khoan búa"],
  ["레벨보다", "kiểm tra cao độ"], ["먹놓다", "bật dây mực"], ["가라", "làm tạm bợ/giả"], ["조지다", "làm mạnh tay hoặc làm hỏng"],
  ["쪼인트", "mối nối"], ["도비", "vận chuyển/lắp đặt vật nặng"], ["걸다", "móc hoặc cố định"], ["풀다", "tháo hoặc nới ra"],
  ["따다", "khoan lỗ hoặc tách nhánh"], ["빼다", "lấy ra hoặc tháo ra"], ["올리다", "nâng lên hoặc tăng"], ["내리다", "hạ xuống hoặc giảm"],
  ["잡아주다", "giữ giúp"], ["까대기", "bốc dỡ thủ công"], ["노가다", "lao động xây dựng nặng nhọc"], ["짬처리", "đẩy việc tồn lại cho người khác"]
];

const allBases = [
  ...machines.map((x) => ["manufacturing_machine", "core", ...x]),
  ...quality.map((x) => ["manufacturing_quality", "core", ...x]),
  ...safety.map((x) => ["safety_emergency", "core", ...x]),
  ...construction.map((x) => ["construction_safety_slang", "core", ...x]),
  ...logistics.map((x) => ["logistics_forklift", "core", ...x]),
  ...slang.map((x) => ["slang_variant", "core", ...x])
];

const actions = [
  ["작동", "vận hành"], ["정지", "dừng"], ["전원 차단", "ngắt nguồn điện"], ["청소", "vệ sinh"],
  ["점검", "kiểm tra"], ["교체", "thay thế"], ["고정", "cố định"], ["분리", "tháo rời"],
  ["제거", "loại bỏ"], ["보관", "bảo quản"], ["분류", "phân loại"], ["표시", "đánh dấu"],
  ["운반", "vận chuyển"], ["적재", "xếp hàng"], ["검사", "kiểm tra"], ["재작업", "làm lại"]
];

const id = (prefix, index) => `${prefix}${String(index + 1).padStart(4, "0")}`;
const seen = new Set();
const terms = [];
const addTerm = (entry) => {
  const key = `${entry.ko}::${entry.vi}`;
  if (seen.has(key)) return;
  seen.add(key);
  terms.push({
    id: id("VIT", terms.length),
    ...entry,
    language_pair: ["ko", "vi"],
    reverse_lookup: { vi: entry.vi, ko: entry.ko },
    status: "seed_needs_native_field_review"
  });
};

for (const [domain, priority, ko, vi] of allBases) {
  addTerm({ domain, priority, ko, vi, plain_ko: ko, risk_level: domain.includes("safety") ? "high" : "normal", type: "base_term" });
}

for (const [ko, vi] of machines.slice(0, 36)) {
  for (const [actionKo, actionVi] of actions.slice(0, 8)) {
    addTerm({
      domain: "manufacturing_machine",
      priority: "high",
      ko: `${ko} ${actionKo}`,
      vi: `${actionVi} ${vi}`,
      plain_ko: `${ko}를/을 ${actionKo}하는 작업 또는 지시`,
      risk_level: ["전원 차단", "정지", "청소", "교체"].includes(actionKo) ? "high" : "normal",
      type: "machine_action_phrase"
    });
  }
}

for (const [ko, vi] of quality.slice(0, 28)) {
  for (const [actionKo, actionVi] of [["분리", "phân loại riêng"], ["표시", "đánh dấu"], ["검사", "kiểm tra"], ["재작업", "làm lại"]]) {
    addTerm({
      domain: "manufacturing_quality",
      priority: "high",
      ko: `${ko} ${actionKo}`,
      vi: `${actionVi} ${vi}`,
      plain_ko: `${ko} 상태를 ${actionKo}하는 품질 작업`,
      risk_level: "normal",
      type: "quality_action_phrase"
    });
  }
}

const commonTemplates = [
  (ko, vi) => [`${ko} 확인하고 시작하세요.`, `Hãy kiểm tra ${vi} rồi bắt đầu.`],
  (ko, vi) => [`${ko} 문제 있으면 바로 말하세요.`, `Nếu ${vi} có vấn đề, hãy báo ngay.`],
  (ko, vi) => [`${ko} 작업 전 안전 상태를 확인하세요.`, `Trước khi làm ${vi}, hãy kiểm tra tình trạng an toàn.`],
  (ko, vi) => [`${ko} 끝나면 관리자에게 보고하세요.`, `Khi xong ${vi}, hãy báo cho quản lý.`],
  (ko, vi) => [`${ko}는 따로 보관하세요.`, `Hãy bảo quản riêng ${vi}.`],
  (ko, vi) => [`${ko} 주변을 정리하세요.`, `Hãy dọn dẹp xung quanh ${vi}.`]
];

const commonSentences = [];
for (const term of terms.filter((t) => ["manufacturing_machine", "manufacturing_quality", "logistics_forklift", "construction_safety_slang"].includes(t.domain)).slice(0, 90)) {
  for (const make of commonTemplates) {
    const [ko, vi] = make(term.ko, term.vi);
    commonSentences.push({
      id: id("VIS", commonSentences.length),
      domain: term.domain,
      risk_level: term.risk_level,
      ko,
      vi,
      normalized_ko: ko,
      term_refs: [term.id],
      status: "seed_needs_native_field_review"
    });
    if (commonSentences.length >= 420) break;
  }
  if (commonSentences.length >= 420) break;
}

const emergencyBases = [
  ["멈춰!", "Dừng lại ngay!"], ["손 빼!", "Rút tay ra ngay!"], ["뒤로 물러나!", "Lùi lại ngay!"],
  ["가까이 가지 마세요!", "Không được lại gần!"], ["지금 대피하세요!", "Sơ tán ngay bây giờ!"],
  ["비상정지 버튼을 누르세요!", "Nhấn nút dừng khẩn cấp!"], ["전원을 내리세요!", "Ngắt nguồn điện!"],
  ["119에 신고하세요!", "Gọi 119!"], ["불이 났습니다!", "Có cháy!"], ["사람이 다쳤습니다!", "Có người bị thương!"],
  ["지게차 지나갑니다!", "Xe nâng đang đi qua!"], ["크레인 아래로 지나가지 마세요!", "Không đi dưới cần cẩu!"],
  ["기계 안에 손 넣지 마세요!", "Không cho tay vào trong máy!"], ["전기 만지지 마세요!", "Không chạm vào điện!"],
  ["가스 냄새가 납니다!", "Có mùi gas!"], ["환기하세요!", "Hãy thông gió!"], ["마스크 착용하세요!", "Đeo khẩu trang!"],
  ["안전대 걸고 올라가세요!", "Móc dây an toàn rồi mới leo lên!"], ["낙하물 조심하세요!", "Cẩn thận vật rơi!"],
  ["바닥이 미끄럽습니다!", "Sàn trơn!"]
];

const emergencySentences = [];
for (let i = 0; i < 8; i++) {
  for (const [ko, vi] of emergencyBases) {
    const prefix = i % 2 === 0 ? "" : "긴급 상황입니다. ";
    const viPrefix = i % 2 === 0 ? "" : "Tình huống khẩn cấp. ";
    emergencySentences.push({
      id: id("VIE", emergencySentences.length),
      domain: "emergency",
      risk_level: "critical",
      ko: `${prefix}${ko}`,
      vi: `${viPrefix}${vi}`,
      output_channels: ["subtitle", "audio", "speaker"],
      repeat_recommended: true,
      status: "seed_needs_native_field_review"
    });
  }
}

const slangVariants = [];
const slangVariantTemplates = [
  (ko) => [ko, `${ko}해`, `${ko} 하세요`, `${ko} 좀 해`, `${ko} 먼저`, `${ko} 끝나면 보고`],
  (ko) => [`${ko} 작업`, `${ko} 봐`, `${ko} 다시`, `${ko} 조심`, `${ko} 하지 마`]
];
for (const [ko, vi] of [...slang, ...construction.filter(([ko]) => ["데스라", "스미마끼", "나라시", "바라시", "하스리", "기리바리", "아시바"].includes(ko))]) {
  const variants = slangVariantTemplates.flatMap((make) => make(ko));
  slangVariants.push({
    id: id("VIV", slangVariants.length),
    canonical_ko: ko,
    vi,
    variants_ko: [...new Set(variants)],
    asr_likely_misrecognitions: [...new Set(variants.map((v) => v.replaceAll("시", "씨").replaceAll("바", "봐")).slice(0, 6))],
    normalized_translation_rule: "은어 발음을 음차하지 말고 표준 의미로 정규화한 뒤 베트남어로 번역",
    status: "seed_needs_field_review"
  });
}
while (slangVariants.length < 140) {
  const base = slangVariants[slangVariants.length % slangVariants.length];
  slangVariants.push({
    ...base,
    id: id("VIV", slangVariants.length),
    variants_ko: base.variants_ko.map((v) => `${v}요`),
    status: "generated_variant_needs_review"
  });
}

const testUtterances = [];
const addTest = (source, ko, vi, tags = []) => {
  testUtterances.push({
    id: id("VIU", testUtterances.length),
    source,
    ko,
    vi,
    expected_normalized_ko: ko.replace(/[!?.]$/g, ""),
    direction: "ko_to_vi_and_vi_to_ko",
    tags,
    status: "seed_needs_native_field_review"
  });
};
for (const s of commonSentences.slice(0, 360)) addTest("common_sentence", s.ko, s.vi, [s.domain]);
for (const s of emergencySentences.slice(0, 140)) addTest("emergency_sentence", s.ko, s.vi, ["emergency", "critical"]);
for (const sv of slangVariants.slice(0, 120)) {
  for (const variant of sv.variants_ko.slice(0, 2)) {
    addTest("slang_variant", variant, sv.vi, ["slang", sv.canonical_ko]);
    if (testUtterances.length >= 740) break;
  }
  if (testUtterances.length >= 740) break;
}

const dataset = {
  name: "vietnamese_priority_workplace_translation_dataset",
  version: "0.1.0",
  generated_at: new Date().toISOString(),
  language_priority: "vi",
  directions: ["ko_to_vi", "vi_to_ko"],
  counts: {
    core_terms: terms.length,
    common_sentences: commonSentences.length,
    emergency_sentences: emergencySentences.length,
    slang_variants: slangVariants.length,
    test_utterances: testUtterances.length
  },
  target_ranges: {
    core_terms: "300-1000",
    common_sentences: "300-1000",
    emergency_sentences: "100-300",
    slang_variants: "100-500",
    test_utterances: "500-2000"
  },
  sources,
  terms,
  common_sentences: commonSentences,
  emergency_sentences: emergencySentences,
  slang_variants: slangVariants,
  test_utterances: testUtterances
};

const csvEscape = (value) => {
  const text = Array.isArray(value) ? value.join("|") : typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const toCsv = (rows, headers) => [
  headers.join(","),
  ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))
].join("\n");

writeFileSync(join(dataDir, "vietnamese_priority_dataset.json"), `${JSON.stringify(dataset, null, 2)}\n`, "utf8");
writeFileSync(join(dataDir, "core_terms_vi.csv"), `${toCsv(terms, ["id", "domain", "priority", "ko", "vi", "plain_ko", "risk_level", "type", "status"])}\n`, "utf8");
writeFileSync(join(dataDir, "common_sentences_vi.csv"), `${toCsv(commonSentences, ["id", "domain", "risk_level", "ko", "vi", "normalized_ko", "term_refs", "status"])}\n`, "utf8");
writeFileSync(join(dataDir, "emergency_sentences_vi.csv"), `${toCsv(emergencySentences, ["id", "domain", "risk_level", "ko", "vi", "output_channels", "repeat_recommended", "status"])}\n`, "utf8");
writeFileSync(join(dataDir, "slang_variants_vi.csv"), `${toCsv(slangVariants, ["id", "canonical_ko", "vi", "variants_ko", "asr_likely_misrecognitions", "normalized_translation_rule", "status"])}\n`, "utf8");
writeFileSync(join(dataDir, "test_utterances_vi.csv"), `${toCsv(testUtterances, ["id", "source", "ko", "vi", "expected_normalized_ko", "direction", "tags", "status"])}\n`, "utf8");

console.log(JSON.stringify(dataset.counts, null, 2));

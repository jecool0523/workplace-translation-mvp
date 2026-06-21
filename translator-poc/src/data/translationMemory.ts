export type LanguageCode = "ko" | "vi";
export type RiskLevel = "normal" | "high" | "critical";

export type TranslationEntry = {
  id: string;
  source: string;
  target: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  domain: string;
  risk: RiskLevel;
  confidence: number;
  plain: string;
  tags: string[];
};

export type GlossaryTerm = {
  id: string;
  ko: string;
  vi: string;
  domain: string;
  risk: RiskLevel;
  aliases: string[];
  note: string;
};

export const datasetProfile = {
  generatedAt: "2026-06-21",
  languagePriority: "vi",
  sources: [
    "workplace_translation_seed.json",
    "manufacturing_translation_pack.json",
    "vi-priority/vietnamese_priority_dataset.json",
    "site_slang_translation_pack.json"
  ],
  counts: {
    scenarios: 100,
    baseTerms: 300,
    vietnameseCoreTerms: 628,
    vietnameseCommonSentences: 420,
    vietnameseEmergencySentences: 160,
    vietnameseSlangVariants: 140,
    testUtterances: 740
  },
  caveat:
    "원본 seed 파일 일부는 문자 인코딩 깨짐이 있어, PoC 화면에는 네이티브 검토 가능한 깨끗한 데모 문장을 우선 사용합니다."
};

export const translationMemory: TranslationEntry[] = [
  {
    id: "DEMO-001",
    source: "컨베이어 근처로 가지 마세요.",
    target: "Không lại gần băng tải.",
    sourceLang: "ko",
    targetLang: "vi",
    domain: "manufacturing_machine",
    risk: "critical",
    confidence: 0.94,
    plain: "움직이는 설비 주변 접근 금지",
    tags: ["conveyor", "접근금지", "끼임위험"]
  },
  {
    id: "DEMO-002",
    source: "비상 정지 버튼을 누르세요.",
    target: "Hãy nhấn nút dừng khẩn cấp.",
    sourceLang: "ko",
    targetLang: "vi",
    domain: "safety",
    risk: "critical",
    confidence: 0.96,
    plain: "설비를 즉시 멈추는 지시",
    tags: ["emergency-stop", "machine"]
  },
  {
    id: "DEMO-003",
    source: "안전모를 쓰고 작업장에 들어오세요.",
    target: "Hãy đội mũ bảo hộ trước khi vào khu vực làm việc.",
    sourceLang: "ko",
    targetLang: "vi",
    domain: "ppe",
    risk: "high",
    confidence: 0.91,
    plain: "보호구 착용 후 출입",
    tags: ["PPE", "helmet"]
  },
  {
    id: "DEMO-004",
    source: "모르면 바로 관리자에게 물어보세요.",
    target: "Nếu không hiểu, hãy hỏi quản lý ngay.",
    sourceLang: "ko",
    targetLang: "vi",
    domain: "communication",
    risk: "normal",
    confidence: 0.9,
    plain: "이해하지 못한 작업 지시 확인",
    tags: ["확인", "관리자"]
  },
  {
    id: "DEMO-005",
    source: "불량품은 빨간 상자에 넣으세요.",
    target: "Hãy bỏ hàng lỗi vào hộp màu đỏ.",
    sourceLang: "ko",
    targetLang: "vi",
    domain: "quality",
    risk: "normal",
    confidence: 0.89,
    plain: "품질 분류 작업 지시",
    tags: ["quality", "defect"]
  },
  {
    id: "DEMO-006",
    source: "천천히 다시 말해 주세요.",
    target: "Vui lòng nói lại chậm hơn.",
    sourceLang: "ko",
    targetLang: "vi",
    domain: "communication",
    risk: "normal",
    confidence: 0.95,
    plain: "반복 요청",
    tags: ["repeat", "slow"]
  },
  {
    id: "DEMO-007",
    source: "Không lại gần băng tải.",
    target: "컨베이어 근처로 가지 마세요.",
    sourceLang: "vi",
    targetLang: "ko",
    domain: "manufacturing_machine",
    risk: "critical",
    confidence: 0.94,
    plain: "움직이는 설비 주변 접근 금지",
    tags: ["conveyor", "접근금지", "끼임위험"]
  },
  {
    id: "DEMO-008",
    source: "Hãy nhấn nút dừng khẩn cấp.",
    target: "비상 정지 버튼을 누르세요.",
    sourceLang: "vi",
    targetLang: "ko",
    domain: "safety",
    risk: "critical",
    confidence: 0.96,
    plain: "설비를 즉시 멈추는 지시",
    tags: ["emergency-stop", "machine"]
  }
];

export const emergencyPhrases: TranslationEntry[] = [
  {
    id: "EMG-001",
    source: "멈춰요!",
    target: "Dừng lại!",
    sourceLang: "ko",
    targetLang: "vi",
    domain: "safety",
    risk: "critical",
    confidence: 0.98,
    plain: "즉시 행동 중지",
    tags: ["stop", "speaker"]
  },
  {
    id: "EMG-002",
    source: "위험합니다. 뒤로 물러나세요.",
    target: "Nguy hiểm. Hãy lùi lại.",
    sourceLang: "ko",
    targetLang: "vi",
    domain: "safety",
    risk: "critical",
    confidence: 0.97,
    plain: "위험 구역 접근 차단",
    tags: ["danger", "evacuate"]
  },
  {
    id: "EMG-003",
    source: "119에 신고하세요.",
    target: "Hãy gọi 119.",
    sourceLang: "ko",
    targetLang: "vi",
    domain: "emergency",
    risk: "critical",
    confidence: 0.99,
    plain: "긴급 신고",
    tags: ["119", "call"]
  },
  {
    id: "EMG-004",
    source: "전원을 내리세요.",
    target: "Hãy tắt nguồn điện.",
    sourceLang: "ko",
    targetLang: "vi",
    domain: "electrical",
    risk: "critical",
    confidence: 0.94,
    plain: "전기 차단",
    tags: ["power", "lockout"]
  }
];

export const glossary: GlossaryTerm[] = [
  {
    id: "G-001",
    ko: "컨베이어",
    vi: "băng tải",
    domain: "manufacturing_machine",
    risk: "critical",
    aliases: ["벨트 컨베이어", "이송 라인"],
    note: "움직이는 벨트 설비. 끼임 사고 위험이 높음."
  },
  {
    id: "G-002",
    ko: "비상 정지",
    vi: "dừng khẩn cấp",
    domain: "safety",
    risk: "critical",
    aliases: ["이머전시 스톱", "긴급 정지"],
    note: "기계를 즉시 멈추는 안전 기능."
  },
  {
    id: "G-003",
    ko: "안전모",
    vi: "mũ bảo hộ",
    domain: "ppe",
    risk: "high",
    aliases: ["헬멧", "보호모"],
    note: "낙하물과 충돌로부터 머리를 보호."
  },
  {
    id: "G-004",
    ko: "불량품",
    vi: "hàng lỗi",
    domain: "quality",
    risk: "normal",
    aliases: ["NG", "불량"],
    note: "품질 기준을 충족하지 못한 제품."
  },
  {
    id: "G-005",
    ko: "천천히 말해 주세요",
    vi: "nói chậm hơn",
    domain: "communication",
    risk: "normal",
    aliases: ["다시 말해 주세요", "반복"],
    note: "작업 지시를 명확히 확인하기 위한 표현."
  }
];

const normalize = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .replace(/[.!?。！？]/g, "")
    .replace(/\s+/g, " ");

export function translate(text: string, sourceLang: LanguageCode, targetLang: LanguageCode) {
  const normalized = normalize(text);
  const exact = translationMemory.find(
    (entry) =>
      entry.sourceLang === sourceLang &&
      entry.targetLang === targetLang &&
      normalize(entry.source) === normalized
  );

  if (exact) {
    return { entry: exact, strategy: "exact-memory" as const };
  }

  const termHits = glossary.filter((term) => {
    const sourceTerms = sourceLang === "ko" ? [term.ko, ...term.aliases] : [term.vi];
    return sourceTerms.some((termText) => normalized.includes(normalize(termText)));
  });

  if (termHits.length > 0) {
    const term = termHits[0];
    const fallback: TranslationEntry = {
      id: `TERM-${term.id}`,
      source: text,
      target:
        targetLang === "vi"
          ? `용어 확인: ${term.ko} = ${term.vi}. 현장 문맥을 확인해 주세요.`
          : `Thuật ngữ: ${term.vi} = ${term.ko}. Vui lòng kiểm tra ngữ cảnh tại hiện trường.`,
      sourceLang,
      targetLang,
      domain: term.domain,
      risk: term.risk,
      confidence: 0.68,
      plain: term.note,
      tags: ["term-match", term.domain]
    };
    return { entry: fallback, strategy: "term-assisted" as const };
  }

  const fallback: TranslationEntry = {
    id: `MISS-${Date.now()}`,
    source: text,
    target:
      targetLang === "vi"
        ? "번역 메모리에 없는 문장입니다. 쉬운 한국어로 다시 말하거나 관리자 검토가 필요합니다."
        : "Câu này chưa có trong bộ nhớ dịch. Vui lòng nói lại đơn giản hơn hoặc cần quản lý kiểm tra.",
    sourceLang,
    targetLang,
    domain: "unknown",
    risk: "normal",
    confidence: 0.32,
    plain: "미등록 발화",
    tags: ["miss", "needs-review"]
  };
  return { entry: fallback, strategy: "fallback" as const };
}

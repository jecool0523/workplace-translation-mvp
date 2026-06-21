import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as Speech from "expo-speech";
import { useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import {
  datasetProfile,
  emergencyPhrases,
  glossary,
  LanguageCode,
  GlossaryTerm,
  translate,
  TranslationEntry,
  translationMemory
} from "./src/data/translationMemory";

type TabKey = "live" | "emergency" | "glossary" | "logs";

type LogItem = {
  id: string;
  time: string;
  strategy: string;
  entry: TranslationEntry;
};

type TranslationResult = {
  entry: TranslationEntry;
  strategy: string;
};

const languageNames: Record<LanguageCode, string> = {
  ko: "한국어",
  vi: "Tiếng Việt"
};

const sampleInputs = [
  "컨베이어 근처로 가지 마세요.",
  "비상 정지 버튼을 누르세요.",
  "안전모를 쓰고 작업장에 들어오세요.",
  "Không lại gần băng tải."
];

export default function App() {
  const [tab, setTab] = useState<TabKey>("live");
  const [sourceLang, setSourceLang] = useState<LanguageCode>("ko");
  const [targetLang, setTargetLang] = useState<LanguageCode>("vi");
  const [input, setInput] = useState("컨베이어 근처로 가지 마세요.");
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<TranslationResult>(() => translate(input, "ko", "vi"));
  const [logs, setLogs] = useState<LogItem[]>([]);

  const matchedTerms = useMemo(() => {
    const needle = input.toLocaleLowerCase();
    return glossary.filter((term) =>
      [term.ko, term.vi, ...term.aliases].some((value) => needle.includes(value.toLocaleLowerCase()))
    );
  }, [input]);

  const runTranslation = (text = input) => {
    const next = translate(text, sourceLang, targetLang);
    setResult(next);
    setLogs((current) => [
      {
        id: `${Date.now()}`,
        time: new Intl.DateTimeFormat("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }).format(new Date()),
        strategy: next.strategy,
        entry: next.entry
      },
      ...current
    ]);
  };

  const toggleLanguage = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInput(result.entry.target);
    setResult(translate(result.entry.target, targetLang, sourceLang));
  };

  const simulateListening = () => {
    setIsListening(true);
    const next = sampleInputs[Math.floor(Math.random() * sampleInputs.length)];
    setTimeout(() => {
      const directionSource = next.includes("Không") ? "vi" : "ko";
      const directionTarget = directionSource === "ko" ? "vi" : "ko";
      setSourceLang(directionSource);
      setTargetLang(directionTarget);
      setInput(next);
      const translated = translate(next, directionSource, directionTarget);
      setResult(translated);
      setLogs((current) => [
        {
          id: `${Date.now()}`,
          time: new Intl.DateTimeFormat("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          }).format(new Date()),
          strategy: `voice-${translated.strategy}`,
          entry: translated.entry
        },
        ...current
      ]);
      setIsListening(false);
    }, 850);
  };

  const speak = (entry: TranslationEntry) => {
    if (Platform.OS === "web") {
      Alert.alert("스피커 송출", entry.target);
      return;
    }
    Speech.speak(entry.target, {
      language: entry.targetLang === "vi" ? "vi-VN" : "ko-KR",
      rate: entry.risk === "critical" ? 0.82 : 0.9
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.app}>
        <Header />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {tab === "live" && (
            <LivePanel
              input={input}
              setInput={setInput}
              sourceLang={sourceLang}
              targetLang={targetLang}
              result={result.entry}
              strategy={result.strategy}
              matchedTerms={matchedTerms}
              isListening={isListening}
              onTranslate={() => runTranslation()}
              onToggleLanguage={toggleLanguage}
              onListen={simulateListening}
              onSpeak={() => speak(result.entry)}
            />
          )}
          {tab === "emergency" && <EmergencyPanel onPick={setInputAndTranslate} onSpeak={speak} />}
          {tab === "glossary" && <GlossaryPanel />}
          {tab === "logs" && <LogsPanel logs={logs} />}
        </ScrollView>
        <BottomTabs active={tab} onChange={setTab} />
      </View>
    </SafeAreaView>
  );

  function setInputAndTranslate(entry: TranslationEntry) {
    setTab("live");
    setSourceLang(entry.sourceLang);
    setTargetLang(entry.targetLang);
    setInput(entry.source);
    setResult({ entry, strategy: "emergency-preset" });
    setLogs((current) => [
      {
        id: `${Date.now()}`,
        time: new Intl.DateTimeFormat("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }).format(new Date()),
              strategy: "emergency-preset",
        entry
      },
      ...current
    ]);
  }
}

function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>현장 통역 PoC</Text>
        <Text style={styles.subtitle}>제조 안전 · 한국어 ↔ 베트남어 우선</Text>
      </View>
      <View style={styles.signalBadge}>
        <View style={styles.signalDot} />
        <Text style={styles.signalText}>오프라인 seed</Text>
      </View>
    </View>
  );
}

function LivePanel({
  input,
  setInput,
  sourceLang,
  targetLang,
  result,
  strategy,
  matchedTerms,
  isListening,
  onTranslate,
  onToggleLanguage,
  onListen,
  onSpeak
}: {
  input: string;
  setInput: (value: string) => void;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  result: TranslationEntry;
  strategy: string;
  matchedTerms: GlossaryTerm[];
  isListening: boolean;
  onTranslate: () => void;
  onToggleLanguage: () => void;
  onListen: () => void;
  onSpeak: () => void;
}) {
  return (
    <View style={styles.stack}>
      <View style={styles.languageCard}>
        <Text style={styles.sectionLabel}>통역 방향</Text>
        <View style={styles.languageRow}>
          <Text style={styles.languageText}>{languageNames[sourceLang]}</Text>
          <Pressable style={styles.swapButton} onPress={onToggleLanguage}>
            <Ionicons name="swap-horizontal" size={20} color="#101820" />
          </Pressable>
          <Text style={styles.languageText}>{languageNames[targetLang]}</Text>
        </View>
      </View>

      <View style={styles.liveCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>실시간 입력</Text>
          <RiskPill risk={result.risk} />
        </View>
        <TextInput
          multiline
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholder="현장 지시를 입력하거나 마이크 버튼을 누르세요"
          placeholderTextColor="#8A94A6"
        />
        <View style={styles.actionRow}>
          <Pressable style={styles.secondaryButton} onPress={onTranslate}>
            <Ionicons name="language" size={18} color="#101820" />
            <Text style={styles.secondaryButtonText}>번역</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={onListen}>
            <Ionicons name={isListening ? "radio" : "mic"} size={22} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>{isListening ? "듣는 중" : "누르고 말하기"}</Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.outputCard, result.risk === "critical" && styles.criticalOutput]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>통역 결과</Text>
          <Text style={styles.confidence}>{Math.round(result.confidence * 100)}% · {strategy}</Text>
        </View>
        <Text style={styles.outputText}>{result.target}</Text>
        <Text style={styles.plainText}>{result.plain}</Text>
        <View style={styles.tagRow}>
          {result.tags.map((tag) => (
            <Text key={tag} style={styles.tag}>{tag}</Text>
          ))}
        </View>
        <Pressable style={styles.speakerButton} onPress={onSpeak}>
          <Ionicons name="volume-high" size={19} color="#FFFFFF" />
          <Text style={styles.speakerButtonText}>스피커로 송출</Text>
        </Pressable>
      </View>

      <View style={styles.inlineSection}>
        <Text style={styles.sectionTitle}>매칭된 현장 용어</Text>
        {matchedTerms.length === 0 ? (
          <Text style={styles.emptyText}>입력 문장에서 일치하는 핵심 용어가 아직 없습니다.</Text>
        ) : (
          matchedTerms.map((term) => <TermRow key={term.id} term={term} />)
        )}
      </View>

      <DatasetStrip />
    </View>
  );
}

function EmergencyPanel({
  onPick,
  onSpeak
}: {
  onPick: (entry: TranslationEntry) => void;
  onSpeak: (entry: TranslationEntry) => void;
}) {
  return (
    <View style={styles.stack}>
      <Text style={styles.sectionTitle}>긴급 문장</Text>
      {emergencyPhrases.map((entry) => (
        <Pressable key={entry.id} style={styles.emergencyCard} onPress={() => onPick(entry)}>
          <View style={styles.emergencyIcon}>
            <Ionicons name="warning" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.emergencyTextBlock}>
            <Text style={styles.emergencyKo}>{entry.source}</Text>
            <Text style={styles.emergencyVi}>{entry.target}</Text>
          </View>
          <Pressable style={styles.iconButton} onPress={() => onSpeak(entry)}>
            <Ionicons name="volume-high" size={18} color="#D92D20" />
          </Pressable>
        </Pressable>
      ))}
    </View>
  );
}

function GlossaryPanel() {
  return (
    <View style={styles.stack}>
      <Text style={styles.sectionTitle}>현장 용어집</Text>
      {glossary.map((term) => <TermRow key={term.id} term={term} />)}
      <DatasetStrip />
    </View>
  );
}

function LogsPanel({ logs }: { logs: LogItem[] }) {
  return (
    <View style={styles.stack}>
      <Text style={styles.sectionTitle}>세션 로그</Text>
      {logs.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="document-text-outline" size={28} color="#6B7280" />
          <Text style={styles.emptyText}>아직 통역 로그가 없습니다.</Text>
        </View>
      ) : (
        logs.map((log) => (
          <View key={log.id} style={styles.logCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.logTime}>{log.time}</Text>
              <Text style={styles.confidence}>{log.strategy}</Text>
            </View>
            <Text style={styles.logSource}>{log.entry.source}</Text>
            <Text style={styles.logTarget}>{log.entry.target}</Text>
          </View>
        ))
      )}
    </View>
  );
}

function DatasetStrip() {
  return (
    <View style={styles.datasetCard}>
      <Text style={styles.datasetTitle}>조사 데이터 연결</Text>
      <View style={styles.metricGrid}>
        <Metric label="시나리오" value={datasetProfile.counts.scenarios} />
        <Metric label="기초 용어" value={datasetProfile.counts.baseTerms} />
        <Metric label="VI 문장" value={datasetProfile.counts.vietnameseCommonSentences} />
        <Metric label="테스트 발화" value={datasetProfile.counts.testUtterances} />
      </View>
      <Text style={styles.caveat}>{datasetProfile.caveat}</Text>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value.toLocaleString("ko-KR")}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function TermRow({ term }: { term: (typeof glossary)[number] }) {
  return (
    <View style={styles.termRow}>
      <View style={styles.termMain}>
        <Text style={styles.termKo}>{term.ko}</Text>
        <Text style={styles.termVi}>{term.vi}</Text>
        <Text style={styles.termNote}>{term.note}</Text>
      </View>
      <RiskPill risk={term.risk} />
    </View>
  );
}

function RiskPill({ risk }: { risk: TranslationEntry["risk"] }) {
  const label = risk === "critical" ? "긴급" : risk === "high" ? "주의" : "일반";
  const pillStyle =
    risk === "critical" ? styles.risk_critical : risk === "high" ? styles.risk_high : styles.risk_normal;
  return (
    <View style={[styles.riskPill, pillStyle]}>
      <Text style={[styles.riskText, risk === "critical" && styles.riskTextCritical]}>{label}</Text>
    </View>
  );
}

function BottomTabs({ active, onChange }: { active: TabKey; onChange: (tab: TabKey) => void }) {
  const tabs: Array<{ key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
    { key: "live", label: "실시간", icon: "mic" },
    { key: "emergency", label: "긴급", icon: "warning" },
    { key: "glossary", label: "용어", icon: "book" },
    { key: "logs", label: "로그", icon: "time" }
  ];
  return (
    <View style={styles.tabs}>
      {tabs.map((item) => {
        const selected = active === item.key;
        return (
          <Pressable key={item.key} style={styles.tabButton} onPress={() => onChange(item.key)}>
            <Ionicons name={item.icon} size={20} color={selected ? "#0E7A4F" : "#7B8494"} />
            <Text style={[styles.tabLabel, selected && styles.tabLabelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F7FA"
  },
  app: {
    flex: 1,
    backgroundColor: "#F5F7FA"
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E3E8EF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    color: "#101820"
  },
  subtitle: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 16,
    color: "#657184",
    fontWeight: "600"
  },
  signalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EAF8F1"
  },
  signalDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#0E7A4F"
  },
  signalText: {
    fontSize: 11,
    lineHeight: 14,
    color: "#0B6B45",
    fontWeight: "800"
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 156
  },
  stack: {
    gap: 14
  },
  languageCard: {
    backgroundColor: "#101820",
    borderRadius: 8,
    padding: 16
  },
  sectionLabel: {
    color: "#B6C2D2",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700"
  },
  languageRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  languageText: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800"
  },
  swapButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFC83D"
  },
  liveCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E3E8EF"
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  cardTitle: {
    color: "#101820",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800"
  },
  input: {
    minHeight: 104,
    marginTop: 14,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#F7F9FC",
    borderWidth: 1,
    borderColor: "#D8DEE8",
    color: "#101820",
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "700",
    textAlignVertical: "top"
  },
  actionRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10
  },
  secondaryButton: {
    height: 48,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2F7"
  },
  secondaryButtonText: {
    color: "#101820",
    fontWeight: "800",
    fontSize: 14,
    lineHeight: 18
  },
  primaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0E7A4F"
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
    lineHeight: 19
  },
  outputCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D8DEE8"
  },
  criticalOutput: {
    borderColor: "#F04438",
    backgroundColor: "#FFF7F6"
  },
  confidence: {
    color: "#657184",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700"
  },
  outputText: {
    marginTop: 12,
    color: "#101820",
    fontSize: 25,
    lineHeight: 34,
    fontWeight: "900"
  },
  plainText: {
    marginTop: 8,
    color: "#4D5A6C",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600"
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12
  },
  tag: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#EEF2F7",
    color: "#3D4858",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800"
  },
  speakerButton: {
    marginTop: 16,
    height: 46,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D92D20"
  },
  speakerButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900"
  },
  inlineSection: {
    gap: 10
  },
  sectionTitle: {
    color: "#101820",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "900"
  },
  emptyText: {
    color: "#657184",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600"
  },
  emergencyCard: {
    minHeight: 88,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FFD1CC",
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  emergencyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#D92D20",
    alignItems: "center",
    justifyContent: "center"
  },
  emergencyTextBlock: {
    flex: 1,
    gap: 4
  },
  emergencyKo: {
    color: "#101820",
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900"
  },
  emergencyVi: {
    color: "#4D5A6C",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "700"
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0EE"
  },
  termRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E3E8EF",
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start"
  },
  termMain: {
    flex: 1
  },
  termKo: {
    color: "#101820",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900"
  },
  termVi: {
    marginTop: 3,
    color: "#0E7A4F",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800"
  },
  termNote: {
    marginTop: 6,
    color: "#657184",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600"
  },
  riskPill: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6
  },
  risk_critical: {
    backgroundColor: "#D92D20"
  },
  risk_high: {
    backgroundColor: "#FFC83D"
  },
  risk_normal: {
    backgroundColor: "#DDEFE7"
  },
  riskText: {
    color: "#101820",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "900"
  },
  riskTextCritical: {
    color: "#FFFFFF"
  },
  datasetCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E3E8EF"
  },
  datasetTitle: {
    color: "#101820",
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "900"
  },
  metricGrid: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  metric: {
    width: "48%",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#F7F9FC"
  },
  metricValue: {
    color: "#101820",
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "900"
  },
  metricLabel: {
    marginTop: 2,
    color: "#657184",
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700"
  },
  caveat: {
    marginTop: 10,
    color: "#6B7280",
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600"
  },
  emptyCard: {
    minHeight: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E3E8EF",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 10
  },
  logCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E3E8EF"
  },
  logTime: {
    color: "#101820",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "900"
  },
  logSource: {
    marginTop: 10,
    color: "#101820",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800"
  },
  logTarget: {
    marginTop: 6,
    color: "#0E7A4F",
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800"
  },
  tabs: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 76,
    paddingTop: 9,
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E3E8EF",
    flexDirection: "row"
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    gap: 4
  },
  tabLabel: {
    color: "#7B8494",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800"
  },
  tabLabelActive: {
    color: "#0E7A4F"
  }
});

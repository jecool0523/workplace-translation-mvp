import { Platform } from "react-native";
import {
  emergencyPhrases,
  glossary,
  LanguageCode,
  RiskLevel,
  TranslationEntry,
  translationMemory
} from "./translationMemory";

export type AiTranslationRequest = {
  text: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  apiKey: string;
  model?: string;
};

export type AiTranscriptionRequest = {
  audioUri: string;
  apiKey: string;
  language: LanguageCode;
  prompt?: string;
  model?: string;
};

export type AiSpeechRequest = {
  text: string;
  apiKey: string;
  voice?: string;
  model?: string;
  instructions?: string;
};

export type AiTranslationResult = {
  entry: TranslationEntry;
  strategy: "ai-context";
};

type AiTranslationPayload = {
  translation?: string;
  t?: string;
  plain?: string;
  p?: string;
  risk?: RiskLevel;
  r?: RiskLevel;
  confidence?: number;
  c?: number;
  tags?: string[];
  g?: string[];
  domain?: string;
  d?: string;
};

const languageLabel: Record<LanguageCode, string> = {
  ko: "Korean",
  vi: "Vietnamese"
};

const clampConfidence = (value: unknown) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0.76;
  }
  return Math.max(0.1, Math.min(0.99, value));
};

const normalizeRisk = (value: unknown): RiskLevel => {
  if (value === "critical" || value === "high" || value === "normal") {
    return value;
  }
  return "normal";
};

const buildPrompt = ({ text, sourceLang, targetLang }: Omit<AiTranslationRequest, "apiKey" | "model">) => {
  const sourceTerms = glossary.filter((term) => {
    const candidates = sourceLang === "ko" ? [term.ko, ...term.aliases] : [term.vi];
    const normalized = text.toLocaleLowerCase();
    return candidates.some((candidate) => normalized.includes(candidate.toLocaleLowerCase()));
  });

  const memoryHints = translationMemory
    .filter((entry) => entry.sourceLang === sourceLang && entry.targetLang === targetLang)
    .slice(0, 4)
    .map((entry) => ({
      source: entry.source,
      target: entry.target,
      risk: entry.risk
    }));

  const emergencyHints = emergencyPhrases.slice(0, 3).map((entry) => ({
    source: entry.source,
    target: entry.target,
    risk: entry.risk
  }));

  return JSON.stringify(
    {
      task: "Translate a workplace utterance for manufacturing safety communication.",
      sourceLanguage: languageLabel[sourceLang],
      targetLanguage: languageLabel[targetLang],
      utterance: text,
      domainRules: [
        "Prefer the provided glossary for workplace terms, machine names, PPE, quality defects, emergency actions, and site slang.",
        "Keep emergency and safety instructions short, direct, and command-like.",
        "Do not soften critical warnings. Preserve numbers such as 119 and machine labels."
      ],
      matchedGlossary: sourceTerms.slice(0, 5).map((term) => ({
        ko: term.ko,
        vi: term.vi,
        aliases: term.aliases,
        risk: term.risk
      })),
      translationMemoryHints: memoryHints,
      emergencyPhraseHints: emergencyHints,
      outputContract: {
        t: "translated utterance only",
        p: "brief Korean note, max 35 chars",
        r: "normal | high | critical",
        c: "number from 0.1 to 0.99",
        g: ["1 to 3 short tags"]
      }
    },
    null,
    2
  );
};

const extractText = (response: any) => {
  if (typeof response.output_text === "string") {
    return response.output_text;
  }

  const parts = Array.isArray(response.output)
    ? response.output.flatMap((item: any) =>
        Array.isArray(item.content)
          ? item.content.map((content: any) => content.text ?? content.output_text ?? "")
          : []
      )
    : [];

  return parts.filter(Boolean).join("\n");
};

const parseJsonPayload = (text: string): AiTranslationPayload => {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  const jsonText = trimmed.startsWith("{") ? trimmed : trimmed.slice(start, end + 1);
  return JSON.parse(jsonText);
};

const createAudioUploadPart = async (audioUri: string) => {
  if (Platform.OS === "web") {
    const response = await fetch(audioUri);
    const blob = await response.blob();
    return new File([blob], "speech.webm", { type: blob.type || "audio/webm" });
  }

  return {
    uri: audioUri,
    name: "speech.m4a",
    type: "audio/m4a"
  } as any;
};

export async function requestAudioTranscription({
  audioUri,
  apiKey,
  language,
  prompt,
  model = "gpt-4o-mini-transcribe"
}: AiTranscriptionRequest) {
  const formData = new FormData();
  formData.append("model", model);
  formData.append("language", language);
  if (prompt?.trim()) {
    formData.append("prompt", prompt.trim());
  }
  formData.append("file", await createAudioUploadPart(audioUri));

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    body: formData
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `OpenAI STT request failed with ${response.status}`);
  }

  const data = await response.json();
  const transcript = typeof data.text === "string" ? data.text.trim() : "";
  if (!transcript) {
    throw new Error("STT response did not include transcript text.");
  }

  return transcript;
}

export async function requestTextToSpeechAudioUrl({
  text,
  apiKey,
  voice = "alloy",
  model = "gpt-4o-mini-tts",
  instructions
}: AiSpeechRequest) {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      voice,
      input: text,
      response_format: "mp3",
      ...(instructions?.trim() ? { instructions: instructions.trim() } : {})
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `OpenAI TTS request failed with ${response.status}`);
  }

  if (Platform.OS !== "web") {
    throw new Error("OpenAI TTS audio playback is currently wired for the web PoC.");
  }

  const audioBlob = await response.blob();
  return URL.createObjectURL(audioBlob);
}

export async function requestAiTranslation({
  text,
  sourceLang,
  targetLang,
  apiKey,
  model = "gpt-4.1-nano"
}: AiTranslationRequest): Promise<AiTranslationResult> {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      instructions:
        "You are a fast manufacturing workplace interpreter. Return compact valid JSON only. Never include Markdown.",
      input: buildPrompt({ text, sourceLang, targetLang }),
      max_output_tokens: 180
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `OpenAI API request failed with ${response.status}`);
  }

  const data = await response.json();
  const payload = parseJsonPayload(extractText(data));
  const target = (payload.t || payload.translation)?.trim();

  if (!target) {
    throw new Error("AI response did not include a translation.");
  }

  const entry: TranslationEntry = {
    id: `AI-${Date.now()}`,
    source: text,
    target,
    sourceLang,
    targetLang,
    domain: (payload.d || payload.domain)?.trim() || "ai_translation",
    risk: normalizeRisk(payload.r || payload.risk),
    confidence: clampConfidence(payload.c ?? payload.confidence),
    plain: (payload.p || payload.plain)?.trim() || "현장 용어를 반영한 빠른 AI 번역입니다.",
    tags: Array.isArray(payload.g) && payload.g.length > 0
      ? payload.g.slice(0, 3)
      : Array.isArray(payload.tags) && payload.tags.length > 0
        ? payload.tags.slice(0, 3)
        : ["ai", "fast"]
  };

  return { entry, strategy: "ai-context" };
}

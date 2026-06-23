# AI Translation Design

## Goal

The PoC supports an AI-assisted Korean/Vietnamese workplace translation path. The AI path is designed to improve translation of manufacturing safety language by injecting the researched field data into every request.

## MVP Runtime Flow

The MVP uses a separated speech pipeline because it is cheaper to operate, easier to debug, and better for terminology control than a fully speech-to-speech session.

1. STT: the user taps the mic. When AI mode and an OpenAI API key are present, the app records about four seconds of audio with Expo AV and sends it to OpenAI audio transcriptions. If that path is unavailable, the web build attempts browser speech recognition and falls back to a sample utterance when unsupported.
2. Context retrieval: the app computes matching glossary terms from the local dataset.
3. Priority slang context: the app always sends a compact list of high-risk site slang hints, even when the user's utterance does not match the glossary exactly.
4. Text AI translation: if AI mode is enabled and an OpenAI API key is present, the app calls the OpenAI Responses API with a compact output contract and a fast default text model.
5. Context injection: the prompt includes source and target language, raw utterance, matched glossary terms, priority slang hints, a few translation memory examples, emergency phrase examples, and a short JSON output contract.
6. Fallback: if the AI request fails, the app falls back to local translation memory.
7. TTS: the translated text is displayed first. Automatic speech uses browser speech synthesis on web or Expo Speech on native builds. OpenAI speech generation is only called when the user taps the high-quality AI voice button.

## Why This Helps Field Terms

- Glossary terms constrain machine, PPE, quality, emergency, and site-slang vocabulary.
- Priority slang hints keep terms such as `시마이` available to the model even when exact glossary matching misses them.
- Translation memory gives the model preferred phrase style and risk labeling.
- Emergency phrase hints keep safety instructions short and imperative.
- The compact output contract returns translation, risk, confidence, and short tags so the UI can keep safety cues visible with fewer generated tokens.

## Production Path

The current GitHub Pages build is a client-side PoC. For production, do not ship a shared API key in the app. Replace direct browser calls with a small HTTPS proxy that:

- stores `OPENAI_API_KEY` on the server
- accepts `text`, `sourceLang`, `targetLang`, and matched local context
- accepts audio uploads for STT and forwards them to OpenAI audio transcriptions
- accepts translated text for TTS and forwards it to OpenAI speech generation
- calls the same OpenAI Responses API contract
- rate-limits requests per device or site
- logs anonymized utterance/domain/risk metadata for later terminology review
- blocks or flags safety-critical low-confidence translations for human review

## Realtime Expansion Path

Keep the MVP boundary as `audio input -> transcript -> field-context translation -> voice output`. Later, add a second hands-free mode backed by `gpt-realtime-translate`:

- keep the same glossary and translation memory retrieval layer
- request a short-lived Realtime session token from the server
- connect the mobile client to OpenAI Realtime over WebRTC
- inject field terminology as session instructions or compact context
- preserve the current STT/text/TTS path as the low-cost, auditable default

This lets the product start with controlled cost and terminology review, then add lower-latency simultaneous interpretation when the field UX requires it.

## Review Loop

Use session logs to identify misses, add confirmed phrases to `translationMemory`, and add recurring shop-floor terms to `glossary`. This turns AI output into curated data rather than allowing the model to become the only source of truth.

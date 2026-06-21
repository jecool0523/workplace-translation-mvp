# AI Translation Design

## Goal

The PoC supports an AI-assisted Korean/Vietnamese workplace translation path. The AI path is designed to improve translation of manufacturing safety language by injecting the researched field data into every request.

## Runtime Flow

1. User enters or simulates an utterance.
2. The app computes matching glossary terms from the local dataset.
3. If AI mode is enabled and an OpenAI API key is present, the app calls the OpenAI Responses API.
4. The prompt includes source and target language, raw utterance, matched glossary terms, translation memory examples, emergency phrase examples, dataset counts, and a JSON output contract.
5. If the AI request fails, the app falls back to local translation memory.

## Why This Helps Field Terms

- Glossary terms constrain machine, PPE, quality, emergency, and site-slang vocabulary.
- Translation memory gives the model preferred phrase style and risk labeling.
- Emergency phrase hints keep safety instructions short and imperative.
- The output contract returns risk, confidence, domain, and tags so the UI can keep safety cues visible.

## Production Path

The current GitHub Pages build is a client-side PoC. For production, do not ship a shared API key in the app. Replace direct browser calls with a small HTTPS proxy that:

- stores `OPENAI_API_KEY` on the server
- accepts `text`, `sourceLang`, `targetLang`, and matched local context
- calls the same OpenAI Responses API contract
- rate-limits requests per device or site
- logs anonymized utterance/domain/risk metadata for later terminology review
- blocks or flags safety-critical low-confidence translations for human review

## Review Loop

Use session logs to identify misses, add confirmed phrases to `translationMemory`, and add recurring shop-floor terms to `glossary`. This turns AI output into curated data rather than allowing the model to become the only source of truth.

# Workplace Translator PoC

Expo 기반 작업장 실시간 통역 PoC입니다.

## 실행

```powershell
npm.cmd install
npm.cmd run start
```

## 범위

- 한국어-베트남어 우선 통역 흐름
- 긴급 문장 감지
- 제조업/안전/현장 은어 용어 매칭
- 시나리오 로그와 원문/번역 방향 표시
- 오프라인 seed 번역 메모리
- OpenAI API 키 입력 기반 AI 현장 번역
- MVP 통역 구조: STT → 텍스트 AI 번역 → TTS
- 향후 확장 구조: gpt-realtime-translate 기반 핸즈프리 동시통역 모드

현재 PoC는 AI 모드가 켜져 있고 OpenAI API 키가 있으면 `expo-av`로 4초 음성을 녹음한 뒤 OpenAI STT로 텍스트화합니다. 번역 결과는 먼저 화면에 표시하고, 자동 음성 출력은 빠른 브라우저/기기 TTS를 기본으로 사용합니다. OpenAI TTS는 `고품질 AI 음성` 버튼을 누를 때만 별도로 생성합니다. API 키가 없거나 녹음/STT가 실패하면 브라우저 Web Speech API를 시도하고, 지원하지 않는 환경에서는 샘플 발화로 대체합니다. 운영 서비스 전환 시에는 서버 STT/TTS 프록시, 현장 소음 모델, 안전 문구 검수, 네이티브 번역 검수가 필요합니다.

## AI 번역 설계

AI 모드는 `src/data/aiTranslator.ts`에서 OpenAI Responses API를 호출합니다. 요청에는 조사 데이터 기반 용어집, 번역 메모리, 긴급 문장 예시, 위험도 정보를 함께 넣어 현장 용어를 우선 반영하도록 구성했습니다.

MVP 단계에서는 음성을 먼저 OpenAI STT로 텍스트화하고, 그 텍스트에 조사 데이터 컨텍스트를 붙여 빠른 텍스트 모델로 번역한 뒤, 결과를 즉시 화면에 표시합니다. TTS는 뒤에서 기기 TTS로 송출하며 OpenAI TTS는 고품질 음성이 필요할 때만 선택 호출합니다.

GitHub Pages PoC에서는 사용자가 입력한 API 키로 브라우저에서 직접 호출합니다. 운영 배포에서는 API 키를 앱에 넣지 말고 서버 프록시에서 보관해야 합니다. 상세 설계는 `docs/ai-translation-design.md`를 참고하세요.

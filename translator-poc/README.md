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

운영 서비스 전환 시에는 마이크 STT, 현장 소음 모델, 실시간 번역 API, 안전 문구 검수, 네이티브 번역 검수가 필요합니다.

## AI 번역 설계

AI 모드는 `src/data/aiTranslator.ts`에서 OpenAI Responses API를 호출합니다. 요청에는 조사 데이터 기반 용어집, 번역 메모리, 긴급 문장 예시, 위험도 정보를 함께 넣어 현장 용어를 우선 반영하도록 구성했습니다.

GitHub Pages PoC에서는 사용자가 입력한 API 키로 브라우저에서 직접 호출합니다. 운영 배포에서는 API 키를 앱에 넣지 말고 서버 프록시에서 보관해야 합니다. 상세 설계는 `docs/ai-translation-design.md`를 참고하세요.

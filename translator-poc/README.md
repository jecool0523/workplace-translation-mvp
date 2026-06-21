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

운영 서비스 전환 시에는 마이크 STT, 현장 소음 모델, 실시간 번역 API, 안전 문구 검수, 네이티브 번역 검수가 필요합니다.

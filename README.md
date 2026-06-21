# Workplace Translation MVP

외국인 노동자를 위한 작업장 실시간 통역 MVP 자료와 Expo 기반 PoC입니다.

## 구성

- `data/workplace-translation-mvp`: 작업장 시나리오, 산업 용어, 제조업 번역 팩, 현장 은어 팩
- `data/workplace-translation-mvp/vi-priority`: 베트남어 우선 한국어-베트남어 양방향 번역 데이터셋
- `tools`: 데이터셋 재생성 스크립트
- `translator-poc`: 스마트 글래스/이어폰 사용을 가정한 모바일 통역 PoC

## 데이터셋

- 작업장 시나리오 100개
- 작업장 용어 300개
- 제조업 핵심 용어 번역 팩 55개
- 현장 은어 확장 팩 50개와 은어 활용 시나리오 48개
- 베트남어 우선 데이터셋
  - 핵심 용어 628개
  - 자주 쓰는 현장 문장 420개
  - 위험/긴급 문장 160개
  - 은어/축약어/현장 발음 변형 140개
  - 테스트 utterance 740개

## PoC 실행

```powershell
cd translator-poc
npm.cmd install
npm.cmd run start
```

## 주의

번역 데이터는 MVP seed입니다. 안전/긴급 지시문과 은어는 베트남어 네이티브 및 현장 담당자 검수를 거친 뒤 운영 환경에 적용해야 합니다.

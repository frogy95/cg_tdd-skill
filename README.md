# choiji-guide : tdd-skill

AI 에이전트가 TDD 파이프라인을 자동으로 실행하는 **AI 네이티브 개발 프로세스** 프로젝트.

기능 구현 요청 한 줄이면, 명세 작성부터 테스트 → 구현 → 리팩토링 → 검증 → 커밋까지 AI가 순서대로 처리한다.

---

## 파이프라인 개요

```
사용자: "이메일 유효성 검사 기능 추가해줘"

📋 spec  →  🔴 red  →  🟢 green  →  🔧 refactor  →  🔍 verify  →  📦 commit
  명세 작성    실패 테스트   최소 구현     코드 개선       전수 검증      커밋 생성
```

파이프라인은 **오케스트레이터-에이전트 패턴**으로 동작한다. `choiji-tdd-leader` 스킬이 오케스트레이터로서 6개의 전문 서브에이전트를 순서대로 호출하고, 각 단계의 산출물을 다음 에이전트에 주입한다.

---

## 사용법

Claude Code에서 기능 개발을 요청하면 파이프라인이 자동으로 실행된다:

```
"사용자 인증 기능 추가해줘"
"이메일 유효성 검사 구현해줘"
"비밀번호 해싱 기능 만들어줘"
```

또는 스킬을 명시적으로 호출:

```
/choiji-tdd-leader
```

---

## 파이프라인 단계

### 1. Spec — 명세 작성 (Opus)
기능의 **Why(왜 필요한가)**, **What(무엇을 하는가)**, **완료 기준**을 `specs/<feature>.md`에 정의한다. 코드는 작성하지 않는다.

사용자 확인 후 다음 단계로 진행한다.

### 2. Red — 실패 테스트 작성 (Sonnet)
명세의 완료 기준을 테스트 케이스로 변환한다. 테스트가 **실패하는 것이 이 단계의 성공**이다.

```
src/<feature>/<feature>.test.ts
```

### 3. Green — 최소 구현 (Sonnet)
테스트를 통과하는 **가장 단순한 코드**를 작성한다. 하드코딩도 허용. 리팩토링은 하지 않는다.

```
src/<feature>/<feature>.ts
```

### 4. Refactor — 코드 개선 (Sonnet)
테스트를 안전망 삼아 **동작은 유지하면서** 코드 품질을 개선한다. 중복 제거, 가독성 향상, 구조 개선.

### 5. Verify — 전수 검증 (Haiku)
결정적 도구로 객관적으로 검증한다:
- 테스트: `npm test`
- 타입 체크: `npx tsc --noEmit`
- 린터: `npm run lint`
- 빌드: `npm run build`

실패 시 원인에 따라 green 또는 refactor 단계로 자동 복구한다 (최대 2회).

### 6. Commit — 커밋 생성 (Haiku)
명세의 Why를 바탕으로 커밋 메시지를 작성하고, 사용자 승인 후 커밋한다. `specs/*.md`는 커밋하지 않는다.

---

## 에이전트 모델 전략

| 단계 | 모델 | 이유 |
|------|------|------|
| spec | Opus | 요구사항 분석, 엣지 케이스 도출에 깊은 사고 필요 |
| red / green / refactor | Sonnet | 구조화된 코드 작업에 균형 잡힌 성능 |
| verify / commit | Haiku | 도구 실행 및 결과 수집만 하므로 경량 모델로 충분 |

---

## 프로젝트 구조

```
.claude/
  agents/           # 파이프라인 서브에이전트 정의
    choiji-tdd-spec.md
    choiji-tdd-red.md
    choiji-tdd-green.md
    choiji-tdd-refactor.md
    choiji-tdd-verify.md
    choiji-tdd-commit.md
  skills/
    choiji-tdd-leader.md  # 오케스트레이터 스킬
src/
  <feature>/
    <feature>.ts          # 구현 코드
    <feature>.test.ts     # 테스트
specs/                    # 명세 파일 (gitignore됨, 임시 산출물)
```

---

## 설계 원칙

- **AI가 실행, 사람이 승인**: spec 확인과 commit 승인 두 지점에서만 사용자 개입
- **도구가 판단**: verify 단계는 사람의 판단이 아닌 테스트/린터/빌드 결과로 품질을 확인
- **단계별 책임 분리**: 각 에이전트는 하나의 역할만 수행하며, 이전 단계 산출물을 침범하지 않음
- **비용 최적화**: 사고가 필요한 단계에는 고성능 모델, 실행만 하는 단계에는 경량 모델

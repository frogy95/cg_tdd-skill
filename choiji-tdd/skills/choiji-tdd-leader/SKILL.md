---
name: choiji-tdd-leader
description: >
  기능 개발 요청 시 TDD 파이프라인을 실행하는 오케스트레이터 스킬.
  "기능 추가", "구현해줘", "만들어줘", "개발해줘", "새 기능" 등의 요청에 반응한다.
  /spec → /red → /green → /refactor → /verify → /commit 파이프라인을 실행한다.
  사용자가 명시적으로 개별 스킬(/spec, /red, /green 등)을 호출한 경우에는 개입하지 않는다.
---

# Feature Dev 오케스트레이터

각 파이프라인 단계를 서브에이전트로 실행한다.
**오케스트레이터가 상태다**: 단계 사이마다 산출물을 읽어 다음 에이전트의 prompt에 주입한다.

> **핵심 원칙**: 각 단계는 **반드시 Agent 도구**로 실행한다. 직접 코드를 작성하지 않는다.
> 이 스킬은 메인 컨텍스트에서 실행되므로 Agent 도구 호출이 정상 동작한다.

## 파이프라인 흐름

```
/spec ──→ [사용자 확인] ──→ /red → /green → /refactor → /verify ──→ [사용자 확인] ──→ /commit
          ↑ 의도 검증                   오케스트레이터가 컨텍스트 조립 및 전달              ↑ 커밋 승인
```

---

## 에이전트별 모델 지정

| 단계 | subagent_type | model | 이유 |
|------|---------------|-------|------|
| spec | `choiji-tdd:choiji-tdd-spec` | `opus` | 요구사항 분석, 엣지 케이스 도출에 깊은 사고 필요 |
| red | `choiji-tdd:choiji-tdd-red` | `sonnet` | 명세→테스트 변환은 구조화된 작업 |
| green | `choiji-tdd:choiji-tdd-green` | `sonnet` | 최소 구현, 빠른 코드 생성 |
| refactor | `choiji-tdd:choiji-tdd-refactor` | `sonnet` | 코드 패턴 인식과 개선 |
| verify | `choiji-tdd:choiji-tdd-verify` | `haiku` | 도구 실행 결과 수집만 하므로 경량 모델 충분 |
| commit | `choiji-tdd:choiji-tdd-commit` | `haiku` | git 명령 실행만 하므로 경량 모델 충분 |

Agent 도구 호출 시 `subagent_type`과 `model` 파라미터를 반드시 지정한다.

---

## 실행 절차

### 0. 시작

`specs/` 디렉토리를 확인하여 진행 중인 기능이 있는지 파악한다.
기능 이름(feature-name)을 결정한다 (kebab-case, 예: `user-auth`, `email-validation`).

---

### 1단계: choiji-tdd-spec 에이전트 실행 [🛑 사용자 확인]

**Agent 도구로 choiji-tdd-spec 에이전트를 호출한다. (`subagent_type: "choiji-tdd:choiji-tdd-spec"`, `model: "opus"`)**

prompt에 포함할 내용:
```
기능 이름: <feature-name>
사용자 요청 원문: <원문 전체>
```

에이전트 완료 후:
1. `specs/<feature-name>.md`를 **직접 읽는다**
2. 내용을 사용자에게 요약하여 보여준다
3. 확인을 받는다:

```
📋 명세 완료: specs/<feature-name>.md
─────────────────────────────────────
[명세 주요 내용 요약]
─────────────────────────────────────
이 명세대로 구현을 시작할까요? (Y/n)
```

승인 후 spec 파일 내용을 메모리에 보관하고 다음 단계로 진행한다.

---

### 2단계: choiji-tdd-red 에이전트 실행 [자동]

**Agent 도구로 choiji-tdd-red 에이전트를 호출한다. (`subagent_type: "choiji-tdd:choiji-tdd-red"`, `model: "sonnet"`)**

prompt에 포함할 내용 (1단계에서 읽은 파일 내용 주입):
```
기능 이름: <feature-name>
명세 파일 경로: specs/<feature-name>.md
명세 파일 내용:
---
<specs/<feature-name>.md 전체 내용>
---
```

에이전트 완료 후:
1. 반환된 `TEST_FILE` 경로를 기록한다
2. 진행 상황 출력:
```
🔴 Red 완료 → /green 진행 중...
```

---

### 3단계: choiji-tdd-green 에이전트 실행 [자동]

**Agent 도구로 choiji-tdd-green 에이전트를 호출한다. (`subagent_type: "choiji-tdd:choiji-tdd-green"`, `model: "sonnet"`)**

prompt에 포함할 내용 (테스트 파일 내용 주입):
```
기능 이름: <feature-name>
테스트 파일 경로: <TEST_FILE>
실패하는 테스트 목록:
<FAILED_TESTS>

명세 내용 (참고용):
---
<specs/<feature-name>.md 전체 내용>
---
```

에이전트 완료 후:
1. 반환된 `IMPL_FILES` 목록을 기록한다
2. 진행 상황 출력:
```
🟢 Green 완료 → /refactor 진행 중...
```

---

### 4단계: choiji-tdd-refactor 에이전트 실행 [자동]

**Agent 도구로 choiji-tdd-refactor 에이전트를 호출한다. (`subagent_type: "choiji-tdd:choiji-tdd-refactor"`, `model: "sonnet"`)**

prompt에 포함할 내용 (구현 파일 목록 주입):
```
기능 이름: <feature-name>
테스트 파일 경로: <TEST_FILE>
구현 파일 목록:
<IMPL_FILES>
```

에이전트 완료 후:
1. 반환된 `REFACTORED_FILES`와 `CHANGES`를 기록한다
2. 진행 상황 출력:
```
🔧 Refactor 완료 → /verify 진행 중...
```

---

### 5단계: choiji-tdd-verify 에이전트 실행 [자동, 실패 시 재시도]

**Agent 도구로 choiji-tdd-verify 에이전트를 호출한다. (`subagent_type: "choiji-tdd:choiji-tdd-verify"`, `model: "haiku"`)**

prompt에 포함할 내용:
```
기능 이름: <feature-name>
변경된 파일 목록:
- <TEST_FILE>
- <IMPL_FILES>
- <REFACTORED_FILES>
```

#### 에러 복구 루프 (최대 2회 자동 재시도)

**통과 시**: 다음 단계로 진행한다.

**실패 시 (1~2회차)**: 실패 원인을 분석하여 해당 단계로 자동 복구한다:
- 테스트 실패 → green 에이전트 재실행 (문제가 된 실패 테스트 목록 주입)
- 린터/타입 오류 → refactor 에이전트 재실행 (오류 내용 주입)
- 재시도 후 verify를 다시 실행한다

**2회 재시도 후에도 실패 시**: 자동 진행을 멈추고 사용자에게 보고한다:
```
❌ Verify 실패 — 자동 복구 불가 (2회 시도)
─────────────────────────────────────
[DETAILS 내용]
─────────────────────────────────────
권장 조치: [ROLLBACK_TO] 단계로 돌아가세요
```

---

### 6단계: choiji-tdd-commit 에이전트 실행 [🛑 사용자 확인]

verify 통과 후, 명세의 Why/What을 바탕으로 커밋 메시지 초안을 직접 작성하여 사용자에게 제시한다:

```
🔍 검증 통과 — 커밋 준비 완료
─────────────────────────────────────
커밋 메시지 초안:
  feat: <제목>

  <본문 — 명세의 Why를 기반으로>

  Pipeline: /choiji-tdd:choiji-tdd-leader
─────────────────────────────────────
이 메시지로 커밋할까요? (Y/n/수정)
```

승인 후 **Agent 도구로 choiji-tdd-commit 에이전트를 호출한다. (`subagent_type: "choiji-tdd:choiji-tdd-commit"`, `model: "haiku"`)**

prompt에 포함할 내용:
```
기능 이름: <feature-name>
기능 맥락 (명세의 Why/What):
<feature_context>

사용자가 승인한 커밋 메시지:
<commit_message_draft>
```

---

## 파이프라인 완료

```
🎉 파이프라인 완료
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 spec ✅ → 🔴 red ✅ → 🟢 green ✅ → 🔧 refactor ✅ → 🔍 verify ✅ → 📦 commit ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
커밋: <COMMIT_HASH> — <COMMIT_MESSAGE>
```

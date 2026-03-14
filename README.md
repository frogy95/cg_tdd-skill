# choiji-tdd

AI 에이전트가 TDD 파이프라인을 자동으로 실행하는 **Claude Code 플러그인**.

기능 구현 요청 한 줄이면, 명세 작성부터 테스트 → 구현 → 리팩토링 → 검증 → 커밋까지 AI가 순서대로 처리한다.

---

## 파이프라인 개요

```
사용자: "이메일 유효성 검사 기능 추가해줘"

📋 spec  →  🔴 red  →  🟢 green  →  🔧 refactor  →  🔍 verify  →  📦 commit
  명세 작성    실패 테스트   최소 구현     코드 개선       전수 검증      커밋 생성
```

`choiji-tdd-leader` 스킬이 오케스트레이터로서 6개의 전문 서브에이전트를 순서대로 호출하고, 각 단계의 산출물을 다음 에이전트에 주입한다.

---

## 설치

```bash
# 프로젝트 루트에서 실행
git clone https://github.com/frogy95/cg_tdd-skill /tmp/choiji-tdd
cp -r /tmp/choiji-tdd/choiji-tdd/agents/. .claude/agents/
cp -r /tmp/choiji-tdd/choiji-tdd/skills/. .claude/skills/
rm -rf /tmp/choiji-tdd
```

---

## 사용법

Claude Code에서 기능 개발을 요청하면 자동으로 실행된다:

```
"사용자 인증 기능 추가해줘"
"이메일 유효성 검사 구현해줘"
```

또는 스킬을 명시적으로 호출:

```
/choiji-tdd:choiji-tdd-leader
```

**사용자 개입 지점은 두 곳뿐이다**: spec 완료 후 명세 확인, commit 전 메시지 승인.

---

## 파이프라인 단계

| 단계 | 역할 | 모델 |
|------|------|------|
| **Spec** | 기능의 Why/What/완료 기준을 `specs/<feature>.md`에 정의 | Opus |
| **Red** | 명세의 완료 기준을 실패하는 테스트로 변환 | Sonnet |
| **Green** | 테스트를 통과하는 최소 구현 작성 (하드코딩 허용) | Sonnet |
| **Refactor** | 동작 유지하면서 코드 품질 개선 | Sonnet |
| **Verify** | 테스트/타입/린터/빌드 전수 검증, 실패 시 자동 복구 (최대 2회) | Haiku |
| **Commit** | 명세의 Why를 바탕으로 커밋 메시지 작성 후 커밋 | Haiku |

---

## 설계 원칙

- **AI가 실행, 사람이 승인**: 두 지점에서만 사용자 개입
- **도구가 판단**: verify는 테스트/린터/빌드 결과로 품질 확인, 사람의 주관 배제
- **단계별 책임 분리**: 각 에이전트는 이전 단계 산출물을 침범하지 않음
- **비용 최적화**: 사고가 필요한 단계는 고성능 모델, 실행만 하는 단계는 경량 모델

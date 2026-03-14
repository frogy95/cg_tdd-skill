# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# choiji-guide-3

AI 네이티브 개발 프로세스를 정의하는 프로젝트. 실제 프로덕트 코드가 아니라 **TDD 기반 AI 에이전트 파이프라인 자체**가 이 프로젝트의 산출물이다.

## 개발 프로세스

기능 개발 시 TDD 파이프라인을 따른다:

```
/spec → /red → /green → /refactor → /verify → /commit
```

파이프라인 전체 실행: `/choiji-tdd-leader` 스킬 사용 (`.claude/skills/choiji-tdd-leader.md` 참조)

**중요**: 오케스트레이터(`choiji-tdd-leader`)는 각 단계를 직접 구현하지 않고, 반드시 `Agent` 도구를 통해 서브에이전트를 호출한다.

## 언어 규칙

- 응답 언어: 한국어
- 코드 주석: 한국어
- 커밋 메시지: 한국어
- 변수명/함수명: 영어 (코드 표준 준수)

## 에이전트 시스템 구조

### 파이프라인 에이전트 (`.claude/agents/`)

| 에이전트 | 역할 | 핵심 제약 |
|----------|------|-----------|
| `choiji-tdd-spec` | 명세 작성 → `specs/<feature>.md` | 코드 작성 금지 |
| `choiji-tdd-red` | 실패하는 테스트 작성 | 구현 코드 수정 금지 |
| `choiji-tdd-green` | 테스트 통과하는 최소 구현 | 테스트 파일 수정 금지, 리팩토링 금지 |
| `choiji-tdd-refactor` | 코드 품질 개선 | 동작 변경 금지, 신기능 추가 금지 |
| `choiji-tdd-verify` | 테스트/타입/린터/빌드 전수 검증 | 판단은 도구에 맡김 |
| `choiji-tdd-commit` | git 커밋 생성 | `specs/*.md` 스테이징 금지 |

### 파일 컨벤션

- 테스트: `src/<feature-name>/<feature-name>.test.ts`
- 구현: `src/<feature-name>/<feature-name>.ts`
- 명세: `specs/<feature-name>.md` (gitignore됨, 임시 산출물)

## 검증 명령어

프로젝트에 TypeScript + Jest 환경이 있을 때 사용하는 명령어:

```bash
npm test                    # 전체 테스트 실행
npm test -- --testPathPattern=<feature>  # 특정 기능 테스트만 실행
npx tsc --noEmit            # 타입 체크
npm run lint                # 린터
npm run build               # 빌드
```

## 커밋 메시지 타입

| 타입 | 용도 |
|------|------|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 동작 변경 없는 코드 개선 |
| `test` | 테스트 추가/수정 |
| `docs` | 문서 변경 |
| `chore` | 빌드, 설정 변경 |

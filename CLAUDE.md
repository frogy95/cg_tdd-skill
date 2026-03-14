# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# choiji-tdd

`choiji-tdd` Claude Code 플러그인을 개발하는 레포. 산출물은 마크다운 파일(스킬, 에이전트 정의)이며, 빌드/컴파일 단계는 없다.

## 플러그인 구조

```
choiji-tdd/                          # 플러그인 루트
  .claude-plugin/plugin.json         # 플러그인 매니페스트
  skills/choiji-tdd-leader/SKILL.md  # 오케스트레이터 스킬
  agents/                            # 파이프라인 서브에이전트 6개
.claude-plugin/marketplace.json      # 마켓플레이스 매니페스트
```

## 파일별 역할

- **`plugin.json`**: 플러그인 이름, 버전, 설명 메타데이터
- **`SKILL.md`**: 사용자가 `/choiji-tdd:choiji-tdd-leader`로 호출하는 오케스트레이터. 각 단계를 `Agent` 도구로 서브에이전트에 위임한다
- **`agents/choiji-tdd-*.md`**: 각 단계 전담 에이전트. frontmatter의 `tools`로 접근 가능한 도구를 제한한다
- **`marketplace.json`**: 이 레포를 마켓플레이스로 사용할 때 플러그인 목록 정의

## 에이전트 파일 규칙

에이전트 파일은 frontmatter + 본문으로 구성된다:

```markdown
---
name: choiji-tdd-<단계>
description: >
  한 줄 설명 (Claude가 에이전트를 선택하는 기준)
tools:
  - Read   # 필요한 도구만 명시 (최소 권한 원칙)
---

# 본문 (에이전트 지시사항)
```

`description`은 오케스트레이터가 `subagent_type`으로 호출할 때 사용되므로 정확하게 작성한다.

## 언어 규칙

- 응답 언어: 한국어
- 커밋 메시지: 한국어

## 커밋 메시지 타입

`feat` / `fix` / `refactor` / `docs` / `chore`

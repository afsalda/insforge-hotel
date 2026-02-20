---
name: Skill Master
description: A master suite of autonomous development workflows: GSD (Spec-Driven), Ralph (Iterative), and Troubleshooting Master (Error Handling).
---

# Skill Master

This is a master skill that provides access to three powerful capabilities: **Get Shit Done (GSD)**, **Ralph**, and **Troubleshooting Master**.

---

## 🚀 Get Shit Done (GSD)
A context-aware, spec-driven development workflow to systematically build high-quality software.

**Use this when:**
1. Starting a new project/epic.
2. Building complex, multi-plan features.
3. Heavy focus on context engineering and spec-driven build is needed.

### GSD Core Workflow
- **Phase 1: Initialize**: Map codebase and define `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`.
- **Phase 2: Context**: Clarify phase goals in `{id}-CONTEXT.md`.
- **Phase 3: Plan**: Generate atomic `PLAN.md` files.
- **Phase 4: Execute**: Implement tasks, verify, and commit atomically.
- **Phase 5: Verify**: Confirm deliverables against specs in `VERIFICATION.md`.

**Resources**: `gsd/resources/agents/`, `gsd/resources/docs/`.

---

## 🤖 Ralph Iterative Development
An autonomous agent loop for building features story-by-story using a simple PRD.

**Use this when:**
1. Implementing a feature with a clearly defined list of user stories.
2. You want a persistent feedback loop (PRD -> Code -> Test -> Update).

### Ralph Core Workflow
1. **Check Stories**: Read `prd.json`.
2. **Read Context**: Check `progress.txt` and `AGENTS.md`.
3. **Select Story**: Pick the highest priority incomplete story.
4. **Implement & Verify**: Focus on one story, run tests/browser checks.
5. **Update**: Set story to `passes: true`, update `progress.txt` and `AGENTS.md`.

**Resources**: `ralph/resources/`.

---

## 🔧 Troubleshooting Master
Master error handling patterns and strategies for building resilient applications.

**Use this when:**
1. Debugging production issues or complex bugs.
2. Designing error handling for new APIs/features.
3. Implementing resilience patterns (circuit breakers, retries).

**Resources**: `troubleshooting/SKILL.md`

---

## 🎨 UI/UX Pro Max
An AI skill that provides design intelligence for building professional UI/UX across multiple platforms and frameworks.

**Use this when:**
1. Designing a new UI component or page.
2. Generating a complete design system for a project.
3. Choosing color palettes, typography, or layout structures.
4. Looking for UI/UX best practices for specific frameworks (React, Tailwind, etc.).

**Resources**: `ui_ux_skill/SKILL.md`

---

## 💡 How to Choose?
- **GSD** is for **architectural heavy lifting** and complex dependencies.
- **Ralph** is for **iterative feature building** via user stories.
- **Troubleshooting Master** is for **fixing bugs** and designing error resilience.
- **UI/UX Pro Max** is for **design intelligence** and frontend styling.

---

## Agent Instructions
When the user invokes these skills, refer to their specific resources:
- **GSD Agents**: `gsd/resources/agents/gsd-planner.md`, `gsd-executor.md`, etc.
- **Ralph Templates**: `ralph/resources/prd.json.example`, `AGENTS.md.template`.
- **Troubleshooting Guide**: `troubleshooting/SKILL.md`.

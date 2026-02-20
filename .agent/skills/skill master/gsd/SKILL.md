---
name: Get Shit Done (GSD)
description: A context-aware, spec-driven development workflow to systematically build high-quality software.
---

# Get Shit Done (GSD) Skill

The **Get Shit Done (GSD)** system is a structured workflow for AI-driven development. It ensures heavy context management, clear requirements ("specs"), and atomic execution.

**Use this skill when:**
1.  Starting a new project/epic (`/gsd:new-project`).
2.  Building a complex feature (`/gsd:plan-phase`).
3.  Or when the `.planning/` directory exists in the project root.

## Core Philosophy
*   **Context Engineering**: Maintain fresh context for each task. Don't let the context window degrade.
*   **Spec-Driven**: Define *what* to build (Requirements/Plan) before *how* (Code).
*   **Atomic Execution**: Break work into small, verifiable tasks.
*   **Verification**: Verify artifacts against requirements.

## File Structure

The GSD system tracks state in the `.planning/` directory:
*   `PROJECT.md`: Vision, stack, and high-level goals.
*   `ROADMAP.md`: Timeline and phases.
*   `REQUIREMENTS.md`: Detailed specs.
*   `STATE.md`: Current context and decision log.
*   `phases/{phase_id}/{plan_id}-PLAN.md`: Executable task plans.

## Workflow Instructions for the Agent

When acting as the GSD Orchestrator, follow these phases:

### Phase 1: New Project / Initialization
**Trigger**: User says "Start a new project" or "Initialize GSD".
1.  **Map Codebase**: If existing code, run `resources/agents/gsd-codebase-mapper.md`.
2.  **Define Project**: Run `resources/agents/gsd-project-researcher.md` (interactively with user).
3.  **Outputs**: Create `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`.

### Phase 2: Discuss & Context
**Trigger**: Before starting a phase.
1.  **Ask Questions**: Clarify the goals for the next phase.
2.  **Create Context**: Summarize decisions in `.planning/phases/{id}-CONTEXT.md`.

### Phase 3: Plan
**Trigger**: Ready to plan a phase.
1.  **Adopt Role**: Read `resources/agents/gsd-planner.md`.
2.  **Generate Plan**: Create `PLAN.md` files in `.planning/phases/`.
    *   Plans MUST be small (2-3 tasks).
    *   Plans MUST be atomic.
    *   Plans MUST verify against `REQUIREMENTS.md`.

### Phase 4: Execute
**Trigger**: Plan is approved.
1.  **Adopt Role**: Read `resources/agents/gsd-executor.md`.
2.  **Execute Plans**:
    *   Implement tasks specified in `PLAN.md`.
    *   Verify each task immediately.
    *   Commit changes atomically.
    *   Update `Plan.md` status.

### Phase 5: Verify
**Trigger**: Phase execution complete.
1.  **Adopt Role**: Read `resources/agents/gsd-verifier.md`.
2.  **Verify**: Check if the deliverables match the `REQUIREMENTS.md` and `ROADMAP.md`.
3.  **Output**: `VERIFICATION.md`.

## Agent Resources
Use these prompt templates to guide your behavior in each phase:
*   **Planner**: `resources/agents/gsd-planner.md`
*   **Executor**: `resources/agents/gsd-executor.md`
*   **Verifier**: `resources/agents/gsd-verifier.md`
*   **Codebase Mapper**: `resources/agents/gsd-codebase-mapper.md`
*   **Project Researcher**: `resources/agents/gsd-project-researcher.md`

## Quick Reference
If you need to perform a quick task without full planning, use the **Quick Mode**:
*   Create a simple plan in `.planning/quick/`.
*   Execute immediately.

---
name: Ralph Iterative Development
description: An autonomous agent loop for building features story-by-story using a PRD.
---

# Ralph Agent Skill

Use this skill when the user wants to implement a feature iteratively using the Ralph methodology. This workflow breaks down features into small, testable user stories and implements them one by one, ensuring high quality and progress tracking.

## Core Workflow

When this skill is active, follow this cycle:

1.  **Check User Stories**: Read `prd.json` (in the root or working directory).
    *   If `prd.json` does not exist, ask the user to help create one, or copy the example from this skill's `resources/prd.json.example`.
    *   Validate that stories are small and self-contained.

2.  **Read Context**:
    *   Read `progress.txt` to understand the current state and learnings from previous iterations.
    *   Read `AGENTS.md` (if it exists) in relevant directories to learn about codebase patterns and gotchas.

3.  **Select Story**:
    *   Pick the **highest priority** user story where `passes: false`.
    *   If all stories are `passes: true`, announce completion.

4.  **Implement**:
    *   Focus *only* on the selected story.
    *   Write the necessary code.
    *   **Verify**: Run typechecks, linters, and tests.
    *   **Browser Verification**: specific frontend stories MUST be verified using the `dev-browser` skill (if available) or by instructing the user to check.

5.  **Record & Update**:
    *   **Update `AGENTS.md`**: If you discover a reusable pattern or gotcha, update the relevant `AGENTS.md`.
    *   **Update `progress.txt`**: Append a log entry with:
        *   Story ID and Title.
        *   Files changed.
        *   Learnings/Patterns discovered.
    *   **Update `prd.json`**: Set `passes: true` for the completed story.

6.  **Loop**:
    *   Ask the user: "Story [ID] complete. Shall I proceed to the next story: [Next Story Title]?"

## File Formats

### `prd.json`
See `resources/prd.json.example` for the structure. Key fields:
*   `userStories`: Array of story objects.
    *   `id`: Unique ID (e.g., US-001).
    *   `title`: Short description.
    *   `acceptanceCriteria`: List of checks.
    *   `priority`: Integer (lower is higher priority).
    *   `passes`: Boolean.

### `progress.txt`
Append-only log. Structure:
```markdown
## [Date/Time] - [Story ID]
- What was implemented
- Files changed
- **Learnings:**
  - Patterns discovered...
```

### `AGENTS.md`
Documentation for future agents. Place in relevant directories. Contains:
*   Architecture patterns.
*   Testing strategies.
*   Gotchas.

## Tips for the Agent

*   **One story at a time**. Do not try to implement multiple stories in one turn.
*   **Keep it green**. Ensure the build passes before marking a story as complete.
*   **Aesthetics matter**. If the story involves UI, ensure it looks premium and matches the design system.

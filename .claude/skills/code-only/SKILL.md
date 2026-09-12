---
name: code-only
description: Write or edit code changes without running any terminal/shell commands to check for syntax errors, type errors, lint issues, or test results. Use when the user asks to just write the code, skip verification, or not run the terminal/build/tests.
---

# Code-only mode

When this skill is active, write or edit the requested code using Read/Write/Edit/Glob/Grep only.

Rules:
- Do NOT run Bash, PowerShell, or any shell/terminal tool for this task — not to check syntax, not to type-check, not to lint, not to run tests, not to build, and not to start a dev server.
- Do NOT launch subagents (e.g. via the Agent tool) to run those checks on your behalf either — the restriction applies to the whole task, not just your own tool calls.
- Rely on careful manual reading of the file you just wrote/edited to catch mistakes (mismatched brackets, wrong imports, typos) instead of executing anything.
- If you are genuinely unsure whether something is correct (e.g. an API's exact signature), say so in your reply rather than running a command to verify it.
- It is fine to use Read/Glob/Grep to inspect existing code for context before writing — the restriction is only on executing/running things (terminals, servers, test runners, builds).
- End your reply by stating plainly that the change was not verified by running anything, so the user knows to check it themselves.

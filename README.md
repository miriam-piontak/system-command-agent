# System Command Agent

Submitter: Miriam Piontak
Course: AI: Engineering, Integration & Architecture

Description
-----------
System Command Agent is a client-server application that classifies short user text requests and executes simple desktop tools when applicable. The system returns structured JSON responses that the client UI renders.

Implemented tools
-----------------
- `calculator` — open calculator
- `browser` — open web browser
- `clock` — open clock
- `calendar` — open calendar
- `downloads` — open downloads folder
- `screenshot` — take a screenshot
- `recycle` — open recycle bin
- `fileExplorer` — open file explorer
- `notes` — open notes app
- `terminal` — open terminal
- `settings` — open system settings

Architecture
------------
Client
- Angular single-page application with a text input, send button, and three response components:
  - `app-success-response`
  - `app-unsupported-response`
  - `app-irrelevant-response`
- The client sends requests to a single server endpoint: `POST /api/agent` and updates the UI based on the response `type`.

Server
- Express backend exposing `POST /api/agent`.
- The agent flow:
  1. Validate incoming request JSON.
  2. Send system prompt + user text to OpenAI (function-calling) to classify intent.
  3. Fallback: local keyword classifier when AI is unavailable.
  4. Execute a supported tool when applicable.
  5. Validate and return a structured JSON response.
- JSON Schema (AJV) validates requests and responses.
- Retry logic is applied when AI returns invalid/malformed JSON; response building also retries before returning an error.
- Errors are handled by middleware and logged to `Server/src/logs/agent.log`.

Requirements implemented
----------------------
- Understand user intent and classify requests (`UNDERSTAND`).
- Detect whether a request is a computer action (`COMPUTER ACTION`).
- Execute supported tools (`SUPPORTED`).
- Return `unsupported` for not-implemented tools (`UNSUPPORTED`).
- Return `irrelevant` for off-topic requests (`IRRELEVANT`).
- Enforce structured JSON-only output (`STRUCTURED OUTPUT`).
- Validate inputs/outputs with AJV (`VALIDATION`).
- Robust error handling for API errors and invalid JSON (`ERROR HANDLING`).

Development tools
-----------------
- Node.js
- Express
- Angular
- OpenAI Node SDK
- AJV
- JavaScript/TypeScript

Run instructions
----------------
1. In the server folder: `npm install`
2. Start the server: `npm start`
3. In the client folder: `npm install`
4. Start the client (Angular): `npm start`

Prompt files and documentation
------------------------------
- Canonical system prompt: `agentPrompts.js` (root) — the exact system prompt string used at runtime.
- Prompt documentation: `PROMPT_README.md` (root) — contains the prompt text, function schema, validation rules and example inputs/outputs.

Reports
-------
- `reports/tool-outputs.jsonl` — canonical smoke-test outputs for supported tools and scenarios (supported/unsupported/irrelevant/error).

Preparing for GitHub
--------------------
1. Ensure no secrets are committed (keep OpenAI API key in environment variables only).
2. The repository already contains a `.gitignore` excluding `node_modules`, `logs`, and local env files.
3. To push to GitHub:
```bash
git add .
git commit -m "Add prompt, prompt README, reports, and .gitignore"
git push origin main
```

Notes
-----
- The server expects to receive only `POST /api/agent` requests from the client.
- If you update the prompt, increment its version in `PROMPT_README.md` and document the change.

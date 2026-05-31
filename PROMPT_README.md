# Prompt Engineering — System Prompt (project canonical)

This file documents the exact system prompt used by the server and metadata required for grading.

-- Exact system prompt (as used by the server) --

```text
ROLE:
You are the System Command Agent — a desktop automation assistant that operates a small set of system tools on behalf of the user.

TASK:
1) Receive a short user text request.
2) Decide whether the request is a computer/tool action or an irrelevant/off-topic request.
3) If it is a computer/tool action, identify the appropriate supported tool.
4) Return a single, structured JSON object (as function_call.arguments) describing the classification and a short Hebrew message for the user.

CONTEXT:
This agent runs inside a client/server application. The client sends a single text field to POST /api/agent. The server will forward this prompt and user text to the model and expects a function_call with JSON arguments. Supported tool ids: calculator, browser, clock, calendar, downloads, screenshot, recycle, fileExplorer, notes, terminal, settings.

CONSTRAINTS (must follow):
- Return exactly one valid JSON object as the function call arguments. Do not output any extra text, markup, or commentary outside the JSON.
- The top-level "type" field must be one of: "SUPPORTED_ACTION", "UNSUPPORTED_ACTION", "IRRELEVANT_REQUEST".
- The "message" field must be a short (1-2 sentences) Hebrew string in a light comedic tone — this text will be shown to the user.
- When "type" is "SUPPORTED_ACTION", include a "tool" field with one of the supported tool ids listed above.
- Do not include any fields not expected by the server's response schema. If uncertain, return the minimal valid JSON.
- If the user asks for unrelated content (e.g., "tell me a joke"), classify it as "IRRELEVANT_REQUEST" and return a short refusal/help message in Hebrew — do NOT produce the unrelated content itself.
- If the user requests an application that is not implemented (e.g., Photoshop), return "UNSUPPORTED_ACTION" and a short comedic Hebrew message; the server will log unsupported requests.

FORMAT (exact templates — return one of the following JSON objects):
- Supported example:
  {"type":"SUPPORTED_ACTION","message":"המחשבון פתוח ומוכן, אל תתנו לו יותר מדי מספרים!","tool":"calculator"}

- Unsupported example:
  {"type":"UNSUPPORTED_ACTION","message":"מצטערים, פעולה זו עדיין אינה נתמכת."}

- Irrelevant example (refusal/help):
  {"type":"IRRELEVANT_REQUEST","message":"אני סוכן מערכת שמפעיל כלים במחשב. לא אוכל לבצע את הבקשה הזו — מה תרצה שאפתח במקום זאת?"}

MODEL & RUNTIME CONFIGURATION
- Model: `gpt-4o-mini` (see `Server/src/config/openai.config.js`)
- Temperature: `0.0` (deterministic output)
- Function-calling: server supplies `functions` with a `classify_request` definition and requests `function_call: { name: 'classify_request' }`.
- Max intent retries: configured in `Server/src/config/retry.config.js` (default: `MAX_INTENT_RETRIES`).

Function schema (as sent in code)
```json
{
  "name": "classify_request",
  "description": "Classify a user request for the desktop tool agent.",
  "parameters": {
    "type": "object",
    "properties": {
      "type": {
        "type": "string",
        "enum": ["SUPPORTED_ACTION", "UNSUPPORTED_ACTION", "IRRELEVANT_REQUEST"]
      },
      "tool": {
        "type": "string",
        "enum": ["calculator","browser","clock","calendar","downloads","screenshot","recycle","fileExplorer","notes","terminal","settings"]
      },
      "message": { "type": "string", "description": "A short Hebrew message with a light comedic tone." }
    },
    "required": ["type","message"],
    "additionalProperties": false
  }
}
```

Validation and response schema
- Request schema: `Server/src/validation/agent-request.schema.json` (requires `text: string`).
- Intent schema: `Server/src/validation/intent.schema.json` (validates OpenAI function output).
- Response schema: `Server/src/validation/agent-response.schema.json` (final responses sent to client).

Retry & error policy (as implemented)
- If OpenAI returns invalid/malformed JSON or fails schema validation, server retries up to `MAX_INTENT_RETRIES` (see `Server/src/config/retry.config.js`).
- If response building fails schema validation, `executeWithRetry()` retries building responses a limited number of times before returning a standardized error JSON.
- Express error handler redacts raw parser/stack traces from client responses and logs full details to `Server/src/logs/agent.log`.

Examples (smoke tests)
- Input: `"open calculator"` → Expected: `{"type":"SUPPORTED_ACTION","tool":"calculator","message":"...Hebrew message..."}`
- Input: `"open Photoshop"` → Expected: `{"type":"UNSUPPORTED_ACTION","message":"...Hebrew message..."}`
- Input: `"tell me a joke"` → Expected: `{"type":"IRRELEVANT_REQUEST","message":"...Hebrew refusal/help..."}`

Notes & best practices
- Keep this file identical to the system prompt used in code — `Server` imports the string from `agentPrompts.js` at runtime.
- Do not include API keys or secrets in this file.
- If you modify the prompt, increment a prompt version in this file and record the change.

Location in repository
- Canonical prompt string: `agentPrompts.js` (root)
- Function schema: `Server/src/services/openai.service.js`
- Retry/config: `Server/src/config/retry.config.js`
- Validation schemas: `Server/src/validation/`

-- End of PROMPT README --

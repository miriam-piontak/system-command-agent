// Service that uses OpenAI to classify user requests.
// It defines a function calling schema and validates the AI response against an intent schema.
// הסבר בעברית: קובץ זה מתקשר עם ספריית OpenAI. הוא שולח את ה"system prompt"
// (המוגדר ב־`agentPrompts.js`) ובקשת המשתמש, ומצפה ל"function call" מובנה המכיל
// שדה `type` ו־`message` — כאשר `message` אמור להיות ההודעה הקומית בעברית שה־AI מייצר.
const OpenAI = require('openai');
const validationService = require('./validation.service');
const openaiConfig = require('../config/openai.config');
const { SYSTEM_COMMAND_AGENT_PROMPT } = require('../../agentPrompts');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Define the OpenAI function schema used to request structured classification.
// שינוי actionType ל-type בתוך ה-functionDefinition
const functionDefinition = {
  name: 'classify_request',
  description: 'Classify a user request for the desktop tool agent.',
  parameters: {
    type: 'object',
    properties: {
      type: { // שונה מ-actionType ל-type
        type: 'string',
        enum: ['SUPPORTED_ACTION', 'UNSUPPORTED_ACTION', 'IRRELEVANT_REQUEST']
      },
      tool: {
        type: 'string',
        enum: ['calculator', 'browser', 'clock', 'calendar', 'downloads', 'screenshot', 'recycle', 'fileExplorer', 'notes', 'terminal', 'settings']
      },
      message: {
        type: 'string',
        description: 'A short Hebrew message with a light comedic tone.'
        // הערה: השדה `message` אמור להכיל את הטקסט שיוצג ללקוח — קצר, בעברית, ועם טאץ\u200F קומי.
      }
    },
    required: ['type', 'message'], // שונה ל-type
    additionalProperties: false
  }
};

// Send the user text to OpenAI and parse the function call response.
// The response must be a JSON object that describes the user intent.
async function classifyText(text) {
  const response = await client.chat.completions.create({
    model: openaiConfig.model,
    messages: [
      {
        role: 'system',
        content: SYSTEM_COMMAND_AGENT_PROMPT
      },
      {
        role: 'user',
        content: text
      }
    ],
    functions: [functionDefinition],
    function_call: { name: 'classify_request' },
    temperature: 0.0
  });

  const choice = response.choices?.[0];
  if (!choice || !choice.message?.function_call?.arguments) {
    throw new Error('OpenAI did not return a valid function call response.');
  }

  const argumentsText = choice.message.function_call.arguments;
  let parsed;
  try {
    parsed = JSON.parse(argumentsText);
  } catch (error) {
    throw new Error('Failed to parse OpenAI function call arguments as JSON.');
  }

  const validation = validationService.validateIntent(parsed);
  if (!validation.valid) {
    throw new Error('OpenAI intent response failed schema validation.');
  }

  return parsed;
}

module.exports = {
  classifyText
};

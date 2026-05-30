// Core service for processing agent requests.
// This file validates requests, classifies intent, executes tools, and builds standardized responses.
// הסבר בעברית: זהו השירות הראשי שמקבל בקשות מה־API, מוודא שהן תקינות,
// שולח את הטקסט ל־OpenAI (באמצעות `openai.service`) לקבלת סיווג/הודעה, ומבצע את ההוראות הרלוונטיות.
const validationService = require('./validation.service');
const aiIntentService = require('./openai.service');
const toolExecutor = require('./tool-executor.service');
const retryConfig = require('../config/retry.config');
const logger = require('../utils/logger');

const supportedTools = [
  'calculator',
  'browser',
  'clock',
  'calendar',
  'downloads',
  'screenshot',
  'recycle',
  'fileExplorer',
  'notes',
  'terminal',
  'settings'
];

// Normalize the input text for easier matching.
function normalizeText(text = '') {
  return text.toLowerCase().trim();
}

// Classify the request using simple keyword matching as a fallback.
// It returns a type and optional tool name for supported actions.
function classifyRequest(text) {
  const normalized = normalizeText(text);

  // הערה: זוהי פונקציה רזרבית — ריצה מקומית לתפוס בקשות פשוטות
  // כאשר ה־AI לא זמין; מחזירה סוג פעולה (`type`) ואפשרות לכלי (`tool`).
  if (!normalized) {
    return { type: 'IRRELEVANT_REQUEST', reason: 'empty_request' };
  }

  const supportedMatches = [
    { tool: 'calculator', patterns: ['calculator', 'מחשבון', 'calc'] },
    { tool: 'browser', patterns: ['browser', 'דפדפן', 'web', 'internet'] },
    { tool: 'clock', patterns: ['clock', 'שעון', 'time'] },
    { tool: 'calendar', patterns: ['calendar', 'לוח שנה', 'לוח', 'calendar app'] },
    { tool: 'downloads', patterns: ['downloads', 'תיקיית הורדות', 'הורדות'] },
    { tool: 'screenshot', patterns: ['screenshot', 'מסך', 'צלם מסך', 'צילום מסך'] },
    { tool: 'recycle', patterns: ['recycle', 'סל מיחזור', 'סל', 'recycle bin'] },
    { tool: 'fileExplorer', patterns: ['file explorer', 'סייר הקבצים', 'מחשב', 'חלון קבצים'] },
    { tool: 'notes', patterns: ['notes', 'פנקס', 'פתקים', 'notepad'] },
    { tool: 'terminal', patterns: ['terminal', 'טרמינל', 'שורת פקודה', 'cmd', 'powershell'] },
    { tool: 'settings', patterns: ['settings', 'הגדרות', 'system settings', 'הגדרות מערכת'] }
  ];

  for (const match of supportedMatches) {
    if (match.patterns.some((token) => normalized.includes(token))) {
      // נמצא ביטוי מתאים -> סיווג כסוג פעולה נתמכת
      return { type: 'SUPPORTED_ACTION', tool: match.tool };
    }
  }

  // If the text mentions a known unsupported application, classify as unsupported.
  const unsupportedMatches = ['photoshop', 'פוטושופ', 'word', 'וורד', 'excel', 'אקסל', 'powerpoint', 'פאוורפוינט'];
  if (unsupportedMatches.some((token) => normalized.includes(token))) {
    return { type: 'UNSUPPORTED_ACTION', reason: 'unsupported_tool_mentioned' };
  }

  const computerKeywords = ['open', 'פתח', 'start', 'הפעל', 'launch', 'הפעלה', 'הפעלת'];
  if (computerKeywords.some((token) => normalized.includes(token))) {
    return { type: 'UNSUPPORTED_ACTION', reason: 'supported_computer_action_missing' };
  }

  return { type: 'IRRELEVANT_REQUEST', reason: 'off_topic' };
}

// Build the normalized response object that the client expects.
function buildResponse(payload) {
  return {
    type: payload.type,
    message: payload.message,
    tool: payload.tool ?? null,
    details: payload.details ?? null
  };
}

// Retry the response builder if the generated response fails schema validation.
async function executeWithRetry(responseBuilder) {
  let attempt = 0;
  let lastResult = null;

  while (attempt <= retryConfig.MAX_RESPONSE_RETRIES) {
    const candidate = await responseBuilder(attempt);
    const validation = validationService.validateAgentResponse(candidate);

    // Return the first candidate that passes validation.
    if (validation.valid) {
      return candidate;
    }

    lastResult = {
      candidate,
      errors: validation.errors
    };
    attempt += 1;
  }

  logger.error({
    event: 'response_validation_failed',
    attempts: retryConfig.MAX_RESPONSE_RETRIES + 1,
    errors: lastResult.errors
  });

  return {
    type: 'error',
    message: 'לא ניתן לייצר מענה תקין לאחר מספר ניסיונות.',
    details: {
      attempts: retryConfig.MAX_RESPONSE_RETRIES + 1,
      validationErrors: lastResult.errors
    }
  };
}

// Handle incoming agent requests by validating, classifying, and responding.
async function handleAgentRequest(body) {
  const requestValidation = validationService.validateAgentRequest(body);
  if (!requestValidation.valid) {
    return {
      type: 'error',
      message: 'פורמט הבקשה אינו תקין.',
      details: requestValidation.errors
    };
  }

  const { text } = body;
  let classification;

  try {
    classification = await aiIntentService.classifyText(text);
  } catch (error) {
    logger.warn({
      event: 'ai_intent_failure',
      userInput: text,
      reason: error.message
    });
    classification = classifyRequest(text);
  }

  // classification עשוי לחזור עם `type` (מ־OpenAI) או עם שדה חלופי.
  // השתמש ב־`type` אם קיים — זה מכיל את סיווג ה־AI ואת ה־`message` שהוא הפיק.
  const fallbackClassification = classifyRequest(text);
  const aiActionType = classification.actionType || classification.type;
  let actionType = aiActionType;
  if (aiActionType !== 'SUPPORTED_ACTION' && fallbackClassification.type === 'SUPPORTED_ACTION') {
    actionType = 'SUPPORTED_ACTION';
  } else if (aiActionType !== 'SUPPORTED_ACTION' && fallbackClassification.type === 'UNSUPPORTED_ACTION') {
    actionType = 'UNSUPPORTED_ACTION';
  }
  const tool = actionType === 'SUPPORTED_ACTION' ? classification.tool : null;

  const defaultResponseMessage = {
    SUPPORTED_ACTION: `הפעלתי את ${tool} בהצלחה.`,
    UNSUPPORTED_ACTION: 'הפעולה המבוקשת אינה נתמכת.',
    IRRELEVANT_REQUEST: 'אני סוכן מערכת להפעלת כלים. אנא בקש פעולה נתמכת.'
  }[actionType] || 'התקבלה תגובה לא ידועה.';

  const responseMessage = (actionType === aiActionType)
    ? (classification.message || defaultResponseMessage)
    : defaultResponseMessage;

  if (actionType === 'SUPPORTED_ACTION' && supportedTools.includes(tool)) {
    return executeWithRetry(async () => {
      const executionResult = await toolExecutor.executeTool(tool, text);
      if (executionResult.success) {
        return buildResponse({
          type: 'supported',
          message: responseMessage,
          tool
        });
      }

      logger.error({
        event: 'tool_execution_failed',
        tool,
        userInput: text,
        reason: executionResult.error
      });

      return buildResponse({
        type: 'error',
        message: `לא הצלחתי להפעיל את ${tool}.`,
        details: { reason: executionResult.error }
      });
    });
  }

  if (actionType === 'UNSUPPORTED_ACTION') {
    logger.warn({
      event: 'unsupported_action',
      userInput: text,
      type: 'UNSUPPORTED_ACTION'
    });

    return executeWithRetry(() => {
      return Promise.resolve(buildResponse({
        type: 'unsupported',
        message: responseMessage
      }));
    });
  }

  logger.info({
    event: 'irrelevant_request',
    userInput: text,
    type: 'IRRELEVANT_REQUEST'
  });

  return executeWithRetry(() => {
    return Promise.resolve(buildResponse({
      type: 'irrelevant',
      message: responseMessage
    }));
  });
}

module.exports = {
  handleAgentRequest
};

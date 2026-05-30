const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');

const ajv = new Ajv({ allErrors: true, strict: false });

const requestSchema = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../validation/agent-request.schema.json'), 'utf8')
);
const responseSchema = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../validation/agent-response.schema.json'), 'utf8')
);
const intentSchema = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../validation/intent.schema.json'), 'utf8')
);

// Compile JSON schema validators for request, response, and intent validation.
const validateRequest = ajv.compile(requestSchema);
const validateResponse = ajv.compile(responseSchema);
const validateIntentSchema = ajv.compile(intentSchema);

function validateAgentRequest(body) {
  const valid = validateRequest(body);
  return {
    valid,
    errors: valid ? [] : validateRequest.errors
  };
}

function validateAgentResponse(response) {
  const valid = validateResponse(response);
  return {
    valid,
    errors: valid ? [] : validateResponse.errors
  };
}

function validateIntent(intent) {
  const valid = validateIntentSchema(intent);
  return {
    valid,
    errors: valid ? [] : validateIntentSchema.errors
  };
}

module.exports = {
  validateAgentRequest,
  validateAgentResponse,
  validateIntent
};

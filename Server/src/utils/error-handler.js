// Express error handling middleware.
// Logs unexpected server errors and returns a standard JSON error response.
const logger = require('./logger');

function errorHandler(err, req, res, next) {
  // Log full error details (for debugging/audit).
  logger.error({
    event: 'unhandled_exception',
    message: err.message,
    stack: err.stack
  });

  // Determine safe client-facing error details. Do not leak raw parser or stack traces.
  let clientDetails = {};
  // Express JSON parser sets err.type === 'entity.parse.failed' for invalid JSON payloads.
  if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
    clientDetails = { error: 'Invalid JSON payload' };
  } else {
    clientDetails = { error: 'Internal server error' };
  }

  const response = {
    type: 'error',
    message: 'השרת נתקל בשגיאה בלתי צפויה.',
    details: clientDetails
  };

  res.status(500).json(response);
}

module.exports = errorHandler;

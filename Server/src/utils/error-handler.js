// Express error handling middleware.
// Logs unexpected server errors and returns a standard JSON error response.
const logger = require('./logger');

function errorHandler(err, req, res, next) {
  logger.error({
    event: 'unhandled_exception',
    message: err.message,
    stack: err.stack
  });

  const response = {
    type: 'error',
    message: 'השרת נתקל בשגיאה בלתי צפויה.',
    details: {
      error: err.message
    }
  };

  res.status(500).json(response);
}

module.exports = errorHandler;

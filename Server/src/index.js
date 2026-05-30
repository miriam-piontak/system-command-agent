// Entry point for the backend server.
// Loads environment variables, imports the Express app, and starts listening on the configured port.
require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT;
if (!PORT) {
  throw new Error('PORT must be defined in .env before starting the server.');
}

app.listen(PORT, () => {
  logger.info({
    event: 'server_start',
    message: `System Command Agent server is running on port ${PORT}`
  });
});

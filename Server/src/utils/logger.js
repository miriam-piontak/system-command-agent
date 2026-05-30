const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
const logFile = path.join(logDir, 'agent.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Structured logger that writes JSON lines to a log file and console.
function writeLog(level, payload) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    ...payload
  };
  const line = JSON.stringify(entry);
  fs.appendFileSync(logFile, `${line}\n`, 'utf8');
  console[level](line);
}

function info(payload) {
  writeLog('info', payload);
}

function warn(payload) {
  writeLog('warn', payload);
}

function error(payload) {
  writeLog('error', payload);
}

module.exports = {
  info,
  warn,
  error
};

const { exec } = require('child_process');

const id = 'calendar';
const name = 'לוח שנה';

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) return reject(error);
      resolve();
    });
  });
}

async function execute() {
  const platform = process.platform;

  if (platform === 'win32') {
    return executeCommand("start outlookcal:");
  }
  if (platform === 'darwin') {
    return executeCommand('open -a Calendar');
  }

  // Linux: try gnome-calendar
  return executeCommand('gnome-calendar || xdg-open calendar://');
}

module.exports = { id, name, execute };

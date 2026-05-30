const { exec } = require('child_process');
const os = require('os');

const id = 'downloads';
const name = 'תיקיית הורדות';

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
  const home = os.homedir();
  const downloadsPath = `${home}\\Downloads`;

  if (platform === 'win32') {
    return executeCommand(`start "" "${downloadsPath}"`);
  }
  if (platform === 'darwin') {
    return executeCommand(`open "${home}/Downloads"`);
  }

  return executeCommand(`xdg-open "${home}/Downloads"`);
}

module.exports = { id, name, execute };

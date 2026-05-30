const { exec } = require('child_process');
const os = require('os');

const id = 'fileExplorer';
const name = 'סייר הקבצים';

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

  if (platform === 'win32') {
    return executeCommand(`start "" "${home}"`);
  }
  if (platform === 'darwin') {
    return executeCommand(`open "${home}"`);
  }
  return executeCommand(`xdg-open "${home}"`);
}

module.exports = { id, name, execute };

const { exec } = require('child_process');
const os = require('os');

const id = 'terminal';
const name = 'טרמינל';

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
    return executeCommand('start powershell -NoExit');
  }
  if (platform === 'darwin') {
    return executeCommand('open -a Terminal');
  }

  // Linux: try gnome-terminal, xterm
  return executeCommand('gnome-terminal || xterm');
}

module.exports = { id, name, execute };

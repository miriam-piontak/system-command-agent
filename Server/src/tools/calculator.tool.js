// Tool implementation for launching the Calculator application.
// This tool uses platform-specific shell commands to open the calculator app.
const { exec } = require('child_process');

const id = 'calculator';
const name = 'Calculator';

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}

async function execute() {
  const platform = process.platform;

  if (platform === 'win32') {
    return executeCommand('start calc');
  }
  if (platform === 'darwin') {
    return executeCommand('open -a Calculator');
  }

  return executeCommand('xdg-open calc || gnome-calculator || kcalc');
}

module.exports = {
  id,
  name,
  execute
};

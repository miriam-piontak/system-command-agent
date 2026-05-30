// Tool implementation for launching the system Clock application.
// Uses operating system commands to open the native clock tool.
const { exec } = require('child_process');

const id = 'clock';
const name = 'Clock';

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
    return executeCommand('start ms-clock:');
  }
  if (platform === 'darwin') {
    return executeCommand('open -a Clock');
  }

  return executeCommand('gnome-clocks || xdg-open "clock:"');
}

module.exports = {
  id,
  name,
  execute
};

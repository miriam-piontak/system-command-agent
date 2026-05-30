// Tool implementation for launching the browser and opening a URL.
// It supports Windows, macOS, and Linux by using the appropriate command.
const { exec } = require('child_process');

const id = 'browser';
const name = 'Browser';

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
  const url = 'https://www.bing.com';

  if (platform === 'win32') {
    return executeCommand(`start "" "${url}"`);
  }
  if (platform === 'darwin') {
    return executeCommand(`open "${url}"`);
  }

  return executeCommand(`xdg-open "${url}"`);
}

module.exports = {
  id,
  name,
  execute
};

const { exec } = require('child_process');

const id = 'screenshot';
const name = 'צילום מסך';

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
    // Open the built-in snipping tool / screen clip
    return executeCommand('start ms-screenclip:');
  }
  if (platform === 'darwin') {
    // macOS: open Screenshot app
    return executeCommand('open -a Screenshot');
  }

  // Linux: attempt to open gnome-screenshot interactive tool
  return executeCommand('gnome-screenshot -i || scrot');
}

module.exports = { id, name, execute };

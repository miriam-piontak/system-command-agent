const { exec } = require('child_process');

const id = 'settings';
const name = 'הגדרות מערכת';

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
    return executeCommand('start ms-settings:');
  }
  if (platform === 'darwin') {
    return executeCommand('open -a "System Preferences" || open -a "System Settings"');
  }

  // Linux: attempt gnome-control-center
  return executeCommand('gnome-control-center || kdecontrol || gsettings');
}

module.exports = { id, name, execute };

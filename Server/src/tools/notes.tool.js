const { exec } = require('child_process');

const id = 'notes';
const name = 'פנקס רשימות';

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
    return executeCommand('start notepad');
  }
  if (platform === 'darwin') {
    return executeCommand('open -a TextEdit');
  }

  return executeCommand('xdg-open ~/.local/share/notes || gedit');
}

module.exports = { id, name, execute };

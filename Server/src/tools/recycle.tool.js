const { exec } = require('child_process');

const id = 'recycle';
const name = 'סל המיחזור';

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
    return executeCommand("start shell:RecycleBinFolder");
  }
  if (platform === 'darwin') {
    return executeCommand('open ~/.Trash');
  }
  return executeCommand('xdg-open trash:// || xdg-open ~/.local/share/Trash/files');
}

module.exports = { id, name, execute };

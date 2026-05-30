const calculatorTool = require('./calculator.tool');
const browserTool = require('./browser.tool');
const clockTool = require('./clock.tool');
const calendarTool = require('./calendar.tool');
const downloadsTool = require('./downloads.tool');
const screenshotTool = require('./screenshot.tool');
const terminalTool = require('./terminal.tool');
const settingsTool = require('./settings.tool');
const recycleTool = require('./recycle.tool');
const fileExplorerTool = require('./fileexplorer.tool');
const notesTool = require('./notes.tool');

// Register available desktop tools for the agent.
// The registry provides a lookup by tool id.
const tools = [
  calculatorTool,
  browserTool,
  clockTool,
  calendarTool,
  downloadsTool,
  screenshotTool,
  recycleTool,
  fileExplorerTool,
  notesTool
  ,terminalTool,settingsTool
];

function getToolById(toolId) {
  return tools.find((tool) => tool.id === toolId);
}

module.exports = {
  getToolById,
  tools
};

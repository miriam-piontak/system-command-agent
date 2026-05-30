const toolRegistry = require('../tools/tool-registry');

// Execute the requested tool by resolving it from the registry.
// Returns a standardized success/error object for the agent service.
async function executeTool(toolId, userInput) {
  const tool = toolRegistry.getToolById(toolId);
  if (!tool) {
    return {
      success: false,
      error: `Tool not found: ${toolId}`
    };
  }

  try {
    await tool.execute();
    return {
      success: true,
      tool: toolId
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'הפעלת הכלי נכשלה.'
    };
  }
}

module.exports = {
  executeTool
};

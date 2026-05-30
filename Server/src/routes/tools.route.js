const express = require('express');
const toolRegistry = require('../tools/tool-registry');
const router = express.Router();

// Return a list of available tools (id and name) for the client UI.
router.get('/', (req, res) => {
  const list = toolRegistry.tools.map((t) => ({ id: t.id, name: t.name }));
  res.json({ tools: list });
});

module.exports = router;

// Defines the HTTP route for agent requests.
// The route accepts POST requests and forwards them to the agent service for processing.
const express = require('express');
const agentService = require('../services/agent.service');
const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const result = await agentService.handleAgentRequest(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

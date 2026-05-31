// Defines the HTTP route for agent requests.
// The route accepts POST requests and forwards them to the agent service for processing.
const express = require('express');
const agentService = require('../services/agent.service');
const validationService = require('../services/validation.service');
const logger = require('../utils/logger');
const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const result = await agentService.handleAgentRequest(req.body);

    // Final safeguard: validate the outgoing response against the response schema.
    const respValidation = validationService.validateAgentResponse(result);
    if (!respValidation.valid) {
      logger.error({
        event: 'outgoing_response_invalid',
        errors: respValidation.errors,
        result
      });

      return res.status(500).json({
        type: 'error',
        message: 'השרת לא הצליח לייצר תגובה תקינה.',
        details: { validationErrors: respValidation.errors }
      });
    }

    return res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

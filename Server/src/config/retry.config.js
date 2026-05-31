// Retry configuration used by the agent service.
// Controls how many times the service will retry response validation before failing.
module.exports = {
  // How many times to retry building a valid agent response before failing.
  MAX_RESPONSE_RETRIES: 1,
  // How many times to retry OpenAI intent classification when parsing/validation fails.
  MAX_INTENT_RETRIES: 2,
  // Delay between intent retries (ms).
  INTENT_RETRY_DELAY_MS: 500
};

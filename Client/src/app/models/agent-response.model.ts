// TypeScript model for the response payload returned by the backend agent.
export interface AgentResponse {
  type: 'supported' | 'unsupported' | 'irrelevant' | 'error';
  message: string;
  tool: string | null;
  details: Record<string, unknown> | null;
}

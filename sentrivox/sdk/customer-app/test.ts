import { observeAgent } from "sentrivox";

observeAgent({
  sessionId: "pilot-user-001",
  model: "gpt-4",
  inputTokens: 1800,
  outputTokens: 600,
  toolName: "search",
  latency: 5100,
  success: true
});

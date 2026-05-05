import { observeAgent } from "./src";

observeAgent({
  sessionId: "sdk-test-001",
  model: "gpt-4",
  inputTokens: 1500,
  outputTokens: 600,
  toolName: "search",
  latency: 4200,
  success: true
});

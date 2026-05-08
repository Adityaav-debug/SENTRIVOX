import { observeAgent } from "./index";

async function simulateLoop() {
  for (let i = 0; i < 8; i++) {
    await observeAgent({
      sessionId: "loop-test-001",

      model: "gpt-4",

      inputTokens: 1000,

      outputTokens: 400,

      toolName: "search",

      latency: 1200,

      success: true
    });
  }

  console.log("Loop test sent");
}

simulateLoop();
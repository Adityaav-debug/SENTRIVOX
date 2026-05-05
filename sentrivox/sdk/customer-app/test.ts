import { observeAgent } from "sentrivox";

async function runTest() {
  console.log("Simulating high-load agent session...");
  
  for (let i = 0; i < 6; i++) {
    await observeAgent({
      sessionId: "pilot-user-001",
      model: "gpt-4",
      inputTokens: 1800,
      outputTokens: 600,
      toolName: "search",
      latency: 3500 + (Math.random() * 1000),
      success: i % 3 !== 0 // simulate some failures
    });
    console.log(`Step ${i+1} capture sent`);
  }
}

runTest();

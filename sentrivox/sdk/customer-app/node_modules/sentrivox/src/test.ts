import { observeAgent } from "./index";

observeAgent({
    sessionId: "session_001",

    model: "gpt-4",

    inputTokens: 1200,
    outputTokens: 450,

    toolName: "search",

    latency: 3400,

    success: true
});
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
(0, index_1.observeAgent)({
    sessionId: "session_001",
    model: "gpt-4",
    inputTokens: 1200,
    outputTokens: 450,
    toolName: "search",
    latency: 3400,
    success: true
});

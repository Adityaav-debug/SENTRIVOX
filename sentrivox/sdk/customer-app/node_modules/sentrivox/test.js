"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("./src");
(0, src_1.observeAgent)({
    sessionId: "sdk-test-001",
    model: "gpt-4",
    inputTokens: 1500,
    outputTokens: 600,
    toolName: "search",
    latency: 4200,
    success: true
});
//# sourceMappingURL=test.js.map
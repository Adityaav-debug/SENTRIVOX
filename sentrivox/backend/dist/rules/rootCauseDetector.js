"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectRootCause = detectRootCause;
function detectRootCause(events) {
    const searchCalls = events.filter((e) => e.toolName === "search").length;
    const highLatencyCalls = events.filter((e) => e.latency > 3000).length;
    if (searchCalls >= 5 &&
        highLatencyCalls >= 1) {
        return {
            diagnosis: "Search tool is causing latency spikes and agent instability",
            confidence: 94
        };
    }
    return null;
}

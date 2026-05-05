"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectTokenBurn = detectTokenBurn;
function detectTokenBurn(sessionId, events) {
    const sessionEvents = events.filter((event) => event.sessionId === sessionId);
    const totalTokens = sessionEvents.reduce((sum, event) => sum +
        (event.inputTokens || 0) +
        (event.outputTokens || 0), 0);
    if (totalTokens > 10000) {
        return {
            alert: "High token burn",
            severity: "medium",
            totalTokens
        };
    }
    return null;
}

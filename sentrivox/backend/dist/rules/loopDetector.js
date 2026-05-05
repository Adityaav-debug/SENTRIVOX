"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectLoop = detectLoop;
function detectLoop(sessionId, events) {
    const searchCalls = events.filter((event) => event.sessionId === sessionId &&
        event.toolName === "search");
    const count = searchCalls.length;
    if (count > 5) {
        return {
            alert: "Loop detected",
            severity: "high",
            count
        };
    }
    return null;
}

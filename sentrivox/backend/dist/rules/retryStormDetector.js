"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectRetryStorm = detectRetryStorm;
function detectRetryStorm(sessionId, events) {
    const failedEvents = events.filter((event) => event.sessionId === sessionId &&
        event.success === false);
    const failedCount = failedEvents.length;
    if (failedCount >= 3) {
        return {
            alert: "Retry storm detected",
            severity: "critical",
            failedCount
        };
    }
    return null;
}

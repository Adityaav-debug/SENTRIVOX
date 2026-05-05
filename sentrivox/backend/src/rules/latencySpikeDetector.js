"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectLatencySpike = detectLatencySpike;
function detectLatencySpike(sessionId, events) {
    const sessionEvents = events.filter((event) => event.sessionId === sessionId);
    if (sessionEvents.length === 0) {
        return null;
    }
    const totalLatency = sessionEvents.reduce((sum, event) => sum + (event.latency || 0), 0);
    const averageLatency = totalLatency / sessionEvents.length;
    if (averageLatency > 3000) {
        return {
            alert: "Latency spike detected",
            severity: "medium",
            averageLatency
        };
    }
    return null;
}
//# sourceMappingURL=latencySpikeDetector.js.map
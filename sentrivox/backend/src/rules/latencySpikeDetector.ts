export function detectLatencySpike(sessionId: string, events: any[]) {
  const sessionEvents = events.filter(
    (event) => event.sessionId === sessionId
  );

  if (sessionEvents.length === 0) {
    return null;
  }

  const totalLatency = sessionEvents.reduce(
    (sum, event) => sum + (event.latency || 0),
    0
  );

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

export function detectLatencySpike(events: any[]) {
  if (!events || events.length === 0) return null;

  const latestEvent = events[events.length - 1];

  if (!latestEvent.latency) return null;

  if (latestEvent.latency > 3000) {
    return {
      type: "LATENCY_SPIKE",
      severity: "HIGH",
      message: `Latency spike detected: ${latestEvent.latency}ms`
    };
  }

  return null;
}

export function detectLatencySpike(
  events: any[]
) {
  const highLatencyEvent =
    events.find(
      (event) => event.latency > 4000
    );

  if (highLatencyEvent) {
    return {
      type: "LATENCY_SPIKE",
      severity: "HIGH",
      message:
        `Latency spike detected: ${highLatencyEvent.latency}ms`
    };
  }

  return null;
}

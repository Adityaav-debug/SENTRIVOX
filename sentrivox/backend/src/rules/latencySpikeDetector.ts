export function detectLatencySpike(event: any) {
  if (!event.latency) return null;

  if (event.latency > 3000) {
    return {
      type: "LATENCY_SPIKE",
      severity: "HIGH",
      message: `Latency spike detected: ${event.latency}ms`
    };
  }

  return null;
}

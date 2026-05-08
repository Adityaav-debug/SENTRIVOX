export function detectLatencySpike(
  events: any[] = []
) {
  if (!Array.isArray(events)) {
    console.log(
      "Latency detector got invalid input:",
      events
    );

    return null;
  }

  const spikes = events.filter(
    (event) =>
      event &&
      typeof event.latency === "number" &&
      event.latency > 3000
  );

  if (spikes.length === 0) {
    return null;
  }

  return {
    type: "LATENCY_SPIKE",
    severity: "HIGH",
    message:
      `Latency spike detected: ${spikes[0].latency}ms`
  };
}

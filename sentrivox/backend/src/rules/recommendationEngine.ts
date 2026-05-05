export function generateRecommendation(alerts: any[]) {
  const hasRetryStorm = alerts.some(
    (a) => a.alert === "Retry storm detected"
  );

  const hasLatency = alerts.some(
    (a) => a.alert === "Latency spike detected"
  );

  if (hasRetryStorm && hasLatency) {
    return {
      action: "Disable retries and shift traffic to cache",
      priority: "critical"
    };
  }

  return {
    action: "No intervention needed",
    priority: "normal"
  };
}

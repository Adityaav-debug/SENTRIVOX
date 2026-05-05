export function detectPredictiveFailure(
  sessionId: string,
  events: any[]
) {
  if (events.length === 0) {
    return null;
  }

  const failedCount = events.filter(
    (event) => event.success === false
  ).length;

  const avgLatency =
    events.reduce(
      (sum, event) => sum + (event.latency || 0),
      0
    ) / events.length;

  const totalTokens = events.reduce(
    (sum, event) =>
      sum +
      (event.inputTokens || 0) +
      (event.outputTokens || 0),
    0
  );

  let riskScore = 0;

  if (failedCount >= 2) {
    riskScore += 35;
  }

  if (avgLatency > 3000) {
    riskScore += 25;
  }

  if (totalTokens > 10000) {
    riskScore += 25;
  }

  if (events.length > 8) {
    riskScore += 15;
  }

  if (riskScore >= 70) {
    return {
      alert: "Agent likely to fail soon",
      severity: "critical",
      riskScore
    };
  }

  return null;
}

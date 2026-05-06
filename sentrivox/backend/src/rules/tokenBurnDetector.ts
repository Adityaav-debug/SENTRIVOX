export function detectTokenBurn(events: any[]) {
  const totalTokens = events.reduce(
    (sum, event) =>
      sum +
      (event.inputTokens || 0) +
      (event.outputTokens || 0),
    0
  );

  if (totalTokens > 10000) {
    return {
      type: "TOKEN_BURN",
      severity: "MEDIUM",
      totalTokens,
      message: "High token burn detected"
    };
  }

  return null;
}
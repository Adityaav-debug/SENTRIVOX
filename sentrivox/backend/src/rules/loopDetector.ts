export function detectLoop(sessionId: string, events: any[]) {
  const searchCalls = events.filter(
    (event) =>
      event.sessionId === sessionId &&
      event.toolName === "search"
  );

  const count = searchCalls.length;

  if (count > 5) {
    return {
      alert: "Loop detected",
      severity: "high",
      count
    };
  }

  return null;
}

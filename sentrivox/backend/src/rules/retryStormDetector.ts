export function detectRetryStorm(sessionId: string, events: any[]) {
  const failedEvents = events.filter(
    (event) =>
      event.sessionId === sessionId &&
      event.success === false
  );

  const failedCount = failedEvents.length;

  if (failedCount >= 3) {
    return {
      alert: "Retry storm detected",
      severity: "critical",
      failedCount
    };
  }

  return null;
}

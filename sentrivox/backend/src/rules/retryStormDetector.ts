export function detectRetryStorm(events: any[] = []) {
  if (!Array.isArray(events) || events.length === 0) {
    return null;
  }
  
  const latestEvent = events[events.length - 1];
  
  if (!latestEvent || typeof latestEvent.retryCount !== "number") {
    return null;
  }

  if (latestEvent.retryCount >= 3) {
    return {
      type: "RETRY_STORM",
      severity: "MEDIUM",
      message: `Retry storm detected: ${latestEvent.retryCount} retries`
    };
  }

  return null;
}

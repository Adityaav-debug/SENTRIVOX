export function detectRetryStorm(events: any[]) {
  if (!events || events.length === 0) return null;
  
  const latestEvent = events[events.length - 1];
  
  if (latestEvent.retryCount === undefined || latestEvent.retryCount === null) return null;

  if (latestEvent.retryCount >= 3) {
    return {
      type: "RETRY_STORM",
      severity: "MEDIUM",
      message: `${latestEvent.retryCount} retries detected`
    };
  }

  return null;
}

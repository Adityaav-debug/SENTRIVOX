export function detectRetryStorm(event: any) {
  if (event.retryCount === undefined || event.retryCount === null) return null;

  if (event.retryCount >= 3) {
    return {
      type: "RETRY_STORM",
      severity: "MEDIUM",
      message: `${event.retryCount} retries detected`
    };
  }

  return null;
}

export function analyzeRootCause(event: any) {
  // Recursive tool loop
  if (
    event.toolCalls > 6 &&
    event.uniqueTools?.length === 1
  ) {
    return {
      diagnosis:
        "Agent repeatedly invoked the same tool without state progression, causing execution waste and response delays.",
      confidence: 94,
      recommendation:
        "Add recursion depth limit"
    };
  }

  // Token burn
  if (
    event.inputTokens > 5000 &&
    event.outputTokens > 4000
  ) {
    return {
      diagnosis:
        "Excessive token consumption was detected during agent execution, creating avoidable API spend.",
      confidence: 91,
      recommendation:
        "Compress prompt context"
    };
  }

  // Retry storm
  if (event.retryCount > 3) {
    return {
      diagnosis:
        "Agent repeatedly retried external tool calls after dependency failures, increasing latency and execution cost.",
      confidence: 88,
      recommendation:
        "Add exponential backoff"
    };
  }

  // Latency issue
  if (event.latency > 3000) {
    return {
      diagnosis:
        "Execution latency exceeded expected thresholds, indicating tool or model bottlenecks.",
      confidence: 85,
      recommendation:
        "Switch model region or add caching"
    };
  }

  return null;
}

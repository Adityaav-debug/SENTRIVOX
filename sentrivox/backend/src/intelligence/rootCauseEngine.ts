export interface RootCauseInput {
  sessionId: string;
  toolCalls: number;
  retryCount: number;
  totalTokens: number;
  latency: number;
  uniqueTools: string[];
  alerts: string[];
}

export function analyzeRootCause(input: RootCauseInput) {
  if (input.toolCalls > 5 && input.uniqueTools.length <= 2) {
    return {
      diagnosis: "Recursive tool loop detected",
      confidence: 94,
      recommendation: "Add recursion depth limit"
    };
  }

  if (input.totalTokens > 8000) {
    return {
      diagnosis: "Prompt amplification or repeated completions",
      confidence: 88,
      recommendation: "Reduce prompt size or cache completions"
    };
  }

  if (input.retryCount > 4) {
    return {
      diagnosis: "Upstream API instability",
      confidence: 90,
      recommendation: "Enable exponential backoff"
    };
  }

  if (input.latency > 5000) {
    return {
      diagnosis: "Model overload or slow tool dependency",
      confidence: 85,
      recommendation: "Investigate tool latency"
    };
  }

  return {
    diagnosis: "No major anomaly detected",
    confidence: 70,
    recommendation: "Continue monitoring"
  };
}

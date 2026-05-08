export function detectLoop(sessionId: string, events: any[] = []) {
  if (!Array.isArray(events)) {
    return null;
  }

  const searchCalls = events.filter(
    (event) =>
      event &&
      event.sessionId === sessionId &&
      event.toolName === "search"
  );

  const count = searchCalls.length;

  if (count > 5) {
    return {
      type: "LOOP_DETECTED",
      severity: "HIGH",
      message: `Tool loop detected: ${count} consecutive search calls`,
      count
    };
  }

  return null;
}

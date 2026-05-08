import axios from "axios";

type AgentEvent = {
  sessionId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  toolName: string;
  latency: number;
  success: boolean;
};

export async function observeAgent(event: AgentEvent) {
  try {
    console.log("Sending to:", "http://localhost:5000/api/events");
    await axios.post(
      "http://localhost:5000/api/events",
      event
    );

    console.log("Sentrivox event captured");
  } catch (error) {
    console.error("Sentrivox SDK failed:", error);
  }
}
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
    await axios.post(
      "http://localhost:5000/events",
      event
    );

    console.log("Sentrivox event captured");
  } catch (error) {
    console.error("Sentrivox SDK failed:", error);
  }
}
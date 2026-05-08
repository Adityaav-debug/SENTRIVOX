import axios from "axios";

const BASE_URL = process.env.SENTRIVOX_URL!;

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
    console.log("Sending to:", `${BASE_URL}/api/events`);
    await axios.post(
      `${BASE_URL}/api/events`,
      event
    );

    console.log("Sentrivox event captured");
  } catch (error) {
    console.error("Sentrivox SDK failed:", error);
  }
}
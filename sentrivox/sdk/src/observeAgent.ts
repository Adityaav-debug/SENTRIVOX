import axios from "axios";

type AgentTelemetry = {
  sessionId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  toolName: string;
  latency: number;
  success: boolean;
};

export async function observeAgent(data: AgentTelemetry) {
  try {
    await axios.post(
      "https://sentrivox-backend.up.railway.app/events",
      data
    );

    console.log(
      "Telemetry sent to Sentrivox"
    );

  } catch (error) {
    console.error(
      "Failed to send telemetry",
      error
    );
  }
}

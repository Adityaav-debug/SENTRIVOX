import axios from "axios";

async function run() {
  const payload = {
    sessionId: "test-session-001",
    model: "gpt-4",
    inputTokens: 4000,
    outputTokens: 2500,
    toolName: "search",
    latency: 4500,
    retryCount: 4,
    success: true
  };

  try {
    const res = await axios.post("http://localhost:5000/events", payload);
    console.log("Response:", res.data);
  } catch (error) {
    console.error("Error sending event:", error);
  }
}

run();

import mongoose from "mongoose";

const agentEventSchema = new mongoose.Schema({
  sessionId: String,

  model: String,

  inputTokens: Number,

  outputTokens: Number,

  toolName: String,

  latency: Number,

  success: Boolean,

  error: String,

  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const AgentEvent = mongoose.model(
  "AgentEvent",
  agentEventSchema
);

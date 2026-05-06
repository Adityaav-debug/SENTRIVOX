import mongoose from "mongoose";

const agentEventSchema = new mongoose.Schema({
  sessionId: String,
  agentId: String,
  eventType: String,

  model: String,

  inputTokens: Number,

  outputTokens: Number,

  toolName: String,

  latency: Number,
  retryCount: Number,
  tokensUsed: Number,

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

import mongoose from "mongoose";

delete mongoose.models.AgentEvent;

const agentEventSchema =
  new mongoose.Schema({
    sessionId: String,
    agentId: String,
    eventType: String,

    model: String,

    inputTokens: Number,
    outputTokens: Number,

    tokensUsed: Number,

    costUsd: Number,

    toolName: String,

    latency: Number,
    retryCount: Number,

    success: Boolean,

    error: String,

    timestamp: {
      type: Date,
      default: Date.now
    }
  }, {
    strict: false
  });

export const AgentEvent =
  mongoose.model(
    "AgentEventV2",
    agentEventSchema
  );
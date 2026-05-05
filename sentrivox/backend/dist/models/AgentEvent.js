"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentEvent = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const agentEventSchema = new mongoose_1.default.Schema({
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
exports.AgentEvent = mongoose_1.default.model("AgentEvent", agentEventSchema);

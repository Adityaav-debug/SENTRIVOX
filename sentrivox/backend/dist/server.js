"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("@fastify/cors"));
const db_1 = require("./config/db");
const events_1 = require("./routes/events");
const AgentEvent_1 = require("./models/AgentEvent");
const loopDetector_1 = require("./rules/loopDetector");
const tokenBurnDetector_1 = require("./rules/tokenBurnDetector");
const retryStormDetector_1 = require("./rules/retryStormDetector");
const latencySpikeDetector_1 = require("./rules/latencySpikeDetector");
const toolHotspotDetector_1 = require("./rules/toolHotspotDetector");
const predictiveFailureDetector_1 = require("./rules/predictiveFailureDetector");
const rootCauseDetector_1 = require("./rules/rootCauseDetector");
dotenv_1.default.config();
const app = (0, fastify_1.default)();
async function startServer() {
    await (0, db_1.connectDB)();
    // RULE ENGINE TEST
    const events = await AgentEvent_1.AgentEvent.find({ sessionId: "loop-test-001" });
    const alert = (0, loopDetector_1.detectLoop)("loop-test-001", events);
    console.log("RULE ENGINE:", alert);
    await app.register(cors_1.default);
    await (0, events_1.eventRoutes)(app);
    app.post("/events", async (request, reply) => {
        try {
            const event = request.body;
            await AgentEvent_1.AgentEvent.create(event);
            return reply.send({
                success: true,
                message: "Event captured"
            });
        }
        catch (error) {
            console.error(error);
            return reply.status(500).send({
                success: false
            });
        }
    });
    app.get("/sessions/:sessionId/alerts", async (request, reply) => {
        try {
            const { sessionId } = request.params;
            const events = await AgentEvent_1.AgentEvent.find({ sessionId });
            const loopAlert = (0, loopDetector_1.detectLoop)(sessionId, events);
            const tokenAlert = (0, tokenBurnDetector_1.detectTokenBurn)(sessionId, events);
            const retryAlert = (0, retryStormDetector_1.detectRetryStorm)(sessionId, events);
            const latencyAlert = (0, latencySpikeDetector_1.detectLatencySpike)(sessionId, events);
            const toolAlert = (0, toolHotspotDetector_1.detectToolHotspot)(sessionId, events);
            const predictiveAlert = (0, predictiveFailureDetector_1.detectPredictiveFailure)(sessionId, events);
            const rootCause = (0, rootCauseDetector_1.detectRootCause)(events);
            const alerts = [];
            if (loopAlert)
                alerts.push(loopAlert);
            if (tokenAlert)
                alerts.push(tokenAlert);
            if (retryAlert)
                alerts.push(retryAlert);
            if (latencyAlert)
                alerts.push(latencyAlert);
            if (toolAlert)
                alerts.push(toolAlert);
            if (predictiveAlert)
                alerts.push(predictiveAlert);
            return {
                sessionId,
                alerts,
                rootCause
            };
        }
        catch (error) {
            console.error(error);
            reply.status(500);
            return { error: "Failed to generate alerts" };
        }
    });
    const PORT = Number(process.env.PORT);
    app.listen({
        port: PORT
    });
    console.log(`Sentrivox backend running on port ${PORT}`);
}
startServer();

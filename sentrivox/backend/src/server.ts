import Fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import { connectDB } from "./config/db";
import { eventRoutes } from "./routes/events";
import { AgentEvent } from "./models/AgentEvent";
import { detectLoop } from "./rules/loopDetector";
import { detectTokenBurn } from "./rules/tokenBurnDetector";
import { detectRetryStorm } from "./rules/retryStormDetector";
import { detectLatencySpike } from "./rules/latencySpikeDetector";
import { detectToolHotspot } from "./rules/toolHotspotDetector";
import { detectPredictiveFailure } from "./rules/predictiveFailureDetector";
import { detectRootCause } from "./rules/rootCauseDetector";
import { generateRecommendation } from "./rules/recommendationEngine";

dotenv.config();

const app = Fastify();

async function startServer() {
    await connectDB();

    // RULE ENGINE TEST
    const events = await AgentEvent.find({ sessionId: "loop-test-001" });
    const alert = detectLoop("loop-test-001", events);
    console.log("RULE ENGINE:", alert);

    await app.register(cors);
    await eventRoutes(app);

app.post("/events", async (request, reply) => {
  try {
    const event = request.body as any;

    await AgentEvent.create(event);

    return reply.send({
      success: true,
      message: "Event captured"
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({
      success: false
    });
  }
});

    app.get("/sessions", async (request, reply) => {
        try {
            const sessions = await AgentEvent.distinct("sessionId");
            return { sessions };
        } catch (error) {
            console.error(error);
            reply.status(500);
            return { error: "Failed to fetch sessions" };
        }
    });

    app.get("/sessions/:sessionId/alerts", async (request, reply) => {
        try {
            const { sessionId } = request.params as { sessionId: string };
            const events = await AgentEvent.find({ sessionId });
            const loopAlert = detectLoop(sessionId, events);
            const tokenAlert = detectTokenBurn(sessionId, events);
            const retryAlert = detectRetryStorm(sessionId, events);
            const latencyAlert = detectLatencySpike(sessionId, events);
            const toolAlert = detectToolHotspot(sessionId, events);
            const predictiveAlert = detectPredictiveFailure(sessionId, events);
            const rootCause = detectRootCause(events);
            const alerts = [];
            if (loopAlert) alerts.push(loopAlert);
            if (tokenAlert) alerts.push(tokenAlert);
            if (retryAlert) alerts.push(retryAlert);
            if (latencyAlert) alerts.push(latencyAlert);
            if (toolAlert) alerts.push(toolAlert);
if (predictiveAlert) alerts.push(predictiveAlert);

            const recommendation = generateRecommendation(alerts);

            const toolCounts: any = {};
            events.forEach(e => {
                toolCounts[e.toolName] = (toolCounts[e.toolName] || 0) + 1;
            });
            const bottleneck = Object.keys(toolCounts).reduce((a, b) => toolCounts[a] > toolCounts[b] ? a : b, "none");
            
            const avgLatency = events.length > 0 
                ? (events.reduce((sum, e) => sum + e.latency, 0) / events.length / 1000).toFixed(2) + "s"
                : "0s";
            
            const failureRate = events.length > 0
                ? ((events.filter(e => !e.success).length / events.length) * 100).toFixed(1) + "%"
                : "0%";

            return {
                sessionId,
                alerts,
                rootCause,
                recommendation,
                summary: {
                    bottleneck,
                    avgLatency,
                    failureRate
                }
              };
        } catch (error) {
            console.error(error);
            reply.status(500);
            return { error: "Failed to generate alerts" };
        }
    });

    const PORT = Number(process.env.PORT);

    app.listen({
        port: PORT
    });

    console.log(
        `Sentrivox backend running on port ${PORT}`
    );
}

startServer();
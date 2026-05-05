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

const app = Fastify({
    logger: true
});

async function startServer() {
    try {
        await connectDB();

        await app.register(cors);

        app.get("/health", async () => {
            return { status: "ok" };
        });

        await eventRoutes(app);

        // Events endpoint
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

        // Sessions list
        app.get("/sessions", async () => {
            const sessions = await AgentEvent.distinct("sessionId");

            return { sessions };
        });

        // Alerts endpoint
        app.get("/sessions/:sessionId/alerts", async (request) => {
            const { sessionId } = request.params as {
                sessionId: string;
            };

            const events = await AgentEvent.find({ sessionId });

            const latestEvent = events[events.length - 1] || {};

            const alerts: any[] = [];

            const loopAlert = detectLoop(sessionId, events);
            const tokenAlert = detectTokenBurn(sessionId, events);
            const retryAlert = detectRetryStorm(latestEvent);
            const latencyAlert = detectLatencySpike(latestEvent);
            const toolAlert = detectToolHotspot(sessionId, events);
            const predictiveAlert = detectPredictiveFailure(
                sessionId,
                events
            );

            if (loopAlert) alerts.push(loopAlert);
            if (tokenAlert) alerts.push(tokenAlert);
            if (retryAlert) alerts.push(retryAlert);
            if (latencyAlert) alerts.push(latencyAlert);
            if (toolAlert) alerts.push(toolAlert);
            if (predictiveAlert) alerts.push(predictiveAlert);

            const rootCause = detectRootCause(events);
            const recommendation =
                generateRecommendation(alerts);

            return {
                sessionId,
                alerts,
                rootCause,
                recommendation
            };
        });

        const PORT = Number(process.env.PORT) || 8080;

        await app.listen({
            port: PORT,
            host: "0.0.0.0"
        });

        console.log(
            `Sentrivox backend running on port ${PORT}`
        );
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

startServer();
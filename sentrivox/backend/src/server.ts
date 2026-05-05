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
        console.log("MongoDB connected");

        await app.register(cors);

        // Health route
        app.get("/health", async () => {
            return {
                status: "ok",
                service: "Sentrivox"
            };
        });

        await eventRoutes(app);

        // Test rule engine
        const events = await AgentEvent.find({
            sessionId: "loop-test-001"
        });

        const alert = detectLoop("loop-test-001", events);
        console.log("RULE ENGINE:", alert);

        app.get("/sessions", async () => {
            const sessions = await AgentEvent.distinct("sessionId");
            return { sessions };
        });

        app.get("/sessions/:sessionId/alerts", async (request) => {
            const { sessionId } = request.params as {
                sessionId: string;
            };

            const events = await AgentEvent.find({
                sessionId
            });

            const lastEvent = events[events.length - 1] || {};

            const alerts = [];

            const loopAlert = detectLoop(sessionId, events);
            const tokenAlert = detectTokenBurn(sessionId, events);
            const retryAlert = detectRetryStorm(lastEvent);
            const latencyAlert = detectLatencySpike(lastEvent);
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

        const PORT = Number(process.env.PORT || 8080);

        const address = await app.listen({
            port: PORT,
            host: "0.0.0.0"
        });

        console.log(
            `Sentrivox backend running at ${address}`
        );

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

startServer();
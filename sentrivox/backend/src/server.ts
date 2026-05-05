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
    try {
        // Connect DB
        await connectDB();

        // Test rule engine
        const testEvents = await AgentEvent.find({
            sessionId: "loop-test-001"
        });

        const testAlert = detectLoop(
            "loop-test-001",
            testEvents
        );

        console.log("RULE ENGINE:", testAlert);

        // Plugins
        await app.register(cors);

        // Routes
        await eventRoutes(app);



        // Capture events
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

        // Get sessions
        app.get("/sessions", async (request, reply) => {
            try {
                const sessions = await AgentEvent.distinct("sessionId");

                return {
                    sessions
                };

            } catch (error) {
                console.error(error);

                return reply.status(500).send({
                    error: "Failed to fetch sessions"
                });
            }
        });

        // Get alerts
        app.get("/sessions/:sessionId/alerts", async (request, reply) => {
            try {
                const { sessionId } = request.params as {
                    sessionId: string;
                };

                const events = await AgentEvent.find({
                    sessionId
                });

                const latestEvent = events[events.length - 1] || {};

                const loopAlert = detectLoop(
                    sessionId,
                    events
                );

                const tokenAlert = detectTokenBurn(
                    sessionId,
                    events
                );

                const retryAlert = detectRetryStorm(
                    latestEvent
                );

                const latencyAlert = detectLatencySpike(
                    latestEvent
                );

                const toolAlert = detectToolHotspot(
                    sessionId,
                    events
                );

                const predictiveAlert = detectPredictiveFailure(
                    sessionId,
                    events
                );

                const rootCause = detectRootCause(events);

                const alerts = [];

                if (loopAlert) alerts.push(loopAlert);
                if (tokenAlert) alerts.push(tokenAlert);
                if (retryAlert) alerts.push(retryAlert);
                if (latencyAlert) alerts.push(latencyAlert);
                if (toolAlert) alerts.push(toolAlert);
                if (predictiveAlert) alerts.push(predictiveAlert);

                const recommendation =
                    generateRecommendation(alerts);

                // Analytics
                const toolCounts: Record<string, number> = {};

                events.forEach((e: any) => {
                    const name = e.toolName || "unknown";

                    toolCounts[name] =
                        (toolCounts[name] || 0) + 1;
                });

                const bottleneck =
                    Object.keys(toolCounts).length > 0
                        ? Object.keys(toolCounts).reduce((a, b) =>
                            toolCounts[a] > toolCounts[b] ? a : b
                        )
                        : "none";

                const avgLatency =
                    events.length > 0
                        ? (
                            events.reduce(
                                (sum: number, e: any) =>
                                    sum + (e.latency || 0),
                                0
                            ) /
                            events.length /
                            1000
                        ).toFixed(2) + "s"
                        : "0s";

                const failureRate =
                    events.length > 0
                        ? (
                            (events.filter(
                                (e: any) => !e.success
                            ).length /
                                events.length) *
                            100
                        ).toFixed(1) + "%"
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

                return reply.status(500).send({
                    error: "Failed to generate alerts"
                });
            }
        });

        // Health check for Railway
        app.get("/health", async () => {
          return {
            status: "ok"
          };
        });

        const PORT = Number(process.env.PORT) || 8080;

        await app.listen({
          port: PORT,
          host: "0.0.0.0"
        });

        console.log(`Sentrivox backend running on port ${PORT}`);

    } catch (error) {
        console.error(
            "Startup failed:",
            error
        );

        process.exit(1);
    }
}

startServer();
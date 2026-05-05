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

            return {
                sessionId,
                alerts,
                rootCause
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
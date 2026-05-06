import { FastifyInstance } from "fastify";
import { AgentEvent } from "../models/AgentEvent";

import { detectLoop } from "../rules/loopDetector";
import { detectLatencySpike } from "../rules/latencySpikeDetector";
import { detectRetryStorm } from "../rules/retryStormDetector";
import { detectTokenBurn } from "../rules/tokenBurnDetector";

export async function eventRoutes(
  fastify: FastifyInstance
) {
  fastify.post("/", async (request, reply) => {
    try {
      const eventData = request.body as any;

      const event = await AgentEvent.create(eventData);

      const sessionEvents = await AgentEvent.find({
        sessionId: eventData.sessionId
      });

      const alerts = [];

      const loopAlert = detectLoop(
        eventData.sessionId,
        sessionEvents as any
      );

      if (loopAlert) alerts.push(loopAlert);

      const latencyAlert =
        detectLatencySpike(sessionEvents as any);

      if (latencyAlert)
        alerts.push(latencyAlert);

      const retryAlert =
        detectRetryStorm(
          sessionEvents as any
        );

      if (retryAlert) {
        alerts.push(retryAlert);
      }

      const tokenAlert =
        detectTokenBurn(sessionEvents as any);

      if (tokenAlert)
        alerts.push(tokenAlert);

      return {
        success: true,
        data: event,
        alerts
      };

    } catch (error) {
      return {
        success: false,
        error
      };
    }
  });

  fastify.get("/sessions", async () => {
    const sessions = await AgentEvent.distinct("sessionId");

    return {
      sessions
    };
  });

  fastify.get(
    "/sessions/:sessionId/alerts",
    async (request) => {
      const { sessionId } = request.params as any;

      const events = await AgentEvent.find({
        sessionId
      });

      const alerts = [];

      // HIGH — latency
      const latencyAlert =
        detectLatencySpike(events);

      if (latencyAlert) {
        alerts.push(latencyAlert);
      }

      // MEDIUM — retry storm
      const retryAlert =
        detectRetryStorm(events);

      if (retryAlert) {
        alerts.push(retryAlert);
      }

      // MEDIUM — token burn
      const tokenAlert =
        detectTokenBurn(events);

      if (tokenAlert) {
        alerts.push(tokenAlert);
      }

      // LOW — loop
      const loopAlert =
        detectLoop(
          sessionId,
          events as any
        );

      if (loopAlert) {
        alerts.push(loopAlert);
      }

      return {
        alerts,
        summary: {
          bottleneck:
            alerts.length > 0
              ? "Detected"
              : "none",

          avgLatency:
            events.length > 0
              ? `${Math.round(
                  events.reduce(
                    (sum, e: any) =>
                      sum + (e.latency || 0),
                    0
                  ) / events.length
                )}ms`
              : "0ms",

          failureRate:
            `${alerts.length * 10}%`
        }
      };
    }
  );

  fastify.get("/sessions/:sessionId/events", async (request) => {
    const { sessionId } = request.params as any;

    const events = await AgentEvent.find({ sessionId });

    return { events };
  });
}

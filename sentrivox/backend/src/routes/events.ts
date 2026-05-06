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
        detectLatencySpike(eventData);

      if (latencyAlert)
        alerts.push(latencyAlert);

      const retryAlert =
        detectRetryStorm(sessionEvents as any);

      if (retryAlert)
        alerts.push(retryAlert);

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
      reply.status(500);

      return {
        success: false,
        error
      };
    }
  });
}

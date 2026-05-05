// Import new detectors
import { detectLatencySpike } from "../rules/latencySpikeDetector";
import { detectRetryStorm } from "../rules/retryStormDetector";
import { detectTokenBurn } from "../rules/tokenBurnDetector";

import { FastifyInstance } from "fastify";
import { AgentEvent } from "../models/AgentEvent";
import { detectLoop } from "../rules/loopDetector";

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

      const loopAlert = detectLoop(
        eventData.sessionId,
        sessionEvents as any
      );

      if (loopAlert) {
        console.log("⚠️ LOOP ALERT DETECTED:", loopAlert);
      }

      return {
        success: true,
        data: event,
        alert: loopAlert
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

import { FastifyInstance } from "fastify";
import { AgentEvent } from "../models/AgentEvent";
import { broadcastAlert } from "../config/socket";


import { detectLoop } from "../rules/loopDetector";
import { detectLatencySpike } from "../rules/latencySpikeDetector";
import { detectRetryStorm } from "../rules/retryStormDetector";
import { detectTokenBurn } from "../rules/tokenBurnDetector";
import { analyzeRootCause } from "../rules/rootCauseEngine";



export async function eventRoutes(
  fastify: FastifyInstance
) {
  fastify.post("/api/events", async (request, reply) => {
    try {
      const rawData = request.body as any;

      const inputTokens =
        Number(
          rawData.inputTokens || 0
        );

      const outputTokens =
        Number(
          rawData.outputTokens || 0
        );

      const totalTokens =
        inputTokens +
        outputTokens;

      const estimatedCost =
        totalTokens * 0.00001;

      const eventData = {
        ...rawData,

        inputTokens,

        outputTokens,

        tokensUsed:
          totalTokens,

        costUsd:
          estimatedCost,

        model:
          rawData.model ||
          "unknown"
      };



      const event = await AgentEvent.create(eventData);



      const rootCause = analyzeRootCause(request.body);




      const sessionEvents = await AgentEvent.find({
        sessionId: eventData.sessionId
      });


      const alerts = [];

      const loopAlert = detectLoop(
        eventData.sessionId,
        (sessionEvents || []) as any
      );


      if (loopAlert) alerts.push(loopAlert);



      const latencyAlert =
        detectLatencySpike(
          Array.isArray(sessionEvents)
            ? sessionEvents
            : []
        );



      if (latencyAlert)
        alerts.push(latencyAlert);

      const retryAlert =
        detectRetryStorm(
          (sessionEvents || []) as any
        );


      if (retryAlert) {
        alerts.push(retryAlert);
      }

      const tokenAlert =
        detectTokenBurn((sessionEvents || []) as any);


      if (tokenAlert)
        alerts.push(tokenAlert);

      // Broadcast alerts to clients
      alerts.forEach(alert => {
        broadcastAlert({
          ...alert,
          rootCause
        });
      });


      return {
        success: true,
        data: event,
        alerts,
        rootCause
      };


    } catch (error: any) {
      console.error("POST /api/events ERROR:", error);
      return {
        success: false,
        error: error.message
      };
    }
  });

  fastify.get("/api/events/sessions", async () => {
    const sessions = await AgentEvent.distinct("sessionId");

    return {
      sessions
    };
  });

  fastify.get(
    "/api/events/sessions/:sessionId/alerts",
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

      const toolCalls = (events || []).filter((e: any) => e.toolName).length;
      const retryCount = (events || []).reduce((sum, e: any) => sum + (e.retryCount || 0), 0);
      const totalTokens = (events || []).reduce((sum, e: any) => sum + (e.tokensUsed || 0), 0);
      const latency = (events || []).length > 0 ? Math.max(...events.map((e: any) => e.latency || 0)) : 0;
      const uniqueTools = Array.from(new Set((events || []).map((e: any) => e.toolName).filter(Boolean))) as string[];
      const alertTypes = (alerts || []).map((a: any) => a.type);


      const rootCause = analyzeRootCause({
        sessionId,
        toolCalls,
        retryCount,
        totalTokens,
        latency,
        uniqueTools,
        alerts: alertTypes
      });

      return {
        alerts,
        rootCause,
        summary: {
          bottleneck:
            alerts.length > 0
              ? "Detected"
              : "none",

          avgLatency:
            (events || []).length > 0
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

  fastify.get("/api/events/sessions/:sessionId/events", async (request, reply) => {
    const { sessionId } =
      request.params as any;

    if (!sessionId) {
      return reply
        .code(400)
        .send({
          error:
            "Session ID required"
        });
    }

    const events = await AgentEvent.find({ sessionId });

    return { events };
  });
}

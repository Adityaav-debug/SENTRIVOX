"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRoutes = eventRoutes;
const AgentEvent_1 = require("../models/AgentEvent");
const loopDetector_1 = require("../rules/loopDetector");
async function eventRoutes(fastify) {
    fastify.post("/api/events", async (request, reply) => {
        try {
            const eventData = request.body;
            const event = await AgentEvent_1.AgentEvent.create(eventData);
            // Loop Detection Logic
            const sessionEvents = await AgentEvent_1.AgentEvent.find({
                sessionId: eventData.sessionId
            });
            const loopAlert = (0, loopDetector_1.detectLoop)(eventData.sessionId, sessionEvents);
            if (loopAlert) {
                console.log("⚠️ LOOP ALERT DETECTED:", loopAlert);
            }
            return {
                success: true,
                data: event,
                alert: loopAlert
            };
        }
        catch (error) {
            reply.status(500);
            return {
                success: false,
                error
            };
        }
    });
}
//# sourceMappingURL=events.js.map
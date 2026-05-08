import dotenv from "dotenv";
dotenv.config();
import Fastify from "fastify";
import { connectDB } from "./config/db";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import { eventRoutes } from "./routes/events";
import { reportRoutes } from "./routes/reports";

import { clients } from "./config/socket";

const app = Fastify({
    logger: true
});

// Health check
app.get("/health", async () => {
    return { status: "ok" };
});

async function start() {
    try {
        // Connect MongoDB
        await connectDB();
        console.log("MongoDB connected");

        await app.register(cors, {
            origin: "*"
        });

        await app.register(websocket);

        app.register(async function (fastify) {
            fastify.get(
                "/ws",
                { websocket: true },
                (connection) => {
                    console.log("WebSocket client connected");
                    clients.add(connection.socket);

                    connection.socket.on("close", () => {
                        console.log("WebSocket client disconnected");
                        clients.delete(connection.socket);
                    });
                }
            );
        });

        // Register routes
        app.register(eventRoutes);
        app.register(reportRoutes);



        const PORT = Number(process.env.PORT);

        console.log("Railway PORT =", process.env.PORT);

        await app.listen({
            host: "0.0.0.0",
            port: PORT
        });

        console.log(`Sentrivox backend running on port ${PORT}`);
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}

start();
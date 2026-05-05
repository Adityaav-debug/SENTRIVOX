import Fastify from "fastify";
import { connectDB } from "./config/db";
import { eventRoutes } from "./routes/events";

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

        // Register routes
        app.register(eventRoutes, {
            prefix: "/api/events"
        });

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
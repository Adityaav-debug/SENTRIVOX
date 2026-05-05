import Fastify from "fastify";
import connectDB from "./config/db";

// Import your routes here
// Example:
// import agentRoutes from "./routes/agentRoutes";
// import telemetryRoutes from "./routes/telemetryRoutes";

const app = Fastify({
    logger: true
});

// Health check route
app.get("/health", async () => {
    return { status: "ok" };
});

async function start() {
    try {
        // Connect database
        await connectDB();
        console.log("MongoDB connected");

        // Register your routes here
        // Example:
        // app.register(agentRoutes, { prefix: "/api/agents" });
        // app.register(telemetryRoutes, { prefix: "/api/telemetry" });

        const PORT = Number(process.env.PORT);

        console.log("Railway PORT =", process.env.PORT);

        await app.listen({
            port: PORT,
            host: "0.0.0.0"
        });

        console.log(`Sentrivox backend running on port ${PORT}`);
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
}

start();
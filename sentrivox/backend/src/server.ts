import Fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import { connectDB } from "./config/db";

dotenv.config();

const app = Fastify({
    logger: true
});

async function startServer() {
    try {
        await connectDB();
        console.log("MongoDB connected");

        await app.register(cors);

        // TEST ROUTE
        app.get("/health", async () => {
            return {
                status: "ok",
                service: "sentrivox"
            };
        });

        const PORT = Number(process.env.PORT) || 8080;

        await app.listen({
            host: "0.0.0.0",
            port: PORT
        });

        console.log(`Sentrivox backend running on ${PORT}`);
    } catch (error) {
        console.error("SERVER ERROR:", error);
        process.exit(1);
    }
}

startServer();
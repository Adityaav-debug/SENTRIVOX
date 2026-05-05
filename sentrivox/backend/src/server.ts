import Fastify from "fastify";

const app = Fastify({ logger: true });

app.get("/health", async () => {
  return { status: "ok" };
});

async function start() {
  const PORT = Number(process.env.PORT) || 8080;

  await app.listen({
    host: "0.0.0.0",
    port: PORT
  });

  console.log(`Running on ${PORT}`);
}

start();
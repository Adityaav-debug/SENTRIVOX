import Fastify from "fastify";

const app = Fastify({ logger: true });

app.get("/health", async () => {
  return { status: "ok" };
});

async function start() {
  const PORT = Number(process.env.PORT) || 8080;

  await app.listen({
    port: PORT,
    host: "0.0.0.0"
  });

  console.log(`Running on ${PORT}`);
}

start();
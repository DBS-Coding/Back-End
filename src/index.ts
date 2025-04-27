import { initServer } from "./config/server";

const start = async () => {
  const server = await initServer();

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

start();

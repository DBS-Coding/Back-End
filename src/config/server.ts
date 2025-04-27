import Hapi, { Server } from "@hapi/hapi";
import routes from "../routes/routes";

export const initServer = async (): Promise<Server> => {
  const server = Hapi.server({
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    host: process.env.HOST || "localhost",
  });

  server.route(routes);

  return server;
};

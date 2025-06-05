import Hapi, { Server } from '@hapi/hapi';
import authRoutes from '../routes/auth.routes';
import  chatbotRoutes  from '../routes/chatbot.routes';
import  healthRoute from '../routes/health.routes';
import { initWebSocket } from "../controllers/websocketController"
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const initServer = async (): Promise<Server> => {
  const server = Hapi.server({
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
        credentials: true,
        additionalHeaders: ['authorization', 'content-type'],
      },
    },
  });

  server.route(authRoutes);
  server.route(chatbotRoutes);
  server.route(healthRoute);
  initWebSocket(server);
  return server;
};

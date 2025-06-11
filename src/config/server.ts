import Hapi, { Server } from '@hapi/hapi';
import authRoutes from '../routes/auth.routes';
import chatbotRoutes from '../routes/chatbot.routes';
import healthRoute from '../routes/health.routes';
import { initWebSocket } from '../controllers/websocketController';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

export const pool = new Pool({
  user: 'postgres',
  host: '',
  database: 'postgres',
  password: '',
  port: 5432,
  ssl: { rejectUnauthorized: false },
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

  server.route({
    method: 'POST',
    path: '/chatnew',
    handler: async (request, h) => {
      return pool;
    },
  });

  server.route({
    method: 'GET',
    path: '/users',
    handler: async (request, h) => {
      // return pool;
      try {
        const client = await pool.connect();
        const res = await client.query('SELECT * FROM users');
        try {
          return res;
        } finally {
          client.release();
        }
      } catch (error) {
        console.error('Database connection/query error:', error);
        return h
          .response({ error: 'Failed to fetch users', detail: error.message })
          .code(500);
      }
    },
  });

  server.route(authRoutes);
  server.route(chatbotRoutes);
  server.route(healthRoute);
  initWebSocket(server);
  return server;
};

import { Server } from "@hapi/hapi";
import WebSocket, { WebSocketServer } from "ws";

interface CustomWebSocket extends WebSocket {
  id: string;
}

export const initWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server: server.listener });

  const clients = new Map<string, CustomWebSocket>();

  wss.on("connection", (ws: CustomWebSocket) => {
    ws.id = Math.random().toString(36).substring(2, 9);
    clients.set(ws.id, ws);

    console.log(`New client connected: ${ws.id}`);

    ws.on("message", (message: string) => {
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`User ${ws.id}: ${message}`);
        }
      });
    });

    ws.on("close", () => {
      clients.delete(ws.id);
    });
  });

  console.log("WebSocket server is running");
};
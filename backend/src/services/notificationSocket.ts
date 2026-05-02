import http from "http";
import { IncomingMessage } from "http";
import { Duplex } from "stream";
import jwt from "jsonwebtoken";
import { WebSocket, WebSocketServer } from "ws";
import config from "../config/config";
import User from "../models/user";

const clients = new Set<WebSocket>();
let notificationServer: WebSocketServer | null = null;

const getRequestUrl = (request: IncomingMessage) =>
  new URL(request.url || "", `http://${request.headers.host || "localhost"}`);

const getToken = (request: IncomingMessage) => {
  const url = getRequestUrl(request);
  const bearerToken = request.headers.authorization?.split(" ")[1];
  return url.searchParams.get("token") || bearerToken;
};

const rejectUpgrade = (socket: Duplex, statusCode: number, message: string) => {
  socket.write(`HTTP/1.1 ${statusCode} ${message}\r\n\r\n`);
  socket.destroy();
};

export const initNotificationSocket = (server: http.Server) => {
  if (notificationServer) return;

  notificationServer = new WebSocketServer({ noServer: true });

  notificationServer.on("connection", (socket) => {
    clients.add(socket);

    socket.send(JSON.stringify({ type: "notifications.connected" }));

    socket.on("close", () => {
      clients.delete(socket);
    });

    socket.on("error", () => {
      clients.delete(socket);
    });
  });

  server.on("upgrade", async (request, socket, head) => {
    const url = getRequestUrl(request);

    if (url.pathname !== "/ws/notifications") {
      return;
    }

    const token = getToken(request);
    if (!token) {
      rejectUpgrade(socket, 401, "Unauthorized");
      return;
    }

    try {
      const decoded = jwt.verify(
        token,
        config.server.token.secret,
      ) as jwt.JwtPayload;

      if (!decoded.id) {
        rejectUpgrade(socket, 401, "Unauthorized");
        return;
      }

      const user = await User.findById(decoded.id).select("role").lean();

      if (!user || user.role !== "admin") {
        rejectUpgrade(socket, 403, "Forbidden");
        return;
      }

      notificationServer?.handleUpgrade(request, socket, head, (ws) => {
        notificationServer?.emit("connection", ws, request);
      });
    } catch {
      rejectUpgrade(socket, 401, "Unauthorized");
    }
  });
};

export const broadcastNotification = (notification: unknown) => {
  const payload = JSON.stringify({
    type: "notification.created",
    notification,
  });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    } else {
      clients.delete(client);
    }
  });
};

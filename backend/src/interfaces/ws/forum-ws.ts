import { WebSocketServer, type WebSocket } from "ws";
import type { Server } from "http";

type TopicId = string;
type UserId = string;

const topicClients = new Map<TopicId, Set<WebSocket>>();
const userNotificationClients = new Map<UserId, WebSocket>();

export function initForumWs(server: Server) {
  const wss = new WebSocketServer({ server, path: "/api/forum/ws" });

  wss.on("connection", (socket, req) => {
    const url = new URL(
      req.url || "",
      `http://${req.headers.host || "localhost"}`,
    );
    const topicId = url.searchParams.get("topicId");
    const userId = url.searchParams.get("userId");

    if (userId && !topicId) {
      attachUserNotificationClient(userId, socket);
      socket.on("close", () => detachUserNotificationClient(userId));
      socket.on("error", () => detachUserNotificationClient(userId));
      return;
    }

    if (!topicId) {
      socket.close(1008, "topicId required");
      return;
    }
    attachClient(topicId, socket);
    socket.on("close", () => detachClient(topicId, socket));
    socket.on("error", () => detachClient(topicId, socket));
  });
}

function attachClient(topicId: TopicId, socket: WebSocket) {
  const set = topicClients.get(topicId) ?? new Set<WebSocket>();
  set.add(socket);
  topicClients.set(topicId, set);
}

function detachClient(topicId: TopicId, socket: WebSocket) {
  const set = topicClients.get(topicId);
  if (!set) return;
  set.delete(socket);
  if (!set.size) {
    topicClients.delete(topicId);
  }
}

function attachUserNotificationClient(userId: UserId, socket: WebSocket) {
  userNotificationClients.set(userId, socket);
}

function detachUserNotificationClient(userId: UserId) {
  userNotificationClients.delete(userId);
}

export function broadcastForumEvent(
  topicId: TopicId,
  event: string,
  data: unknown,
) {
  const set = topicClients.get(topicId);
  if (!set || !set.size) return;
  const payload = JSON.stringify({ event, data });
  for (const client of set) {
    if (client.readyState === client.OPEN) {
      client.send(payload);
    }
  }
}

export function sendUserNotification(
  userId: UserId,
  notification: {
    topicId: string;
    topicTitle: string;
    message: string;
    author: { name: string | null };
  },
) {
  const client = userNotificationClients.get(userId);
  if (!client || client.readyState !== client.OPEN) return;
  const payload = JSON.stringify({ event: "topic-reply", data: notification });
  client.send(payload);
}

import { WebSocketServer, type WebSocket } from 'ws'
import type { Server } from 'http'

type TopicId = string

const topicClients = new Map<TopicId, Set<WebSocket>>()

export function initForumWs(server: Server) {
  const wss = new WebSocketServer({ server, path: '/api/forum/ws' })

  wss.on('connection', (socket, req) => {
    const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`)
    const topicId = url.searchParams.get('topicId')
    if (!topicId) {
      socket.close(1008, 'topicId required')
      return
    }
    attachClient(topicId, socket)
    socket.on('close', () => detachClient(topicId, socket))
    socket.on('error', () => detachClient(topicId, socket))
  })
}

function attachClient(topicId: TopicId, socket: WebSocket) {
  const set = topicClients.get(topicId) ?? new Set<WebSocket>()
  set.add(socket)
  topicClients.set(topicId, set)
}

function detachClient(topicId: TopicId, socket: WebSocket) {
  const set = topicClients.get(topicId)
  if (!set) return
  set.delete(socket)
  if (!set.size) {
    topicClients.delete(topicId)
  }
}

export function broadcastForumEvent(topicId: TopicId, event: string, data: unknown) {
  const set = topicClients.get(topicId)
  if (!set || !set.size) return
  const payload = JSON.stringify({ event, data })
  for (const client of set) {
    if (client.readyState === client.OPEN) {
      client.send(payload)
    }
  }
}

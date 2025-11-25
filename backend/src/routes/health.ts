import { Router } from 'express'


export const healthRouter = Router().get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

import { Router } from 'express'
import type { HttpController } from '../api-router'

export class HealthController implements HttpController {
  readonly basePath = '/health'

  register(router: Router) {
    router.get('/', (_req, res) => res.json({ status: 'ok' }))
  }
}

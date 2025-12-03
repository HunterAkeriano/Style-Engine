import { Router } from 'express'
import type { Env } from '../../config/env'

export interface HttpController {
  basePath: string
  register(router: Router): void
}

/**
 * Aggregates controllers and exposes a single Router.
 * Implements a simple Composite + Builder pattern.
 */
export class ApiRouter {
  constructor(private readonly env: Env, private readonly controllers: HttpController[]) {}

  build(): Router {
    const router = Router()
    const sorted = [...this.controllers].sort((a, b) => (a.basePath === '/health' ? -1 : b.basePath === '/health' ? 1 : 0))
    for (const controller of sorted) {
      const child = Router()
      controller.register(child)
      router.use(controller.basePath, child)
    }
    return router
  }
}

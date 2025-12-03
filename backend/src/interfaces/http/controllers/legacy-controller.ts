import { Router } from 'express'
import type { Env } from '../../../config/env'
import type { HttpController } from '../api-router'

type RouterFactory = (env: Env) => Router

/**
 * Adapter that wraps existing function-based routers into the HttpController interface.
 * Helps transition to the class-based router composition without rewriting all handlers at once.
 */
export class LegacyController implements HttpController {
  readonly basePath: string

  constructor(private readonly path: string, private readonly factory: RouterFactory, private readonly env: Env) {
    this.basePath = path
  }

  register(router: Router) {
    router.use(this.factory(this.env))
  }
}

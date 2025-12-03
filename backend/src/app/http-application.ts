import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { Container } from '../core/container'
import type { Env } from '../config/env'
import { setupSwagger } from '../swagger'
import { ApiRouter } from '../interfaces/http/api-router'
import { ApiError, isApiError } from '../core/errors/api-error'

export class HttpApplication {
  private readonly app: Express

  constructor(private readonly env: Env, private readonly container: Container) {
    this.app = express()
  }

  /**
   * Configure middlewares, routes and error handling.
   */
  configure() {
    this.app.set('envConfig', this.env)
    this.app.set('appUrl', this.env.APP_URL)

    const allowedOrigin = this.env.APP_URL || 'http://localhost:5173'
    const corsOptions: cors.CorsOptions = {
      origin: allowedOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }

    this.app.use(cors(corsOptions))
    this.app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
    this.app.use(express.json({ limit: '1mb' }))
    this.app.use(morgan(this.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

    this.app.use('/uploads', express.static('uploads'))

    const apiRouter = this.container.resolve<ApiRouter>('api.router')
    this.app.use('/api', apiRouter.build())
    setupSwagger(this.app)

    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (res.headersSent) return next(err)

      if (isApiError(err)) {
        const errorPayload: Record<string, unknown> = {
          status: err.status,
          message: err.message
        }
        if (err.code) errorPayload.code = err.code
        if (err.details) errorPayload.details = err.details
        return res.status(err.status).json({ error: errorPayload })
      }

      const status = err?.status || err?.statusCode || 500
      const message = err?.message || 'Internal server error'
      res.status(status).json({
        error: {
          status,
          message,
          ...(this.env.NODE_ENV !== 'production' && { details: err?.stack })
        }
      })
    })
  }

  listen() {
    const port = Number(this.env.PORT) || 4000
    this.app.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`)
    })
  }
}

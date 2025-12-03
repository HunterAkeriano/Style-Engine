import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { loadEnv } from './config/env'
import { initDb } from './config/db'
import { ensureSuperAdmin } from './config/super-admin'
import { createApiRouter } from './routes'
import { setupSwagger } from './swagger'

const env = loadEnv()
const { sequelize } = initDb(env)

sequelize
  .authenticate()
  .then(async () => {
    await sequelize.sync()
    await ensureSuperAdmin(env)
  })
  .catch((err: unknown) => {
    console.error('Failed to connect to database', err)
    process.exit(1)
  })

const app = express()

const allowedOrigin = env.APP_URL || 'http://localhost:5173'
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))

app.use('/uploads', express.static('uploads'))

app.use('/api', createApiRouter(env))
setupSwagger(app)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err)

  if (res.headersSent) {
    return next(err)
  }

  const status = err.status || err.statusCode || 500
  const message = err.message || 'Internal server error'

  res.status(status).json({
    error: {
      status,
      message,
      ...(env.NODE_ENV !== 'production' && { details: err.stack })
    }
  })
})

const port = Number(env.PORT) || 4000
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})

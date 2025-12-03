import 'dotenv/config'
import { bootstrap } from './app/bootstrap'

bootstrap().catch((err) => {
  console.error('Unhandled bootstrap error', err)
  process.exit(1)
})

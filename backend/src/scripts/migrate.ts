import 'dotenv/config'
import { Pool } from 'pg'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { loadEnv } from '../config/env'

const env = loadEnv()
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
})

async function runMigrations() {
  const client = await pool.connect()

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)

    const result = await client.query('SELECT version FROM schema_migrations ORDER BY version')
    const executedMigrations = new Set(result.rows.map(row => row.version))

    const migrationsDir = join(__dirname, '../db/migrations')
    const files = readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort()

    console.log(`Found ${files.length} migration files`)

    for (const file of files) {
      const version = file.replace('.sql', '')

      if (executedMigrations.has(version)) {
        console.log(`⏭️  Skipping ${version} (already executed)`)
        continue
      }

      console.log(`▶️  Running ${version}...`)
      const sql = readFileSync(join(migrationsDir, file), 'utf8')

      await client.query('BEGIN')
      try {
        await client.query(sql)
        await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [version])
        await client.query('COMMIT')
        console.log(`✅ ${version} completed`)
      } catch (error) {
        await client.query('ROLLBACK')
        console.error(`❌ ${version} failed:`, error)
        throw error
      }
    }

    console.log('✨ All migrations completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

runMigrations()

import 'dotenv/config'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { loadEnv } from '../config/env'
import { QueryTypes } from 'sequelize'
import { initDb } from '../config/db'

const env = loadEnv()
const { sequelize } = initDb(env)

async function runMigrations() {
  try {
    await sequelize.authenticate()
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)

    const result = await sequelize.query<{ version: string }>(
      'SELECT version FROM schema_migrations ORDER BY version',
      { type: QueryTypes.SELECT }
    )
    const executedMigrations = new Set(result.map(row => row.version))

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

      const transaction = await sequelize.transaction()
      try {
        await sequelize.query(sql, { transaction })
        await sequelize.query('INSERT INTO schema_migrations (version) VALUES ($1)', {
          bind: [version],
          transaction
        })
        await transaction.commit()
        console.log(`✅ ${version} completed`)
      } catch (error) {
        await transaction.rollback()
        console.error(`❌ ${version} failed:`, error)
        throw error
      }
    }

    console.log('✨ All migrations completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

runMigrations()

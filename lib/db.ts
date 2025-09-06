import postgres from 'postgres'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

if (!process.env.POSTGRES_URL) {
  throw new Error('Missing required environment variable: POSTGRES_URL')
}

export const sql = postgres(process.env.POSTGRES_URL, {
  max: 10
})

export async function runMigrations() {
  try {
    const migrationPath = join(
      process.cwd(),
      'db/migrations/001_better_auth_tables.sql'
    )
    const migration = readFileSync(migrationPath, 'utf8')

    await sql.unsafe(migration)
    console.log('✅ Database migrations completed successfully')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

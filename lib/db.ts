import postgres from 'postgres'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

if (!process.env.POSTGRES_URL) {
  throw new Error('Missing required environment variable: POSTGRES_URL')
}

export const sql = postgres(process.env.POSTGRES_URL, {
  max: 10,
  onnotice: () => {} // Suppress NOTICE messages
})

export async function runMigrations() {
  try {
    const migrationsDir = join(process.cwd(), 'migrations')

    // Read all .sql files in the migrations directory
    const migrationFiles = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort() // Sort to ensure consistent execution order

    if (migrationFiles.length === 0) {
      console.log('No migration files found')
      return
    }

    console.log(`Running ${migrationFiles.length} migration(s)...`)

    // Execute each migration file
    for (const file of migrationFiles) {
      const migrationPath = join(migrationsDir, file)
      const migration = readFileSync(migrationPath, 'utf8')

      console.log(`Running migration: ${file}`)
      await sql.unsafe(migration)
      console.log(`✅ Migration completed: ${file}`)
    }

    console.log('✅ All database migrations completed successfully')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

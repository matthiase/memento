import postgres from 'postgres'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Lazy initialization of database connections
let adminSql: ReturnType<typeof postgres> | null = null
let testSql: ReturnType<typeof postgres> | null = null

function getAdminConnection() {
  if (!adminSql) {
    const dbUrl = new URL(process.env.POSTGRES_URL!)
    adminSql = postgres({
      host: dbUrl.hostname,
      port: Number(dbUrl.port) || 5432,
      username: dbUrl.username,
      password: dbUrl.password || '',
      database: 'postgres', // Connect to default postgres database for admin operations
      ssl: dbUrl.searchParams.get('sslmode') !== 'disable'
    })
  }
  return adminSql
}

function getTestConnection() {
  if (!testSql) {
    testSql = postgres(process.env.POSTGRES_URL!, {
      max: 10,
      onnotice: () => {} // Suppress NOTICE messages
    })
  }
  return testSql
}

export { getTestConnection as testSql }

export async function recreateTestDatabase() {
  try {
    // Re-parse URL at runtime in case environment was loaded after module initialization
    const currentDbUrl = new URL(process.env.POSTGRES_URL!)
    const currentTestDbName = currentDbUrl.pathname.slice(1)

    console.log(`Database URL: ${process.env.POSTGRES_URL}`)
    console.log(`Current test DB name: ${currentTestDbName}`)

    if (!currentTestDbName.includes('_test')) {
      throw new Error(
        `Expected test database name to contain '_test', got: ${currentTestDbName}`
      )
    }

    // Drop the test database if it exists
    const admin = getAdminConnection()
    await admin.unsafe(`DROP DATABASE IF EXISTS "${currentTestDbName}"`)
    console.log(`✅ Dropped test database: ${currentTestDbName}`)

    // Create a fresh test database
    await admin.unsafe(`CREATE DATABASE "${currentTestDbName}"`)
    console.log(`✅ Created test database: ${currentTestDbName}`)

    // Run migrations on the new test database
    await runTestMigrations()
  } catch (error) {
    console.error('❌ Failed to recreate test database:', error)
    throw error
  }
}

export async function runTestMigrations() {
  try {
    const migrationPath = join(
      process.cwd(),
      'migrations/001_better_auth_tables.sql'
    )
    const migration = readFileSync(migrationPath, 'utf8')

    const testConn = getTestConnection()
    await testConn.unsafe(migration)
    console.log('✅ Test database migrations completed successfully')
  } catch (error) {
    console.error('❌ Test migration failed:', error)
    throw error
  }
}

export async function cleanupTestDatabase() {
  try {
    if (testSql) {
      await testSql.end()
    }
    if (adminSql) {
      await adminSql.end()
    }
    console.log('✅ Test database connections closed')
  } catch (error) {
    console.error('❌ Failed to cleanup test database:', error)
  }
}

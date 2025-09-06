import { describe, test, expect, afterAll } from 'bun:test'
import { sql, runMigrations } from '@/lib/db'

describe('Database Connection', () => {
  afterAll(async () => {
    await sql.end()
  })

  test('should connect to database successfully', async () => {
    const result = await sql`SELECT 1 as test`
    expect(result).toBeDefined()
    expect(result[0]).toEqual({ test: 1 })
  })

  test('should have valid environment variable', () => {
    expect(process.env.POSTGRES_URL).toBeDefined()
    expect(process.env.POSTGRES_URL).toContain('postgres://')
  })

  test('should execute basic queries', async () => {
    const result = await sql`SELECT current_database() as db_name`
    expect(result).toBeDefined()
    expect(result[0]).toHaveProperty('db_name')
    expect(result[0].db_name).toBe('memento')
  })

  test('should verify Better Auth tables exist', async () => {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('user', 'session', 'account', 'verification')
      ORDER BY table_name
    `

    const tableNames = tables.map(t => t.table_name)
    expect(tableNames).toContain('account')
    expect(tableNames).toContain('session')
    expect(tableNames).toContain('user')
    expect(tableNames).toContain('verification')
  })

  test('migration function should execute without errors', async () => {
    // This test ensures the migration can run multiple times safely
    await expect(runMigrations()).resolves.toBeUndefined()
  })
})

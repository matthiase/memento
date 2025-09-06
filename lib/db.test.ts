import { describe, test, expect, beforeAll, afterAll } from 'bun:test'
import { testSql, runTestMigrations } from '@/lib/test-db'
import { setupTestDatabase } from '../test-setup'

describe('Database Connection', () => {
  beforeAll(async () => {
    await setupTestDatabase()
  })

  afterAll(async () => {
    const testConn = testSql()
    await testConn.end()
  })

  test('should connect to test database successfully', async () => {
    const testConn = testSql()
    const result = await testConn`SELECT 1 as test`
    expect(result).toBeDefined()
    expect(result[0]).toEqual({ test: 1 })
  })

  test('should have valid test environment variable', () => {
    expect(process.env.POSTGRES_URL).toBeDefined()
    expect(process.env.POSTGRES_URL).toContain('postgres://')
    expect(process.env.POSTGRES_URL).toContain('_test')
  })

  test('should execute basic queries on test database', async () => {
    const testConn = testSql()
    const result = await testConn`SELECT current_database() as db_name`
    expect(result).toBeDefined()
    expect(result[0]).toHaveProperty('db_name')
    expect(result[0].db_name).toBe('memento_test')
  })

  test('should verify Better Auth tables exist in test database', async () => {
    const testConn = testSql()
    const tables = await testConn`
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

  test('test migration function should execute without errors', async () => {
    // This test ensures the migration can run multiple times safely
    await expect(runTestMigrations()).resolves.toBeUndefined()
  })
})

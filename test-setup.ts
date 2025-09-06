// Test setup file for Bun tests
// This file is preloaded before running tests

import { recreateTestDatabase, cleanupTestDatabase } from '@/lib/test-db'

// Load test environment variables from .env.test
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

try {
  const envTestPath = join(process.cwd(), '.env.test')
  const envContent = readFileSync(envTestPath, 'utf8')

  // Parse .env.test file
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=')
      const value = valueParts.join('=')
      if (key && value) {
        process.env[key.trim()] = value.trim()
      }
    }
  })
} catch (error) {
  console.warn('Could not load .env.test file:', error)
}
// biome-ignore lint/suspicious/noExplicitAny: bypass readonly restriction
;(process.env as any).NODE_ENV = 'test'

console.log('Test environment initialized')

// Global test setup - recreate database before all tests
let dbSetupPromise: Promise<void> | null = null

// Setup database once for all tests
export async function setupTestDatabase() {
  if (!dbSetupPromise) {
    dbSetupPromise = recreateTestDatabase()
  }
  return dbSetupPromise
}

// Cleanup after all tests complete
process.on('exit', () => {
  cleanupTestDatabase()
})

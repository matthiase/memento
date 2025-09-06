#!/usr/bin/env bun

// Load test environment variables
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
  console.log('✅ Loaded test environment from .env.test')
} catch (error) {
  console.error('❌ Could not load .env.test file:', error)
  process.exit(1)
}

import { recreateTestDatabase } from '@/lib/test-db'

async function main() {
  try {
    console.log('Setting up test database...')
    await recreateTestDatabase()
    console.log('✅ Test database setup completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Test database setup failed:', error)
    process.exit(1)
  }
}

main()
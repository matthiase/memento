import { describe, test, expect, beforeAll, afterAll } from 'bun:test'

// Integration tests for auth flow
// Note: These tests require a running server or will be skipped in CI
const SERVER_URL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000'

describe('Auth Flow Integration', () => {
  let serverAvailable = false

  beforeAll(async () => {
    // Check if server is running
    try {
      const response = await fetch(`${SERVER_URL}/api/auth/session`, {
        method: 'GET',
      })
      serverAvailable = response.status !== undefined
    } catch {
      serverAvailable = false
      console.log('Server not available for integration tests - skipping')
    }
  })

  test.skipIf(!serverAvailable)('should respond to session endpoint', async () => {
    const response = await fetch(`${SERVER_URL}/api/auth/session`)
    
    // Should get a response (even if it's an error due to no active session)
    expect(response).toBeDefined()
    expect(typeof response.status).toBe('number')
  })

  test.skipIf(!serverAvailable)('should handle OPTIONS requests', async () => {
    const response = await fetch(`${SERVER_URL}/api/auth/session`, {
      method: 'OPTIONS',
    })
    
    expect(response).toBeDefined()
    expect(response.headers.get('access-control-allow-methods')).toBeTruthy()
  })

  test('should have valid environment configuration', () => {
    expect(process.env.BETTER_AUTH_URL).toBeDefined()
    expect(process.env.BETTER_AUTH_SECRET).toBeDefined()
    expect(process.env.POSTGRES_URL).toBeDefined()
    expect(process.env.NEXT_PUBLIC_BETTER_AUTH_URL).toBeDefined()
  })

  test('should have consistent URL configuration', () => {
    const betterAuthUrl = process.env.BETTER_AUTH_URL
    const publicAuthUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL
    
    expect(betterAuthUrl).toBeDefined()
    expect(publicAuthUrl).toBeDefined()
    
    // After asserting they're defined, we can safely compare them
    if (betterAuthUrl && publicAuthUrl) {
      expect(betterAuthUrl).toBe(publicAuthUrl)
    }
  })
})
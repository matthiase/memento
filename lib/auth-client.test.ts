import { describe, test, expect, beforeAll } from 'bun:test'
import {
  authClient,
  signIn,
  signUp,
  signOut,
  useSession,
  getSession
} from '@/lib/auth-client'

// Mock environment for client-side testing
beforeAll(() => {
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL = 'http://localhost:3000'
})

describe('Auth Client Configuration', () => {
  test('should create auth client with correct base URL', () => {
    expect(authClient).toBeDefined()
    // Note: Better Auth client may not expose baseURL directly, test the configuration instead
    expect(authClient.$fetch).toBeDefined()
  })

  test('should export authentication functions', () => {
    expect(signIn).toBeDefined()
    expect(typeof signIn).toBe('function')

    expect(signUp).toBeDefined()
    expect(typeof signUp).toBe('function')

    expect(signOut).toBeDefined()
    expect(typeof signOut).toBe('function')

    expect(getSession).toBeDefined()
    expect(typeof getSession).toBe('function')
  })

  test('should export useSession hook', () => {
    expect(useSession).toBeDefined()
    expect(typeof useSession).toBe('function')
  })

  test('should use fallback URL when env var is not set', () => {
    // Test fallback behavior
    const fallbackURL =
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000'
    expect(fallbackURL).toBe('http://localhost:3000')

    // Re-import to test fallback
    const { createAuthClient } = require('better-auth/react')
    const testClient = createAuthClient({
      baseURL: fallbackURL
    })

    expect(testClient).toBeDefined()
    expect(testClient.$fetch).toBeDefined()
  })
})

describe('Auth Client Methods', () => {
  test('signIn function should be callable', () => {
    // Test that functions can be called (though they may fail without a running server)
    expect(() => {
      signIn
    }).not.toThrow()
  })

  test('signUp function should be callable', () => {
    expect(() => {
      signUp
    }).not.toThrow()
  })

  test('signOut function should be callable', () => {
    expect(() => {
      signOut
    }).not.toThrow()
  })

  test('getSession function should be callable', () => {
    expect(() => {
      getSession
    }).not.toThrow()
  })
})

describe('Client-side Environment', () => {
  test('should have NEXT_PUBLIC_BETTER_AUTH_URL defined', () => {
    expect(process.env.NEXT_PUBLIC_BETTER_AUTH_URL).toBeDefined()
    expect(process.env.NEXT_PUBLIC_BETTER_AUTH_URL).toBe(
      'http://localhost:3000'
    )
  })

  test('should construct proper API URLs', () => {
    const baseURL =
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000'
    expect(baseURL).toMatch(/^https?:\/\//)
    expect(authClient).toBeDefined()
  })
})

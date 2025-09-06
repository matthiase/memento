import { describe, test, expect, beforeAll } from 'bun:test'
import { auth } from '@/lib/auth'
import type { Session, User } from '@/lib/auth'

// Mock environment variables for testing  
beforeAll(() => {
  process.env.BETTER_AUTH_URL = 'http://localhost:3000'
  process.env.BETTER_AUTH_SECRET = 'test-secret-key-for-testing-only'
  process.env.POSTGRES_URL =
    'postgres://memento@localhost/memento?sslmode=disable'
})

describe('Better Auth Configuration', () => {
  test('should have valid auth configuration', () => {
    expect(auth).toBeDefined()
    expect(auth.options).toBeDefined()
  })

  test('should have correct base URL', () => {
    expect(auth.options.baseURL).toBe('http://localhost:3000')
  })

  test('should have database configuration', () => {
    expect(auth.options.database).toBeDefined()
    expect(auth.options.database).toHaveProperty('provider', 'postgresql')
    expect(auth.options.database).toHaveProperty('url')
  })

  test('should have email/password authentication enabled', () => {
    expect(auth.options.emailAndPassword).toBeDefined()
    expect(auth.options.emailAndPassword?.enabled).toBe(true)
  })

  test('should have trusted origins configured', () => {
    expect(auth.options.trustedOrigins).toBeDefined()
    expect(auth.options.trustedOrigins).toContain('http://localhost:3000')
  })

  test('should handle GitHub social provider conditionally', () => {
    // When no GitHub credentials are provided
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      expect(auth.options.socialProviders).toEqual({})
    } else {
      expect(auth.options.socialProviders).toHaveProperty('github')
      expect(auth.options.socialProviders.github).toHaveProperty('clientId')
      expect(auth.options.socialProviders.github).toHaveProperty('clientSecret')
    }
  })

  test('should have proper TypeScript types', () => {
    // Test that the exported types are properly inferred
    type SessionType = Session
    type UserType = User

    // These should compile without errors
    const mockSession: SessionType = {
      session: {
        id: 'test-session-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'test-user-id',
        expiresAt: new Date(),
        token: 'test-token',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent'
      },
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }

    const mockUser: UserType = {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      emailVerified: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    expect(mockSession).toBeDefined()
    expect(mockUser).toBeDefined()
  })
})

describe('Environment Variable Validation', () => {
  test('should require BETTER_AUTH_URL', () => {
    expect(process.env.BETTER_AUTH_URL).toBeDefined()
    expect(process.env.BETTER_AUTH_URL).toBeTruthy()
  })

  test('should require BETTER_AUTH_SECRET', () => {
    expect(process.env.BETTER_AUTH_SECRET).toBeDefined()
    expect(process.env.BETTER_AUTH_SECRET).toBeTruthy()
  })

  test('should require POSTGRES_URL', () => {
    expect(process.env.POSTGRES_URL).toBeDefined()
    expect(process.env.POSTGRES_URL).toMatch(/^postgres:\/\//)
  })

  test('should have NEXT_PUBLIC_BETTER_AUTH_URL for client-side', () => {
    expect(process.env.NEXT_PUBLIC_BETTER_AUTH_URL).toBeDefined()
    expect(process.env.NEXT_PUBLIC_BETTER_AUTH_URL).toBeTruthy()
  })
})

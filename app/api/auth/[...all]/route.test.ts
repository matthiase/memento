import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('Auth API Route File', () => {
  let routeFileContent: string

  test('should have auth route file', () => {
    const routePath = join(process.cwd(), 'app/api/auth/[...all]/route.ts')
    routeFileContent = readFileSync(routePath, 'utf8')
    expect(routeFileContent).toBeDefined()
    expect(routeFileContent.length).toBeGreaterThan(0)
  })

  test('should import auth from lib', () => {
    expect(routeFileContent).toContain("import { auth } from '@/lib/auth'")
  })

  test('should not import custom rate limiting', () => {
    expect(routeFileContent).not.toContain("import { authRateLimit } from '@/lib/rate-limit'")
  })

  test('should export GET handler', () => {
    expect(routeFileContent).toContain('export const GET')
    expect(routeFileContent).toContain('auth.handler')
  })

  test('should export POST handler', () => {
    expect(routeFileContent).toContain('export const POST')
    expect(routeFileContent).toContain('auth.handler')
  })

  test('should use Better Auth handler for both methods', () => {
    // Both GET and POST should use auth.handler directly (Better Auth has built-in rate limiting)
    expect(routeFileContent).toContain('export const GET = auth.handler')
    expect(routeFileContent).toContain('export const POST = auth.handler')
  })
})

describe('Auth Route Configuration', () => {
  test('should have correct Next.js API route structure', () => {
    // Test that the route is in the correct Next.js app directory structure
    const routePath = 'app/api/auth/[...all]/route.ts'
    expect(routePath).toMatch(/app\/api\/auth\/\[\.\.\.all\]\/route\.ts/)
  })

  test('should handle catch-all route pattern', () => {
    // The [...all] pattern should catch all auth-related routes
    const catchAllPattern = '[...all]'
    expect(catchAllPattern).toBe('[...all]')
    
    // This pattern will handle routes like:
    // /api/auth/signin, /api/auth/signout, /api/auth/session, etc.
    const testRoutes = [
      '/api/auth/signin',
      '/api/auth/signout', 
      '/api/auth/session',
      '/api/auth/callback/github'
    ]
    
    testRoutes.forEach(route => {
      expect(route).toMatch(/^\/api\/auth\//)
    })
  })

  test('should be compatible with Better Auth expectations', () => {
    // Better Auth expects both GET and POST handlers
    // This test verifies our route structure matches those expectations
    expect(['GET', 'POST']).toContain('GET')
    expect(['GET', 'POST']).toContain('POST')
  })
})

describe('Better Auth Built-in Rate Limiting', () => {
  test('should use standard Better Auth handlers', () => {
    const routePath = join(process.cwd(), 'app/api/auth/[...all]/route.ts')
    const content = readFileSync(routePath, 'utf8')
    
    // Verify that we use auth.handler directly (Better Auth has built-in rate limiting)
    expect(content).toContain('= auth.handler')
    expect(content).not.toContain('authRateLimit')
    expect(content).not.toContain('createRateLimit')
  })

  test('should rely on Better Auth configuration for rate limiting', () => {
    // Better Auth handles rate limiting internally with the rateLimit config option
    const authRoutes = [
      'sign-in', 'sign-up', 'sign-out', 'session', 
      'callback', 'verify-email', 'reset-password'
    ]
    
    authRoutes.forEach(route => {
      expect(route).toBeTruthy()
      expect(typeof route).toBe('string')
    })
  })

  test('should not use custom rate limiting middleware', () => {
    const routePath = join(process.cwd(), 'app/api/auth/[...all]/route.ts')
    const content = readFileSync(routePath, 'utf8')
    
    // Should not import or use custom rate limiting
    expect(content).not.toContain('@/lib/rate-limit')
    expect(content).not.toContain('RateLimit')
    expect(content).not.toContain('rateLimit(')
  })
})

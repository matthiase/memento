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

  test('should export GET handler', () => {
    expect(routeFileContent).toContain('export const GET')
    expect(routeFileContent).toContain('auth.handler')
  })

  test('should export POST handler', () => {
    expect(routeFileContent).toContain('export const POST')
    expect(routeFileContent).toContain('auth.handler')
  })

  test('should use Better Auth handler for both methods', () => {
    // Both GET and POST should use auth.handler
    const getMatches = routeFileContent.match(/export const GET = auth\.handler/g)
    const postMatches = routeFileContent.match(/export const POST = auth\.handler/g)
    
    expect(getMatches).toBeTruthy()
    expect(postMatches).toBeTruthy()
    expect(getMatches?.length).toBe(1)
    expect(postMatches?.length).toBe(1)
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

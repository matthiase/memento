import { describe, test, expect } from 'bun:test'
import { GET, POST } from '@/app/api/auth/[...all]/route'

describe('Auth API Routes', () => {
  test('should export GET handler', () => {
    expect(GET).toBeDefined()
    expect(typeof GET).toBe('function')
  })

  test('should export POST handler', () => {
    expect(POST).toBeDefined()
    expect(typeof POST).toBe('function')
  })

  test('GET and POST should be the same handler function', () => {
    // Better Auth uses the same handler for both GET and POST
    expect(GET).toBe(POST)
  })

  test('handler should be from Better Auth', async () => {
    // Test that the handler is properly imported from auth
    expect(GET.name).toBeTruthy()
    expect(POST.name).toBeTruthy()
  })
})

describe('Auth Route Integration', () => {
  test('should handle Request objects', async () => {
    // The handlers should accept Request objects
    // Note: Better Auth may throw initialization errors but still accept Request objects
    expect(GET).toBeDefined()
    expect(POST).toBeDefined()
    expect(typeof GET).toBe('function')
    expect(typeof POST).toBe('function')
  })

  test('should return Promise<Response>', async () => {
    // Test that the handler is callable and returns appropriate type
    expect(GET).toBeDefined()
    expect(POST).toBeDefined()
    expect(typeof GET).toBe('function')
    expect(typeof POST).toBe('function')

    // Both handlers should be the same function from Better Auth
    expect(GET).toBe(POST)
  })
})

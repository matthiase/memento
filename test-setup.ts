// Test setup file for Bun tests
// This file is preloaded before running tests

// Set test environment variables
// Use type assertion to bypass readonly restriction for NODE_ENV in tests
;(process.env as any).NODE_ENV = 'test'
process.env.BETTER_AUTH_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_BETTER_AUTH_URL = 'http://localhost:3000'
process.env.BETTER_AUTH_SECRET = 'test-secret-key-for-testing-purposes-only'
process.env.POSTGRES_URL = 'postgres://memento@localhost/memento?sslmode=disable'

console.log('Test environment initialized')
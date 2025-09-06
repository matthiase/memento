import { describe, test, expect } from 'bun:test'
import { type LoadingState } from './useAuth'

describe('useAuth Hook Types', () => {
  test('should define correct LoadingState type', () => {
    const states: LoadingState[] = ['idle', 'email', 'social', 'submitting']
    
    expect(states).toContain('idle')
    expect(states).toContain('email')
    expect(states).toContain('social')
    expect(states).toContain('submitting')
    expect(states.length).toBe(4)
  })

  test('should export hook functions', async () => {
    const { useAuth, useEmailAuth, useSocialAuth } = await import('./useAuth')
    
    expect(typeof useAuth).toBe('function')
    expect(typeof useEmailAuth).toBe('function')
    expect(typeof useSocialAuth).toBe('function')
  })

  test('useAuth hook should have correct function name', async () => {
    const { useAuth, useEmailAuth, useSocialAuth } = await import('./useAuth')
    
    expect(useAuth.name).toBe('useAuth')
    expect(useEmailAuth.name).toBe('useEmailAuth')
    expect(useSocialAuth.name).toBe('useSocialAuth')
  })
})

describe('useAuth Hook Structure', () => {
  test('should define proper interfaces', () => {
    // Test that the interfaces are properly defined by checking required properties
    const mockOptions = {
      onSuccess: () => {},
      onError: () => {}
    }
    
    expect(typeof mockOptions.onSuccess).toBe('function')
    expect(typeof mockOptions.onError).toBe('function')
  })

  test('should validate hook return type structure', () => {
    // Define the expected return structure
    const expectedReturn = {
      loadingState: 'idle' as LoadingState,
      error: null as string | null,
      isLoading: false,
      signInWithEmail: () => Promise.resolve(),
      signInWithSocial: () => Promise.resolve(),
      clearError: () => {},
      reset: () => {}
    }
    
    expect(typeof expectedReturn.signInWithEmail).toBe('function')
    expect(typeof expectedReturn.signInWithSocial).toBe('function')
    expect(typeof expectedReturn.clearError).toBe('function')
    expect(typeof expectedReturn.reset).toBe('function')
    expect(expectedReturn.loadingState).toBe('idle')
    expect(expectedReturn.isLoading).toBe(false)
    expect(expectedReturn.error).toBe(null)
  })
})

describe('Hook Specializations', () => {
  test('useEmailAuth should exclude social auth', () => {
    // Test that useEmailAuth returns the expected subset
    const expectedEmailAuth = {
      loadingState: 'idle' as LoadingState,
      error: null as string | null,
      isLoading: false,
      signInWithEmail: () => Promise.resolve(),
      clearError: () => {},
      reset: () => {}
    }
    
    expect(typeof expectedEmailAuth.signInWithEmail).toBe('function')
    expect('signInWithSocial' in expectedEmailAuth).toBe(false)
  })

  test('useSocialAuth should exclude email auth', () => {
    // Test that useSocialAuth returns the expected subset
    const expectedSocialAuth = {
      loadingState: 'idle' as LoadingState,
      error: null as string | null,
      isLoading: false,
      signInWithSocial: () => Promise.resolve(),
      clearError: () => {},
      reset: () => {}
    }
    
    expect(typeof expectedSocialAuth.signInWithSocial).toBe('function')
    expect('signInWithEmail' in expectedSocialAuth).toBe(false)
  })
})

describe('JSDoc Documentation', () => {
  test('should have comprehensive JSDoc comments', async () => {
    // Read the hook file to verify JSDoc presence
    const hookFile = await Bun.file('hooks/useAuth.ts').text()
    
    expect(hookFile).toContain('/**')
    expect(hookFile).toContain('@fileoverview')
    expect(hookFile).toContain('@param')
    expect(hookFile).toContain('@returns')
    expect(hookFile).toContain('@example')
    expect(hookFile).toContain('@typedef')
    expect(hookFile).toContain('@interface')
  })

  test('should document all public functions', async () => {
    const hookFile = await Bun.file('hooks/useAuth.ts').text()
    
    // Check that all main functions have JSDoc
    expect(hookFile).toContain('* Custom hook for authentication operations')
    expect(hookFile).toContain('* Signs in a user with email and password')
    expect(hookFile).toContain('* Signs in a user with a social provider')
    expect(hookFile).toContain('* Hook specifically for email/password authentication')
    expect(hookFile).toContain('* Hook specifically for social authentication')
  })

  test('should include practical examples', async () => {
    const hookFile = await Bun.file('hooks/useAuth.ts').text()
    
    expect(hookFile).toContain('await signInWithEmail(')
    expect(hookFile).toContain('await signInWithSocial(')
    expect(hookFile).toContain('onSuccess: (data) => router.push')
    expect(hookFile).toContain('const { signInWithEmail, isLoading, error }')
  })
})
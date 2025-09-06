/**
 * @fileoverview Custom authentication hook for Better Auth integration
 * 
 * This hook provides a clean interface for authentication operations
 * including email/password login, social authentication, and loading states.
 * 
 * @author Claude Code
 * @since 1.0.0
 */

import { useState, useCallback } from 'react'
import { 
  signIn,
  type AuthResponse,
  isAuthError,
  AUTH_ERROR_HANDLERS 
} from '@/lib/auth-client'

/**
 * Loading states for different authentication operations.
 * @typedef {'idle' | 'email' | 'social' | 'submitting'} LoadingState
 */
export type LoadingState = 'idle' | 'email' | 'social' | 'submitting'

/**
 * Configuration options for the useAuth hook.
 * @interface UseAuthOptions
 */
export interface UseAuthOptions {
  /** Called after successful authentication */
  onSuccess?: (data: any) => void
  /** Called after authentication error */
  onError?: (error: string) => void
}

/**
 * Return type for the useAuth hook.
 * @interface UseAuthReturn
 */
export interface UseAuthReturn {
  /** Current loading state */
  loadingState: LoadingState
  /** Current error message, if any */
  error: string | null
  /** Whether any authentication operation is in progress */
  isLoading: boolean
  /** Sign in with email and password */
  signInWithEmail: (email: string, password: string) => Promise<void>
  /** Sign in with social provider */
  signInWithSocial: (provider: 'github' | 'google' | string) => Promise<void>
  /** Clear current error */
  clearError: () => void
  /** Reset hook to idle state */
  reset: () => void
}

/**
 * Custom hook for authentication operations with Better Auth.
 * 
 * Provides a clean interface for email/password login, social authentication,
 * loading states, and error handling with user-friendly messages.
 * 
 * @param {UseAuthOptions} [options] Configuration options
 * @returns {UseAuthReturn} Authentication state and functions
 * 
 * @example
 * ```typescript
 * const { 
 *   signInWithEmail, 
 *   signInWithSocial,
 *   loadingState, 
 *   error,
 *   isLoading 
 * } = useAuth({
 *   onSuccess: (data) => router.push('/dashboard'),
 *   onError: (error) => console.error('Auth error:', error)
 * });
 * 
 * // Email login
 * await signInWithEmail('user@example.com', 'password');
 * 
 * // Social login  
 * await signInWithSocial('github');
 * ```
 */
export function useAuth(options: UseAuthOptions = {}): UseAuthReturn {
  const { onSuccess, onError } = options
  
  const [loadingState, setLoadingState] = useState<LoadingState>('idle')
  const [error, setError] = useState<string | null>(null)
  
  const isLoading = loadingState !== 'idle'
  
  /**
   * Clears the current error message.
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])
  
  /**
   * Resets the hook to its initial state.
   */
  const reset = useCallback(() => {
    setLoadingState('idle')
    setError(null)
  }, [])
  
  /**
   * Signs in a user with email and password.
   * 
   * @param {string} email User's email address
   * @param {string} password User's password
   * @returns {Promise<void>}
   * 
   * @example
   * ```typescript
   * await signInWithEmail('user@example.com', 'securePassword123');
   * ```
   */
  const signInWithEmail = useCallback(async (email: string, password: string): Promise<void> => {
    setLoadingState('email')
    setError(null)

    try {
      const result = await signIn.email({ email, password }) as AuthResponse

      if (isAuthError(result)) {
        const errorMessage = AUTH_ERROR_HANDLERS.signIn(result.error)
        setError(errorMessage)
        onError?.(errorMessage)
      } else {
        onSuccess?.(result.data)
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please check your connection and try again.'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoadingState('idle')
    }
  }, [onSuccess, onError])
  
  /**
   * Signs in a user with a social provider.
   * 
   * @param {string} provider The social provider to use (e.g., 'github', 'google')
   * @returns {Promise<void>}
   * 
   * @example
   * ```typescript
   * await signInWithSocial('github');
   * await signInWithSocial('google');
   * ```
   */
  const signInWithSocial = useCallback(async (provider: string): Promise<void> => {
    setLoadingState('social')
    setError(null)

    try {
      const result = await signIn.social({ provider }) as AuthResponse

      if (isAuthError(result)) {
        const errorMessage = AUTH_ERROR_HANDLERS.social(result.error)
        setError(errorMessage)
        setLoadingState('idle')
        onError?.(errorMessage)
      } else {
        onSuccess?.(result.data)
        // Note: Don't reset loading state here as social auth may redirect
      }
    } catch (err) {
      const errorMessage = `Unable to connect to ${provider}. Please check your connection and try again.`
      setError(errorMessage)
      setLoadingState('idle')
      onError?.(errorMessage)
    }
  }, [onSuccess, onError])

  return {
    loadingState,
    error,
    isLoading,
    signInWithEmail,
    signInWithSocial,
    clearError,
    reset
  }
}

/**
 * Hook specifically for email/password authentication.
 * A simplified version of useAuth for forms that only need email authentication.
 * 
 * @param {UseAuthOptions} [options] Configuration options
 * @returns {Omit<UseAuthReturn, 'signInWithSocial'>} Email auth state and functions
 * 
 * @example
 * ```typescript
 * const { signInWithEmail, isLoading, error } = useEmailAuth();
 * ```
 */
export function useEmailAuth(options: UseAuthOptions = {}) {
  const auth = useAuth(options)
  
  return {
    loadingState: auth.loadingState,
    error: auth.error,
    isLoading: auth.isLoading,
    signInWithEmail: auth.signInWithEmail,
    clearError: auth.clearError,
    reset: auth.reset
  }
}

/**
 * Hook specifically for social authentication.
 * A simplified version of useAuth for components that only need social auth.
 * 
 * @param {UseAuthOptions} [options] Configuration options
 * @returns {Omit<UseAuthReturn, 'signInWithEmail'>} Social auth state and functions
 * 
 * @example
 * ```typescript
 * const { signInWithSocial, isLoading, error } = useSocialAuth();
 * ```
 */
export function useSocialAuth(options: UseAuthOptions = {}) {
  const auth = useAuth(options)
  
  return {
    loadingState: auth.loadingState,
    error: auth.error,
    isLoading: auth.isLoading,
    signInWithSocial: auth.signInWithSocial,
    clearError: auth.clearError,
    reset: auth.reset
  }
}
import { createAuthClient } from 'better-auth/react'

const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL
  }
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return 'http://localhost:3000'
}

export const authClient = createAuthClient({
  baseURL: getBaseURL()
})

export const { signIn, signUp, signOut, useSession, getSession } = authClient

// Re-export auth types for convenience
export type { 
  AuthResponse, 
  AuthErrorResponse, 
  AuthSuccessResponse,
  BetterAuthErrorCode 
} from './auth-types'
export { 
  isAuthError, 
  isAuthSuccess, 
  AUTH_ERROR_HANDLERS,
  getUserFriendlyErrorMessage 
} from './auth-types'

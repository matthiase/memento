import { describe, test, expect } from 'bun:test'
import {
  BASE_ERROR_CODES,
  type AuthResponse,
  type AuthErrorResponse,
  type AuthSuccessResponse,
  isAuthError,
  isAuthSuccess,
  isErrorCode,
  getUserFriendlyErrorMessage,
  AUTH_ERROR_HANDLERS,
  USER_FRIENDLY_ERROR_MESSAGES
} from './auth-types'

describe('Auth Types', () => {
  describe('Type Guards', () => {
    test('isAuthError should correctly identify error responses', () => {
      const errorResponse: AuthErrorResponse = {
        data: null,
        error: { message: 'Invalid credentials' }
      }

      const successResponse: AuthSuccessResponse = {
        data: { user: { id: '1', email: 'test@example.com' } },
        error: null
      }

      expect(isAuthError(errorResponse)).toBe(true)
      expect(isAuthError(successResponse)).toBe(false)
    })

    test('isAuthSuccess should correctly identify success responses', () => {
      const errorResponse: AuthErrorResponse = {
        data: null,
        error: { message: 'Invalid credentials' }
      }

      const successResponse: AuthSuccessResponse = {
        data: { user: { id: '1', email: 'test@example.com' } },
        error: null
      }

      expect(isAuthSuccess(errorResponse)).toBe(false)
      expect(isAuthSuccess(successResponse)).toBe(true)
    })
  })

  describe('Error Code Detection', () => {
    test('isErrorCode should match by error code', () => {
      const error = {
        message: 'Some message',
        code: 'INVALID_PASSWORD' as const
      }

      expect(isErrorCode(error, 'INVALID_PASSWORD')).toBe(true)
      expect(isErrorCode(error, 'USER_NOT_FOUND')).toBe(false)
    })

    test('isErrorCode should match by message when no code', () => {
      const error = {
        message: BASE_ERROR_CODES.INVALID_PASSWORD
      }

      expect(isErrorCode(error, 'INVALID_PASSWORD')).toBe(true)
      expect(isErrorCode(error, 'USER_NOT_FOUND')).toBe(false)
    })
  })

  describe('User-Friendly Error Messages', () => {
    test('getUserFriendlyErrorMessage should return user-friendly message by code', () => {
      const error = {
        message: 'Some technical message',
        code: 'INVALID_PASSWORD' as const
      }

      const friendlyMessage = getUserFriendlyErrorMessage(error)
      expect(friendlyMessage).toBe(
        USER_FRIENDLY_ERROR_MESSAGES.INVALID_PASSWORD
      )
    })

    test('getUserFriendlyErrorMessage should return user-friendly message by matching message', () => {
      const error = {
        message: BASE_ERROR_CODES.USER_ALREADY_EXISTS
      }

      const friendlyMessage = getUserFriendlyErrorMessage(error)
      expect(friendlyMessage).toBe(
        USER_FRIENDLY_ERROR_MESSAGES.USER_ALREADY_EXISTS
      )
    })

    test('getUserFriendlyErrorMessage should fallback to original message', () => {
      const error = {
        message: 'Unknown error occurred'
      }

      const friendlyMessage = getUserFriendlyErrorMessage(error)
      expect(friendlyMessage).toBe('Unknown error occurred')
    })

    test('getUserFriendlyErrorMessage should handle empty error message', () => {
      const error = {
        message: ''
      }

      const friendlyMessage = getUserFriendlyErrorMessage(error)
      expect(friendlyMessage).toBe(
        'An unexpected error occurred. Please try again.'
      )
    })
  })

  describe('Specific Error Handlers', () => {
    test('signIn handler should provide specific messages for common errors', () => {
      const invalidCredentialsError = {
        message: BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD
      }
      expect(AUTH_ERROR_HANDLERS.signIn(invalidCredentialsError)).toBe(
        'Invalid email or password. Please check your credentials and try again.'
      )

      const userNotFoundError = {
        message: BASE_ERROR_CODES.USER_NOT_FOUND
      }
      expect(AUTH_ERROR_HANDLERS.signIn(userNotFoundError)).toBe(
        'No account found with this email. Please check the email address or sign up.'
      )

      const emailNotVerifiedError = {
        message: BASE_ERROR_CODES.EMAIL_NOT_VERIFIED
      }
      expect(AUTH_ERROR_HANDLERS.signIn(emailNotVerifiedError)).toBe(
        'Please check your email and click the verification link before signing in.'
      )
    })

    test('signUp handler should provide specific messages for signup errors', () => {
      const userExistsError = {
        message: BASE_ERROR_CODES.USER_ALREADY_EXISTS
      }
      expect(AUTH_ERROR_HANDLERS.signUp(userExistsError)).toBe(
        'An account with this email already exists. Please sign in instead.'
      )

      const invalidEmailError = {
        message: BASE_ERROR_CODES.INVALID_EMAIL
      }
      expect(AUTH_ERROR_HANDLERS.signUp(invalidEmailError)).toBe(
        'Please enter a valid email address.'
      )

      const passwordTooShortError = {
        message: BASE_ERROR_CODES.PASSWORD_TOO_SHORT
      }
      expect(AUTH_ERROR_HANDLERS.signUp(passwordTooShortError)).toBe(
        USER_FRIENDLY_ERROR_MESSAGES.PASSWORD_TOO_SHORT
      )
    })

    test('social handler should provide specific messages for OAuth errors', () => {
      const accountLinkedError = {
        message: BASE_ERROR_CODES.SOCIAL_ACCOUNT_ALREADY_LINKED
      }
      expect(AUTH_ERROR_HANDLERS.social(accountLinkedError)).toBe(
        'This social account is already linked to another user.'
      )

      const providerNotFoundError = {
        message: BASE_ERROR_CODES.PROVIDER_NOT_FOUND
      }
      expect(AUTH_ERROR_HANDLERS.social(providerNotFoundError)).toBe(
        'Social sign-in is temporarily unavailable. Please try again later.'
      )

      const failedUserInfoError = {
        message: BASE_ERROR_CODES.FAILED_TO_GET_USER_INFO
      }
      expect(AUTH_ERROR_HANDLERS.social(failedUserInfoError)).toBe(
        'Unable to retrieve information from your social account. Please try again.'
      )
    })
  })

  describe('Error Codes Coverage', () => {
    test('all error codes should have user-friendly messages', () => {
      for (const code of Object.keys(BASE_ERROR_CODES)) {
        expect(
          USER_FRIENDLY_ERROR_MESSAGES[
            code as keyof typeof USER_FRIENDLY_ERROR_MESSAGES
          ]
        ).toBeDefined()
        expect(
          typeof USER_FRIENDLY_ERROR_MESSAGES[
            code as keyof typeof USER_FRIENDLY_ERROR_MESSAGES
          ]
        ).toBe('string')
      }
    })

    test('user-friendly messages should be different from base error codes', () => {
      for (const [code, baseMessage] of Object.entries(BASE_ERROR_CODES)) {
        const friendlyMessage =
          USER_FRIENDLY_ERROR_MESSAGES[
            code as keyof typeof USER_FRIENDLY_ERROR_MESSAGES
          ]
        expect(friendlyMessage).not.toBe(baseMessage)
        expect(friendlyMessage.length).toBeGreaterThan(0)
      }
    })
  })
})

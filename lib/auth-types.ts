/**
 * @fileoverview Better Auth error types and utilities
 *
 * This module provides type-safe error handling for Better Auth responses,
 * including user-friendly error messages and context-specific error handlers.
 *
 * @author Claude Code
 * @since 1.0.0
 */

/**
 * Base error codes from Better Auth library.
 * These are the official error codes that Better Auth can return.
 *
 * @readonly
 * @enum {string}
 */
export const BASE_ERROR_CODES = {
  USER_NOT_FOUND: 'User not found',
  FAILED_TO_CREATE_USER: 'Failed to create user',
  FAILED_TO_CREATE_SESSION: 'Failed to create session',
  FAILED_TO_UPDATE_USER: 'Failed to update user',
  FAILED_TO_GET_SESSION: 'Failed to get session',
  INVALID_PASSWORD: 'Invalid password',
  INVALID_EMAIL: 'Invalid email',
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password',
  SOCIAL_ACCOUNT_ALREADY_LINKED: 'Social account already linked',
  PROVIDER_NOT_FOUND: 'Provider not found',
  INVALID_TOKEN: 'Invalid token',
  ID_TOKEN_NOT_SUPPORTED: 'id_token not supported',
  FAILED_TO_GET_USER_INFO: 'Failed to get user info',
  USER_EMAIL_NOT_FOUND: 'User email not found',
  EMAIL_NOT_VERIFIED: 'Email not verified',
  PASSWORD_TOO_SHORT: 'Password too short',
  PASSWORD_TOO_LONG: 'Password too long',
  USER_ALREADY_EXISTS: 'User already exists. Use another email.',
  EMAIL_CAN_NOT_BE_UPDATED: 'Email can not be updated',
  CREDENTIAL_ACCOUNT_NOT_FOUND: 'Credential account not found',
  SESSION_EXPIRED: 'Session expired. Re-authenticate to perform this action.',
  FAILED_TO_UNLINK_LAST_ACCOUNT: "You can't unlink your last account",
  ACCOUNT_NOT_FOUND: 'Account not found',
  USER_ALREADY_HAS_PASSWORD:
    'User already has a password. Provide that to delete the account.'
} as const

/**
 * Union type of all Better Auth error codes.
 * Use this type to ensure type safety when checking for specific errors.
 *
 * @typedef {keyof typeof BASE_ERROR_CODES} BetterAuthErrorCode
 */
export type BetterAuthErrorCode = keyof typeof BASE_ERROR_CODES

/**
 * Represents a successful authentication response.
 *
 * @template T The type of the response data
 * @interface AuthSuccessResponse
 * @property {T} data The successful response data
 * @property {null} error Always null for success responses
 */
export interface AuthSuccessResponse<T = any> {
  data: T
  error: null
}

/**
 * Represents a failed authentication response.
 *
 * @interface AuthErrorResponse
 * @property {null} data Always null for error responses
 * @property {object} error The error details
 * @property {string} error.message Human-readable error message
 * @property {number} [error.status] HTTP status code (optional)
 * @property {string} [error.statusText] HTTP status text (optional)
 * @property {BetterAuthErrorCode} [error.code] Better Auth error code (optional)
 */
export interface AuthErrorResponse {
  data: null
  error: {
    message: string
    status?: number
    statusText?: string
    code?: BetterAuthErrorCode
  }
}

/**
 * Union type representing either a successful or failed authentication response.
 *
 * @template T The type of the success response data
 * @typedef {AuthSuccessResponse<T> | AuthErrorResponse} AuthResponse
 */
export type AuthResponse<T = any> = AuthSuccessResponse<T> | AuthErrorResponse

/**
 * Type guard to check if an authentication response is an error.
 *
 * @template T The type of the success response data
 * @param {AuthResponse<T>} response The response to check
 * @returns {response is AuthErrorResponse} True if the response is an error
 *
 * @example
 * ```typescript
 * const result = await signIn.email({ email, password });
 * if (isAuthError(result)) {
 *   console.log('Error:', result.error.message);
 * }
 * ```
 */
export function isAuthError<T>(
  response: AuthResponse<T>
): response is AuthErrorResponse {
  return response.error !== null
}

/**
 * Type guard to check if an authentication response is successful.
 *
 * @template T The type of the success response data
 * @param {AuthResponse<T>} response The response to check
 * @returns {response is AuthSuccessResponse<T>} True if the response is successful
 *
 * @example
 * ```typescript
 * const result = await signIn.email({ email, password });
 * if (isAuthSuccess(result)) {
 *   console.log('Success:', result.data);
 * }
 * ```
 */
export function isAuthSuccess<T>(
  response: AuthResponse<T>
): response is AuthSuccessResponse<T> {
  return response.data !== null && response.error === null
}

/**
 * Checks if an error matches a specific Better Auth error code.
 * Matches by both error code and error message for flexibility.
 *
 * @param {AuthErrorResponse['error']} error The error object to check
 * @param {BetterAuthErrorCode} code The error code to match against
 * @returns {boolean} True if the error matches the specified code
 *
 * @example
 * ```typescript
 * if (isErrorCode(result.error, 'INVALID_PASSWORD')) {
 *   console.log('Password is incorrect');
 * }
 * ```
 */
export function isErrorCode(
  error: AuthErrorResponse['error'],
  code: BetterAuthErrorCode
): boolean {
  return error.code === code || error.message === BASE_ERROR_CODES[code]
}

// User-friendly error messages
export const USER_FRIENDLY_ERROR_MESSAGES: Record<BetterAuthErrorCode, string> =
  {
    USER_NOT_FOUND: 'No account found with this email address.',
    FAILED_TO_CREATE_USER: 'Failed to create your account. Please try again.',
    FAILED_TO_CREATE_SESSION: 'Unable to sign you in. Please try again.',
    FAILED_TO_UPDATE_USER: 'Failed to update your account.',
    FAILED_TO_GET_SESSION: 'Session error. Please try signing in again.',
    INVALID_PASSWORD: 'Incorrect password. Please try again.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_EMAIL_OR_PASSWORD:
      'Invalid email or password. Please check your credentials.',
    SOCIAL_ACCOUNT_ALREADY_LINKED:
      'This social account is already linked to another user.',
    PROVIDER_NOT_FOUND: 'Authentication provider not available.',
    INVALID_TOKEN: 'Invalid authentication token. Please try again.',
    ID_TOKEN_NOT_SUPPORTED: 'This authentication method is not supported.',
    FAILED_TO_GET_USER_INFO: 'Failed to retrieve user information.',
    USER_EMAIL_NOT_FOUND: 'No email address found for this account.',
    EMAIL_NOT_VERIFIED: 'Please verify your email address before signing in.',
    PASSWORD_TOO_SHORT:
      'Password is too short. Please use at least 8 characters.',
    PASSWORD_TOO_LONG:
      'Password is too long. Please use fewer than 128 characters.',
    USER_ALREADY_EXISTS:
      'An account with this email already exists. Please sign in instead.',
    EMAIL_CAN_NOT_BE_UPDATED: 'Unable to update email address at this time.',
    CREDENTIAL_ACCOUNT_NOT_FOUND: 'Account credentials not found.',
    SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
    FAILED_TO_UNLINK_LAST_ACCOUNT: "You can't remove your last sign-in method.",
    ACCOUNT_NOT_FOUND: 'Account not found.',
    USER_ALREADY_HAS_PASSWORD:
      'You already have a password set for this account.'
  }

// Get user-friendly error message
export function getUserFriendlyErrorMessage(
  error: AuthErrorResponse['error']
): string {
  // Try to match by error code first
  if (error.code && USER_FRIENDLY_ERROR_MESSAGES[error.code]) {
    return USER_FRIENDLY_ERROR_MESSAGES[error.code]
  }

  // Try to match by message content
  for (const [code, message] of Object.entries(BASE_ERROR_CODES)) {
    if (error.message === message) {
      return USER_FRIENDLY_ERROR_MESSAGES[code as BetterAuthErrorCode]
    }
  }

  // Default fallback
  return error.message || 'An unexpected error occurred. Please try again.'
}

// Common error handlers for different scenarios
export const AUTH_ERROR_HANDLERS = {
  signIn: (error: AuthErrorResponse['error']): string => {
    if (isErrorCode(error, 'INVALID_EMAIL_OR_PASSWORD')) {
      return 'Invalid email or password. Please check your credentials and try again.'
    }
    if (isErrorCode(error, 'EMAIL_NOT_VERIFIED')) {
      return 'Please check your email and click the verification link before signing in.'
    }
    if (isErrorCode(error, 'USER_NOT_FOUND')) {
      return 'No account found with this email. Please check the email address or sign up.'
    }
    return getUserFriendlyErrorMessage(error)
  },

  signUp: (error: AuthErrorResponse['error']): string => {
    if (isErrorCode(error, 'USER_ALREADY_EXISTS')) {
      return 'An account with this email already exists. Please sign in instead.'
    }
    if (isErrorCode(error, 'INVALID_EMAIL')) {
      return 'Please enter a valid email address.'
    }
    if (
      isErrorCode(error, 'PASSWORD_TOO_SHORT') ||
      isErrorCode(error, 'PASSWORD_TOO_LONG')
    ) {
      return getUserFriendlyErrorMessage(error)
    }
    return getUserFriendlyErrorMessage(error)
  },

  social: (error: AuthErrorResponse['error']): string => {
    if (isErrorCode(error, 'SOCIAL_ACCOUNT_ALREADY_LINKED')) {
      return 'This social account is already linked to another user.'
    }
    if (isErrorCode(error, 'PROVIDER_NOT_FOUND')) {
      return 'Social sign-in is temporarily unavailable. Please try again later.'
    }
    if (isErrorCode(error, 'FAILED_TO_GET_USER_INFO')) {
      return 'Unable to retrieve information from your social account. Please try again.'
    }
    return getUserFriendlyErrorMessage(error)
  }
}

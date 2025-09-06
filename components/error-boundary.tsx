/**
 * @fileoverview Error Boundary component for handling React errors gracefully
 *
 * This component catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 *
 * @author Claude Code
 * @since 1.0.0
 */

'use client'

import type React from 'react'
import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'

/**
 * Props for the ErrorBoundary component.
 * @interface ErrorBoundaryProps
 */
interface ErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode
  /** Optional fallback component to render when an error occurs */
  fallback?: ReactNode
  /** Optional callback function called when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  /** Whether to show detailed error information (for development) */
  showDetails?: boolean
}

/**
 * State for the ErrorBoundary component.
 * @interface ErrorBoundaryState
 */
interface ErrorBoundaryState {
  /** Whether an error has been caught */
  hasError: boolean
  /** The error that was caught */
  error?: Error
  /** Additional error information from React */
  errorInfo?: ErrorInfo
}

/**
 * Error Boundary component that catches and handles React component errors.
 *
 * This component implements React's error boundary pattern to catch JavaScript
 * errors in child components and display a user-friendly fallback UI.
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   onError={(error, errorInfo) => console.log('Error caught:', error)}
 *   showDetails={process.env.NODE_ENV === 'development'}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 *
 * @example
 * ```tsx
 * // With custom fallback
 * <ErrorBoundary
 *   fallback={<div>Something went wrong in this section.</div>}
 * >
 *   <ComplexComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)

    this.state = {
      hasError: false
    }
  }

  /**
   * Static method called when an error is thrown in a child component.
   * Updates state to trigger the fallback UI.
   *
   * @param {Error} error The error that was thrown
   * @returns {ErrorBoundaryState} New state with error information
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  /**
   * Called when an error is caught by the error boundary.
   * Logs the error and calls the optional onError callback.
   *
   * @param {Error} error The error that was thrown
   * @param {ErrorInfo} errorInfo Additional information about the error
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error
    console.error('Error caught by ErrorBoundary:', error, errorInfo)

    // Update state with error info
    this.setState({
      errorInfo
    })

    // Call optional error handler
    this.props.onError?.(error, errorInfo)
  }

  /**
   * Resets the error boundary state, allowing the component to try rendering again.
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined
    })
  }

  /**
   * Reloads the current page.
   */
  handleReload = (): void => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state
    const { children, fallback, showDetails = false } = this.props

    if (hasError) {
      // If a custom fallback is provided, use it
      if (fallback) {
        return fallback
      }

      // Default error UI
      return (
        <Card className="mx-auto max-w-lg border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Something went wrong</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-red-700">
              We're sorry, but something unexpected happened. Please try again.
            </p>

            {showDetails && error && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-red-800">
                  Error Details:
                </h4>
                <div className="rounded-md bg-red-100 p-3">
                  <p className="text-xs text-red-800 font-mono break-all">
                    {error.message}
                  </p>
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="text-xs text-red-700 cursor-pointer">
                        Stack Trace
                      </summary>
                      <pre className="mt-1 text-xs text-red-800 whitespace-pre-wrap break-all">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>

                {errorInfo?.componentStack && (
                  <div className="rounded-md bg-red-100 p-3">
                    <h5 className="text-xs font-semibold text-red-800 mb-1">
                      Component Stack:
                    </h5>
                    <pre className="text-xs text-red-800 whitespace-pre-wrap break-all">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                onClick={this.handleReset}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Try Again
              </Button>
              <Button
                onClick={this.handleReload}
                variant="default"
                size="sm"
                className="flex-1"
              >
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return children
  }
}

/**
 * Hook-based error boundary using React's error boundary pattern.
 * This is a functional approach to error boundaries using useErrorBoundary.
 *
 * Note: This requires a library like react-error-boundary for the hook implementation.
 * For now, we provide the class-based ErrorBoundary above.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const throwError = useErrorHandler()
 *
 *   const handleClick = () => {
 *     throwError(new Error('Something went wrong!'))
 *   }
 *
 *   return <button onClick={handleClick}>Trigger Error</button>
 * }
 * ```
 */
export function useErrorHandler() {
  return (error: Error) => {
    // In a real implementation, this would use react-error-boundary
    // For now, we just throw the error to be caught by the class-based boundary
    throw error
  }
}

/**
 * Higher-order component that wraps a component with an error boundary.
 *
 * @param {React.ComponentType<T>} WrappedComponent Component to wrap
 * @param {Partial<ErrorBoundaryProps>} errorBoundaryProps Props for the error boundary
 * @returns {React.ComponentType<T>} Component wrapped with error boundary
 *
 * @example
 * ```tsx
 * const SafeComponent = withErrorBoundary(MyComponent, {
 *   fallback: <div>Error in MyComponent</div>,
 *   onError: (error) => console.log('Error:', error)
 * })
 * ```
 */
export function withErrorBoundary<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  errorBoundaryProps?: Partial<ErrorBoundaryProps>
) {
  const WithErrorBoundaryComponent = (props: T) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  )

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return WithErrorBoundaryComponent
}

/**
 * Utility function to simulate errors for testing purposes.
 * Only available in development mode.
 *
 * @param {string} message Error message
 * @throws {Error} Always throws an error with the provided message
 *
 * @example
 * ```tsx
 * <button onClick={() => simulateError('Test error')}>
 *   Trigger Test Error
 * </button>
 * ```
 */
export function simulateError(message = 'Simulated error for testing'): never {
  if (!['development', 'test'].includes(process.env.NODE_ENV)) {
    console.warn(
      'simulateError() should only be used in development and test mode'
    )
  }
  throw new Error(`[Test Error] ${message}`)
}

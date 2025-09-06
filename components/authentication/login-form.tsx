'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { 
  signIn,
  type AuthResponse, 
  isAuthError, 
  AUTH_ERROR_HANDLERS 
} from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/skeleton'

type FormData = {
  email: string
  password: string
}

// Validation rules
const validationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    maxLength: {
      value: 254,
      message: 'Email address is too long'
    }
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters long'
    },
    maxLength: {
      value: 128,
      message: 'Password is too long'
    },
    validate: {
      hasLowercase: (value: string) =>
        /(?=.*[a-z])/.test(value) || 'Password must contain at least one lowercase letter',
      hasUppercase: (value: string) =>
        /(?=.*[A-Z])/.test(value) || 'Password must contain at least one uppercase letter',
      hasNumber: (value: string) =>
        /(?=.*\d)/.test(value) || 'Password must contain at least one number'
    }
  }
}

type LoadingState = 'idle' | 'email' | 'github' | 'submitting'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle')
  const [error, setError] = useState<string | null>(null)
  
  const isLoading = loadingState !== 'idle'

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
  } = useForm<FormData>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: FormData) => {
    setLoadingState('email')
    setError(null)

    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password
      }) as AuthResponse

      if (isAuthError(result)) {
        const errorMessage = AUTH_ERROR_HANDLERS.signIn(result.error)
        setError(errorMessage)
      }
    } catch (_err) {
      setError('An unexpected error occurred. Please check your connection and try again.')
    } finally {
      setLoadingState('idle')
    }
  }

  const handleGitHubSignIn = async () => {
    setLoadingState('github')
    setError(null)

    try {
      const result = await signIn.social({
        provider: 'github'
      }) as AuthResponse

      if (isAuthError(result)) {
        const errorMessage = AUTH_ERROR_HANDLERS.social(result.error)
        setError(errorMessage)
        setLoadingState('idle')
      }
    } catch (_err) {
      setError('Unable to connect to GitHub. Please check your connection and try again.')
      setLoadingState('idle')
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>[Some descriptive text]</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={handleGitHubSignIn}
                  disabled={isLoading}
                >
                  {loadingState === 'github' ? (
                    <Spinner size="sm" className="mr-2" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <title>Login with GitHub</title>
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
                    </svg>
                  )}
                  {loadingState === 'github' ? 'Connecting to GitHub...' : 'Login with GitHub'}
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    disabled={isLoading}
                    className={cn(
                      errors.email && touchedFields.email
                        ? 'border-red-500 focus:border-red-500'
                        : '',
                      isLoading && 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-60'
                    )}
                    {...register('email', validationRules.email)}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    disabled={isLoading}
                    className={cn(
                      errors.password && touchedFields.password
                        ? 'border-red-500 focus:border-red-500'
                        : '',
                      isLoading && 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-60'
                    )}
                    {...register('password', validationRules.password)}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !isValid}
                >
                  {loadingState === 'email' && <Spinner size="sm" className="mr-2" />}
                  {loadingState === 'email' ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}

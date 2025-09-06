import { betterAuth } from 'better-auth'

if (!process.env.BETTER_AUTH_URL || !process.env.BETTER_AUTH_SECRET) {
  throw new Error(
    'Missing required environment variables: BETTER_AUTH_URL and BETTER_AUTH_SECRET'
  )
}

if (!process.env.POSTGRES_URL) {
  throw new Error('Missing required environment variable: POSTGRES_URL')
}

const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  ...(process.env.NODE_ENV === 'production'
    ? [process.env.NEXT_PUBLIC_APP_URL].filter(Boolean)
    : ['http://localhost:3000'])
].filter(Boolean) as string[]

export const auth = betterAuth({
  database: {
    provider: 'postgresql',
    url: process.env.POSTGRES_URL
  },
  emailAndPassword: {
    enabled: true
  },
  socialProviders:
    process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
          }
        }
      : {},
  trustedOrigins,
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5 // 5 minutes
    }
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: false
    },
    useSecureCookies: process.env.NODE_ENV === 'production'
  }
})

export type Session = typeof auth.$Infer.Session
export type User = (typeof auth.$Infer.Session)['user']

import { betterAuth } from 'better-auth'

if (!process.env.BETTER_AUTH_URL || !process.env.BETTER_AUTH_SECRET) {
  throw new Error(
    'Missing required environment variables: BETTER_AUTH_URL and BETTER_AUTH_SECRET'
  )
}

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
  trustedOrigins: ['http://localhost:3000'],
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user

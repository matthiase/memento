import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Model Context Protocol Server Registry',
  description: 'Skills and extensions to power your AI agents'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer
          builtBy="Stack Auth"
          builtByLink="https://stack-auth.com/"
          githubLink="https://github.com/stack-auth/stack-template"
          twitterLink="https://twitter.com/stack_auth"
          linkedinLink="linkedin.com/company/stack-auth"
        />
      </body>
    </html>
  )
}

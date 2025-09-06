# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.4.5 web application for a Model Context Protocol Server Registry, built with TypeScript, React 19, Tailwind CSS 4, and Radix UI components. The project uses Bun as the package manager and Biome for linting/formatting.

## Development Commands

- `bun run dev` - Start development server with Turbopack
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run check` - Run Biome checks on app, components, and lib directories
- `bun run lint` - Run Biome linting on app, components, and lib directories
- `bun run format` - Format code with Biome on app, components, and lib directories

## Architecture & Structure

### Route Organization
- **Route Groups**: Uses Next.js App Router with route groups:
  - `(public)` - Public pages with navbar and footer layout
  - `(authentication)` - Authentication pages with minimal layout
- **Layouts**: Separate layouts for public and auth pages at `app/(public)/layout.tsx` and `app/(authentication)/layout.tsx`

### Component Structure  
- **UI Components**: Radix UI-based components in `components/ui/` (button, card, input, label, navigation-menu, popover)
- **Feature Components**: Business logic components in `components/` (navbar, footer, hero, features, wordmark)
- **Authentication Components**: Auth-specific components in `components/authentication/`

### Styling & Design System
- **Tailwind CSS 4**: Uses latest version with custom configuration
- **Design Tokens**: Geist Sans and Geist Mono fonts configured as CSS variables
- **Utility Function**: `lib/utils.ts` contains `cn()` function for conditional class merging using clsx and tailwind-merge

### Code Standards
- **Linting/Formatting**: Biome configuration with strict rules in `biome.json`
- **TypeScript**: Strict TypeScript configuration
- **Import Style**: Uses `@/` path alias for absolute imports
- **Code Style**: 2-space indentation, 80-character line width, double quotes, minimal semicolons

### Key Technologies
- **Better Auth**: Integrated for authentication and user management with PostgreSQL
- **Rate Limiting**: Custom middleware for preventing brute force attacks
- **Lucide React**: Icon library for UI icons
- **Class Variance Authority**: For component variant management
- **Next.js Features**: App Router, Layouts, TypeScript, optimized fonts

## Authentication & Security

### Better Auth Integration
- Uses Better Auth v1.3.8 with PostgreSQL (non-ORM approach using Postgres.js)
- Email/password and social authentication (GitHub OAuth)
- Custom `useAuth` hook for React components with loading states and error handling
- Type-safe error handling with user-friendly messages
- Comprehensive JSDoc documentation

### Rate Limiting (Better Auth Built-in)
- **Email sign-in**: 5 attempts per 15 minutes per IP
- **Email sign-up**: 3 attempts per 5 minutes per IP  
- **Password reset**: 3 attempts per 1 hour per IP
- **Social auth (GitHub)**: 5 attempts per 10 minutes per IP
- **General auth endpoints**: 10 requests per 1 minute per IP
- Better Auth handles rate limiting internally with `X-Retry-After` headers
- Enabled in both development and production environments

### Production Security Considerations
- Better Auth rate limiting uses in-memory storage by default
- For horizontal scaling, configure database storage in Better Auth config
- Configure proper CORS policies
- Use environment-specific secrets and keys
- Implement additional layers like Cloudflare rate limiting if needed
- Better Auth rate limiting is IP-based and automatic

## Development Notes

- Project appears to be in active development with authentication flow implementation
- Landing page features MCP (Model Context Protocol) server registry concept
- Uses route groups for clean separation between public and authenticated areas
- All formatting and linting should use Biome commands, not ESLint/Prettier
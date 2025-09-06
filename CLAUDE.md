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
- **Stack Auth**: Integrated for authentication and user management
- **Lucide React**: Icon library for UI icons
- **Class Variance Authority**: For component variant management
- **Next.js Features**: App Router, Layouts, TypeScript, optimized fonts

## Development Notes

- Project appears to be in active development with authentication flow implementation
- Landing page features MCP (Model Context Protocol) server registry concept
- Uses route groups for clean separation between public and authenticated areas
- All formatting and linting should use Biome commands, not ESLint/Prettier
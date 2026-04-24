---
name: croissant-stack
description: Expert guidance for working with the Croissant Stack (TanStack Start, Better Auth, oRPC, Drizzle)
---

# Croissant Stack

This skill provides specialized knowledge and instructions for working within the Croissant Stack repository—a modern, type-safe full-stack monorepo.

## When to use

Use this skill when performing any task within this repository, including:
- Developing features in the TanStack Start application (`apps/web`).
- Managing the database schema or migrations (`packages/db`).
- Extending the oRPC API (`packages/orpc`).
- Configuring authentication with Better Auth (`packages/auth`).
- Creating or modifying shared UI components (`packages/ui`).
- Using or maintaining the `create-croissant` CLI.

## Instructions

### 1. Project Architecture
Understand the monorepo structure powered by **Turborepo**:
- **`apps/web`**: The main TanStack Start application.
- **`packages/auth`**: Authentication logic using Better Auth.
- **`packages/db`**: Database schema and Drizzle client.
- **`packages/orpc`**: Modular, type-safe API layer.
- **`packages/ui`**: Shared UI components using shadcn/ui.

### 2. Local Development
- **Install dependencies**: Use `npm install`.
- **Database setup**: Run `npm run db:up` to start the PostgreSQL container.
- **Environment variables**: Ensure `.env` exists at the root (copy from `.env.example`).
- **Push schema**: Run `npm run db:push --filter @workspace/db` after schema changes.
- **Start dev server**: Run `npm run dev` from the root. The app runs at `http://localhost:3000`.

### 3. Working with oRPC
- API procedures are located in `packages/orpc/src/lib/`.
- The main router is in `packages/orpc/src/lib/router.ts`.
- When adding new procedures, follow the modular pattern (e.g., create a new file in `lib/` and import it into the main router).

### 4. Database & Schema
- Define schemas in `packages/db/src/schema.ts` or modular files in `packages/db/src/`.
- Use Drizzle Kit commands via Turbo: `npm run db:push --filter @workspace/db` or `npm run db:studio --filter @workspace/db`.

### 5. UI Components
- Shared components live in `packages/ui/src/components`.
- Use the shadcn CLI to add new components: `npx shadcn@latest add [component-name] -c apps/web`. This is configured to place components into the shared package.

### 6. Turborepo Commands
- Use `--filter` to target specific packages: `npm run [command] --filter [package-name]`.
- Example: `npm run build --filter web` or `npm run lint --filter @workspace/db`.

### 7. Creating New Projects
- The `packages/create-croissant` directory contains the source for the CLI tool.
- The `template/` directory inside it should be kept in sync with the main repository structure.

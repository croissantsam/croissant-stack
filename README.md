# Croissant Stack

A modern, type-safe full-stack monorepo powered by **TanStack Start**, **Better Auth**, **oRPC**, and **Drizzle ORM**.

## 🚀 Quick Start

The fastest way to scaffold a new project with the Croissant Stack is using our CLI:

```bash
npx create-croissant@latest
```

---

## 🚀 Features

- **Frontend**: [TanStack Start](https://tanstack.com/start) for a seamless, type-safe React experience.
- **Authentication**: [Better Auth](https://www.better-auth.com/) with Drizzle adapter and PostgreSQL.
- **API**: [oRPC](https://orpc.sh/) with a modular, namespaced router for end-to-end type-safety.
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL and Docker Compose setup.
- **Styling**: [shadcn/ui](https://ui.shadcn.com/) components with Tailwind CSS.
- **Monorepo**: Powered by [Turborepo](https://turbo.build/) for lightning-fast builds and smart task orchestration.
- **Developer Experience**: Path aliases (`@/`), strict TypeScript, and automated linting/formatting.

## 🚀 Monorepo Management with Turborepo

This project uses **Turborepo** to manage the monorepo efficiently. Turbo understands the dependency graph between our packages and optimizes our workflow in several ways:

- **Smart Caching**: Tasks like `build` and `lint` are cached. If the code hasn't changed, Turbo will replay the logs and output instantly.
- **Parallel Execution**: Run tasks across multiple packages simultaneously without stepping on each other's toes.
- **Task Pipelines**: Defines the relationship between tasks (e.g., "don't build the app until its dependencies are built").

You can see the configuration in `turbo.json`.

## 📁 Project Structure

- `apps/web`: The main TanStack Start application. Uses `@/` path alias for clean imports.
- `packages/auth`: Authentication logic and Better Auth configuration.
- `packages/db`: Database schema, migrations, and Drizzle client.
- `packages/orpc`: Type-safe API router. Organized into modular files (e.g., `lib/planets.ts`).
- `packages/ui`: Shared UI components and styles.

## 🛠️ Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up the Database

Start the PostgreSQL database using Docker Compose:

```bash
npm run db:up
```

This command runs a PostgreSQL container named `samstack` on port `5432`.

### 3. Environment Variables

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

Ensure you provide the necessary variables:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auth
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-here
```

### 4. Push Database Schema

Synchronize your schema with the database:

```bash
# From packages/db or via turbo
npm run db:push --filter @workspace/db
```

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📦 Scripts

All scripts are orchestrated by Turborepo. You can run them from the root directory:

- `npm run dev`: Start all applications in development mode.
- `npm run build`: Build all applications for production.
- `npm run lint`: Lint all packages (uses Turbo's caching).
- `npm run format`: Format all packages using Prettier.
- `npm run typecheck`: Run TypeScript type checking across the workspace.

### 🗄️ Database Scripts

These handle Docker and Drizzle operations:

- `npm run db:up`: Start the PostgreSQL Docker container.
- `npm run db:down`: Stop and remove the database container.
- `npm run db:logs`: Tail logs from the database container.
- `npm run db:push --filter @workspace/db`: Push Drizzle schema to the database.
- `npm run db:studio --filter @workspace/db`: Open Drizzle Studio to explore your data.

### 🎯 Filtering Tasks

Turbo allows you to run tasks for specific packages using the `--filter` flag:

```bash
# Only lint the web app
npm run lint -- --filter web

# Build the db package and everything that depends on it
npm run build -- --filter @workspace/db...
```

## 🔗 oRPC & Type Safety

The project uses oRPC for end-to-end type safety. The router is modularized for better maintainability:

- `packages/orpc/src/lib/router.ts`: Main router entry point.
- `packages/orpc/src/lib/planets.ts`: Planet-related procedures.

On the client side, you can infer types directly from the router:

```typescript
import type { router } from "@workspace/orpc/router"
import type { InferRouterInputs, InferRouterOutputs } from "@orpc/server"

type Inputs = InferRouterInputs<typeof router>
type Outputs = InferRouterOutputs<typeof router>
```

## 🧱 Adding Components

To add components to the shared UI package:

```bash
npx shadcn@latest add [component-name] -c apps/web
```

This will place the UI components in `packages/ui/src/components`.

## 🛡️ License

MIT

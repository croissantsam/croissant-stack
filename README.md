# Croissant Stack

A modern, type-safe full-stack monorepo powered by **TanStack Start**, **Better Auth**, **oRPC**, and **Drizzle ORM**.

## 🚀 Quick Start

The fastest way to scaffold a new project with the Croissant Stack is using our CLI:

```bash
npx create-croissant@latest
```

---

## 🌟 Features

- **Web (Platform)**: [TanStack Start](https://tanstack.com/start) for a seamless, type-safe React experience.
- **Mobile**: [Expo](https://expo.dev/) (React Native) for cross-platform mobile development.
- **Desktop**: [Electron](https://www.electronjs.org/) with [electron-vite](https://electron-vite.org/) for native desktop applications.
- **Authentication**: [Better Auth](https://www.better-auth.com/) with Drizzle adapter and PostgreSQL.
- **API**: [oRPC](https://orpc.sh/) with a modular, namespaced router for end-to-end type-safety.
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL and Docker Compose setup.
- **Styling**: [shadcn/ui](https://ui.shadcn.com/) components with Tailwind CSS.
- **Monorepo Management**: Powered by [Turborepo](https://turbo.build/) for lightning-fast builds and smart task orchestration.
- **Developer Experience**: 
  - Path aliases (`@/`) for clean imports.
  - Strict TypeScript across the entire stack.
  - Ultra-fast linting and formatting with [Oxc](https://oxc.rs/) (`oxlint` and `oxfmt`).
  - Automated CI checks on push via [Husky](https://typicode.github.io/husky/).

## 📁 Project Structure

### Apps
- `apps/platform`: The main TanStack Start web application.
- `apps/mobile`: Expo-powered mobile application.
- `apps/desktop`: Electron-powered desktop application.

### Packages
- `packages/auth` (`@workspace/auth`): Authentication logic and Better Auth configuration.
- `packages/db` (`@workspace/db`): Database schema, migrations, and Drizzle client.
- `packages/orpc` (`@workspace/orpc`): Type-safe API router and definitions.
- `packages/ui` (`@workspace/ui`): Shared UI components and global styles.
- `packages/config-typescript` (`@workspace/config-typescript`): Shared TypeScript configurations.
- `packages/create-croissant`: The CLI tool for scaffolding new projects.

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

The web application will be available at `http://localhost:3000`.

## 📦 Scripts

All scripts are orchestrated by Turborepo. You can run them from the root directory:

### Core Scripts
- `npm run dev`: Start all applications in development mode.
- `npm run build`: Build all applications for production.
- `npm run quality`: Run all quality checks (linting and formatting) using Oxc.
- `npm run quality:fix`: Automatically fix linting and formatting issues using Oxc.
- `npm run typecheck`: Run TypeScript type checking across the workspace.
- `npm run ci`: Run linting, type-checking, and build (used in CI/CD).

### 🗄️ Database Scripts
These handle Docker and Drizzle operations:
- `npm run db:up`: Start the PostgreSQL Docker container.
- `npm run db:down`: Stop and remove the database container.
- `npm run db:logs`: Tail logs from the database container.
- `npm run db:push --filter @workspace/db`: Push Drizzle schema to the database.
- `npm run db:studio --filter @workspace/db`: Open Drizzle Studio to explore your data.

## 🎯 Turborepo Power

### Filtering Tasks
Turbo allows you to run tasks for specific packages using the `--filter` flag:

```bash
# Only lint the platform app
npm run lint -- --filter platform

# Build the db package and everything that depends on it
npm run build -- --filter @workspace/db...
```

### Smart Caching
Tasks like `build` and `lint` are cached. If the code hasn't changed, Turbo will replay the logs and output instantly.

## 🔗 oRPC & Type Safety

The project uses oRPC for end-to-end type safety. The router is modularized for better maintainability:

- `packages/orpc/src/lib/router.ts`: Main router entry point.
- `packages/orpc/src/lib/planets.ts`: Planet-related procedures.

On the client side, you can infer types directly from the router:

```typescript
import type { router } from "@workspace/orpc/router";
import type { InferRouterInputs, InferRouterOutputs } from "@orpc/server";

type Inputs = InferRouterInputs<typeof router>;
type Outputs = InferRouterOutputs<typeof router>;
```

## 🧱 UI Components

To add components to the shared UI package:

```bash
npx shadcn@latest add [component-name] -c apps/platform
```

This will place the UI components in `packages/ui/src/components`.

## 🛡️ Quality & Git Hooks

This project uses **Husky** to ensure code quality. When pushing to the `main` branch, it automatically runs the CI pipeline (`npm run ci`) to prevent broken code from being pushed.

Formatting and linting are handled by **Oxc**, which is significantly faster than ESLint and Prettier.

- **Linting**: `oxlint`
- **Formatting**: `oxfmt`

---

Built with ❤️ for the ultimate developer experience.

## 🛡️ License

MIT

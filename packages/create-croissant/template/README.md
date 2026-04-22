# Croissant Stack

A modern, type-safe full-stack monorepo powered by **TanStack Start**, **Better Auth**, **oRPC**, and **Drizzle ORM**.

## 🚀 Features

- **Frontend**: [TanStack Start](https://tanstack.com/start) for a seamless, type-safe React experience.
- **Authentication**: [Better Auth](https://www.better-auth.com/) with Drizzle adapter and PostgreSQL.
- **API**: [oRPC](https://orpc.sh/) for end-to-end type-safety between server and client.
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL and Docker Compose setup.
- **Styling**: [shadcn/ui](https://ui.shadcn.com/) components with Tailwind CSS.
- **Monorepo**: Managed by [Turborepo](https://turbo.build/).

## 📁 Project Structure

- `apps/web`: The main TanStack Start application.
- `packages/auth`: Authentication logic and Better Auth configuration.
- `packages/db`: Database schema, migrations, and Drizzle client.
- `packages/orpc`: Type-safe API router and procedures.
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

Create a `.env` file in the root directory (you can copy from `.env.example` if available) and provide the necessary variables:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auth
BETTER_AUTH_URL=http://localhost:3000
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

- `npm run dev`: Start all applications in development mode.
- `npm run build`: Build all applications for production.
- `npm run db:up`: Start the PostgreSQL Docker container.
- `npm run db:down`: Stop and remove the database container.
- `npm run db:logs`: Tail logs from the database container.
- `npm run lint`: Lint all packages.
- `npm run typecheck`: Run TypeScript type checking.

## 🧱 Adding Components

To add components to the shared UI package:

```bash
pnpm dlx shadcn@latest add [component-name] -c apps/web
```

This will place the UI components in `packages/ui/src/components`.

## 🛡️ License

MIT

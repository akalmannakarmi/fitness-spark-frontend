# Fitness Spark — Frontend

Web frontend for **Fitness Spark**, a meal-planning application that helps users create personalized meal plans, discover healthy recipes, and track their nutrition goals. This is a Next.js (Pages Router) application that talks to the [Fitness Spark backend API](https://github.com/akalmannakarmi/fitness-spark) (a separate repository).

## Tech Stack

- **Framework:** Next.js 15 (Pages Router)
- **UI:** React 19
- **Styling:** Tailwind CSS v4 (CSS-first configuration)
- **Data fetching:** TanStack Query + Axios
- **Forms:** React Hook Form
- **Charts:** Recharts
- **Icons:** Lucide
- **Package manager:** Bun
- **Quality tools:** ESLint, Prettier, TypeScript (strict), Husky + lint-staged
- **Testing:** Vitest + Testing Library + jsdom

## Prerequisites

- **[Bun](https://bun.sh)** (package manager and runtime)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/akalmannakarmi/fitness-spark-frontend.git
cd fitness-spark-frontend
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment variables

Copy the example file and adjust the API URL if your backend is not on `localhost:8000`:

```bash
cp .env.example .env.local
```

### 4. Run the development server

```bash
bun run dev
```

Open <http://localhost:3000> with your browser. The backend API must be running — see its README for setup.

## Environment Variables

| Variable                   | Description                                                                        |
| -------------------------- | ---------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`      | Base URL of the backend API (default `http://localhost:8000`)                      |
| `NEXT_PUBLIC_API_BASE_URL` | Optional override used as the Axios base URL (falls back to `NEXT_PUBLIC_API_URL`) |

## Available Scripts

| Script                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `bun run dev`          | Start the development server (Turbopack) |
| `bun run build`        | Create a production build                |
| `bun run start`        | Start the production server              |
| `bun run lint`         | Run ESLint                               |
| `bun run lint:fix`     | Run ESLint and auto-fix issues           |
| `bun run format`       | Format code with Prettier                |
| `bun run format:check` | Check formatting with Prettier           |
| `bun run typecheck`    | Type-check with `tsc --noEmit`           |
| `bun run test`         | Run tests with Vitest                    |
| `bun run test:ui`      | Open the Vitest UI                       |

## Docker

Build and run the frontend with Docker:

```bash
docker compose up --build
```

The app is served on port `3000`. Compose reads environment variables from `.env`.

The `Dockerfile` is a multi-stage build (Bun for deps/build, Node base image for runtime) that relies on Next.js `output: "standalone"` for a minimal production image.

## Contributing

Development guidelines and standards are shared with the backend and documented in the [`fitness-spark` CONTRIBUTING.md](https://github.com/akalmannakarmi/fitness-spark/blob/main/CONTRIBUTING.md).

# Akhere Book Foundation

An imported pnpm monorepo containing the Akhere Book Foundation homepage mockup and an Express API foundation.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/mockup-sandbox run dev` — run the homepage component preview
- Required env: `DATABASE_URL` — supplied automatically by Replit's managed PostgreSQL

## Preview

- Homepage mockup: `/__mockup/preview/ABFHomepage`
- API health check: `/api/healthz`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mockup-sandbox/src/components/mockups/ABFHomepage.tsx` — homepage mockup
- `artifacts/mockup-sandbox/src/index.css` — mockup theme and styling
- `artifacts/api-server/src/routes/` — API routes
- `lib/db/src/schema/` — Drizzle schema exports
- `lib/api-spec/openapi.yaml` — API contract source of truth

## Architecture decisions

- The imported pnpm workspace structure is preserved.
- The homepage is currently delivered as a mockup-sandbox component preview.
- The API is a separate Express 5 artifact mounted under `/api`.
- Database access uses the Replit-managed PostgreSQL connection through Drizzle ORM.

## Product

The current preview presents the Akhere Book Foundation's public homepage direction, including organization navigation, donation and involvement calls to action, and a mission-led hero section.

## User preferences

- Keep the existing imported structure and stack unless a future request requires otherwise.

## Gotchas

- The API server requires a `PORT` value, provided by its managed artifact workflow.
- The database connection variables are runtime-managed; do not set `DATABASE_URL` manually.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

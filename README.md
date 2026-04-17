# WedSnap

WedSnap is a Next.js MVP for event-scoped wedding photo collection.

Guests can:

- open an event page at `/e/[eventSlug]`
- upload photos through signed R2 upload URLs
- browse an event gallery when enabled

Event owners can:

- open `/admin/events/[eventSlug]`
- inspect uploaded media
- download originals
- delete uploads and recalculate event storage usage

## Stack

- Next.js App Router
- PostgreSQL + Prisma
- Cloudflare R2
- Sharp
- Zod
- Vitest

## Required Environment Variables

Copy [.env.example](./.env.example) and fill in:

- `DATABASE_URL`
- `R2_ACCOUNT_ID`
- `R2_BUCKET_NAME`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_PUBLIC_BASE_URL`
- `SIGNED_URL_EXPIRY_SECONDS`
- `MAX_UPLOAD_MB_DEFAULT`
- `MAX_EVENT_STORAGE_MB_DEFAULT`
- `NEXT_PUBLIC_APP_URL`

## Scripts

```bash
pnpm dev
pnpm build
pnpm test
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm db:setup
pnpm db:studio
```

## Local Setup

1. Create `.env` from `.env.example`.
2. Point `DATABASE_URL` to your Postgres database.
3. Fill in the Cloudflare R2 credentials and bucket values.
4. Run `pnpm install`.
5. Run `pnpm db:setup`.
6. Start the app with `pnpm dev`.

The seed script creates a default `demo-event` record so these routes work immediately:

- `/e/demo-event`
- `/e/demo-event/gallery`
- `/admin/events/demo-event`

## Production Notes

- The R2 bucket must stay private.
- Uploads are written with signed PUT URLs only.
- Gallery and admin previews rely on signed read URLs or derivative assets.
- `NEXT_PUBLIC_APP_URL` must be set to the real deployed app URL.
- Run `pnpm db:generate` and `pnpm db:push` during initial deployment before serving traffic.

## Current Scope

Implemented:

- event public page
- signed upload init/complete flow
- derivative generation for thumbnails and optimized images
- event gallery
- event admin page
- delete flow
- rate limiting, logging, and basic tests

Backlog items remain tracked in [docs/IMPLEMENTATION_PLAN.md](./docs/IMPLEMENTATION_PLAN.md).

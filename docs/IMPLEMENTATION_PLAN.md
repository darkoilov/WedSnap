# WedSnap Implementation Plan

## Purpose

This file is the execution tracker for the project.

Rules for implementation:

- work strictly step by step
- do not skip unfinished checklist items
- mark each completed item immediately
- keep scope aligned with the source documents
- treat `docs/features.md` as backlog, not MVP

## Source Of Truth

Implementation priority:

1. `docs/CODEX MASTER IMPLEMENTATION SPEC.docx`
2. `docs/🧾 WEDDING QR PHOTO PLATFORM.docx`
3. `docs/features.md` only after MVP is complete

Excluded from implementation:

- old V0 specification files

## Scope Lock

### MVP In Scope

- event-based public page at `/e/[eventSlug]`
- image upload flow for guests
- event-based gallery at `/e/[eventSlug]/gallery`
- event-based admin page at `/admin/events/[eventSlug]`
- database-backed events and uploads
- signed uploads to private object storage
- image derivative generation
- upload limits and event status enforcement
- delete upload flow
- production-safe validation and error handling

### Not In MVP

- guest login/authentication
- payments
- owner multi-event dashboard
- guest comments/messages
- guest list
- ZIP export
- poster/barcode generation
- bulk download

## Non-Negotiable Rules

- `1 QR = 1 event`
- every upload belongs to exactly one event
- all upload and gallery queries are scoped by event
- bucket stays private
- uploads use signed URLs only
- original assets remain untouched
- storage keys are event-namespaced
- gallery grid must not use original assets

## Decisions Locked For First Pass

- use Next.js App Router
- use route handlers for API endpoints
- use PostgreSQL
- use Prisma ORM
- use Cloudflare R2
- use Sharp for image processing
- support images first
- keep video support schema-ready but disabled unless explicitly implemented later
- keep admin minimal and unauthenticated unless auth already exists

## Progress Tracker

Legend:

- `[ ]` not started
- `[~]` in progress
- `[x]` done
- `[-]` deferred

## Phase 0: Project Alignment

- [x] Remove old V0 implementation specs from active planning
- [x] Consolidate working implementation plan into this file
- [x] Confirm final database provider and connection target
- [x] Confirm R2 bucket and environment strategy
- [x] Confirm whether gallery is enabled in MVP by default

## Phase 1: Foundation

### 1.1 Route Structure Migration

- [x] Replace prototype root route flow with event-based route structure
- [x] Add `app/e/[eventSlug]/page.tsx`
- [x] Add `app/e/[eventSlug]/gallery/page.tsx`
- [x] Add `app/admin/events/[eventSlug]/page.tsx`
- [x] Decide what root `/` should do during MVP
- [x] Remove or repurpose obsolete prototype pages that conflict with final routing

### 1.2 Environment Validation

- [x] Add env validation module
- [x] Add required vars for database
- [x] Add required vars for R2
- [x] Add defaults for upload and event storage limits
- [x] Ensure app fails clearly when required env vars are missing

### 1.3 Database Setup

- [x] Add Prisma dependencies and scripts
- [x] Create `prisma/schema.prisma`
- [x] Define `Event` model
- [x] Define `Upload` model
- [x] Add required enums
- [x] Add indexes and unique constraints
- [x] Create database client helper

### 1.4 Core Domain Helpers

- [x] Add event data access helper
- [x] Add upload data access helper
- [x] Add storage key builder helper
- [x] Add shared validation schemas
- [x] Add formatting/util helpers needed for MVP

## Phase 2: Event Read Flow

### 2.1 Public Event API

- [x] Add `GET /api/event/[eventSlug]`
- [x] Validate slug input
- [x] Return only public-safe event fields
- [x] Return proper not-found behavior

### 2.2 Public Event Page

- [x] Load event data by slug
- [x] Render event name/date/location from real data
- [x] Render upload availability state from event status
- [x] Render storage status from real event values
- [x] Gate gallery CTA based on event settings
- [x] Add not-found or friendly invalid event UI

## Phase 3: Upload Pipeline

### 3.1 Storage Layer

  - [x] Add R2 client wrapper
  - [x] Add signed PUT upload URL creation
  - [x] Add object existence check helper
  - [x] Add signed read URL helper if required
  - [x] Add object delete helper

### 3.2 Upload Init API

  - [x] Add `POST /api/upload/init`
  - [x] Validate request body with Zod
  - [x] Validate event exists
  - [x] Validate event is active
  - [x] Validate mime type
  - [x] Validate file size
  - [x] Validate remaining storage
  - [x] Validate file count limit
  - [x] Create pending upload record
  - [x] Return signed upload response

### 3.3 Upload Complete API

  - [x] Add `POST /api/upload/complete`
  - [x] Validate upload belongs to event
  - [x] Verify uploaded object exists when practical
  - [x] Mark upload as uploaded
  - [x] Trigger image processing
  - [x] Update event storage usage

### 3.4 Guest Upload UI Integration

  - [x] Replace mock upload behavior with real API calls
  - [x] Support multiple selected files
  - [x] Preserve selected files on failure
  - [x] Show per-flow progress state clearly
  - [x] Handle retry path
  - [x] Handle closed/full event errors
  - [x] Handle invalid file and oversize errors

## Phase 4: Image Processing

### 4.1 Derivative Generation

  - [x] Generate thumbnail asset for image uploads
  - [x] Generate optimized web asset for image uploads
  - [x] Store derivative keys in database
  - [x] Preserve original upload untouched
  - [x] Capture image dimensions when available

### 4.2 Presentation Rules

  - [x] Ensure gallery grid uses thumbnail or optimized asset only
  - [x] Ensure modal/full preview uses optimized or signed original as intended
  - [x] Keep image loading lazy in gallery

## Phase 5: Gallery

### 5.1 Gallery API

  - [x] Add `GET /api/gallery/[eventSlug]`
  - [x] Return only non-deleted uploads for that event
  - [x] Exclude failed and deleted records
  - [x] Return image-ready gallery payload

### 5.2 Gallery Page

  - [x] Load event-scoped gallery data
  - [x] Render responsive grid
  - [x] Render empty state
  - [x] Render loading state
  - [x] Render modal/lightbox
  - [x] Respect event gallery setting

## Phase 6: Admin

### 6.1 Admin Event Page

  - [x] Load event-specific admin data
  - [x] Show event usage stats
  - [x] Show upload count
  - [x] Show upload list/grid
  - [x] Show per-upload delete action
  - [x] Add optional per-upload download if low-cost to support

### 6.2 Delete Flow

  - [x] Add `POST /api/admin/uploads/[uploadId]/delete`
  - [x] Soft delete upload record
  - [x] Remove gallery visibility
  - [x] Delete storage assets if configured
  - [x] Recalculate or update event storage usage

## Phase 7: Hardening

### 7.1 Security

  - [x] Add signed URL expiration policy
  - [x] Sanitize filenames
  - [x] Add rate limiting for upload endpoints
  - [x] Ensure no secrets leak to client

### 7.2 Logging And Errors

  - [x] Add structured logging for upload lifecycle
  - [x] Add safe user-facing API errors
  - [x] Add server-side diagnostics for failures

### 7.3 Testing

  - [x] Add tests for event isolation
  - [x] Add tests for upload validation rules
  - [x] Add tests for delete behavior
  - [x] Add tests for gallery filtering

### 7.4 Production Verification

  - [x] Verify production build passes
  - [x] Verify startup env validation
  - [x] Verify route coverage
  - [x] Verify no mock data remains in MVP routes

## Backlog After MVP

- [ ] Single file download
- [ ] Bulk download / ZIP export
- [ ] Guest list
- [ ] Per-guest media grouping
- [ ] Guest messages
- [ ] Event statistics dashboard
- [ ] Login requirement toggle for uploads
- [ ] Poster/barcode generation

## Working Protocol

For every implementation session:

1. mark the current item as `[~]`
2. finish that item end-to-end
3. verify it
4. mark it `[x]`
5. move to the next item only after that

If an item is intentionally postponed, mark it `[-]` and state why.

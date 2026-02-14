# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Yonsei Joy Dental Clinic (연세조이치과) website — a Korean dental clinic site built with Next.js (App Router) and Sanity CMS. The site is in Korean. 도메인은 아직 미정.

## Commands

- `npm run dev` — Start development server (Next.js + embedded Sanity Studio)
- `npm run build` — Production build
- `npm run lint` — ESLint (flat config, no args needed)
- `npx sanity@latest schema deploy` — Deploy local schema changes to Sanity cloud

## Architecture

### Next.js App Router + Embedded Sanity Studio

The app uses Next.js 16 with the App Router. Sanity Studio is embedded at `/studio` via a catch-all route (`app/studio/[[...tool]]/page.tsx`). The Studio is configured in `sanity.config.ts` (marked `"use client"`).

### Sanity Configuration

- Project ID and dataset are read from env vars: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
- Client is created in `sanity/client.ts` using `next-sanity`'s `createClient`
- `safeFetch()` wrapper returns `null` when Sanity is unconfigured (projectId = "placeholder") or on fetch errors — all page components use this and handle null gracefully with fallback values
- `urlFor()` helper generates Sanity image URLs via `@sanity/image-url`

### Content Model (Sanity Schemas)

Schemas live in `sanity/schemas/` and are registered in `sanity/schemas/index.ts`:

- **siteSettings** — Singleton: phone numbers, email, address (used in layout Header/Footer)
- **heroSlide** — Hero carousel images with ordering
- **doctor** — Staff profiles with specialties, tag (implant/ortho/general), ordering
- **hours** — Singleton: schedule array with day/time/highlight/closed fields
- **post** — Blog posts with slug, category (ortho/implant/general), Portable Text body with inline images

### GROQ Queries

All queries are centralized in `sanity/lib/queries.ts`. Pages import and use these named query constants.

### Page Structure

- `/` (`app/page.tsx`) — Homepage, server component that fetches all content sections in parallel via `Promise.all`
- `/columns` (`app/columns/page.tsx`) — Blog listing with client-side category filtering (`ColumnsClient.tsx`)
- `/columns/[slug]` — Individual post pages using Portable Text rendering (`@portabletext/react`)
- `/studio` — Embedded Sanity Studio

### Styling

All styles are in a single `styles/globals.css` file. Components use class names defined there. Scroll animations are handled by `components/ScrollAnimations.tsx` (adds `.visible` class to `.fade-in` elements on intersection).

### Path Aliases

`@/*` maps to project root (configured in `tsconfig.json`).

## Key Patterns

- Homepage components (Hero, About, Doctors, Treatments, Hours, MapSection, BlogPreview) receive data as props from the server-rendered page
- Post categories use string values: `"ortho"`, `"implant"`, `"general"`
- Blog post body uses Portable Text (block content + images)
- `styled-components` is a dependency but the main styling approach is the global CSS file

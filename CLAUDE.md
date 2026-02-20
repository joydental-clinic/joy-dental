# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Yonsei Joy Dental Clinic (연세조이치과) website — a Korean dental clinic site built with Astro and Sanity CMS. The site is in Korean. Static output (SSG) with React islands for interactive components.

## Commands

- `npm run dev` — Start Astro development server
- `npm run build` — Production build (static output to `dist/`)
- `npm run preview` — Preview production build locally
- `npx sanity@latest schema deploy` — Deploy local schema changes to Sanity cloud

## Architecture

### Astro (Static Site Generation) + Sanity CMS

The app uses Astro with `output: "static"`. All pages are pre-rendered at build time. Interactive components use React islands with Astro's `client:*` directives for selective hydration.

Sanity Studio is accessed externally (not embedded). Schema files remain in `sanity/schemas/` for CLI deployment.

### Sanity Configuration

- Project ID and dataset are configured via `@sanity/astro` integration in `astro.config.mjs`
- Env vars use Astro prefix: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`
- Client uses `sanity:client` virtual import from `@sanity/astro`
- `safeFetch()` wrapper in `src/utils/sanity.ts` returns `null` on fetch errors
- `urlFor()` helper generates Sanity image URLs via `@sanity/image-url`

### Content Model (Sanity Schemas)

Schemas live in `sanity/schemas/` and are registered in `sanity/schemas/index.ts`:

- **siteSettings** — Singleton: phone numbers, email, address (used in layout Header/Footer)
- **heroSlide** — Hero carousel images with ordering
- **doctor** — Staff profiles with specialties, tag (implant/ortho/general), ordering
- **hours** — Singleton: schedule array with day/time/highlight/closed fields
- **post** — Blog posts with slug, category (ortho/implant/general), Portable Text body with inline images
- **notice** — Notices with slug, category, pinned flag, Portable Text body

### GROQ Queries

All queries are centralized in `src/utils/queries.ts`. Pages import and use these named query constants.

### Directory Structure

```
src/
  layouts/BaseLayout.astro       — Main layout with header, footer, scroll animations
  pages/                         — Astro file-based routing
    index.astro                  — Homepage
    columns/index.astro          — Blog listing
    columns/[slug].astro         — Individual post
    ortho.astro                  — Orthodontics specialty page
    implant.astro                — Implant specialty page
    notice/index.astro           — Notice listing
    notice/[slug].astro          — Individual notice
    sitemap.xml.ts               — Dynamic sitemap
    robots.txt.ts                — Robots.txt
  components/
    astro/                       — Zero-JS Astro components (Doctors, Treatments, Hours, etc.)
    react/                       — React islands (Header, Hero, AnnouncementBar, etc.)
  utils/
    sanity.ts                    — Sanity client, urlFor, safeFetch
    queries.ts                   — GROQ queries
  styles/globals.css             — All styles
sanity/
  schemas/                       — Sanity schema definitions (for CLI deploy)
```

### Component Strategy

- **Astro components** (`src/components/astro/`): Pure HTML, zero JavaScript shipped. Used for Doctors, Treatments, Hours, MapSection, BlogPreview, NoticePreview, Footer, PortableTextRenderer.
- **React islands** (`src/components/react/`): Hydrated on client. Used for Header (`client:load`), Hero (`client:load`), AnnouncementBar (`client:load`), CinematicCarousel (`client:visible`), ColumnsClient (`client:load`), ScrollToTop (`client:idle`).

### Styling

All styles are in `src/styles/globals.css`. Imported in `BaseLayout.astro`. Scroll animations are handled by an inline `<script>` in `BaseLayout.astro` using IntersectionObserver.

### Path Aliases

`@/*` maps to `./src/*` (configured in `tsconfig.json`).

## Key Patterns

- Homepage fetches all data in parallel via `Promise.all` in the Astro frontmatter
- Dynamic routes use `getStaticPaths()` for static generation
- Post categories use string values: `"ortho"`, `"implant"`, `"general"`
- Blog/notice bodies use Portable Text rendered via `astro-portabletext`
- React components use `<a>` tags instead of framework-specific Link components

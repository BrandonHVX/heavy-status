# Heavy Status News App

## Overview
A mobile-first news application powered by WordPress (WPGraphQL) backend. Features include a Headlines page with masonry grids, Featured stories, Explore page with categories, and a Live video page. Built with Next.js App Router.

## Architecture
- **Framework**: Next.js 16 with App Router, server components, and ISR (60s revalidation)
- **CMS**: WordPress at https://heavy-status.com with WPGraphQL plugin
- **Styling**: Tailwind CSS with light theme, blue (#3b82f6) primary color
- **Fonts**: Cormorant Garamond (serif headlines) + DM Sans (sans-serif body)
- **Animations**: GSAP page transitions
- **Deployment**: Vercel-ready (Next.js)

## Project Structure
```
app/                    # Next.js App Router pages
  layout.tsx            # Root layout with fonts, meta, header, bottom nav
  page.tsx              # Headlines page (/)
  HeadlinesClient.tsx   # Client component for headlines
  loading.tsx           # Loading skeleton
  featured/page.tsx     # Featured stories
  explore/page.tsx      # Explore with categories
  live/page.tsx         # Live video page
  article/[slug]/page.tsx  # Article detail
  category/[slug]/page.tsx # Category archive
  api/search/[query]/route.ts  # Search API
  sitemap.xml/route.ts  # Google News sitemap
  robots.txt/route.ts   # SEO robots
  feed.xml/route.ts     # RSS feed
  not-found.tsx         # 404 page
components/             # Reusable client components
  Header.tsx            # Header with search autocomplete
  BottomNav.tsx         # Mobile bottom navigation
  PostCard.tsx          # Card variants (hero, overlay, compact, wide, minimal, standard)
  MasonryGrid.tsx       # Masonry layout
  AdBanner.tsx          # Ad/CTA banners
  PullToRefresh.tsx     # Pull-to-refresh
  PageTransition.tsx    # GSAP transitions
  LoadingSkeleton.tsx   # Loading skeletons
  OneSignalInit.tsx     # Push notifications
lib/
  wordpress.ts          # GraphQL API functions + types
  utils.ts              # cn() utility
public/
  manifest.json         # PWA manifest
  sw.js                 # Service worker
  favicon.png           # App icon
```

## Key Pages
- `/` - Headlines with 3 sections (Latest, Featured, Highlights) in masonry grids
- `/featured` - Featured/Breaking News category posts
- `/explore` - All categories and explore posts
- `/live` - Video player interface with playlist
- `/article/:slug` - Individual article view
- `/category/:slug` - Category archive

## API Routes
- `GET /api/search/:query` - Search posts, categories, tags
- `GET /sitemap.xml` - Google News sitemap
- `GET /robots.txt` - SEO robots
- `GET /feed.xml` - RSS feed

## Features
- PWA with service worker and manifest
- Pull-to-refresh on mobile
- GSAP page transitions
- Dynamic search with autocomplete
- Back buttons on every page
- Ad banners/CTA between sections
- Google News sitemap + RSS feed
- ISR (Incremental Static Regeneration) with 60s revalidation
- SEO metadata on every page (OpenGraph, Twitter Cards)

## Environment Variables
- WORDPRESS_URL: WordPress site URL
- WORDPRESS_GRAPHQL_URL: WPGraphQL endpoint
- NEXT_PUBLIC_ONESIGNAL_APP_ID: OneSignal push notification app ID
- SITE_URL: Production site URL (for sitemap/meta)

## WordPress Categories
- breaking-news → Featured page
- highlights → Highlights section on Headlines
- community-news → Live page

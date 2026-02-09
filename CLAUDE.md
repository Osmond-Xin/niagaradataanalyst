# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio/blog website for niagaradataanalyst.com. The project is **in transition** from a Next.js 12 blog (Pages Router, Bootstrap, markdown posts) to a Next.js 14 portfolio site (App Router, Tailwind CSS, TypeScript) as described in the design/requirements/tasks documents.

**Current state:** The original source files have been deleted from the working tree but remain in git history. The repo currently contains only planning documents (`requirements.md`, `design.md`, `tasks.md`).

## Build & Dev Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint (next lint)
```

## Architecture

### Original Codebase (in git history, Next.js 12)
- **Pages Router** (`pages/`) with `_app.js` as app wrapper, `_document.js` for HTML config
- **Markdown blog posts** in `posts/` parsed with `gray-matter` and rendered with `marked` + `highlight.js`
- **Bootstrap 5** via CDN for styling
- **Components:** Header, Footer, Banner, Post, ItemPost, Sidebar
- **SEO:** `next-seo` with config in `next-seo.config.js`, sitemap via `next-sitemap`
- **Utilities** (`utils/index.js`): `sortByDate`, `slugify`, `ImageUrl`
- **Site URL** configured in `config.js`: `https://niagaradataanalyst.com`
- **Analytics:** Google Tag Manager (GTM-PPLH2LDP) and GA4 (G-6VF5PE1GJB)
- **Deployment:** Vercel

### Planned Rebuild (Next.js 14, per design.md/tasks.md)
- **App Router** with `src/` directory structure
- **TypeScript** throughout
- **Tailwind CSS** (no inline styles, no CSS modules)
- **Bilingual (zh/en)** via React Context (`LanguageContext`) + `translations.ts`
- **Key libraries:** Recharts (charts), ReactFlow (architecture diagrams)
- **Testing:** Jest with `@testing-library/react` and `@fast-check/jest` for property-based tests
- **Components:** Navbar, LanguageToggle, HeroSection, CapabilityCards, PipelineSimulator, InteractiveArch, AiAgentWidget

## Coding Conventions

- All code comments and documentation must be in **Chinese (中文)**
- Components: PascalCase. Functions/variables: camelCase
- All user-facing text must go through the `t()` translation function from `useLanguage()` hook
- Translation keys use dot-separated paths (e.g., `nav.home`, `hero.title`)
- Chinese is the primary language; English is secondary
- Strictly use Tailwind CSS utility classes for styling
- Property-based tests: minimum 100 iterations, tag format: `Feature: personal-portfolio-website, Property {number}: {property_text}`

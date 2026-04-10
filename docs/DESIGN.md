# Design System — NiagaraDataAnalyst

> Based on Claude (Anthropic) design system via [awesome-design-md](https://github.com/VoltAgent/awesome-design-md).
> Adapted for a bilingual (zh/en) AI-portfolio site featuring data visualization and architecture diagrams.

---

## 1. Visual Theme & Atmosphere

This portfolio site blends **Claude's warm editorial authority** with **technical precision**. The canvas is a warm parchment (`#f5f4ed`) that evokes a considered, authored space — not a cold dashboard. The editorial personality says "thoughtful expert" rather than "powerful tool."

Where Claude uses organic illustrations, this site uses **data visualizations and architecture diagrams** as its signature visual elements — they serve the same role (visual personality) but are native to the technical subject matter.

**Key Characteristics:**
- Warm parchment canvas (`#f5f4ed`) — the emotional foundation, not a digital surface
- Serif display type (Georgia fallback for Anthropic Serif) — every headline has book-title gravitas
- Terracotta brand accent (`#c96442`) — earthy, warm, deliberately un-tech CTA color
- Exclusively warm-toned neutrals — no cool blue-grays anywhere in the palette
- Light/dark section alternation — parchment sections alternate with near-black sections
- Ring-based shadow system (`0px 0px 0px 1px`) — border-like depth without heavy shadows
- Data charts and architecture diagrams styled in terracotta / clay / ochre warm palette
- Gradient-free — depth comes from warm surface tones and section alternation, never gradients

---

## 2. Color Palette & Roles

### Primary
| Token | Hex | Role |
|-------|-----|------|
| `terracotta` | `#c96442` | Brand CTA buttons, highest-signal brand moments |
| `coral` | `#d97757` | Text accents, links on dark surfaces |
| `near-black` | `#141413` | Primary text (light mode), dark-section background |

### Surfaces & Backgrounds
| Token | Hex | Role |
|-------|-----|------|
| `parchment` | `#f5f4ed` | Primary page background (light mode) |
| `ivory` | `#faf9f5` | Card and container surface on parchment |
| `white` | `#ffffff` | Specific button surfaces, maximum contrast |
| `warm-sand` | `#e8e6dc` | Secondary button background, prominent interactive surfaces |
| `dark-surface` | `#30302e` | Dark-theme containers, nav borders, elevated dark elements |
| `deep-dark` | `#141413` | Dark-section page background |

### Text
| Token | Hex | Role |
|-------|-----|------|
| `text-primary` | `#141413` | Primary body text (light mode) |
| `text-secondary` | `#5e5d59` | Secondary text, body paragraphs |
| `text-muted` | `#87867f` | Tertiary, footnotes, metadata |
| `text-dark-link` | `#3d3d3a` | Dark text links, emphasized secondary |
| `text-on-dark` | `#b0aea5` | Body text on dark (near-black) surfaces |
| `text-heading-dark` | `#faf9f5` | Headline text on dark sections |

### Borders
| Token | Hex | Role |
|-------|-----|------|
| `border-cream` | `#f0eee6` | Standard light-mode border — barely visible |
| `border-warm` | `#e8e6dc` | Prominent borders, section dividers |
| `border-dark` | `#30302e` | Borders on dark surfaces |

### Interactive States
| Token | Hex | Role |
|-------|-----|------|
| `ring-warm` | `#d1cfc5` | Button hover/focus ring |
| `ring-deep` | `#c2c0b6` | Active/pressed ring |
| `focus-blue` | `#3898ec` | Input focus ring (the only cool color — accessibility only) |
| `error` | `#b53333` | Error states |

### Chart Palette (5-color warm set for data visualizations)
| Token | Hex | Role |
|-------|-----|------|
| `chart-1` | `#c96442` | Terracotta — primary series |
| `chart-2` | `#8b5a3c` | Clay — secondary series |
| `chart-3` | `#c9a46a` | Ochre — tertiary series |
| `chart-4` | `#d4b896` | Sand — quaternary series |
| `chart-5` | `#4d4c48` | Ink — quinary series |

### Gradient System
Claude's design is **gradient-free**. Depth comes from warm surface tone interplay and light/dark section alternation. There are **no `bg-gradient-*` utilities** anywhere in this design system.

---

## 3. Typography Rules

### Font Families
- **Display / Headings**: `'Fraunces', Georgia, serif` — weight 500 only (equivalent to Anthropic Serif)
- **Body / UI**: `'Inter', system-ui, sans-serif` — weight 400–500
- **Code**: `'JetBrains Mono', 'Fira Code', monospace`

*Fraunces is a Google Font that captures Anthropic Serif's optical-size variable serif personality. Load only the 500 weight.*

### Type Scale
| Role | Font | Tailwind Class | Size | Weight | Line Height | Notes |
|------|------|----------------|------|--------|-------------|-------|
| Display / Hero | display | `text-display` | 64px (4rem) | 500 | 1.10 | Book-title presence |
| Section Heading | display | `text-section` | 52px (3.25rem) | 500 | 1.20 | Feature section anchors |
| Sub-heading L | display | `text-subhead-lg` | 36px (2.25rem) | 500 | 1.30 | Secondary sections |
| Sub-heading | display | `text-subhead` | 32px (2rem) | 500 | 1.10 | Card titles |
| Sub-heading S | display | `text-subhead-sm` | 26px (1.625rem) | 500 | 1.20 | Smaller section titles |
| Feature Title | display | `text-feature` | 21px (1.3125rem) | 500 | 1.20 | Small feature headings |
| Body Serif | display | `text-body-serif` | 17px | 400 | 1.60 | Editorial passages |
| Body Large | sans | `text-body-lg` | 20px (1.25rem) | 400 | 1.60 | Intro paragraphs |
| Body / Nav | sans | `text-body` | 17px | 400–500 | 1.60 | Nav links, UI text |
| Body Standard | sans | `text-base` | 16px | 400–500 | 1.50 | Standard body |
| Body Small | sans | `text-body-sm` | 15px | 400–500 | 1.60 | Compact body |
| Caption | sans | `text-caption` | 14px | 400 | 1.43 | Metadata |
| Label | sans | `text-label` | 12px | 400–500 | 1.50 | Badges, small labels |
| Code | mono | `text-code` | 15px | 400 | 1.60 | Code, terminal output |

### Principles
- **Serif for authority, sans for utility** — display font for all headlines; Inter for all UI/body
- **Single weight for serifs** — weight 500 only on display font; never bold (700+)
- **Generous body line-height** — 1.60 for reading experience, not dashboard scanning
- **No gradients on text** — no `bg-clip-text` gradient treatment; plain warm-toned text colors only

---

## 4. Component Stylings

### Buttons

**Primary (Terracotta Brand)**
```
bg: #c96442  text: #faf9f5  radius: 8px
shadow: 0px 0px 0px 0px #c96442, 0px 0px 0px 1px #c96442
hover: brightness slightly increased
```

**Secondary (Warm Sand)**
```
bg: #e8e6dc  text: #4d4c48  radius: 8px  padding: 0px 12px 0px 8px
shadow: 0px 0px 0px 0px #e8e6dc, 0px 0px 0px 1px #d1cfc5
hover: ring deepens to #c2c0b6
```

**Dark (Charcoal)**
```
bg: #30302e  text: #faf9f5  radius: 8px  padding: 0px 12px 0px 8px
shadow: ring-based
```

**Ghost (White)**
```
bg: #ffffff  text: #141413  radius: 12px  padding: 8px 16px 8px 12px
hover: bg shifts to warm-sand
```

**Dark Primary (on dark sections)**
```
bg: #141413  text: #b0aea5  radius: 12px  padding: 9.6px 16.8px
border: 1px solid #30302e
```

### Cards & Containers
```
light: bg #faf9f5, border 1px solid #f0eee6, radius 8–16px
dark:  bg #30302e, border 1px solid #30302e, radius 8–16px
featured: radius 32px, shadow rgba(0,0,0,0.05) 0px 4px 24px
```

### Inputs & Forms
```
text: #141413  padding: 6px 12px
border: 1px solid #e8e6dc  radius: 12px
focus: border-color #3898ec, ring rgba(56,152,236,0.20)
```

### Navigation
```
sticky top, backdrop-blur-sm
light mode: bg rgba(245,244,237,0.92), border-bottom 1px solid #f0eee6
dark mode:  bg rgba(20,20,19,0.92), border-bottom 1px solid #30302e
logo: display font (Fraunces) weight 500, color #141413 (light) / #faf9f5 (dark)
links: color #5e5d59, hover #141413
CTA: Terracotta Brand button
```

### Section Alternation (core layout pattern)
```
Light section: bg #f5f4ed, text #141413
Dark section:  bg #141413, text #faf9f5
Transition: abrupt cut (not gradient) between sections
```

### Data Charts (warm theme for Recharts)
```
background: transparent (inherits section bg)
grid lines: #e8e6dc (light) / #30302e (dark)
axis labels: #87867f
tooltip: bg #faf9f5, border 1px solid #f0eee6, shadow whisper
series colors: chart-1 through chart-5 (terracotta palette)
```

### Architecture Diagrams (ReactFlow)
```
node bg: #faf9f5 (light) / #30302e (dark)
node border: 1px solid #f0eee6 / #30302e
node text: #141413 / #faf9f5
edge stroke: #c96442 (terracotta, for emphasis)
edge stroke (default): #d1cfc5
```

---

## 5. Layout Principles

### Spacing Scale
8px base. Scale: `3 4 6 8 10 12 16 20 24 30 40 48 64 80 96 120`.

### Container
```
max-width: 1200px (max-w-[1200px] or max-w-7xl)
padding: px-4 sm:px-6 lg:px-8
centered: mx-auto
```

### Section Vertical Rhythm
```
major sections: py-20 lg:py-32   (80px → 128px)
subsections:    py-12 lg:py-16
hero:           py-24 lg:py-40
```

### Page Structure Pattern
```
[Navbar — sticky]
[Hero — light parchment]
[Feature A — light parchment]
[Feature B — dark near-black]   ← alternating section
[Feature C — light parchment]
[CTA / Footer — dark near-black]
```

### Whitespace Philosophy
- Editorial pacing: each section breathes like a magazine spread
- Serif headings demand more whitespace than sans-serif
- Content island approach: each section is a distinct "room"

### Border Radius Scale
| Name | Size | Use |
|------|------|-----|
| sharp | 4px | Minimal inline elements |
| sm | 6–8px | Standard buttons, cards |
| md | 12px | Primary buttons, inputs, nav elements |
| lg | 16px | Featured containers, tab lists |
| xl | 24px | Tag-like highlighted containers |
| 2xl | 32px | Hero containers, large media cards |

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (0) | No shadow, no border | Parchment background |
| Contained (1) | `1px solid #f0eee6` (light) / `1px solid #30302e` (dark) | Standard cards |
| Ring (2) | `0px 0px 0px 1px` ring shadows in warm grays | Buttons, interactive cards |
| Whisper (3) | `rgba(0,0,0,0.05) 0px 4px 24px` | Elevated feature cards |
| Inset (4) | `inset 0px 0px 0px 1px` at 15% opacity | Active/pressed states |

**Shadow Rule**: Use ring shadows, not drop shadows. When drop shadows appear, they are whisper-soft (0.05 opacity, 24px blur). Never use `shadow-lg` with saturated color (e.g., `shadow-blue-500/25` is forbidden).

---

## 7. Do's and Don'ts

### Do
- Use Parchment (`#f5f4ed`) as the primary light background
- Use display font (Fraunces) weight 500 for all headlines
- Use Terracotta (`#c96442`) only for primary CTAs and highest-signal moments
- Keep all neutrals warm-toned — every gray must have a yellow-brown undertone
- Use ring shadows for interactive states
- Use `line-height: 1.60` for body text
- Alternate light/dark sections for editorial chapter rhythm
- Use the 5-color terracotta chart palette for all Recharts and chart components
- Route all user-facing strings through the `t()` translation function

### Don't
- Don't use cool blue-grays anywhere (`blue-*`, `cyan-*`, `violet-*`, `slate-*` are all banned)
- Don't use gradients (`bg-gradient-*`, `bg-clip-text`, `text-transparent` with gradient) — gradient-free
- Don't use bold weight (700+) on display font
- Don't use sharp corners (< 6px) on buttons or cards
- Don't use heavy drop shadows (`shadow-xl shadow-*[color]*/*`)
- Don't use `#ffffff` as page background — always use parchment or ivory
- Don't hardcode hex values in components — always use Tailwind tokens from this design system
- Don't write `style={{ color: ... }}` inline styles — Tailwind only
- Don't add text that bypasses the `t()` translation function

---

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| mobile | < 640px | Stacked layout, hamburger nav, hero display 36px |
| sm | 640–767px | Wider content area |
| md | 768–1023px | 2-column grids begin, condensed nav |
| lg | 1024px+ | Full multi-column, hero display 64px |

### Collapsing Strategy
- **Nav**: full horizontal → hamburger at `md:hidden`
- **Hero text**: `text-4xl sm:text-5xl lg:text-6xl` (but with display font)
- **Feature grids**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Section padding**: reduces proportionally but maintains editorial rhythm
- **Charts**: horizontal scroll on mobile or reduced height

### Touch Targets
- All buttons and nav links minimum 44×44px hit area
- Card surfaces as large touch targets

---

## 9. Agent Prompt Guide

When using Claude Code or any AI coding assistant to generate or modify UI in this project:

### Quick Color Reference
```
Page background (light): Parchment #f5f4ed
Card surface:            Ivory #faf9f5
Primary CTA:             Terracotta #c96442  text: Ivory #faf9f5
Primary text:            Near Black #141413
Secondary text:          Olive Gray #5e5d59
Muted text:              Stone Gray #87867f
Light border:            Border Cream #f0eee6
Dark surface:            #30302e
Dark section bg:         #141413
Text on dark:            Warm Silver #b0aea5
```

### Quick Font Reference
```
All headlines:   font-display (Fraunces), weight 500, no bold
All body/UI:     font-sans (Inter)
Code:            font-mono (JetBrains Mono)
```

### Example Component Prompts
- "Hero section on Parchment (#f5f4ed): centered 64px font-display weight-500 headline in #141413, line-height 1.10. Subtitle in Olive Gray (#5e5d59) 20px font-sans line-height 1.60. One Terracotta (#c96442) CTA button with Ivory text, 8px radius, ring shadow."
- "Feature card on Ivory (#faf9f5): 1px solid #f0eee6 border, 8px radius, whisper shadow rgba(0,0,0,0.05) 0px 4px 24px. Title font-display 25px weight-500 in #141413. Description font-sans 16px Olive Gray #5e5d59."
- "Dark section on #141413: Ivory (#faf9f5) headline font-display 52px weight-500. Body text Warm Silver #b0aea5 font-sans. Borders #30302e."
- "Recharts chart with warm palette: series colors [#c96442, #8b5a3c, #c9a46a, #d4b896, #4d4c48]. Grid lines #e8e6dc. Axis text #87867f."
- "Sticky navbar on Parchment bg rgba(245,244,237,0.92) backdrop-blur: logo font-display weight-500 #141413, nav links #5e5d59 hover #141413, right-side Terracotta button."

### Iteration Guide
1. Always reference specific token names: "use Olive Gray (#5e5d59)" not "make it gray"
2. Specify font family explicitly: "font-display for heading, font-sans for body"
3. For shadows: use "ring shadow (0px 0px 0px 1px)" or "whisper shadow" — never "drop shadow"
4. Never introduce gradients — use section color alternation for depth instead
5. All user text through `t()` — no hardcoded Chinese or English strings in JSX

---

## 10. Bilingual & Project Constraints

*This chapter is specific to niagaradataanalyst.com and supersedes any conflicting guidance from chapters 1–9.*

### Bilingual Content Rules
- All user-facing text MUST go through `t(key)` from `useLanguage()` — no hardcoded strings
- Translation keys use dot-separated paths: `hero.title`, `nav.home`, `capabilities.engineering.title`
- Language context: `src/contexts/LanguageContext.tsx` — do not modify its interface
- Translation data: `src/data/translations.ts` — add new keys here when creating new sections

### Code Style Rules
- Components: PascalCase (`HeroSection`, `CapabilityCards`)
- Functions/variables: camelCase
- All code comments: Chinese (中文)
- Tailwind CSS only — no CSS Modules, no `style={{}}` inline styles
- TypeScript throughout — no `any` types

### Chart & Diagram Rules
- All Recharts components receive colors from `src/lib/chart-theme.ts`
- All ReactFlow nodes use custom node components styled with Tailwind tokens from this design system
- Never pass hardcoded hex strings directly to chart `stroke`, `fill`, or `color` props — reference `chartTheme` constants

### Architecture Note
- **App Router** (`src/app/`): Next.js 14 — no `pages/` directory
- **Dark mode**: `darkMode: 'class'` in Tailwind; default is light; `.dark` class adds dark variant
- **Fonts**: `next/font/google` — Fraunces (500 only) + Inter (400, 500)
- **No gradients** means `InfinityLoopIcon` SVG in HeroSection must be replaced with a warm-palette single-color design

# Personal Site - Design & Architecture

## Design Philosophy

**Minimalism as identity.** The site strips away all visual noise to let content breathe. Every design decision serves clarity.

## Design Rules

### Colors
- **Black & white only.** No colored elements, gradients on large surfaces, or accent colors.
- `--bg: #0a0a0a` (near-black background)
- `--ink: #ffffff` (white text)
- `--ink-secondary: #888888` (muted gray for secondary text)
- `--ink-tertiary: #555555` (darker gray for tertiary/hints)

### Typography
- **Geist only.** Loaded from Fontshare CDN (`f[]=geist`).
- Single font family for all text hierarchy (display, heading, body).
- No fallback to system fonts except as emergency backup.

### Layout
- **No lines or dividers.** Visual separation comes from spacing, typography scale, and whitespace alone.
- **No visible borders.** `--border: transparent` everywhere. Components have no outlines.
- Generous padding: `--space-2xl: 8rem` for major sections.
- Content max-width: `1200px` centered.

### Interactions
- Hover states: opacity shifts only (never color changes or underlines on text).
- Transitions: `150ms` for fast, `300ms` base, `600ms` slow.
- Spring easing for magnetic/attention effects: `cubic-bezier(0.34, 1.56, 0.64, 1)`.

### Visual Assets
- Logos stored in `/public/logos/` with `{ light, dark }` structure in assets.ts.
- Favicon: `/public/favicon.png`.
- No decorative images except project screenshots.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Routing | React Router v6 |
| Build | Vite |
| Styling | Plain CSS (no Tailwind, no CSS-in-JS) |
| Animation | Framer Motion (page transitions only) |
| Markdown | react-markdown (project descriptions) |
| Font | Geist via Fontshare CDN |

---

## Key Code Paths

### Entry Points
- `index.html` — Loads Geist font, mounts `<div id="root">`
- `src/main.tsx` — React root render
- `src/App.tsx` — Router setup + `ScrollManager` for hash navigation

### Routing
| Route | Component |
|---|---|
| `/` | `SinglePage.tsx` |
| `/projects/:slug` | `ProjectDetail.tsx` |
| `/agents` | `AgentsPage.tsx` |
| `/agents/:slug` | `AgentBlogPost.tsx` |

### Pages
- **`SinglePage.tsx`** — Main landing page. Contains hero + experience + projects all in one scrollable page with hash anchors (`#home`, `#experience`, `#projects`).
- **`ProjectDetail.tsx`** — Individual project page with markdown rendering via `react-markdown`.
- **`AgentsPage.tsx`** — Dashboard-style hub for agent projects.
- **`AgentBlogPost.tsx`** — Blog post renderer for agent documentation.

### Components
- **`Nav.tsx`** — Fixed top nav. Handles smooth scroll to hash anchors on single-page routes. Mobile hamburger menu included (hidden on desktop).
- **`Footer.tsx`** — Simple centered footer with copyright and social links.

### Data Layer (`src/data/`)
| File | Purpose |
|---|---|
| `base.ts` | Site owner name (firstName, lastName) |
| `experience.ts` | Work experience entries with period, company, skills |
| `projects.ts` | Project entries with slug, description (markdown), screenshots |
| `skills.ts` | Skill definitions with slug, name, logo, color |
| `assets.ts` | Asset path resolver (`/logos/...`) |

### Hooks
- **`useScrollReveal.ts`** — IntersectionObserver for fade-in animations on scroll. Adds `.visible` class.
- **`useMagneticEffect.ts`** — Magnetic button attraction on hover (unused currently but available).

### CSS Architecture
- Single file: `src/index.css`
- CSS custom properties for all design tokens (colors, spacing, fonts, transitions)
- BEM-lite naming: `.nav__container`, `.hero__left`, `.project-card__title-row`
- No CSS modules or component-scoped styles

---

## Adding Content

### New Experience Entry
Edit `src/data/experience.ts`:
```ts
{
  slug: 'unique-slug',
  company: 'Company Name',
  description: 'What you did.',
  period: { from: new Date(2024, 0, 1), to: new Date(2024, 3, 1) },
  skills: getSkills('ts', 'reactjs'),
  ...
}
```

### New Project
Edit `src/data/projects.ts`:
```ts
{
  slug: 'unique-slug',
  name: 'Project Name',
  description: `Markdown description with ### Technical Details`,
  shortDescription: 'One-liner for card view',
  skills: getSkills('python', 'llm'),
  screenshots: [{ label: 'Caption', src: url('filename.png') }],
  ...
}
```

### New Skill
Edit `src/data/skills.ts` — add to `skills` array and import logo from `assets.ts`.

---

## Build & Deploy

- **Build**: `pnpm build` (outputs to `dist/`)
- **Dev**: `pnpm dev`
- **Deploy**: GitHub Actions (`/.github/workflows/deploy.yml`) pushes to Vercel on main branch push

# Developer Portfolio

A data-driven developer portfolio built with Next.js, TypeScript, Three.js,
Tailwind CSS, Framer Motion, MDX, and live analytics for competitive programming
and GitHub activity.

Content lives in typed files under `src/data/`; UI and analytics read from those
files plus live fetchers in `src/lib/integrations`.

## Tech Stack

- Next.js 14 App Router, React 18, TypeScript
- Tailwind CSS with CSS-variable design tokens
- Framer Motion for section and chart animation
- Three.js / React Three Fiber for the hero and loader scenes
- MDX blog via `next-mdx-remote`
- GitHub GraphQL API for the `/dev` profile
- Public APIs and best-effort scrapers for `/competitive`

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Useful scripts:

```bash
npm run build
npm run start
npm run typecheck
npm run lint
```

Note: the current lint script may show a Next/ESLint CLI option warning with the
installed ESLint version. TypeScript and production builds are the main verified
checks.

## App Architecture

- `src/app/` contains routes, metadata, API routes, sitemap, robots, and loading UI.
- `src/data/` contains editable portfolio content: hero, about, skills,
  experience, projects, socials, competitive profiles, GitHub accounts, and blog
  posts.
- `src/types/index.ts` is the shared content contract.
- `src/components/sections/` renders the home-page sections from data.
- `src/components/analytics/` contains reusable cards, stats, charts, heatmaps,
  and sync badges used by `/competitive` and `/dev`.
- `src/components/three/` contains the Three.js/R3F scenes.
- `src/lib/*-live.ts` builds cached live snapshots for analytics pages.
- `src/lib/integrations/` contains external data fetchers.

Live analytics use `unstable_cache` with a 12-hour revalidate window, so expensive
platform/API calls do not run on every request.

## Editing Content

Most changes happen in `src/data/`.

| File | Purpose |
| --- | --- |
| `config.ts` | Site name, SEO, nav, section order, feature toggles |
| `hero.ts` | Hero text, roles, CTAs |
| `about.ts` | Bio, photo, highlights, stats, resume |
| `skills.ts` | Skill groups |
| `experience.ts` | Work and education timeline |
| `projects.ts` | Project cards |
| `socials.ts` | Social/profile links |
| `competitive.ts` | Competitive platform handles and profile URLs |
| `devprofile.ts` | GitHub accounts for `/dev` aggregation |
| `posts/*.mdx` | Blog posts |

Do not maintain competitive solved counts, ratings, contests, heatmap data, or
GitHub totals by hand. Those are fetched live where public/authenticated sources
allow it.

## Competitive Analytics

The `/competitive` page reads platform metadata from `src/data/competitive.ts`
and live stats from `src/lib/integrations/*`.

| Platform | Source | Fetched Correctly | Heatmap |
| --- | --- | --- | --- |
| LeetCode | Public GraphQL endpoint | Solved, difficulty, contest rating, contests, peak rating | Yes, submission calendar |
| Codeforces | Official public REST API | Solved, rating, rank, contests | Yes, accepted submissions |
| CodeChef | Server-rendered profile scrape | Solved, rating, peak rating, star rank, contests | Yes, daily submissions from embedded data |
| GeeksforGeeks | Best-effort Next.js profile scrape | Solved count and coding score | No public daily map found |
| Code360 / Coding Ninjas | Public Code360 APIs | Coding problems solved, points, best streak | No daily map exposed for this profile |
| AtCoder | AtCoder history JSON + AtCoder Problems submissions API | Solved, rating/contests when available | Yes, accepted submissions |
| AlgoZenith | Public `api2.maang.in` profile APIs | Solved, XP, coins, best streak, followers | Yes, profile heatmap endpoint |

Practice platforms are marked as unrated so the UI does not present points,
XP, or scores as contest ratings. If a platform endpoint fails completely, that
platform is hidden instead of showing hardcoded numbers. If a reachable source
has no solved/daily field, the page uses zero or omits that specific metric.

## Dev Profile Analytics

The `/dev` page aggregates GitHub accounts from `src/data/devprofile.ts`.

It fetches via GitHub GraphQL:

- commits and total contributions
- private contributions when the account token permits it
- followers and public repositories
- per-day contribution calendars
- repository language usage

All configured GitHub accounts are merged into one profile:

- totals are summed
- contribution calendars are merged into one heatmap
- language usage is combined and sorted

Each account needs a matching token env var from `tokenEnv` in
`src/data/devprofile.ts`.

```env
GITHUB_TOKEN_PERSONAL=...
GITHUB_TOKEN_EVA=...
```

For private contributions, the token must belong to that GitHub account and the
account must enable private contribution visibility in GitHub profile settings.

## Environment Variables

Copy `.env.example` to `.env.local`.

Common variables:

- `NEXT_PUBLIC_SITE_URL` for SEO, sitemap, and OpenGraph URLs
- `CONTACT_PROVIDER`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
  `CONTACT_FROM_EMAIL` for the contact form
- `GITHUB_TOKEN_*` values for `/dev`

Competitive programming integrations currently need no API keys.

## Assets

Place images, `resume.pdf`, and OpenGraph assets in `public/`. Data files can
reference them as `/resume.pdf`, `/images/example.png`, etc.

## Deploy

Deploy on Vercel with no custom server needed.

Set production env vars in the Vercel dashboard:

- `NEXT_PUBLIC_SITE_URL`
- contact form variables if email sending is enabled
- GitHub tokens for `/dev`

Then run:

```bash
npm run build
```

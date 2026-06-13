# Developer Portfolio — Next.js + Three.js

A fully professional, **data-driven** developer portfolio built with the
Next.js App Router, TypeScript, Three.js (React Three Fiber), Tailwind CSS, and
Framer Motion.

> You add your content by editing typed files under [`src/data/`](src/data/) —
> you never have to touch component code.

## Features

- ⚡️ **Next.js 14 App Router** + TypeScript (SSG, file routing, metadata API)
- 🎨 **Tasteful Three.js** hero (mouse-reactive particle field + morphing knot), lazy-loaded and `prefers-reduced-motion` aware
- 🧩 **Data-driven sections** — Hero, About, Skills, Experience, Projects, Services, Testimonials, Contact
- 📝 **MDX blog** with frontmatter, reading time, and dynamic routes
- 🌗 **Dark/light theme** toggle (persisted), design tokens via CSS variables
- 🧭 Scroll progress bar + active-section nav highlighting
- 🔍 **SEO**: OpenGraph/Twitter cards, JSON-LD `Person`, auto `sitemap.xml` + `robots.txt`
- ✉️ **Working contact form** (`/api/contact`) with a pluggable email provider (Resend)
- ♿️ Accessible, responsive, keyboard-navigable

## Getting started

```bash
npm install
cp .env.example .env.local   # optional: fill in for contact form / SEO URL
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

## Editing your content

Everything lives in [`src/data/`](src/data/). Each file is typed against
[`src/types/index.ts`](src/types/index.ts), so your editor autocompletes fields
and flags mistakes.

| File | What it controls |
| --- | --- |
| `config.ts` | Your name, role, SEO text, nav items, **section order**, blog toggle |
| `socials.ts` | Social links (icon = a [lucide](https://lucide.dev/icons) name) |
| `hero.ts` | Hero headline, typewriter roles, tagline, CTA buttons |
| `about.ts` | Bio paragraphs, photo, highlights, stats, resume link |
| `skills.ts` | Skill groups + proficiency bars |
| `experience.ts` | Work/education timeline |
| `projects.ts` | Projects (add an object → it appears, with tag filtering) |
| `services.ts` | Services offered |
| `testimonials.ts` | Recommendations |
| `posts/*.mdx` | Blog posts (frontmatter + markdown body) |

**Reorder or hide sections** by editing the `sections` array in `config.ts`.

**Add a project**: append an object to the array in `projects.ts`. No other
changes needed.

**Add a blog post**: drop a new `.mdx` file in `src/data/posts/` with
frontmatter (`title`, `date`, `excerpt`, `tags`, `cover`).

## Assets

Put images, your `resume.pdf`, and an OpenGraph `og.png` (1200×630) in
[`public/`](public/). Data files can reference them as `/resume.pdf`, etc., or
use remote URLs (whitelist new image hosts in `next.config.mjs`).

## Contact form

The `/api/contact` route works locally out of the box (logs submissions). To
actually send email, set in `.env.local`:

```
CONTACT_PROVIDER=resend
RESEND_API_KEY=...
CONTACT_TO_EMAIL=you@your-domain.com
CONTACT_FROM_EMAIL=portfolio@your-domain.com
```

## Deploy

Push to GitHub and import into [Vercel](https://vercel.com) — zero config. Set
`NEXT_PUBLIC_SITE_URL` (and any contact env vars) in the Vercel dashboard.

## Project structure

```
src/
├─ app/           # routes (home, blog, api, sitemap, robots)
├─ data/          # ◀ YOUR CONTENT lives here
├─ types/         # shared TypeScript types for all data
├─ components/
│  ├─ sections/   # one data-driven component per page section
│  ├─ three/      # Three.js / R3F scene
│  ├─ ui/         # primitives (Button, Card, Section, …)
│  ├─ layout/     # Navbar, Footer, ThemeProvider, ScrollProgress
│  └─ blog/       # PostCard, MDX components
├─ lib/           # posts loader, SEO, motion variants, utils
└─ hooks/         # useScrolled, useActiveSection, usePrefersReducedMotion
```

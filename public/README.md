# Public assets

Drop static files here. Reference them from data files with a root path, e.g.
`/resume.pdf` or `/og.png`.

Recommended files to add:

- `resume.pdf` — your resume (linked from the About section, see `src/data/about.ts`)
- `og.png` — OpenGraph share image, 1200×630 (set in `src/data/config.ts` → `ogImage`)
- `favicon.ico` — already present

Remote image URLs are also supported; whitelist new hosts in `next.config.mjs`
under `images.remotePatterns`.

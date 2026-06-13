# Deployment Guide

This portfolio is a standard Next.js 14 app and deploys anywhere Next runs.
**Vercel** (made by the Next.js team) is the easiest and recommended path.

---

## Option A — Vercel (recommended, free for personal use)

### 1. Push to GitHub
```bash
git add .
git commit -m "Portfolio: Next.js + Three.js"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git   # if not already set
git push -u origin main
```

### 2. Import into Vercel
1. Go to <https://vercel.com/new> and sign in with GitHub.
2. **Import** your repository.
3. Framework preset auto-detects **Next.js** — leave build settings as-is
   (Build: `next build`, Output: `.next`).
4. Add **Environment Variables** (Settings → Environment Variables):

   | Key | Value | Needed for |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` | SEO, sitemap, OG tags |
   | `CONTACT_PROVIDER` | `resend` | Contact form email (optional) |
   | `RESEND_API_KEY` | `re_...` | Contact form email (optional) |
   | `CONTACT_TO_EMAIL` | `you@domain.com` | Contact form email (optional) |
   | `CONTACT_FROM_EMAIL` | `portfolio@domain.com` | Contact form email (optional) |

5. Click **Deploy**. You'll get a `*.vercel.app` URL in ~1 minute.

### 3. Custom domain (optional)
Vercel → Project → **Settings → Domains** → add your domain and follow the DNS
instructions. Update `NEXT_PUBLIC_SITE_URL` to match, then redeploy.

### 4. Auto-deploys
Every push to `main` redeploys production; pull requests get preview URLs.

---

## Option B — Netlify
1. Push to GitHub (as above).
2. Netlify → **Add new site → Import** → pick the repo.
3. Netlify auto-detects Next.js. Build command `next build`.
4. Add the same environment variables under **Site settings → Environment**.
5. Deploy.

---

## Option C — Any Node host (Render, Railway, a VPS, Docker)

Next.js needs a Node runtime for the contact API and ISR.

```bash
npm install
npm run build
npm run start        # serves on PORT (default 3000)
```

- Set `PORT` and the env vars from the table above.
- Behind nginx/Caddy, reverse-proxy to the Node process.
- For Docker, use the official Next.js standalone output guide.

---

## Pre-deploy checklist
- [ ] Replace placeholder content in `src/data/*` with your real info
- [ ] Update social/WhatsApp links in `src/data/socials.ts` (set your real `wa.me` number)
- [ ] Update competitive handles/stats in `src/data/competitive.ts`
- [ ] Add `public/resume.pdf` and a `public/og.png` (1200×630)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your real domain
- [ ] `npm run build` passes locally
- [ ] (Optional) configure the contact email provider

## Email provider (contact form)
The `/api/contact` route works without a provider (it logs submissions). To send
real email, create a free [Resend](https://resend.com) account, verify a sending
domain, grab an API key, and set the `CONTACT_*` env vars above.
```

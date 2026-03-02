# Final Stage | Professional Photography

A professional, high-end photography studio website built with Next.js, featuring a black and gold aesthetic with red accents. Includes an admin panel for managing portfolio images, categories, contact info, and SEO.

## Tech Stack

- **Next.js 16** — React framework
- **TypeScript** — Type safety
- **Tailwind CSS v4** — Styling
- **Supabase** — Database, storage, auth
- **Google Fonts** — Playfair Display (headings), Cormorant Garamond (body)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Panel Setup

To enable the admin panel (`/admin`), you need to configure Supabase and environment variables.

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a project
2. In **Project Settings → API**, copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Service role key (secret) → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Run the Database Schema

In Supabase **SQL Editor**, run the contents of `supabase/schema.sql`.

If you already have an existing database, run `supabase/migration-videos.sql`, `supabase/migration-hero.sql`, `supabase/migration-proposal-video-autoplay.sql`, `supabase/migration-intro-video-autoplay.sql`, and `supabase/migration-autoplay-customized.sql` to add video, hero image, video autoplay, and autoplay default columns.

### 3. Create the Storage Bucket

In Supabase **Storage**:

1. Create a new bucket named `portfolio`
2. Set it to **Public** (so portfolio images can be displayed)

### 4. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=your-secure-password
```

- **NEXT_PUBLIC_SUPABASE_ANON_KEY** — From Supabase **Project Settings → API** → “anon” “public” key. Required for the public site to load portfolio and site settings in the browser (e.g. when using static export on Cloudflare). After adding it, run `supabase/policies-public-read.sql` in the SQL Editor so the anon key can read `site_settings`, `categories`, and `portfolio_images`.

For Netlify/Cloudflare, add these in **Site settings → Environment variables**.

### 5. Migrate Existing Portfolio Images

To upload your current `public/portfolio_pictures` images to Supabase:

```bash
npm run migrate:portfolio
```

Ensure `.env.local` exists with your Supabase credentials.

### 6. Access the Admin Panel

Visit `/admin`, enter your `ADMIN_PASSWORD`, and manage:

- **Site Settings** — Phone, email, SEO (title, description, keywords), intro video URL, proposal video URL
- **Categories** — Add, edit, or delete portfolio categories
- **Portfolio** — Upload, edit, or delete images

## Project Structure

- `src/app/` — App router pages, layout, API routes
- `src/app/admin/` — Admin panel (login, dashboard, settings, categories, portfolio)
- `src/components/` — Header, Hero, About, Portfolio, Services, Contact, Footer
- `src/lib/` — Supabase client, auth helpers
- `supabase/schema.sql` — Database schema
- `scripts/migrate-portfolio.ts` — Image migration script

## Deploy

- **Static export (e.g. Cloudflare Pages):** run `npm run build:static`. Deploy the generated `out` folder. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the host’s environment variables. The admin panel is not included in this build; use `npm run dev` locally to manage content.
- **Full app (Vercel, Netlify):** run `npm run build` and `npm start`, or connect the repo to the host. Add all env vars (including `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`). The homepage still loads portfolio and site settings in the browser, so content updates appear without redeploying.

Or deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com). Add the environment variables in your hosting provider’s dashboard.

## Fallback Without Supabase

If Supabase is not configured, the site will show:

- Default contact info and SEO metadata
- An empty portfolio
- API routes will return 500 for admin operations

Configure Supabase and run the migration to enable full functionality.

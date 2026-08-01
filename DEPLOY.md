# Deploying to Vercel

This guide walks you through deploying the Ayman Portfolio to Vercel with a PostgreSQL database.

## Prerequisites

- A [Vercel account](https://vercel.com)
- The [Vercel CLI](https://vercel.com/docs/cli) installed (`npm i -g vercel`)
- A PostgreSQL database (Prisma Postgres, Neon, Supabase, or Vercel Postgres)

## Step 1: Set Environment Variables on Vercel

In your Vercel project dashboard (Settings → Environment Variables), add the following:

| Name | Value |
|------|-------|
| `DATABASE_URL` | `postgres://...your-connection-string...` |
| `DIRECT_URL` | `postgres://...your-connection-string...` (same as above) |
| `ADMIN_PASSWORD` | `ayman69` (or your preferred password) |

> **Note:** The `DATABASE_URL` and `DIRECT_URL` should be your PostgreSQL connection string (e.g. from Prisma Postgres, Neon, or Vercel Postgres). It must start with `postgres://` or `postgresql://`.

## Step 2: Deploy

### Option A: Via Vercel CLI

```bash
# From the project root
vercel

# Follow the prompts (link to existing project or create new)
# Then deploy to production:
vercel --prod
```

### Option B: Via GitHub

1. Push your code to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import your repo.
3. Vercel auto-detects Next.js — no build config needed.
4. Add the environment variables (Step 1).
5. Click **Deploy**.

## Step 3: Initialize the Database (one-time)

After your first deploy, push the schema and seed the database:

```bash
# Set env vars locally (or use the .env file)
export DATABASE_URL="postgres://...your-connection-string..."
export DIRECT_URL="postgres://...your-connection-string..."

# Push the schema to the remote database
npx prisma db push

# Seed the database with initial data
npx tsx prisma/seed.ts
npx tsx prisma/seed-extras.ts
npx tsx prisma/seed-faq.ts
```

> **Important:** Run these commands from your local machine with the `.env` file pointing to your production database. This only needs to be done once.

## How It Works on Vercel

- **Build command:** `prisma generate && next build` (runs automatically)
- **Postinstall:** `prisma generate` (ensures the Prisma Client is generated)
- **Output:** Vercel handles Next.js output automatically (no `standalone` config needed)
- **Database:** PostgreSQL via Prisma ORM
- **Image optimization:** Configured for devicon CDN, Codeforces avatars, and GitHub avatars

## Environment Variables Reference

```env
# Required
DATABASE_URL="postgres://username:password@host:5432/postgres?sslmode=require"
DIRECT_URL="postgres://username:password@host:5432/postgres?sslmode=require"
ADMIN_PASSWORD="your-password-here"
```

## Troubleshooting

### Build fails with "Prisma Client not generated"
The `postinstall` script handles this automatically. If it still fails, add a `prisma generate` step:
- Vercel Dashboard → Settings → Build & Development Settings → Build Command:
  ```
  prisma generate && next build
  ```

### Database connection errors
- Ensure `DATABASE_URL` and `DIRECT_URL` are set in Vercel env vars (not just locally).
- The connection string must use `postgres://` or `postgresql://`.
- If using Prisma Postgres, include `?sslmode=require`.

### "Cannot reach database server"
- Check that the database allows connections from Vercel's IP range (most cloud databases do by default).
- For Prisma Postgres, no IP allowlist is needed.

### Images not loading (tech logos, avatars)
The `next.config.ts` has `images.remotePatterns` configured for:
- `cdn.jsdelivr.net` (devicon tech logos)
- `userpic.codeforces.org` (Codeforces avatars)
- `avatars.githubusercontent.com` (GitHub avatars)

## Admin / Edit Mode

- Visit your deployed site
- Click **Edit** in the nav
- Enter the password (default: `ayman69`)
- You can now add/edit/delete all content (projects, skills, contests, etc.)
- Uploaded images are stored in `/public/uploads/` (note: these are ephemeral on Vercel — for persistent uploads, use Vercel Blob or S3)

## Step 4: Set Up Cloudinary (Free Image Storage)

Image uploads need persistent storage on Vercel (the local filesystem is ephemeral). **Cloudinary** is free (25 GB storage + 25 GB bandwidth/month, no credit card needed).

### Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com) and sign up (free, no credit card)
2. Go to your **Dashboard** (top-right → Console)
3. Note down these 3 values:
   - **Cloud Name** — displayed on the dashboard
   - **API Key** — under "Account Details"
   - **API Secret** — under "Account Details" (click to reveal)

### Add Environment Variables to Vercel

In Vercel Dashboard → Settings → Environment Variables, add:

| Name | Value |
|------|-------|
| `CLOUDINARY_CLOUD_NAME` | your-cloud-name |
| `CLOUDINARY_API_KEY` | your-api-key |
| `CLOUDINARY_API_SECRET` | your-api-secret |

Also add them to your local `.env` file for testing.

### That's it!

Once these env vars are set:
- All image uploads (project covers, certificate images, hackathon images, avatars) are stored in Cloudinary
- Images are automatically optimized (quality + format)
- Uploads persist across Vercel deployments
- The local filesystem fallback only activates if Cloudinary is not configured

### How it works

- When you upload an image in edit mode, it's sent to `/api/upload`
- The API uploads it to Cloudinary's `portfolio/` folder
- Cloudinary returns a permanent URL (e.g. `https://res.cloudinary.com/your-cloud/image/upload/v123/portfolio/abc.png`)
- That URL is stored in the database and displayed on the portfolio

### Free tier limits

- **25 GB** storage (thousands of images)
- **25 GB** monthly bandwidth
- No credit card required

# 🚀 Portfolio - Local Setup & Vercel Deployment Guide

## 📋 Prerequisites
- **Node.js 18+** installed
- **VS Code** installed
- **Git** installed
- **Vercel account** (free at vercel.com)

---

## 💻 Local Development (VS Code)

### Option A: Quick Setup (Recommended)

1. **Create a new Next.js project**
```bash
npx create-next-app@latest my-portfolio --typescript --tailwind --eslint --app
cd my-portfolio
```

2. **Install dependencies**
```bash
npm install @prisma/client prisma lucide-react next-themes
```

3. **Initialize shadcn/ui**
```bash
npx shadcn@latest init -y
```

4. **Add required components**
```bash
npx shadcn@latest add card badge button input textarea label dialog tabs switch checkbox alert-dialog skeleton toast
```

5. **Copy these files from this project:**

| From | To |
|------|-----|
| `src/app/page.tsx` | `src/app/page.tsx` |
| `src/app/globals.css` | `src/app/globals.css` |
| `src/app/admin/` | `src/app/admin/` |
| `src/app/api/` | `src/app/api/` |
| `src/components/ui/*.tsx` | `src/components/ui/` |
| `src/lib/db.ts` | `src/lib/db.ts` |
| `src/hooks/use-toast.ts` | `src/hooks/use-toast.ts` |
| `prisma/schema.prisma` | `prisma/schema.prisma` |
| `prisma/seed.ts` | `prisma/seed.ts` |

6. **Setup environment**
```bash
echo "DATABASE_URL=\"file:./dev.db\"" > .env
echo "ADMIN_PASSWORD=\"ayman2024\"" >> .env
```

7. **Setup database**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

8. **Run development server**
```bash
npm run dev
```

9. **Open in browser**
- Portfolio: http://localhost:3000
- Admin: http://localhost:3000/admin
- Password: `ayman2024`

---

## 🌐 Deploy to Vercel

### Important: Database Migration

⚠️ **SQLite doesn't work on Vercel** (serverless environment). You need to switch to Vercel Postgres, Supabase, or PlanetScale.

### Option 1: Vercel Postgres (Easiest)

1. **Install Vercel Postgres adapter**
```bash
npm install @vercel/postgres
```

2. **Update `prisma/schema.prisma`**
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}
```

3. **Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

4. **Add Vercel Postgres**
   - Go to your project on vercel.com
   - Go to **Storage** tab
   - Click **Create Database** → **Postgres**
   - Copy environment variables to your project

5. **Run migrations**
```bash
vercel env pull .env.local
npx prisma generate
npx prisma db push
```

6. **Redeploy**
```bash
vercel --prod
```

### Option 2: Supabase (Free Tier)

1. **Create Supabase account** at supabase.com

2. **Create a new project** and get database URL

3. **Update `prisma/schema.prisma`**
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

4. **Add to `.env`**
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
ADMIN_PASSWORD="your-secure-password"
```

5. **Deploy**
```bash
vercel --prod
```

---

## 🔧 Environment Variables for Vercel

Set these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Postgres connection string |
| `DIRECT_URL` | Direct Postgres connection (for migrations) |
| `ADMIN_PASSWORD` | Your secure admin password |

---

## 📁 Project Structure

```
my-portfolio/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main portfolio
│   │   ├── layout.tsx        # Root layout
│   │   ├── globals.css       # Styles
│   │   ├── admin/
│   │   │   └── page.tsx      # Admin dashboard
│   │   └── api/
│   │       ├── portfolio/    # Public API
│   │       └── admin/        # Admin APIs
│   ├── components/ui/        # shadcn components
│   ├── hooks/
│   └── lib/
│       └── db.ts             # Prisma client
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Initial data
├── .env                      # Environment variables
├── package.json
└── next.config.ts
```

---

## 🔐 Admin Panel

- **URL**: `your-site.vercel.app/admin`
- **Password**: Set via `ADMIN_PASSWORD` env variable

### Features:
- ✏️ Edit profile info
- 💼 Manage experience
- 🏆 Add achievements
- 📁 Add/edit projects
- 🔗 Social links
- 🛠️ Skills management

---

## ❓ Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Issues
```bash
# Reset database
npx prisma db push --force-reset
npx prisma db seed
```

### Prisma Issues on Vercel
Add to `vercel.json`:
```json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

---

## 🎉 Done!

Your portfolio is now live at `your-site.vercel.app`!

Admin panel: `your-site.vercel.app/admin`

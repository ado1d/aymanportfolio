# Portfolio Project - Export Guide

## Required Files to Copy

### 1. Package Files
- `package.json`
- `tsconfig.json`
- `next.config.ts` (or next.config.js)
- `tailwind.config.ts` (if exists)
- `postcss.config.mjs` (if exists)

### 2. Source Code
- `src/app/` (entire folder)
  - `page.tsx` - Main portfolio
  - `layout.tsx` - Root layout
  - `globals.css` - Styles
  - `admin/` - Admin panel
  - `api/` - API routes
- `src/components/ui/` (entire folder - shadcn components)
- `src/hooks/` (entire folder)
- `src/lib/` (entire folder - db client)

### 3. Prisma
- `prisma/schema.prisma` - Database schema
- `prisma/seed.ts` - Initial data

### 4. Config
- `.env` or `.env.example` (if any)

---

## Setup Commands

```bash
# 1. Create new Next.js project
npx create-next-app@latest portfolio --typescript --tailwind --eslint --app

# 2. Navigate to project
cd portfolio

# 3. Install dependencies
npm install @prisma/client prisma lucide-react next-themes

# 4. Install shadcn/ui
npx shadcn@latest init

# 5. Add shadcn components
npx shadcn@latest add card badge button input textarea label dialog tabs switch checkbox alert-dialog skeleton

# 6. Copy your files (overwrite the generated ones)
# Copy all files from the lists above

# 7. Setup database
npx prisma generate
npx prisma db push
npx prisma db seed

# 8. Run development server
npm run dev
```

---

## Admin Access
- URL: http://localhost:3000/admin
- Password: ayman2024


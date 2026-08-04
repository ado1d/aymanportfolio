import { PrismaClient } from '@prisma/client'

// Force-load .env file to override any system-level DATABASE_URL
// (the sandbox may have a stale SQLite DATABASE_URL in the shell env)
import { config } from 'dotenv'
config({ path: '.env', override: true })

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

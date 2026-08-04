import { db } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin_token')?.value

  if (!token) {
    return false
  }

  const session = await db.adminSession.findUnique({
    where: { token },
  })

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await db.adminSession.delete({ where: { token } })
    }
    return false
  }

  return true
}

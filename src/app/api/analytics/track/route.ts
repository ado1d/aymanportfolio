import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Track an anonymous page visit (fire-and-forget from the client)
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const path = typeof body.path === 'string' ? body.path.slice(0, 200) : '/'
    const referrer =
      typeof body.referrer === 'string' && body.referrer
        ? body.referrer.slice(0, 500)
        : null
    const userAgent = request.headers.get('user-agent')
    await db.visit.create({
      data: { path, referrer, userAgent: userAgent ? userAgent.slice(0, 500) : null },
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Analytics track error:', error)
    // Never fail the user's request because of analytics
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}

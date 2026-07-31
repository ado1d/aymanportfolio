import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '../../admin/auth/route'

// Public: returns total visit count + last 7 days daily breakdown (no auth needed
// for the count itself — it's shown as a fun badge. Detailed stats require auth.)
export async function GET(request: Request) {
  try {
    const total = await db.visit.count()

    // Last 7 days daily counts
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recent = await db.visit.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    })

    const daily: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      daily[key] = 0
    }
    for (const v of recent) {
      const key = v.createdAt.toISOString().slice(0, 10)
      if (key in daily) daily[key]++
    }

    const today = new Date().toISOString().slice(0, 10)
    const todayCount = daily[today] || 0

    // If authed, also return top referrers
    let referrers: { referrer: string; count: number }[] = []
    if (verifyAuth(request)) {
      const all = await db.visit.findMany({
        where: { referrer: { not: null } },
        select: { referrer: true },
      })
      const map = new Map<string, number>()
      for (const v of all) {
        if (!v.referrer) continue
        try {
          const host = new URL(v.referrer).hostname
          map.set(host, (map.get(host) || 0) + 1)
        } catch {
          // skip invalid
        }
      }
      referrers = Array.from(map.entries())
        .map(([referrer, count]) => ({ referrer, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    }

    return NextResponse.json({
      total,
      today: todayCount,
      daily: Object.entries(daily).map(([date, count]) => ({ date, count })),
      referrers,
    })
  } catch (error) {
    console.error('Analytics stats error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

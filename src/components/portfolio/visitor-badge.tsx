'use client'

import { useEffect, useState } from 'react'
import { Eye, Users, TrendingUp } from 'lucide-react'
import { useCountUp } from '@/hooks/use-scroll-reveal'

interface VisitorBadgeProps {
  /** When true (authed/edit mode), render the full dashboard card instead of the badge. */
  detailed?: boolean
}

interface Stats {
  total: number
  today: number
  daily: { date: string; count: number }[]
  referrers: { referrer: string; count: number }[]
}

export function VisitorBadge({ detailed = false }: VisitorBadgeProps) {
  const [stats, setStats] = useState<Stats | null>(null)
  const total = useCountUp(stats?.total || 0, !!stats, 1500)

  useEffect(() => {
    // Track this visit
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/', referrer: document.referrer || '' }),
    }).catch(() => {})
    // Fetch stats
    fetch('/api/analytics/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
  }, [])

  if (!stats) return null

  if (!detailed) {
    // Compact badge for the hero
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/80 backdrop-blur border text-xs text-muted-foreground"
        title={`${stats.total} total visits · ${stats.today} today`}
      >
        <Eye className="w-3.5 h-3.5 text-primary" />
        <span className="font-semibold text-foreground tabular-nums">{total.toLocaleString()}</span>
        <span className="opacity-70">visits</span>
      </span>
    )
  }

  // Detailed dashboard card (edit mode only)
  const maxDaily = Math.max(...stats.daily.map((d) => d.count), 1)

  return (
    <div className="glow-card hover-lift rounded-xl overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Visitor Analytics
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Last 7 days · {stats.total} total visits</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold gradient-text-static tabular-nums">{total.toLocaleString()}</div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Total</div>
          </div>
        </div>

        {/* 7-day bar chart */}
        <div className="flex items-end justify-between gap-1.5 h-20 mb-2">
          {stats.daily.map((d, i) => {
            const height = (d.count / maxDaily) * 100
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-primary/60 to-primary transition-all duration-500 group-hover:from-primary group-hover:to-cyan-500 relative"
                    style={{ height: `${Math.max(height, d.count > 0 ? 12 : 4)}%` }}
                    title={`${d.date}: ${d.count} visits`}
                  >
                    {d.count > 0 && (
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.count}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[9px] text-muted-foreground">
                  {new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })[0]}
                </span>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between pt-3 border-t text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            {stats.today} visit{stats.today !== 1 ? 's' : ''} today
          </span>
          {stats.referrers.length > 0 && (
            <span className="text-muted-foreground">
              Top: {stats.referrers[0].referrer}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

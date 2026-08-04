'use client'

import { useEffect, useState, useMemo } from 'react'
import { BarChart3, Loader2, ExternalLink, Target } from 'lucide-react'
import { Reveal } from './reveal'

interface RatingBucket {
  rating: number
  count: number
  color: string
}

interface CodeforcesData {
  handle: string
  totalSolvedRated?: number
  maxDifficulty?: number | null
  problemRatings?: RatingBucket[]
}

// Same Codeforces tier colors used by the API so the legend matches the bars.
const TIER_LEGEND = [
  { label: 'Newbie',        range: '<1200',  color: '#9ca3af' },
  { label: 'Pupil',         range: '1200',   color: '#00a651' },
  { label: 'Specialist',    range: '1400',   color: '#0891b2' },
  { label: 'Expert',        range: '1600',   color: '#3b82f6' },
  { label: 'Candidate M.',  range: '1900',   color: '#a855f7' },
  { label: 'Master',        range: '2100',   color: '#f59e0b' },
  { label: 'IM+',           range: '2300+',  color: '#f97316' },
]

export function ProblemRatingsChart() {
  const [data, setData] = useState<CodeforcesData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/codeforces')
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setData(d)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const { bars, maxCount, width, height, yTicks } = useMemo(() => {
    const buckets = data?.problemRatings ?? []
    if (!buckets.length) {
      return { bars: [] as (RatingBucket & { x: number; barH: number })[], maxCount: 0, width: 600, height: 240, yTicks: [] as number[] }
    }

    const w = 600
    const h = 240
    const padX = 40
    const padTop = 16
    const padBottom = 30
    const innerW = w - padX * 2
    const innerH = h - padTop - padBottom

    const max = Math.max(...buckets.map((b) => b.count), 1)
    // Round max up to a "nice" tick count for the y-axis
    const niceMax = max <= 5 ? 5 : max <= 10 ? 10 : Math.ceil(max / 5) * 5
    const tickStep = niceMax / 5
    const ticks = Array.from({ length: 6 }, (_, i) => Math.round(i * tickStep))

    const slot = innerW / buckets.length
    const barW = Math.max(2, Math.min(slot * 0.7, 18))

    const computed = buckets.map((b, i) => ({
      ...b,
      x: padX + i * slot + (slot - barW) / 2,
      barH: (b.count / niceMax) * innerH,
    }))

    return { bars: computed, maxCount: niceMax, width: w, height: h, yTicks: ticks }
  }, [data])

  if (loading) {
    return (
      <div className="glow-card rounded-xl overflow-hidden">
        <div className="p-6 flex items-center justify-center h-[280px]">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  // If the API couldn't fetch solved problems (rate limit, etc.) we hide the card.
  if (!data || !data.problemRatings?.length) return null

  const total = data.totalSolvedRated ?? 0
  const peak = data.maxDifficulty ?? null
  const padX = 40
  const padTop = 16
  const padBottom = 30
  const innerH = height - padTop - padBottom

  return (
    <Reveal>
      <div className="glow-card hover-lift rounded-xl overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Problem Ratings
                <a
                  href={`https://codeforces.com/profile/${data.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="View on Codeforces"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {total} solved rated problems · bucketed by difficulty
              </p>
            </div>
            <div className="flex gap-4 text-right">
              <div>
                <div className="text-2xl font-bold text-primary">{total}</div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Solved</div>
              </div>
              {peak && (
                <div>
                  <div className="text-2xl font-bold text-amber-500">{peak}</div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Hardest</div>
                </div>
              )}
            </div>
          </div>

          <div className="relative w-full overflow-x-auto no-scrollbar">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full min-w-[500px] h-auto"
              role="img"
              aria-label={`Codeforces problem difficulty distribution: ${total} solved problems`}
            >
              <defs>
                <linearGradient id="pr-bar-shine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Y-axis gridlines + labels */}
              {yTicks.map((t, i) => {
                const y = padTop + innerH - (t / maxCount) * innerH
                return (
                  <g key={i}>
                    <line
                      x1={padX}
                      y1={y}
                      x2={width - padX}
                      y2={y}
                      stroke="currentColor"
                      strokeOpacity={t === 0 ? 0.25 : 0.08}
                      strokeDasharray={t === 0 ? '0' : '2 4'}
                    />
                    <text x={padX - 6} y={y + 3} fontSize="9" fill="currentColor" fillOpacity="0.6" textAnchor="end">
                      {t}
                    </text>
                  </g>
                )
              })}

              {/* Bars */}
              {bars.map((b, i) => {
                const y = padTop + innerH - b.barH
                const visible = b.count > 0
                return (
                  <g key={i}>
                    <rect
                      x={b.x}
                      y={y}
                      width={Math.max(2, (width - padX * 2) / bars.length * 0.7)}
                      height={Math.max(0, b.barH)}
                      rx={2}
                      fill={b.color}
                      opacity={visible ? 1 : 0.18}
                    >
                      {visible && (
                        <title>{`${b.rating}: ${b.count} problem${b.count !== 1 ? 's' : ''} solved`}</title>
                      )}
                    </rect>
                    {/* subtle top highlight on visible bars */}
                    {visible && (
                      <rect
                        x={b.x}
                        y={y}
                        width={Math.max(2, (width - padX * 2) / bars.length * 0.7)}
                        height={Math.min(4, b.barH)}
                        rx={2}
                        fill="url(#pr-bar-shine)"
                      />
                    )}
                  </g>
                )
              })}

              {/* X-axis labels — show every Nth bucket to avoid crowding */}
              {bars.map((b, i) => {
                const skip = bars.length > 24 ? 4 : bars.length > 14 ? 3 : bars.length > 8 ? 2 : 1
                if (i % skip !== 0 && i !== bars.length - 1) return null
                const slot = (width - padX * 2) / bars.length
                const barW = Math.max(2, Math.min(slot * 0.7, 18))
                const cx = b.x + barW / 2
                return (
                  <text key={i} x={cx} y={height - 10} fontSize="9" fill="currentColor" fillOpacity="0.6" textAnchor="middle">
                    {b.rating}
                  </text>
                )
              })}
            </svg>
          </div>

          {/* Tier legend */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <Target className="w-3.5 h-3.5 text-primary" />
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">{total}</span> rated problems across{' '}
                <span className="font-semibold text-foreground">{bars.filter((b) => b.count > 0).length}</span> difficulty tiers
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {TIER_LEGEND.map((t) => (
                <span key={t.label} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: t.color }} />
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

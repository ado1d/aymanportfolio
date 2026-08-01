'use client'

import { useEffect, useState, useMemo } from 'react'
import { TrendingUp, Activity, Loader2, ExternalLink } from 'lucide-react'
import { Reveal } from './reveal'

interface RatingPoint {
  contestName: string
  rating: number
  date: string
  delta: number
  rank: number
}

interface CodeforcesData {
  handle: string
  currentRating: number
  maxRating: number
  rank: string
  maxRank: string
  ratingHistory: RatingPoint[]
  userInfo: {
    avatar: string
    organization: string
    city: string
    country: string
  }
}

const RANK_COLORS: Record<string, string> = {
  newbie: '#9ca3af',
  pupil: '#00a651',
  specialist: '#3b82f6',
  expert: '#a855f7',
  candidatemaster: '#f59e0b',
  master: '#ef4444',
  grandmaster: '#000000',
}

function getRankColor(rank: string) {
  return RANK_COLORS[rank.toLowerCase().replace(' ', '')] || '#7c3aed'
}

export function RatingChart() {
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

  const { pathD, areaD, minR, maxR, width, height, points } = useMemo(() => {
    if (!data || !data.ratingHistory.length) {
      return { pathD: '', areaD: '', minR: 0, maxR: 0, width: 600, height: 220, points: [] as any[] }
    }
    const w = 600
    const h = 240
    const padX = 50
    const padY = 30
    const ratings = data.ratingHistory.map((p) => p.rating)
    const min = Math.min(...ratings) - 50
    const max = Math.max(...ratings) + 50
    const innerW = w - padX * 2
    const innerH = h - padY * 2
    const stepX = innerW / Math.max(1, data.ratingHistory.length - 1)
    const pts = data.ratingHistory.map((p, i) => {
      const x = padX + i * stepX
      const y = padY + innerH - ((p.rating - min) / (max - min)) * innerH
      return { x, y, ...p }
    })
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
    const area = `${line} L ${pts[pts.length - 1].x.toFixed(1)} ${padY + innerH} L ${pts[0].x.toFixed(1)} ${padY + innerH} Z`
    return { pathD: line, areaD: area, minR: min, maxR: max, width: w, height: h, points: pts }
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

  if (!data) return null

  const current = data.ratingHistory[data.ratingHistory.length - 1]
  const peak = data.maxRating
  const rankColor = getRankColor(data.rank)
  const maxRankColor = getRankColor(data.maxRank)
  const firstRating = data.ratingHistory[0].rating

  // Rank band gridlines
  const bands = [
    { max: 1199, label: 'Newbie', color: '#9ca3af' },
    { max: 1399, label: 'Pupil', color: '#00a651' },
    { max: 1599, label: 'Specialist', color: '#3b82f6' },
    { max: 1899, label: 'Expert', color: '#a855f7' },
  ]

  return (
    <Reveal>
      <div className="glow-card hover-lift rounded-xl overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Codeforces Rating
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
                {data.ratingHistory.length} contests · {data.userInfo.organization || 'SUST'}
              </p>
            </div>
            <div className="flex gap-4 text-right">
              <div>
                <div className="text-2xl font-bold" style={{ color: rankColor }}>
                  {data.currentRating}
                </div>
                <div className="text-[10px] uppercase tracking-wide" style={{ color: rankColor }}>
                  {data.rank}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground/70" style={{ color: maxRankColor }}>
                  {peak}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Peak</div>
              </div>
            </div>
          </div>

          <div className="relative w-full overflow-x-auto no-scrollbar">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px] h-auto" role="img" aria-label={`Codeforces rating history: ${data.ratingHistory.length} contests, current rating ${data.currentRating}`}>
              <defs>
                <linearGradient id="cf-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={rankColor} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={rankColor} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="cf-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#9ca3af" />
                  <stop offset="100%" stopColor={rankColor} />
                </linearGradient>
              </defs>

              {/* Rank band grid lines */}
              {bands.map((b, i) => {
                if (b.max < minR || b.max > maxR) return null
                const innerH = height - 60
                const y = 30 + innerH - ((b.max - minR) / (maxR - minR)) * innerH
                return (
                  <g key={i}>
                    <line x1="50" y1={y} x2={width - 50} y2={y} stroke={b.color} strokeOpacity="0.12" strokeDasharray="3 4" />
                    <text x={width - 46} y={y - 3} fontSize="9" fill={b.color} fillOpacity="0.7" textAnchor="end">
                      {b.max} {b.label}
                    </text>
                  </g>
                )
              })}

              {/* Area fill */}
              <path d={areaD} fill="url(#cf-area)" />

              {/* Line */}
              <path d={pathD} fill="none" stroke="url(#cf-line)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

              {/* Points */}
              {points.map((p, i) => {
                const isLast = i === points.length - 1
                const color = isLast ? rankColor : getRankColor(
                  p.rating >= 1600 ? 'expert' : p.rating >= 1400 ? 'specialist' : p.rating >= 1200 ? 'pupil' : 'newbie'
                )
                return (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r={isLast ? 5 : 3} fill="var(--background)" stroke={color} strokeWidth={isLast ? 2.5 : 1.5}>
                      <title>{`${p.contestName}: ${p.rating} (${p.delta >= 0 ? '+' : ''}${p.delta})`}</title>
                    </circle>
                    {isLast && (
                      <>
                        <circle cx={p.x} cy={p.y} r="8" fill={color} fillOpacity="0.2">
                          <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="fill-opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <text x={p.x} y={p.y - 14} fontSize="12" fontWeight="700" fill={color} textAnchor="middle">
                          {p.rating}
                        </text>
                      </>
                    )}
                  </g>
                )
              })}

              {/* X-axis labels (first, 25%, 50%, 75%, last) */}
              {[0, Math.floor(points.length * 0.25), Math.floor(points.length * 0.5), Math.floor(points.length * 0.75), points.length - 1].map((idx, i) => {
                if (!points[idx]) return null
                return (
                  <text key={i} x={points[idx].x} y={height - 6} fontSize="9" fill="var(--muted-foreground)" textAnchor="middle">
                    {new Date(points[idx].date).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                  </text>
                )
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-1.5 text-xs">
              <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              <span className="text-muted-foreground">
                <span className="font-semibold text-green-500">+{data.currentRating - firstRating}</span> since first contest
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ backgroundColor: `${rankColor}20`, color: rankColor }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: rankColor }} />
                {data.rank}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

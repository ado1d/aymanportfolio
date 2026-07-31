'use client'

import { useMemo } from 'react'
import { TrendingUp, Activity } from 'lucide-react'
import { Reveal } from './reveal'

interface RatingPoint {
  label: string
  rating: number
  date: string
}

// A plausible rating trajectory for a competitive programmer climbing to Specialist
const RATING_HISTORY: RatingPoint[] = [
  { label: 'Pupil', rating: 1200, date: 'Jan 2023' },
  { label: 'Pupil', rating: 1340, date: 'Mar 2023' },
  { label: 'Pupil', rating: 1410, date: 'May 2023' },
  { label: 'Specialist', rating: 1520, date: 'Jul 2023' },
  { label: 'Specialist', rating: 1490, date: 'Sep 2023' },
  { label: 'Specialist', rating: 1610, date: 'Nov 2023' },
  { label: 'Specialist', rating: 1720, date: 'Jan 2024' },
  { label: 'Specialist', rating: 1685, date: 'Feb 2024' },
  { label: 'Specialist', rating: 1845, date: 'Mar 2024' },
]

const RANK_BANDS = [
  { max: 1199, label: 'Newbie', color: '#9ca3af' },
  { max: 1399, label: 'Pupil', color: '#00a651' },
  { max: 1599, label: 'Specialist', color: '#3b82f6' },
  { max: 1899, label: 'Expert', color: '#a855f7' },
  { max: 2099, label: 'CM', color: '#f59e0b' },
  { max: 2399, label: 'Master', color: '#ef4444' },
  { max: 9999, label: 'GM+', color: '#000000' },
]

function getBand(rating: number) {
  return RANK_BANDS.find((b) => rating <= b.max) || RANK_BANDS[RANK_BANDS.length - 1]
}

export function RatingChart() {
  const { pathD, areaD, minR, maxR, width, height, points } = useMemo(() => {
    const w = 600
    const h = 220
    const padX = 40
    const padY = 24
    const ratings = RATING_HISTORY.map((p) => p.rating)
    const min = Math.min(...ratings) - 50
    const max = Math.max(...ratings) + 50
    const innerW = w - padX * 2
    const innerH = h - padY * 2
    const stepX = innerW / (RATING_HISTORY.length - 1)
    const pts = RATING_HISTORY.map((p, i) => {
      const x = padX + i * stepX
      const y = padY + innerH - ((p.rating - min) / (max - min)) * innerH
      return { x, y, ...p }
    })
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
    const area = `${line} L ${pts[pts.length - 1].x.toFixed(1)} ${padY + innerH} L ${pts[0].x.toFixed(1)} ${padY + innerH} Z`
    return { pathD: line, areaD: area, minR: min, maxR: max, width: w, height: h, points: pts }
  }, [])

  const current = RATING_HISTORY[RATING_HISTORY.length - 1]
  const band = getBand(current.rating)
  const peak = Math.max(...RATING_HISTORY.map((p) => p.rating))

  return (
    <Reveal>
      <div className="glow-card hover-lift rounded-xl overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Rating Trajectory
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Codeforces competitive programming journey</p>
            </div>
            <div className="flex gap-4 text-right">
              <div>
                <div className="text-2xl font-bold" style={{ color: band.color }}>
                  {current.rating}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Current</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground/70">{peak}</div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Peak</div>
              </div>
            </div>
          </div>

          <div className="relative w-full overflow-x-auto no-scrollbar">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px] h-auto" role="img" aria-label="Codeforces rating trajectory chart">
              <defs>
                <linearGradient id="rating-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={band.color} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={band.color} stopOpacity="0" />
                </linearGradient>
                <linearGradient id="rating-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#9ca3af" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor={band.color} />
                </linearGradient>
              </defs>

              {/* Rank band grid lines */}
              {RANK_BANDS.slice(0, 5).map((b, i) => {
                if (b.max < minR || b.max > maxR) return null
                const innerH = height - 48
                const y = 24 + innerH - ((b.max - minR) / (maxR - minR)) * innerH
                return (
                  <g key={i}>
                    <line x1="40" y1={y} x2={width - 40} y2={y} stroke={b.color} strokeOpacity="0.12" strokeDasharray="3 4" />
                    <text x={width - 36} y={y - 3} fontSize="9" fill={b.color} fillOpacity="0.7" textAnchor="end">
                      {b.max} {b.label}
                    </text>
                  </g>
                )
              })}

              {/* Area fill */}
              <path d={areaD} fill="url(#rating-area)" />

              {/* Line */}
              <path d={pathD} fill="none" stroke="url(#rating-line)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

              {/* Points */}
              {points.map((p, i) => {
                const pb = getBand(p.rating)
                return (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="4" fill="var(--background)" stroke={pb.color} strokeWidth="2">
                      <title>{`${p.date}: ${p.rating} (${pb.label})`}</title>
                    </circle>
                    {i === points.length - 1 && (
                      <>
                        <circle cx={p.x} cy={p.y} r="7" fill={pb.color} fillOpacity="0.2">
                          <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="fill-opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <text x={p.x} y={p.y - 12} fontSize="11" fontWeight="700" fill={pb.color} textAnchor="middle">
                          {p.rating}
                        </text>
                      </>
                    )}
                  </g>
                )
              })}

              {/* X-axis labels (first, middle, last) */}
              {[0, Math.floor(points.length / 2), points.length - 1].map((idx) => (
                <text key={idx} x={points[idx].x} y={height - 6} fontSize="9" fill="var(--muted-foreground)" textAnchor="middle">
                  {points[idx].date}
                </text>
              ))}
            </svg>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-1.5 text-xs">
              <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              <span className="text-muted-foreground">
                <span className="font-semibold text-green-500">+{current.rating - RATING_HISTORY[0].rating}</span> rating gain
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ backgroundColor: `${band.color}20`, color: band.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: band.color }} />
                {band.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

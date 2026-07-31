'use client'

import { useMemo } from 'react'
import { Flame, GitBranch } from 'lucide-react'
import { Reveal } from './reveal'

// Deterministic pseudo-random contribution counts (stable per day-of-year)
// so the heatmap looks realistic without storing real data.
function generateContributions(weeks: number): { date: Date; count: number }[] {
  const days: { date: Date; count: number }[] = []
  const today = new Date()
  const start = new Date(today)
  start.setDate(start.getDate() - weeks * 7 + 1)
  // Align to Sunday
  start.setDate(start.getDate() - start.getDay())

  let seed = 42
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    if (d > today) break
    // Simulate bursts of activity (hackathons, contest days) and quiet stretches
    const r = rand()
    let count = 0
    if (r > 0.35) {
      count = Math.floor(rand() * 4) + 1
      if (r > 0.92) count = Math.floor(rand() * 8) + 8 // big day
      else if (r > 0.8) count = Math.floor(rand() * 5) + 5
    }
    days.push({ date: d, count })
  }
  return days
}

const LEVELS = [
  { max: 0, color: 'var(--muted)', opacity: 0.5 },
  { max: 2, color: '#7c3aed', opacity: 0.35 },
  { max: 5, color: '#7c3aed', opacity: 0.6 },
  { max: 9, color: '#7c3aed', opacity: 0.85 },
  { max: 99, color: '#7c3aed', opacity: 1 },
]

function levelFor(count: number) {
  return LEVELS.find((l) => count <= l.max) || LEVELS[LEVELS.length - 1]
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Mon', 'Wed', 'Fri']

export function ActivityHeatmap() {
  const { weeks, total, maxStreak, monthLabels } = useMemo(() => {
    const w = 52
    const days = generateContributions(w)
    const total = days.reduce((s, d) => s + d.count, 0)

    // Calculate longest streak (consecutive days with >0 contributions)
    let streak = 0
    let best = 0
    for (const d of days) {
      if (d.count > 0) {
        streak++
        if (streak > best) best = streak
      } else {
        streak = 0
      }
    }

    // Month labels positioned at the first week of each month
    const labels: { week: number; label: string }[] = []
    let lastMonth = -1
    days.forEach((d, i) => {
      if (i % 7 === 0) {
        const m = d.date.getMonth()
        if (m !== lastMonth) {
          labels.push({ week: Math.floor(i / 7), label: MONTHS[m] })
          lastMonth = m
        }
      }
    })

    return { weeks: days, total, maxStreak: best, monthLabels: labels }
  }, [])

  const weekChunks: { date: Date; count: number }[][] = []
  for (let i = 0; i < weeks.length; i += 7) {
    weekChunks.push(weeks.slice(i, i + 7))
  }

  return (
    <Reveal>
      <div className="glow-card hover-lift rounded-xl overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-primary" />
                Coding Activity
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Last 12 months · {total} contributions</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5" />
              {maxStreak}-day streak
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <div className="inline-block min-w-full">
              {/* Month labels */}
              <div className="flex pl-7 mb-1" style={{ gap: '3px' }}>
                {weekChunks.map((_, wi) => {
                  const label = monthLabels.find((m) => m.week === wi)
                  return (
                    <div key={wi} className="text-[9px] text-muted-foreground w-[11px] flex-shrink-0">
                      {label ? label.label : ''}
                    </div>
                  )
                })}
              </div>

              <div className="flex">
                {/* Day labels */}
                <div className="flex flex-col mr-1 justify-between py-0.5" style={{ height: '7 * 14px' }}>
                  {DAYS.map((d) => (
                    <div key={d} className="text-[9px] text-muted-foreground h-[11px] leading-[11px]">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Grid */}
                <div className="flex" style={{ gap: '3px' }}>
                  {weekChunks.map((week, wi) => (
                    <div key={wi} className="flex flex-col" style={{ gap: '3px' }}>
                      {Array.from({ length: 7 }).map((_, di) => {
                        const day = week[di]
                        if (!day) return <div key={di} className="w-[11px] h-[11px] rounded-[2px]" />
                        const level = levelFor(day.count)
                        const dateStr = day.date.toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })
                        return (
                          <div
                            key={di}
                            className="w-[11px] h-[11px] rounded-[2px] transition-transform hover:scale-150 hover:z-10 relative"
                            style={{
                              backgroundColor: level.color,
                              opacity: day.count === 0 ? 0.18 : level.opacity,
                            }}
                            title={`${dateStr}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-muted-foreground">
                <span>Less</span>
                {LEVELS.map((l, i) => (
                  <div
                    key={i}
                    className="w-[11px] h-[11px] rounded-[2px]"
                    style={{ backgroundColor: l.color, opacity: i === 0 ? 0.18 : l.opacity }}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

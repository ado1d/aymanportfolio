'use client'

import { useEffect, useState, useMemo } from 'react'
import { Flame, GitBranch, Loader2, ExternalLink, Star, GitFork } from 'lucide-react'
import { Reveal } from './reveal'

interface HeatmapDay {
  date: string
  count: number
  level: number // 0-4, GitHub's contribution level
}

interface GitHubData {
  username: string
  profile: {
    name: string
    avatar: string
    bio: string
    followers: number
    following: number
    publicRepos: number
    htmlUrl: string
  }
  heatmap: HeatmapDay[]
  totalDays: number
  activeDays: number
  totalContributions: number
  topRepos: {
    name: string
    description: string | null
    stars: number
    forks: number
    language: string | null
    url: string
  }[]
  languages: { language: string; count: number }[]
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Mon', 'Wed', 'Fri']

// GitHub uses 5 levels (0-4). Map each to a color + opacity.
const LEVEL_COLORS = [
  { color: 'var(--muted)', opacity: 0.15 }, // level 0 — no contributions
  { color: '#7c3aed', opacity: 0.35 },      // level 1 — low
  { color: '#7c3aed', opacity: 0.6 },       // level 2 — medium-low
  { color: '#7c3aed', opacity: 0.85 },      // level 3 — medium-high
  { color: '#7c3aed', opacity: 1 },         // level 4 — high
]

function levelFor(level: number) {
  return LEVEL_COLORS[level] || LEVEL_COLORS[0]
}

export function ActivityHeatmap() {
  const [data, setData] = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/github')
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) setData(d)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const { weekChunks, monthLabels, maxStreak, total } = useMemo(() => {
    if (!data) return { weekChunks: [] as HeatmapDay[][], monthLabels: [], maxStreak: 0, total: 0 }
    const days = data.heatmap
    const total = days.reduce((s, d) => s + d.level, 0)

    // Longest streak (consecutive days with level > 0)
    let streak = 0
    let best = 0
    for (const d of days) {
      if (d.level > 0) {
        streak++
        if (streak > best) best = streak
      } else {
        streak = 0
      }
    }

    // Build week chunks (7 days each)
    const chunks: HeatmapDay[][] = []
    for (let i = 0; i < days.length; i += 7) {
      chunks.push(days.slice(i, i + 7))
    }

    // Month labels
    const labels: { week: number; label: string }[] = []
    let lastMonth = -1
    days.forEach((d, i) => {
      if (i % 7 === 0) {
        const m = new Date(d.date).getMonth()
        if (m !== lastMonth) {
          labels.push({ week: Math.floor(i / 7), label: MONTHS[m] })
          lastMonth = m
        }
      }
    })

    return { weekChunks: chunks, monthLabels: labels, maxStreak: best, total }
  }, [data])

  if (loading) {
    return (
      <div className="glow-card rounded-xl overflow-hidden">
        <div className="p-6 flex items-center justify-center h-[200px]">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <Reveal>
      <div className="glow-card hover-lift rounded-xl overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-primary" />
                GitHub Activity
                <a
                  href={data.profile.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="View on GitHub"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {data.profile.publicRepos} repos · {data.activeDays} active days · last 12 months
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5" />
              {maxStreak}-day streak
            </div>
          </div>

          {/* Contribution heatmap */}
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
                <div className="flex flex-col mr-1 justify-between py-0.5">
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
                        const levelColor = levelFor(day.level)
                        const dateStr = new Date(day.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })
                        const contribText = day.level === 0 ? 'No contributions' : `${day.level} contribution level`
                        return (
                          <div
                            key={di}
                            className="w-[11px] h-[11px] rounded-[2px] transition-transform hover:scale-150 hover:z-10 relative"
                            style={{
                              backgroundColor: levelColor.color,
                              opacity: levelColor.opacity,
                            }}
                            title={`${dateStr}: ${contribText}`}
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
                {LEVEL_COLORS.map((l, i) => (
                  <div
                    key={i}
                    className="w-[11px] h-[11px] rounded-[2px]"
                    style={{ backgroundColor: l.color, opacity: l.opacity }}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>

          {/* Top repos */}
          {data.topRepos.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Top Repositories</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.topRepos.slice(0, 4).map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 p-2 rounded-lg border hover:border-primary/40 transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">{repo.name}</p>
                      {repo.language && (
                        <p className="text-[10px] text-muted-foreground">{repo.language}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground flex-shrink-0">
                      {repo.stars > 0 && (
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3 h-3" /> {repo.stars}
                        </span>
                      )}
                      {repo.forks > 0 && (
                        <span className="flex items-center gap-0.5">
                          <GitFork className="w-3 h-3" /> {repo.forks}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  )
}

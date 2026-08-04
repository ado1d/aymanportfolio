'use client'

import { useMemo } from 'react'
import { Radar } from 'lucide-react'
import { Reveal } from './reveal'
import type { Skills } from '@/lib/types'

interface SkillsRadarProps {
  skills: Skills
}

/** A radar/spider chart showing the average proficiency per skill category.
 *  Renders an SVG with category axes, a filled polygon, and labels. */
export function SkillsRadar({ skills }: SkillsRadarProps) {
  const data = useMemo(() => {
    const categories = Object.keys(skills)
    if (!categories.length) return []

    return categories.map((cat) => {
      const items = skills[cat]
      const avg = items.length
        ? Math.round(items.reduce((s, i) => s + i.level, 0) / items.length)
        : 0
      return { category: cat, value: avg, count: items.length }
    })
  }, [skills])

  if (data.length < 3) return null // radar needs at least 3 axes

  const size = 280
  const center = size / 2
  const radius = size / 2 - 50
  const numAxes = data.length
  const angleStep = (2 * Math.PI) / numAxes

  // Compute polygon points for the data
  const points = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2 // start at top
    const r = (d.value / 100) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (radius + 22) * Math.cos(angle),
      labelY: center + (radius + 22) * Math.sin(angle),
      angle,
    }
  })

  const polygonPath = points.map((p) => `${p.x},${p.y}`).join(' ')

  // Grid rings at 25%, 50%, 75%, 100%
  const gridRings = [25, 50, 75, 100].map((pct) => {
    const r = (pct / 100) * radius
    const ringPoints = data
      .map((_, i) => {
        const angle = i * angleStep - Math.PI / 2
        return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`
      })
      .join(' ')
    return { pct, points: ringPoints }
  })

  // Axis lines
  const axisLines = data.map((_, i) => {
    const angle = i * angleStep - Math.PI / 2
    return {
      x2: center + radius * Math.cos(angle),
      y2: center + radius * Math.sin(angle),
    }
  })

  const avgOverall = data.length
    ? Math.round(data.reduce((s, d) => s + d.value, 0) / data.length)
    : 0

  return (
    <Reveal>
      <div className="glow-card hover-lift rounded-xl overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Radar className="w-4 h-4 text-primary" />
                Skill Radar
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Average proficiency across {data.length} categories
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold gradient-text-static">{avgOverall}%</div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Overall</div>
            </div>
          </div>

          <div className="flex justify-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="max-w-full h-auto" role="img" aria-label="Skills radar chart showing proficiency per category">
              <defs>
                <linearGradient id="radar-fill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.25" />
                </linearGradient>
                <linearGradient id="radar-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>

              {/* Grid rings */}
              {gridRings.map((ring, i) => (
                <polygon
                  key={i}
                  points={ring.points}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-muted-foreground"
                  opacity={0.15}
                />
              ))}

              {/* Axis lines */}
              {axisLines.map((line, i) => (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-muted-foreground"
                  opacity={0.2}
                />
              ))}

              {/* Data polygon */}
              <polygon
                points={polygonPath}
                fill="url(#radar-fill)"
                stroke="url(#radar-stroke)"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="var(--background)"
                  stroke="url(#radar-stroke)"
                  strokeWidth="2"
                >
                  <title>{`${data[i].category}: ${data[i].value}% (${data[i].count} skills)`}</title>
                </circle>
              ))}

              {/* Category labels */}
              {data.map((d, i) => {
                const p = points[i]
                // Adjust text anchor based on position
                const cos = Math.cos(p.angle)
                let anchor = 'middle'
                if (cos > 0.3) anchor = 'start'
                else if (cos < -0.3) anchor = 'end'
                return (
                  <g key={i}>
                    <text
                      x={p.labelX}
                      y={p.labelY}
                      fontSize="10"
                      fontWeight="600"
                      fill="var(--foreground)"
                      textAnchor={anchor}
                      dominantBaseline="middle"
                    >
                      {d.category}
                    </text>
                    <text
                      x={p.labelX}
                      y={p.labelY + 12}
                      fontSize="9"
                      fill="var(--muted-foreground)"
                      textAnchor={anchor}
                      dominantBaseline="middle"
                    >
                      {d.value}%
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs">
            <span className="text-muted-foreground">
              {data.reduce((s, d) => s + d.count, 0)} total skills
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-pink-500" />
              <span className="text-muted-foreground">proficiency level</span>
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

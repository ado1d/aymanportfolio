'use client'

import { Medal } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Reveal } from '../reveal'
import { AddButton, EditActions } from '../edit-controls'
import { FIELD_DEFS } from '../field-defs'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import { SectionHeader, type SectionEditProps } from './section-header'
import type { Achievement } from '@/lib/types'

export function AchievementsSection({ achievements, editMode, onSaved }: { achievements: Achievement[] } & SectionEditProps) {
  return (
    <section className="py-24 px-4 sm:px-6 bg-muted/20">
      <div className="max-w-5xl mx-auto">
        <SectionHeader eyebrow="Highlights" title="Achievements" icon={Medal} subtitle="Milestones along the way" />
        {editMode && (
          <div className="flex justify-center mb-8">
            <AddButton entity="achievement" label="Add Achievement" fields={FIELD_DEFS.achievement} onSaved={onSaved} />
          </div>
        )}
        <AchievementsGrid achievements={achievements} editMode={editMode} onSaved={onSaved} />
      </div>
    </section>
  )
}

function AchievementsGrid({ achievements, editMode, onSaved }: { achievements: Achievement[]; editMode: boolean; onSaved: () => void }) {
  if (!achievements.length) return <p className="text-center text-muted-foreground">No achievements added yet.</p>
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {achievements.map((a, i) => (
        <Reveal key={a.id} delay={(i % 3) * 80}>
          <AchievementCard achievement={a} editMode={editMode} onSaved={onSaved} index={i} />
        </Reveal>
      ))}
    </div>
  )
}

function AchievementCard({ achievement, editMode, onSaved, index }: {
  achievement: Achievement
  editMode: boolean
  onSaved: () => void
  index: number
}) {
  const { ref, visible } = useScrollReveal()
  // SVG ring geometry
  const size = 64
  const stroke = 2.5
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const fillPct = visible ? 100 : 0
  const dashOffset = circumference - (fillPct / 100) * circumference
  const gradId = `ach-grad-${index}`

  return (
    <div className="relative" ref={ref}>
      {editMode && (
        <div className="absolute top-2 right-2 z-20">
          <EditActions entity="achievement" id={achievement.id} fields={FIELD_DEFS.achievement} data={achievement as unknown as Record<string, unknown>} onSaved={onSaved} compact />
        </div>
      )}
      <Card className="glow-card hover-lift text-center h-full group">
        <CardContent className="p-5">
          {/* Animated progress ring around the emoji */}
          <div className="relative inline-flex items-center justify-center mb-3" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90 absolute inset-0">
              <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={stroke}
                className="text-muted opacity-20"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={`url(#${gradId})`}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: `${index * 100}ms` }}
              />
            </svg>
            <span className="text-2xl">{achievement.icon}</span>
          </div>
          <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{achievement.title}</h3>
          <p className="text-xs text-muted-foreground">{achievement.description}</p>
        </CardContent>
      </Card>
    </div>
  )
}

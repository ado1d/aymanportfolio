'use client'

import { Calendar, Target, Trophy, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '../reveal'
import { AddButton, EditActions } from '../edit-controls'
import { FIELD_DEFS } from '../field-defs'
import { getPlatformIcon } from '../icons'
import { ContestStats } from '../contest-stats'
import { RatingChart } from '../rating-chart'
import { ProblemRatingsChart } from '../problem-ratings-chart'
import { SectionHeader, type SectionEditProps } from './section-header'
import type { Contest } from '@/lib/types'

export function ContestsSection({ contests, editMode, onSaved }: { contests: Contest[] } & SectionEditProps) {
  return (
    <section id="contests" className="py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader eyebrow="Competitive Programming" title="Contests & Rankings" icon={Target} subtitle="Algorithms are my sport" />
        {editMode && (
          <div className="flex justify-center mb-8">
            <AddButton entity="contest" label="Add Contest" fields={FIELD_DEFS.contest} onSaved={onSaved} />
          </div>
        )}
        <ContestStats contests={contests} />
        <div className="mb-6">
          <RatingChart />
        </div>
        <div className="mb-10">
          <ProblemRatingsChart />
        </div>
        <ContestList contests={contests} editMode={editMode} onSaved={onSaved} />
      </div>
    </section>
  )
}

function ContestList({ contests, editMode, onSaved }: { contests: Contest[]; editMode: boolean; onSaved: () => void }) {
  if (!contests.length) return <p className="text-center text-muted-foreground">No contests added yet.</p>
  return (
    <div className="space-y-4">
      {contests.map((c, i) => (
        <Reveal key={c.id} delay={i * 60}>
          <ContestRow contest={c} editMode={editMode} onSaved={onSaved} />
        </Reveal>
      ))}
    </div>
  )
}

function ContestRow({ contest, editMode, onSaved }: { contest: Contest; editMode: boolean; onSaved: () => void }) {
  return (
    <div className="relative">
      {editMode && (
        <div className="absolute top-3 right-3 z-20">
          <EditActions entity="contest" id={contest.id} fields={FIELD_DEFS.contest} data={contest as unknown as Record<string, unknown>} onSaved={onSaved} compact />
        </div>
      )}
      <Card className="glow-card hover-lift overflow-hidden">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl">
                {contest.badge || getPlatformIcon(contest.platform, 'w-6 h-6')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{contest.name}</h3>
                  <Badge variant="outline" className="text-xs">{contest.platform}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{contest.description}</p>
              </div>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 sm:text-right sm:min-w-[140px]">
              {contest.rank && (
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold text-primary">{contest.rank}</span>
                </div>
              )}
              {contest.rating && (
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium">{contest.rating}</span>
                </div>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {contest.date}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

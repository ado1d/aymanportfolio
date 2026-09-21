'use client'

import { MapPin, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Reveal } from '../reveal'
import { EditActions } from '../edit-controls'
import { FIELD_DEFS } from '../field-defs'
import { CurrentlyWidget } from '../currently-widget'
import { VisitorLocationWidget } from '../visitor-location-widget'
import { ActivityHeatmap } from '../activity-heatmap'
import { VisitorBadge } from '../visitor-badge'
import { SectionHeader, type SectionEditProps } from './section-header'
import type { CurrentlyData, PortfolioData, Profile } from '@/lib/types'

export function AboutSection({
  profile,
  currently,
  editMode,
  onSaved,
}: {
  profile: Profile | null
  currently: CurrentlyData
} & SectionEditProps) {
  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <SectionHeader eyebrow="Who I am" title="About Me" icon={Sparkles} />
        <AboutBlock profile={profile} editMode={editMode} onSaved={onSaved} />
        <div className="grid md:grid-cols-2 gap-6">
          <CurrentlyWidget currently={currently} editMode={editMode} onSaved={onSaved} />
          <VisitorLocationWidget />
        </div>
        <ActivityHeatmap />
        {editMode && <VisitorBadge detailed />}
      </div>
    </section>
  )
}

function AboutBlock({ profile, editMode, onSaved }: { profile: PortfolioData['profile']; editMode: boolean; onSaved: () => void }) {
  return (
    <Reveal>
      <Card className="glow-card relative">
        <CardContent className="p-6 sm:p-8">
          {editMode && profile && (
            <div className="absolute top-4 right-4 z-20">
              <EditActions entity="profile" id={profile.id} fields={FIELD_DEFS.profile} data={profile as unknown as Record<string, unknown>} onSaved={onSaved} compact />
            </div>
          )}
          <p className="text-base sm:text-lg leading-relaxed text-foreground/90">
            {profile?.about ||
              "I'm a final-year Computer Science undergraduate passionate about problem solving and building things that ship."}
          </p>
          {profile?.location && (
            <div className="flex items-center gap-2 mt-6 pt-6 border-t text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {profile.location}
            </div>
          )}
        </CardContent>
      </Card>
    </Reveal>
  )
}

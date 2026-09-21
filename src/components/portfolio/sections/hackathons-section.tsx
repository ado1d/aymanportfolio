'use client'

import { Calendar, Eye, ExternalLink, Sparkles, Trophy, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '../reveal'
import { AddButton, EditActions } from '../edit-controls'
import { FIELD_DEFS } from '../field-defs'
import { SectionHeader, type SectionEditProps } from './section-header'
import type { Hackathon } from '@/lib/types'

interface LightboxImage {
  url: string
  title?: string
  subtitle?: string
}

export function HackathonsSection({
  hackathons,
  editMode,
  onSaved,
  onOpenLightbox,
}: {
  hackathons: Hackathon[]
  onOpenLightbox: (imgs: LightboxImage[], i: number) => void
} & SectionEditProps) {
  return (
    <section className="py-24 px-4 sm:px-6 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <SectionHeader eyebrow="Building Under Pressure" title="Hackathons" icon={Trophy} subtitle="Where ideas meet deadlines — and I thrive" />
        {editMode && (
          <div className="flex justify-center mb-8">
            <AddButton entity="hackathon" label="Add Hackathon" fields={FIELD_DEFS.hackathon} onSaved={onSaved} />
          </div>
        )}
        <HackathonGrid hackathons={hackathons} editMode={editMode} onSaved={onSaved} onOpenLightbox={onOpenLightbox} />
      </div>
    </section>
  )
}

function HackathonGrid({ hackathons, editMode, onSaved, onOpenLightbox }: {
  hackathons: Hackathon[]
  editMode: boolean
  onSaved: () => void
  onOpenLightbox: (imgs: LightboxImage[], i: number) => void
}) {
  if (!hackathons.length) return <p className="text-center text-muted-foreground">No hackathons added yet.</p>
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {hackathons.map((h, i) => (
        <Reveal key={h.id} delay={(i % 2) * 100}>
          <HackathonCard hackathon={h} editMode={editMode} onSaved={onSaved} onOpenLightbox={onOpenLightbox} />
        </Reveal>
      ))}
    </div>
  )
}

function HackathonCard({ hackathon, editMode, onSaved, onOpenLightbox }: {
  hackathon: Hackathon
  editMode: boolean
  onSaved: () => void
  onOpenLightbox: (imgs: LightboxImage[], i: number) => void
}) {
  return (
    <div className="relative project-card h-full">
      {editMode && (
        <div className="absolute top-3 right-3 z-30">
          <EditActions entity="hackathon" id={hackathon.id} fields={FIELD_DEFS.hackathon} data={hackathon as unknown as Record<string, unknown>} onSaved={onSaved} compact />
        </div>
      )}
      <Card className="glow-card hover-lift group overflow-hidden h-full">
        {hackathon.imageUrl && (
          <div className="relative aspect-video overflow-hidden bg-muted">
            <img src={hackathon.imageUrl} alt={hackathon.title} width={640} height={360} className="project-img w-full h-full object-cover" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {hackathon.result && (
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur text-white text-xs font-semibold flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" /> {hackathon.result}
              </div>
            )}
          </div>
        )}
        <CardContent className="p-5">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{hackathon.title}</h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {hackathon.date}</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Team of {hackathon.teamSize}</span>
            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> {hackathon.organizer}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">{hackathon.description}</p>
          {hackathon.tags && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {hackathon.tags.split(',').map((t, i) => (
                <Badge key={i} variant="secondary" className="text-xs font-normal">{t.trim()}</Badge>
              ))}
            </div>
          )}
          <div className="flex gap-3 pt-3 border-t">
            {hackathon.imageUrl && (
              <button
                onClick={() => onOpenLightbox([{ url: hackathon.imageUrl!, title: hackathon.title, subtitle: hackathon.result || undefined }], 0)}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Eye className="w-4 h-4" /> View
              </button>
            )}
            {hackathon.projectUrl && (
              <a href={hackathon.projectUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ExternalLink className="w-4 h-4" /> Project
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

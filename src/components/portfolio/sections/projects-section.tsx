'use client'

import { Rocket } from 'lucide-react'
import { AddButton } from '../edit-controls'
import { FIELD_DEFS } from '../field-defs'
import { ProjectsShowcaseWithFilter } from '../projects-showcase'
import { SectionHeader, type SectionEditProps } from './section-header'
import type { Project } from '@/lib/types'

interface LightboxImage {
  url: string
  title?: string
  subtitle?: string
}

export function ProjectsSection({
  projects,
  editMode,
  onSaved,
  onOpenLightbox,
  onOpenDetail,
}: {
  projects: Project[]
  onOpenLightbox: (imgs: LightboxImage[], i: number) => void
  onOpenDetail: (p: Project) => void
} & SectionEditProps) {
  return (
    <section id="projects" className="py-24 px-4 sm:px-6 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <SectionHeader eyebrow="Things I've Built" title="Projects" icon={Rocket} subtitle="From competitive programming tools to full-stack apps" />
        {editMode && (
          <div className="flex justify-center mb-8">
            <AddButton entity="project" label="Add Project" fields={FIELD_DEFS.project} onSaved={onSaved} />
          </div>
        )}
        <ProjectsShowcaseWithFilter
          projects={projects}
          editMode={editMode}
          onSaved={onSaved}
          onOpenLightbox={onOpenLightbox}
          onOpenDetail={onOpenDetail}
        />
      </div>
    </section>
  )
}

'use client'

import { Code } from 'lucide-react'
import { AddButton } from '../edit-controls'
import { FIELD_DEFS } from '../field-defs'
import { SkillsWithTabs } from '../skills-with-tabs'
import { SectionHeader, type SectionEditProps } from './section-header'
import type { Skills } from '@/lib/types'

export function SkillsSection({ skills, editMode, onSaved }: { skills: Skills } & SectionEditProps) {
  return (
    <section id="skills" className="py-24 px-4 sm:px-6 bg-muted/20">
      <div className="max-w-5xl mx-auto">
        <SectionHeader eyebrow="Tech Stack" title="Skills & Tools" icon={Code} subtitle="Technologies I use to bring ideas to life" />
        {editMode && (
          <div className="flex justify-center mb-8">
            <AddButton entity="skill" label="Add Skill" fields={FIELD_DEFS.skill} onSaved={onSaved} />
          </div>
        )}
        <SkillsWithTabs skills={skills} editMode={editMode} onSaved={onSaved} />
      </div>
    </section>
  )
}

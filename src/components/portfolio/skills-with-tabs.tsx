'use client'

import { useState, useMemo } from 'react'
import { Reveal } from './reveal'
import { EditActions } from './edit-controls'
import { FIELD_DEFS } from './field-defs'
import type { Skills, SkillItem } from '@/lib/types'

interface SkillsWithTabsProps {
  skills: Skills
  editMode: boolean
  onSaved: () => void
}

export function SkillsWithTabs({ skills, editMode, onSaved }: SkillsWithTabsProps) {
  const categories = Object.keys(skills)
  const [active, setActive] = useState('All')

  const allCategories = useMemo(() => ['All', ...categories], [categories])

  const visibleCategories = active === 'All' ? categories : [active]

  if (!categories.length) {
    return <p className="text-center text-muted-foreground">No skills added yet.</p>
  }

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <Reveal className="flex flex-wrap justify-center gap-2">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              active === cat
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                : 'bg-card border text-muted-foreground hover:border-primary/40 hover:text-foreground'
            }`}
          >
            {cat}
            {cat !== 'All' && (
              <span className={`ml-1.5 text-xs ${active === cat ? 'opacity-80' : 'opacity-60'}`}>
                {skills[cat]?.length}
              </span>
            )}
          </button>
        ))}
      </Reveal>

      {/* Skill bars grouped by visible category */}
      <div className="space-y-8">
        {visibleCategories.map((cat, ci) => (
          <Reveal key={cat} delay={ci * 60}>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {cat}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills[cat]?.map((s, si) => (
                  <SkillBar key={si} skill={s} editMode={editMode} onSaved={onSaved} />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function SkillBar({ skill, editMode, onSaved }: { skill: SkillItem; editMode: boolean; onSaved: () => void }) {
  // Tooltip text based on proficiency level
  const levelLabel =
    skill.level >= 90 ? 'Expert' : skill.level >= 75 ? 'Advanced' : skill.level >= 60 ? 'Intermediate' : 'Familiar'

  return (
    <div className="relative group">
      {editMode && (
        <div className="absolute top-2 right-2 z-20">
          <EditActions entity="skill" id={skill.id} fields={FIELD_DEFS.skill} data={skill as unknown as Record<string, unknown>} onSaved={onSaved} compact />
        </div>
      )}
      <div
        className="skill-tooltip-wrap relative p-4 rounded-xl border bg-card hover:border-primary/40 transition-colors cursor-default"
        tabIndex={0}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm">{skill.name}</span>
          <span className="text-xs text-muted-foreground">{skill.level}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-pink-500 transition-all duration-1000 ease-out"
            style={{ width: `${skill.level}%` }}
          />
        </div>
        {/* Hover/focus tooltip */}
        <div className="skill-tooltip">
          {levelLabel} · {skill.level}%
        </div>
      </div>
    </div>
  )
}

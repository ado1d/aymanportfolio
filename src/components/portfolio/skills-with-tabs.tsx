'use client'

import { useState, useMemo } from 'react'
import { Reveal } from './reveal'
import { EditActions } from './edit-controls'
import { FIELD_DEFS } from './field-defs'
import type { Skills, SkillItem } from '@/lib/types'

// Map skill names to devicon icon names (colored SVGs via jsdelivr CDN)
const TECH_LOGOS: Record<string, string> = {
  'C++': 'cplusplus', 'Python': 'python', 'JavaScript': 'javascript', 'TypeScript': 'typescript',
  'Java': 'java', 'SQL': 'mysql',
  'React / Next.js': 'nextjs', 'Next.js': 'nextjs', 'React': 'react',
  'Node.js / Express': 'nodejs', 'Node.js': 'nodejs', 'Express': 'nodejs',
  'Tailwind CSS': 'tailwindcss', 'Prisma / PostgreSQL': 'postgresql', 'Prisma': 'prisma',
  'PostgreSQL': 'postgresql', 'Socket.io': 'socketio', 'Vue.js': 'vuejs',
  'Git & GitHub': 'git', 'Git': 'git', 'GitHub': 'github',
  'Docker': 'docker', 'Linux / Bash': 'linux', 'Linux': 'linux', 'Bash': 'bash', 'Figma': 'figma',
  'TensorFlow': 'tensorflow', 'scikit-learn': 'scikitlearn', 'PyTorch': 'pytorch',
}

function getLogoUrl(name: string): string | null {
  const slug = TECH_LOGOS[name]
  return slug ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg` : null
}

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

  if (!categories.length) return <p className="text-center text-muted-foreground">No skills added yet.</p>

  return (
    <div className="space-y-6">
      <Reveal className="flex flex-wrap justify-center gap-2">
        {allCategories.map((cat) => (
          <button key={cat} onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              active === cat ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105' : 'bg-card border text-muted-foreground hover:border-primary/40 hover:text-foreground'
            }`}>
            {cat}
            {cat !== 'All' && <span className={`ml-1.5 text-xs ${active === cat ? 'opacity-80' : 'opacity-60'}`}>{skills[cat]?.length}</span>}
          </button>
        ))}
      </Reveal>

      <div className="space-y-6">
        {visibleCategories.map((cat, ci) => (
          <Reveal key={cat} delay={ci * 60}>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {cat}
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills[cat]?.map((s, si) => (
                  <TechLogo key={si} skill={s} editMode={editMode} onSaved={onSaved} />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function TechLogo({ skill, editMode, onSaved }: { skill: SkillItem; editMode: boolean; onSaved: () => void }) {
  const [imgError, setImgError] = useState(false)
  const logoUrl = getLogoUrl(skill.name)

  return (
    <div className="relative group">
      {editMode && (
        <div className="absolute top-1 right-1 z-20">
          <EditActions entity="skill" id={skill.id} fields={FIELD_DEFS.skill} data={skill as unknown as Record<string, unknown>} onSaved={onSaved} compact />
        </div>
      )}
      <div className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-card hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 w-[100px]">
        <div className="w-10 h-10 flex items-center justify-center">
          {logoUrl && !imgError ? (
            <img src={logoUrl} alt={skill.name} className="w-8 h-8 object-contain" loading="lazy" onError={() => setImgError(true)} />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              {skill.name.charAt(0)}
            </div>
          )}
        </div>
        <span className="text-xs font-medium text-center leading-tight">{skill.name}</span>
      </div>
    </div>
  )
}

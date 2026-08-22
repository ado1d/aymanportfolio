'use client'

import { Reveal } from '../reveal'

/** Shared props that every editable section receives. */
export interface SectionEditProps {
  editMode: boolean
  onSaved: () => void
}

/** Shared section header (eyebrow badge + gradient title + underline). */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  icon?: React.ElementType
}) {
  return (
    <Reveal className="text-center mb-14">
      {eyebrow && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 uppercase tracking-wider">
          {Icon && <Icon className="w-3.5 h-3.5" />}
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold mb-3">
        <span className="gradient-text">{title}</span>
      </h2>
      <div className="section-line" />
      {subtitle && <p className="text-muted-foreground mt-4 max-w-xl mx-auto">{subtitle}</p>}
    </Reveal>
  )
}

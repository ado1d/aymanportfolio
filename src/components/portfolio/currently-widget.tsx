'use client'

import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Hammer, Lightbulb, Music, Plus } from 'lucide-react'
import { Reveal } from './reveal'
import { AddButton } from './edit-controls'
import { FIELD_DEFS } from './field-defs'
import type { CurrentlyData } from '@/lib/types'

interface CurrentlyWidgetProps {
  currently: CurrentlyData
  editMode: boolean
  onSaved: () => void
}

const TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  learning: { icon: Lightbulb, label: 'Learning', color: 'text-amber-500' },
  building: { icon: Hammer, label: 'Building', color: 'text-primary' },
  reading: { icon: BookOpen, label: 'Reading', color: 'text-cyan-500' },
  listening: { icon: Music, label: 'Listening', color: 'text-pink-500' },
}

export function CurrentlyWidget({ currently, editMode, onSaved }: CurrentlyWidgetProps) {
  const types = Object.keys(currently)
  if (!types.length && !editMode) return null

  return (
    <Reveal>
      <Card className="glow-card relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Currently
              </h3>
            </div>
            {editMode && (
              <AddButton entity="currentlyItem" label="Add" fields={FIELD_DEFS.currentlyItem} onSaved={onSaved} />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(TYPE_CONFIG).map(([type, config]) => {
              const items = currently[type]
              if (!items || !items.length) return null
              const Icon = config.icon
              return (
                <div key={type} className="space-y-2">
                  <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide ${config.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {config.label}
                  </div>
                  <ul className="space-y-1.5">
                    {items.map((item, i) => (
                      <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                        <span className="text-muted-foreground mt-0.5">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </Reveal>
  )
}

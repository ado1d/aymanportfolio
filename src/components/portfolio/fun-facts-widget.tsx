'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Shuffle, Plus, Trash2 } from 'lucide-react'
import { Reveal } from './reveal'
import { AddButton } from './edit-controls'
import { deleteEntity } from './use-edit-mode'
import { FIELD_DEFS } from './field-defs'
import { useToast } from '@/hooks/use-toast'
import type { FunFact } from '@/lib/types'

interface FunFactsWidgetProps {
  funFacts: FunFact[]
  editMode: boolean
  onSaved: () => void
}

export function FunFactsWidget({ funFacts, editMode, onSaved }: FunFactsWidgetProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (paused || funFacts.length <= 1) return
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % funFacts.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [paused, funFacts.length])

  // Reset index if out of bounds
  if (index >= funFacts.length) {
    if (funFacts.length > 0) setIndex(0)
  }

  const shuffle = () => {
    if (funFacts.length <= 1) return
    let next = index
    while (next === index) {
      next = Math.floor(Math.random() * funFacts.length)
    }
    setIndex(next)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteEntity('funFact', id)
      toast({ title: 'Fun fact deleted' })
      onSaved()
    } catch {
      toast({ title: 'Delete failed', variant: 'destructive' })
    }
  }

  if (!funFacts.length && !editMode) return null

  const fact = funFacts[index] || funFacts[0]

  return (
    <Reveal>
      <div
        className="glow-card hover-lift rounded-xl overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              Fun Fact
            </h3>
            <div className="flex items-center gap-1">
              {editMode && (
                <AddButton entity="funFact" label="Add" fields={FIELD_DEFS.funFact} onSaved={onSaved} />
              )}
              {funFacts.length > 1 && (
                <button
                  onClick={shuffle}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                  aria-label="Shuffle fun fact"
                  title="Show another fact"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {fact ? (
            <div key={fact.id} className="flex items-start gap-3 quote-fade group/fact">
              <span className="text-2xl flex-shrink-0">{fact.icon}</span>
              <p className="text-sm leading-relaxed text-foreground/90 flex-1">{fact.text}</p>
              {editMode && (
                <button
                  onClick={() => handleDelete(fact.id)}
                  className="opacity-0 group-hover/fact:opacity-100 p-0.5 rounded text-muted-foreground hover:text-destructive transition-all flex-shrink-0"
                  aria-label="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No fun facts yet.</p>
          )}

          {funFacts.length > 1 && (
            <div className="flex gap-1.5 mt-4">
              {funFacts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1 rounded-full transition-all ${
                    i === index ? 'w-6 bg-primary' : 'w-1 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to fact ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Reveal>
  )
}

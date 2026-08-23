'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { Reveal } from './reveal'
import { EditActions } from './edit-controls'
import { FIELD_DEFS } from './field-defs'
import { AddButton } from './edit-controls'
import type { Testimonial } from '@/lib/types'

interface TestimonialsProps {
  testimonials: Testimonial[]
  editMode: boolean
  onSaved: () => void
}

export function Testimonials({ testimonials, editMode, onSaved }: TestimonialsProps) {
  const [active, setActive] = useState(0)

  if (!testimonials.length) {
    return editMode ? (
      <div className="flex justify-center">
        <AddButton entity="testimonial" label="Add Testimonial" fields={FIELD_DEFS.testimonial} onSaved={onSaved} />
      </div>
    ) : (
      <p className="text-center text-muted-foreground">No testimonials yet.</p>
    )
  }

  const current = testimonials[active]
  const next = () => setActive((i) => (i + 1) % testimonials.length)
  const prev = () => setActive((i) => (i - 1 + testimonials.length) % testimonials.length)

  return (
    <div className="max-w-3xl mx-auto">
      {editMode && (
        <div className="flex justify-center mb-6">
          <AddButton entity="testimonial" label="Add Testimonial" fields={FIELD_DEFS.testimonial} onSaved={onSaved} />
        </div>
      )}

      <Reveal>
        <div className="relative">
          {editMode && (
            <div className="absolute top-4 right-4 z-20">
              <EditActions entity="testimonial" id={current.id} fields={FIELD_DEFS.testimonial} data={current as unknown as Record<string, unknown>} onSaved={onSaved} compact />
            </div>
          )}

          {/* Big quote mark decoration */}
          <div className="absolute -top-4 left-6 text-7xl text-primary/10 font-serif leading-none select-none pointer-events-none">
            &ldquo;
          </div>

          <Card className="glow-card hover-lift relative overflow-hidden">
            <CardContent className="p-8 sm:p-10">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < current.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                  />
                ))}
              </div>

              <blockquote className="text-lg sm:text-xl leading-relaxed text-foreground/90 mb-6 relative z-10">
                {current.quote}
              </blockquote>

              <div className="flex items-center gap-4 pt-4 border-t">
                {current.avatarUrl ? (
                  <img
                    src={current.avatarUrl}
                    alt={current.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-cyan-500 flex items-center justify-center text-white font-bold text-lg ring-2 ring-primary/20">
                    {current.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{current.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {current.role}
                    {current.company && <span> · {current.company}</span>}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carousel controls */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 sm:-translate-x-4 w-10 h-10 rounded-full bg-card border shadow-lg flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 sm:translate-x-4 w-10 h-10 rounded-full bg-card border shadow-lg flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === active ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </Reveal>
    </div>
  )
}

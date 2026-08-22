'use client'

import { GraduationCap, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '../reveal'
import { AddButton, EditActions } from '../edit-controls'
import { FIELD_DEFS } from '../field-defs'
import { SectionHeader, type SectionEditProps } from './section-header'
import type { Education } from '@/lib/types'

export function EducationSection({ education, editMode, onSaved }: { education: Education[] } & SectionEditProps) {
  return (
    <section id="education" className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader eyebrow="Academic Journey" title="Education" icon={GraduationCap} subtitle="Where I built my foundations" />
        {editMode && (
          <div className="flex justify-center mb-8">
            <AddButton entity="education" label="Add Education" fields={FIELD_DEFS.education} onSaved={onSaved} />
          </div>
        )}
        <EducationTimeline education={education} editMode={editMode} onSaved={onSaved} />
      </div>
    </section>
  )
}

function EducationTimeline({ education, editMode, onSaved }: { education: Education[]; editMode: boolean; onSaved: () => void }) {
  if (!education.length) return <p className="text-center text-muted-foreground">No education added yet.</p>
  return (
    <div className="relative">
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 timeline-line md:-translate-x-1/2" />
      <div className="space-y-8">
        {education.map((edu, index) => (
          <Reveal key={edu.id} delay={index * 80}>
            <div className={`relative flex items-start gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full ring-4 ring-background transform -translate-x-1/2 mt-6 z-10">
                <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
              </div>
              <div className={`flex-1 ml-12 md:ml-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                <div className="relative">
                  {editMode && (
                    <div className="absolute -top-2 -right-2 z-20">
                      <EditActions entity="education" id={edu.id} fields={FIELD_DEFS.education} data={edu as unknown as Record<string, unknown>} onSaved={onSaved} compact />
                    </div>
                  )}
                  <Card className="glow-card hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <Badge variant="outline" className="text-xs">{edu.period}</Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{edu.institution}</h3>
                      <p className="text-sm text-primary font-medium mb-2">{edu.degree}</p>
                      {edu.gpa && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium mb-3">
                          <Star className="w-3 h-3" /> GPA: {edu.gpa}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{edu.description}</p>
                      {edu.courses && (
                        <div className="pt-3 border-t">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Relevant Courses</p>
                          <div className="flex flex-wrap gap-1.5">
                            {edu.courses.split(',').map((c, i) => (
                              <Badge key={i} variant="secondary" className="text-xs font-normal">{c.trim()}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

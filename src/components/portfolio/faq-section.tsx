'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, HelpCircle, Search, X } from 'lucide-react'
import { Reveal } from './reveal'
import { EditActions } from './edit-controls'
import { AddButton } from './edit-controls'
import { FIELD_DEFS } from './field-defs'
import type { Faq } from '@/lib/types'

interface FaqSectionProps {
  faqs: Faq[]
  editMode: boolean
  onSaved: () => void
}

export function FaqSection({ faqs, editMode, onSaved }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...Array.from(new Set(faqs.map((f) => f.category)))]

  const filtered = faqs.filter((f) => {
    const q = search.trim().toLowerCase()
    const matchCat = activeCategory === 'All' || f.category === activeCategory
    const matchSearch =
      !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  return (
    <div>
      {editMode && (
        <div className="flex justify-center mb-6">
          <AddButton entity="faq" label="Add FAQ" fields={FIELD_DEFS.faq} onSaved={onSaved} />
        </div>
      )}

      {/* Search + category filter */}
      {faqs.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <label htmlFor="faq-search" className="sr-only">Search FAQs</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              id="faq-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              aria-label="Search FAQs"
              className="w-full h-10 pl-9 pr-8 rounded-md border bg-card text-sm outline-none focus:border-primary transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {categories.length > 1 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <HelpCircle className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground text-sm">
            {faqs.length === 0 ? 'No FAQs yet.' : 'No questions match your search.'}
          </p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-3">
          {filtered.map((faq, i) => {
            const isOpen = openId === faq.id
            return (
              <Reveal key={faq.id} delay={i * 50}>
                <div className="relative">
                  {editMode && (
                    <div className="absolute top-3 right-3 z-20">
                      <EditActions entity="faq" id={faq.id} fields={FIELD_DEFS.faq} data={faq as unknown as Record<string, unknown>} onSaved={onSaved} compact />
                    </div>
                  )}
                  <Card className={`glow-card overflow-hidden transition-all ${isOpen ? 'ring-1 ring-primary/30' : ''}`}>
                    <button
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4"
                      aria-expanded={isOpen}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-[10px] font-normal uppercase tracking-wide">
                            {faq.category}
                          </Badge>
                        </div>
                        <h3 className={`font-semibold text-sm sm:text-base ${editMode ? 'pr-16' : ''}`}>{faq.question}</h3>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}
                      />
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-300 ease-out"
                      style={{ maxHeight: isOpen ? '500px' : '0px' }}
                    >
                      <CardContent className="px-5 pb-5 pt-0">
                        <div className="pt-3 border-t">
                          <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </div>
              </Reveal>
            )
          })}
        </div>
      )}
    </div>
  )
}

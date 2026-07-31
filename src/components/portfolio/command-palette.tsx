'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Search, CornerDownLeft, ArrowUp, ArrowDown, Moon, Sun } from 'lucide-react'
import { getSocialIcon } from './icons'
import type { SocialLink } from '@/lib/types'

interface CommandItem {
  id: string
  label: string
  hint?: string
  group: string
  icon?: React.ReactNode
  action: () => void
  keywords?: string
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (o: boolean) => void
  sections: { label: string; id: string }[]
  socialLinks: SocialLink[]
  onToggleTheme: () => void
  isDark: boolean
}

export function CommandPalette({
  open,
  onOpenChange,
  sections,
  socialLinks,
  onToggleTheme,
  isDark,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const items: CommandItem[] = useMemo(() => {
    const nav: CommandItem[] = sections.map((s) => ({
      id: `nav-${s.id}`,
      label: `Go to ${s.label}`,
      hint: s.id,
      group: 'Navigation',
      action: () => {
        document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })
        onOpenChange(false)
      },
      keywords: s.label.toLowerCase(),
    }))

    const theme: CommandItem[] = [
      {
        id: 'theme-toggle',
        label: isDark ? 'Switch to light mode' : 'Switch to dark mode',
        group: 'Theme',
        icon: isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
        action: () => {
          onToggleTheme()
          onOpenChange(false)
        },
        keywords: 'theme dark light mode toggle',
      },
    ]

    const social: CommandItem[] = socialLinks.map((s) => ({
      id: `social-${s.id}`,
      label: `Open ${s.platform}`,
      hint: 'external',
      group: 'Social',
      icon: getSocialIcon(s.platform, 'w-4 h-4'),
      action: () => {
        window.open(s.url, '_blank', 'noopener,noreferrer')
        onOpenChange(false)
      },
      keywords: s.platform.toLowerCase(),
    }))

    const actions: CommandItem[] = [
      {
        id: 'top',
        label: 'Scroll to top',
        group: 'Actions',
        action: () => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
          onOpenChange(false)
        },
        keywords: 'top home start',
      },
      {
        id: 'print',
        label: 'Print / Save as PDF',
        group: 'Actions',
        action: () => {
          window.print()
          onOpenChange(false)
        },
        keywords: 'print pdf save resume',
      },
    ]

    return [...nav, ...theme, ...social, ...actions]
  }, [sections, socialLinks, isDark, onToggleTheme, onOpenChange])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((it) => {
      const hay = `${it.label} ${it.hint || ''} ${it.group} ${it.keywords || ''}`.toLowerCase()
      return q.split(/\s+/).every((tok) => hay.includes(tok))
    })
  }, [items, query])

  // Reset active index when the query changes (adjust during render — avoids setState-in-effect).
  const [prevQuery, setPrevQuery] = useState(query)
  if (query !== prevQuery) {
    setPrevQuery(query)
    setActiveIndex(0)
  }

  // Clear the query when the palette opens (adjust during render).
  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) setQuery('')
  }

  // focus input on open (this effect only touches the DOM, not state)
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [open])

  const runActive = () => {
    const it = filtered[activeIndex]
    if (it) it.action()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % Math.max(1, filtered.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + filtered.length) % Math.max(1, filtered.length))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      runActive()
    } else if (e.key === 'Escape') {
      onOpenChange(false)
    }
  }

  // group filtered items
  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>()
    filtered.forEach((it, idx) => {
      if (!map.has(it.group)) map.set(it.group, [])
      map.get(it.group)!.push({ ...it, _idx: idx } as CommandItem & { _idx: number })
    })
    return Array.from(map.entries())
  }, [filtered])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden top-[20%] translate-y-0">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <div className="flex items-center gap-3 px-4 border-b">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search sections, theme, links, actions..."
            className="flex-1 h-14 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            grouped.map(([group, gItems]) => (
              <div key={group} className="mb-2">
                <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group}
                </div>
                {gItems.map((it) => {
                  const idx = (it as CommandItem & { _idx: number })._idx
                  const active = idx === activeIndex
                  return (
                    <button
                      key={it.id}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={runActive}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                        active ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                      }`}
                    >
                      <span className="w-4 h-4 flex items-center justify-center text-muted-foreground">
                        {it.icon}
                      </span>
                      <span className="flex-1 truncate">{it.label}</span>
                      {it.hint && it.hint !== 'external' && (
                        <span className="text-xs text-muted-foreground">#{it.hint}</span>
                      )}
                      {it.hint === 'external' && (
                        <span className="text-[10px] text-muted-foreground">↗</span>
                      )}
                      {active && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-primary opacity-70" />
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/30 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              <ArrowDown className="w-3 h-3" /> navigate
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" /> select
            </span>
          </div>
          <span>{filtered.length} results</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

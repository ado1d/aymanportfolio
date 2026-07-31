'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Keyboard } from 'lucide-react'

interface ShortcutItem {
  keys: string[]
  description: string
  group: string
}

const SHORTCUTS: ShortcutItem[] = [
  { keys: ['⌘', 'K'], description: 'Open command palette', group: 'Global' },
  { keys: ['?'], description: 'Show this keyboard shortcuts help', group: 'Global' },
  { keys: ['Esc'], description: 'Close dialog / overlay', group: 'Global' },
  { keys: ['↑', '↓'], description: 'Navigate items in palette', group: 'Global' },
  { keys: ['↵'], description: 'Select focused item', group: 'Global' },
  { keys: ['/'], description: 'Focus project search', group: 'Navigation' },
  { keys: ['G', 'H'], description: 'Go to Home / Hero', group: 'Navigation' },
  { keys: ['G', 'A'], description: 'Go to About', group: 'Navigation' },
  { keys: ['G', 'S'], description: 'Go to Skills', group: 'Navigation' },
  { keys: ['G', 'P'], description: 'Go to Projects', group: 'Navigation' },
  { keys: ['G', 'C'], description: 'Go to Contact', group: 'Navigation' },
  { keys: ['T'], description: 'Toggle dark / light theme', group: 'Theme' },
  { keys: ['←', '→'], description: 'Prev / Next testimonial (when in section)', group: 'Gallery' },
]

interface ShortcutHelpProps {
  open: boolean
  onOpenChange: (o: boolean) => void
}

export function ShortcutHelp({ open, onOpenChange }: ShortcutHelpProps) {
  const groups = Array.from(new Set(SHORTCUTS.map((s) => s.group)))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Keyboard shortcuts</DialogTitle>
        <div className="flex items-center gap-2 px-5 py-4 border-b">
          <Keyboard className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Keyboard Shortcuts</h2>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {groups.map((group) => (
            <div key={group} className="mb-3">
              <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group}
              </div>
              {SHORTCUTS.filter((s) => s.group === group).map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm text-foreground/80">{s.description}</span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((k, j) => (
                      <kbd
                        key={j}
                        className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded border bg-muted text-[11px] font-mono font-semibold"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t bg-muted/30 text-[11px] text-muted-foreground">
          Tip: press <kbd className="px-1 py-0.5 rounded border bg-background font-mono">?</kbd> anytime to reopen this.
        </div>
      </DialogContent>
    </Dialog>
  )
}

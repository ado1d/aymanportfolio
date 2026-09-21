'use client'

import { useEffect, useState } from 'react'
import { Command, Inbox, Menu, Pencil, ShieldCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const NAV_ITEMS = [
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Education', id: 'education' },
  { label: 'Hackathons', id: 'hackathons' },
  { label: 'Contests', id: 'contests' },
  { label: 'Projects', id: 'projects' },
  { label: 'Certificates', id: 'certificates' },
  { label: 'Testimonials', id: 'testimonials' },
  { label: 'FAQ', id: 'faq' },
  { label: 'Contact', id: 'contact' },
]

export const NAV_LINKS = [
  ...NAV_ITEMS.map((item) => ({ ...item, external: false })),
  { label: 'Lifestyle', id: 'lifestyle', external: true },
]

interface SiteNavProps {
  firstName: string
  editMode: boolean
  authed: boolean
  onToggleEditMode: () => void
  onOpenCommandPalette: () => void
  onOpenInbox: () => void
}

/**
 * SiteNav — the top navigation bar.
 *
 * Theme is forced to dark mode globally; the previous light/dark switch and
 * the sound-effects toggle have been removed.
 *
 * Perf: `activeSection` state lives HERE instead of the page, so scroll
 * highlighting only re-renders this small bar. Section tracking uses a single
 * IntersectionObserver (no scroll handler, no forced layout reads).
 */
export function SiteNav({
  firstName,
  editMode,
  authed,
  onToggleEditMode,
  onOpenCommandPalette,
  onOpenInbox,
}: SiteNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    // Track which section is in view with one IntersectionObserver.
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[]
    if (!sections.length) return

    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <a href="#home" className="flex items-center gap-2">
            <span
              className="inline-block gradient-text"
              style={{
                fontFamily: '"Brush Script MT", "Segoe Script", cursive',
                fontSize: '2.2rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                transform: 'rotate(-2deg)',
                textShadow: '0 1px 2px rgba(0,0,0,0.15)',
              }}
            >
              {firstName}
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((item) => (
              <a
                key={item.id}
                href={item.external ? `/${item.id}` : `#${item.id}`}
                className={`nav-underline px-3 py-1.5 rounded-md text-sm font-medium ${
                  !item.external && activeSection === item.id
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/70'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCommandPalette}
              className="hidden md:flex items-center gap-2 h-9 px-3 rounded-md border bg-card text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              aria-label="Open command palette"
              title="Search (Cmd+K)"
            >
              <Command className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Search</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">
                ⌘K
              </kbd>
            </button>
            <Button
              variant={editMode ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleEditMode}
              className="hidden sm:inline-flex"
            >
              {editMode ? (
                <>
                  <Pencil className="w-3.5 h-3.5 mr-1.5" /> Editing
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Edit
                </>
              )}
            </Button>
            {authed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenInbox}
                className="hidden sm:inline-flex relative"
                title="Message inbox"
              >
                <Inbox className="w-4 h-4" />
              </Button>
            )}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            {NAV_LINKS.map((item) => (
              <a
                key={item.id}
                href={item.external ? `/${item.id}` : `#${item.id}`}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                  !item.external && activeSection === item.id ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center gap-3 px-3 mt-3">
              <Button variant="outline" size="sm" onClick={onToggleEditMode} className="flex-1">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Edit Mode
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

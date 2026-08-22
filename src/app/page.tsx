'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useEditMode } from '@/components/portfolio/use-edit-mode'
import { LoginDialog } from '@/components/portfolio/login-dialog'
import { ImageLightbox } from '@/components/portfolio/image-lightbox'
import { CommandPalette } from '@/components/portfolio/command-palette'
import { PortfolioSkeleton } from '@/components/portfolio/portfolio-skeleton'
import { AdminInbox } from '@/components/portfolio/admin-inbox'
import { ShortcutHelp } from '@/components/portfolio/shortcut-help'
import { ProjectDetailModal } from '@/components/portfolio/project-detail-modal'
import { ReadingProgress } from '@/components/portfolio/reading-progress'
import { ScrollProgressButton } from '@/components/portfolio/scroll-progress-button'
import { KonamiEasterEgg } from '@/components/portfolio/konami-easter-egg'
import { SoundProvider } from '@/components/portfolio/sound-provider'
import { CursorFollower } from '@/components/portfolio/cursor-follower'
import { AuroraBackground } from '@/components/portfolio/aurora-background'
import { JsonLd } from '@/components/portfolio/json-ld'
import { SectionDivider } from '@/components/portfolio/section-divider'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { SiteNav, NAV_ITEMS } from '@/components/portfolio/site-nav'
import { HeroSection } from '@/components/portfolio/sections/hero-section'
import { StatsSection } from '@/components/portfolio/sections/stats-section'
import { LazySection } from '@/components/portfolio/sections/lazy-section'
import type { PortfolioData, Project } from '@/lib/types'

/* ------------------------------------------------------------------ */
/*  Below-the-fold sections are code-split AND only mounted when they  */
/*  scroll near the viewport. This keeps the initial payload tiny —    */
/*  the main reason the old version felt heavy on phones.              */
/* ------------------------------------------------------------------ */
const AboutSection = dynamic(() =>
  import('@/components/portfolio/sections/about-section').then((m) => m.AboutSection))
const SkillsSection = dynamic(() =>
  import('@/components/portfolio/sections/skills-section').then((m) => m.SkillsSection))
const EducationSection = dynamic(() =>
  import('@/components/portfolio/sections/education-section').then((m) => m.EducationSection))
const HackathonsSection = dynamic(() =>
  import('@/components/portfolio/sections/hackathons-section').then((m) => m.HackathonsSection))
const ContestsSection = dynamic(() =>
  import('@/components/portfolio/sections/contests-section').then((m) => m.ContestsSection))
const ProjectsSection = dynamic(() =>
  import('@/components/portfolio/sections/projects-section').then((m) => m.ProjectsSection))
const CertificatesSection = dynamic(() =>
  import('@/components/portfolio/sections/certificates-section').then((m) => m.CertificatesSection))
const AchievementsSection = dynamic(() =>
  import('@/components/portfolio/sections/achievements-section').then((m) => m.AchievementsSection))
const LifestyleCta = dynamic(() =>
  import('@/components/portfolio/sections/lifestyle-cta').then((m) => m.LifestyleCta))
const TestimonialsSection = dynamic(() =>
  import('@/components/portfolio/sections/contact-faq-testimonials').then((m) => m.TestimonialsSection))
const FaqSectionBlock = dynamic(() =>
  import('@/components/portfolio/sections/contact-faq-testimonials').then((m) => m.FaqSectionBlock))
const ContactSection = dynamic(() =>
  import('@/components/portfolio/sections/contact-faq-testimonials').then((m) => m.ContactSection))

interface LightboxState {
  images: { url: string; title?: string; subtitle?: string }[]
  index: number
}

export default function Home() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [inboxOpen, setInboxOpen] = useState(false)
  const [shortcutHelpOpen, setShortcutHelpOpen] = useState(false)
  const [detailProject, setDetailProject] = useState<Project | null>(null)
  const [isDark, setIsDark] = useState(false)

  const sound = useSoundEffects()
  const edit = useEditMode()

  // theme init
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = saved === 'dark' || (!saved && prefersDark)
    setIsDark(dark)
    if (dark) document.documentElement.classList.add('dark')
  }, [])

  // Cmd+K / Ctrl+K to open command palette + other keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in an input/textarea (except Esc)
      const target = e.target as HTMLElement
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdOpen((o) => !o)
        return
      }

      // "?" opens shortcut help (Shift+/) — but not while typing
      if (e.shiftKey && e.key === '?' && !isTyping) {
        e.preventDefault()
        setShortcutHelpOpen((o) => !o)
        return
      }

      if (isTyping) return

      // "/" focuses project search
      if (e.key === '/') {
        const search = document.getElementById('project-search') as HTMLInputElement | null
        if (search) {
          e.preventDefault()
          search.scrollIntoView({ behavior: 'smooth', block: 'center' })
          setTimeout(() => search.focus(), 400)
        }
        return
      }

      // "t" toggles theme (read current state from DOM to avoid stale closure)
      if (e.key.toLowerCase() === 't' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        const isCurrentlyDark = document.documentElement.classList.contains('dark')
        if (isCurrentlyDark) {
          document.documentElement.classList.remove('dark')
          localStorage.setItem('theme', 'light')
          setIsDark(false)
        } else {
          document.documentElement.classList.add('dark')
          localStorage.setItem('theme', 'dark')
          setIsDark(true)
        }
        return
      }

      // "g" + letter = go to section
      if (e.key.toLowerCase() === 'g' && !e.metaKey && !e.ctrlKey) {
        const handler = (ev: KeyboardEvent) => {
          const map: Record<string, string> = {
            h: 'home',
            a: 'about',
            s: 'skills',
            e: 'education',
            p: 'projects',
            c: 'contact',
            t: 'testimonials',
          }
          const id = map[ev.key.toLowerCase()]
          if (id) {
            ev.preventDefault()
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
          }
          window.removeEventListener('keydown', handler)
        }
        window.addEventListener('keydown', handler, { once: true })
        return
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio')
      const json = await res.json()
      setData(json)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/portfolio')
        const json = await res.json()
        if (!cancelled) setData(json)
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Stable callbacks for lightbox / project detail (declared BEFORE the
  // loading early-return so the hook order never changes between renders).
  const openLightbox = useCallback((imgs: { url: string; title?: string; subtitle?: string }[], i: number) => {
    setLightbox({ images: imgs, index: i })
  }, [])
  const openDetail = useCallback((p: Project) => setDetailProject(p), [])

  if (loading) {
    return <PortfolioSkeleton />
  }

  const profile = data?.profile
  const skills = data?.skills || {}
  const education = data?.education || []
  const hackathons = data?.hackathons || []
  const contests = data?.contests || []
  const certificates = data?.certificates || []
  const achievements = data?.achievements || []
  const projects = data?.projects || []
  const socialLinks = data?.socialLinks || []
  const testimonials = data?.testimonials || []
  const currently = data?.currently || {}
  const faqs = data?.faqs || []
  const funFacts = data?.funFacts || []

  const displayName = profile?.name || 'Ayman'
  const displayEmail = profile?.email || 'aaymanchowdhury@gmail.com'
  const displayLocation = profile?.location || 'Dhaka, Bangladesh'
  const firstName = displayName.split(' ')[0]

  const editProps = { editMode: edit.editMode, onSaved: refresh }

  return (
    <SoundProvider>
      <KonamiEasterEgg>
        <AuroraBackground />
        <div className="relative z-10 min-h-screen flex flex-col bg-transparent">
          <JsonLd profile={profile} projects={projects} socialLinks={socialLinks} />
          <ReadingProgress />

          {/* Navigation */}
          <SiteNav
            firstName={firstName}
            isDark={isDark}
            onToggleTheme={toggleTheme}
            editMode={edit.editMode}
            authed={edit.authed}
            onToggleEditMode={edit.toggleEditMode}
            onOpenCommandPalette={() => setCmdOpen(true)}
            onOpenInbox={() => setInboxOpen(true)}
            soundEnabled={sound.enabled}
            onToggleSound={sound.toggle}
          />

          <main className="flex-1 relative z-10 pt-16">
            {/* ============ HERO (renders immediately) ============ */}
            <HeroSection
              profile={profile}
              socialLinks={socialLinks}
              displayName={displayName}
              firstName={firstName}
            />

            {/* ============ STATS STRIP ============ */}
            <StatsSection
              hackathons={hackathons.length}
              contests={contests.length}
              projects={projects.length}
              certificates={certificates.length}
            />

            <SectionDivider />

            {/* ============ Below-the-fold sections: lazy mounted + code-split ============ */}
            <LazySection minHeight={900}>
              <AboutSection profile={profile} currently={currently} funFacts={funFacts} {...editProps} />
            </LazySection>

            <LazySection minHeight={800}>
              <SkillsSection skills={skills} {...editProps} />
            </LazySection>

            <LazySection minHeight={700}>
              <EducationSection education={education} {...editProps} />
            </LazySection>

            <LazySection minHeight={900}>
              <HackathonsSection hackathons={hackathons} onOpenLightbox={openLightbox} {...editProps} />
            </LazySection>

            <LazySection minHeight={1100}>
              <ContestsSection contests={contests} {...editProps} />
            </LazySection>

            <LazySection minHeight={1000}>
              <ProjectsSection projects={projects} onOpenLightbox={openLightbox} onOpenDetail={openDetail} {...editProps} />
            </LazySection>

            <LazySection minHeight={800}>
              <CertificatesSection certificates={certificates} onOpenLightbox={openLightbox} {...editProps} />
            </LazySection>

            <LazySection minHeight={600}>
              <AchievementsSection achievements={achievements} {...editProps} />
            </LazySection>

            <SectionDivider flip />

            <LazySection minHeight={500}>
              <TestimonialsSection testimonials={testimonials} {...editProps} />
            </LazySection>

            <LazySection minHeight={400}>
              <LifestyleCta />
            </LazySection>

            <LazySection minHeight={700}>
              <FaqSectionBlock faqs={faqs} {...editProps} />
            </LazySection>

            <LazySection minHeight={600}>
              <ContactSection email={displayEmail} location={displayLocation} socialLinks={socialLinks} {...editProps} />
            </LazySection>
          </main>

          {/* Footer (sticky) */}
          <footer className="border-t relative z-10 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 py-6 text-center">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} {firstName} · Crafted with{' '}
                <span className="text-red-500">♥</span> & Next.js
              </p>
            </div>
          </footer>

          {/* Scroll progress ring / back-to-top */}
          <ScrollProgressButton />

          {/* Custom cursor follower (desktop only) */}
          <CursorFollower />

          {/* Login + Lightbox + Command Palette */}
          <LoginDialog open={edit.showLogin} onOpenChange={edit.setShowLogin} onLogin={edit.login} />
          {lightbox && (
            <ImageLightbox
              images={lightbox.images}
              open={!!lightbox}
              startIndex={lightbox.index}
              onClose={() => setLightbox(null)}
            />
          )}
          <CommandPalette
            open={cmdOpen}
            onOpenChange={setCmdOpen}
            sections={NAV_ITEMS}
            socialLinks={socialLinks}
            onToggleTheme={toggleTheme}
            isDark={isDark}
          />
          <AdminInbox open={inboxOpen} onOpenChange={setInboxOpen} authed={edit.authed} />
          <ShortcutHelp open={shortcutHelpOpen} onOpenChange={setShortcutHelpOpen} />
          <ProjectDetailModal
            project={detailProject}
            open={!!detailProject}
            onOpenChange={(o) => !o && setDetailProject(null)}
            onOpenLightbox={(url) => {
              setLightbox({ images: [{ url, title: detailProject?.title, subtitle: detailProject?.description }], index: 0 })
              setDetailProject(null)
            }}
          />
        </div>
      </KonamiEasterEgg>
    </SoundProvider>
  )
}

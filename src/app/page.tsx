'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Github,
  Mail,
  ExternalLink,
  Trophy,
  Code,
  Star,
  Menu,
  X,
  Moon,
  Sun,
  ArrowRight,
  Send,
  MapPin,
  GraduationCap,
  Award,
  Calendar,
  Users,
  Sparkles,
  Pencil,
  Eye,
  ShieldCheck,
  ChevronUp,
  Zap,
  Target,
  Medal,
  Rocket,
  FileText,
  CheckCircle2,
  Command,
} from 'lucide-react'
import { getSocialIcon, getPlatformIcon } from '@/components/portfolio/icons'
import { useScrollReveal, useCountUp } from '@/hooks/use-scroll-reveal'
import { Reveal } from '@/components/portfolio/reveal'
import { ImageLightbox } from '@/components/portfolio/image-lightbox'
import { useEditMode } from '@/components/portfolio/use-edit-mode'
import { LoginDialog } from '@/components/portfolio/login-dialog'
import { AddButton, EditActions } from '@/components/portfolio/edit-controls'
import { FIELD_DEFS } from '@/components/portfolio/field-defs'
import { ContactForm } from '@/components/portfolio/contact-form'
import { ReadingProgress } from '@/components/portfolio/reading-progress'
import { CommandPalette } from '@/components/portfolio/command-palette'
import { PortfolioSkeleton } from '@/components/portfolio/portfolio-skeleton'
import { ProjectsShowcaseWithFilter } from '@/components/portfolio/projects-showcase'
import { JsonLd } from '@/components/portfolio/json-ld'
import type {
  PortfolioData,
  Project,
  Certificate,
  Hackathon,
  Contest,
  Education,
  Achievement,
  SocialLink,
} from '@/lib/types'

const NAV_ITEMS = [
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Education', id: 'education' },
  { label: 'Hackathons', id: 'hackathons' },
  { label: 'Contests', id: 'contests' },
  { label: 'Projects', id: 'projects' },
  { label: 'Certificates', id: 'certificates' },
  { label: 'Contact', id: 'contact' },
]

interface LightboxState {
  images: { url: string; title?: string; subtitle?: string }[]
  index: number
}

function FloatingParticles() {
  return (
    <div className="particles" aria-hidden>
      {[...Array(18)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 15}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  )
}

function SectionHeader({
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

function StatCard({ icon: Icon, value, label, suffix, delay = 0 }: { icon: React.ElementType; value: number; label: string; suffix?: string; delay?: number }) {
  const { ref, visible } = useScrollReveal()
  // Count up on mount (robust regardless of scroll position); the card reveal still respects scroll.
  const count = useCountUp(value, true, 1600)
  return (
    <div
      ref={ref}
      className="glow-card hover-lift p-5 text-center reveal"
      style={visible ? { transitionDelay: `${delay}ms`, opacity: 1, transform: 'translateY(0)' } : { transitionDelay: `${delay}ms` }}
    >
      <div className="inline-flex p-2.5 rounded-xl bg-primary/10 text-primary mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-3xl font-bold gradient-text-static">
        {count}
        {suffix}
      </div>
      <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">{label}</div>
    </div>
  )
}

export default function Home() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showTop, setShowTop] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)
  const [cmdOpen, setCmdOpen] = useState(false)

  const [isDark, setIsDark] = useState(false)
  const edit = useEditMode()

  // theme init
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = saved === 'dark' || (!saved && prefersDark)
    setIsDark(dark)
    if (dark) document.documentElement.classList.add('dark')
  }, [])

  // Cmd+K / Ctrl+K to open command palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdOpen((o) => !o)
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

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY })
    const onScroll = () => {
      setShowTop(window.scrollY > 600)
      const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[]
      const scrollY = window.scrollY + 120
      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollY >= sections[i].offsetTop) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

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

  const displayName = profile?.name || 'Ayman'
  const displayTitle = profile?.title || 'Computer Science Student'
  const displayEmail = profile?.email || 'ayman.dev@gmail.com'
  const displayLocation = profile?.location || 'Dhaka, Bangladesh'
  const firstName = displayName.split(' ')[0]

  const featuredProjects = projects.filter((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <JsonLd profile={profile} projects={projects} socialLinks={socialLinks} />
      <ReadingProgress />

      {/* Background Effects */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div className="aurora" />
      <FloatingParticles />
      <div className="mouse-light" style={{ left: mousePosition.x, top: mousePosition.y }} />
      <div className="mouse-light-secondary" style={{ left: mousePosition.x, top: mousePosition.y }} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <a href="#home" className="text-xl font-bold gradient-text flex items-center gap-2">
              <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm">
                {firstName[0]}
              </span>
              {firstName}
            </a>

            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`nav-underline px-3 py-1.5 rounded-md text-sm transition-colors ${
                    activeSection === item.id
                      ? 'text-primary bg-primary/10 font-medium'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCmdOpen(true)}
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
              <div className="hidden sm:flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-muted-foreground" />
                <Switch
                  checked={isDark}
                  onCheckedChange={toggleTheme}
                  aria-label="Toggle dark mode"
                />
                <Moon className="w-4 h-4 text-muted-foreground" />
              </div>
              <Button
                variant={edit.editMode ? 'default' : 'outline'}
                size="sm"
                onClick={edit.toggleEditMode}
                className="hidden sm:inline-flex"
              >
                {edit.editMode ? (
                  <>
                    <Pencil className="w-3.5 h-3.5 mr-1.5" /> Editing
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Edit
                  </>
                )}
              </Button>
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
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                    activeSection === item.id ? 'text-primary bg-primary/10' : 'text-muted-foreground'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="flex items-center gap-3 px-3 mt-3">
                <div className="flex items-center gap-1.5">
                  <Sun className="w-4 h-4" />
                  <Switch
                    checked={isDark}
                    onCheckedChange={toggleTheme}
                    aria-label="Toggle dark mode"
                  />
                  <Moon className="w-4 h-4" />
                </div>
                <Button variant="outline" size="sm" onClick={edit.toggleEditMode} className="flex-1">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Edit Mode
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 relative z-10 pt-16">
        {/* ============ HERO ============ */}
        <section id="home" className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 pt-8">
          <div className="text-center max-w-4xl">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-pink-500 to-cyan-500 blur-2xl opacity-40 animate-pulse" />
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={displayName}
                    className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-4 ring-background shadow-2xl"
                  />
                ) : (
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-primary via-pink-500 to-cyan-500 flex items-center justify-center text-5xl font-bold text-white ring-4 ring-background shadow-2xl">
                    {firstName[0]}
                  </div>
                )}
                {profile?.available && (
                  <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-green-500 border-4 border-background" />
                )}
              </div>
            </div>

            {profile?.available && (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium mb-6 border border-green-500/20">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Available for opportunities
              </span>
            )}

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4">
              Hi, I&apos;m <span className="gradient-text">{firstName}</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-3 max-w-2xl mx-auto">
              {displayTitle}
            </p>
            {profile?.tagline && (
              <p className="text-base text-muted-foreground/80 italic mb-8 max-w-xl mx-auto">
                &ldquo;{profile.tagline}&rdquo;
              </p>
            )}

            <div className="flex items-center justify-center gap-3 mb-8">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-card border hover:border-primary hover:text-primary hover:-translate-y-1 transition-all duration-300"
                  title={link.platform}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" className="hover-lift" asChild>
                <a href="#contact">
                  <Send className="w-4 h-4 mr-2" /> Let&apos;s Connect
                </a>
              </Button>
              <Button variant="outline" size="lg" className="hover-lift" asChild>
                <a href="#projects">
                  <Eye className="w-4 h-4 mr-2" /> View Projects
                </a>
              </Button>
              {profile?.resumeUrl && (
                <Button variant="ghost" size="lg" className="hover-lift" asChild>
                  <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="w-4 h-4 mr-2" /> Resume
                  </a>
                </Button>
              )}
            </div>

            <div className="mt-16 animate-bounce">
              <ArrowRight className="w-5 h-5 mx-auto rotate-90 text-muted-foreground" />
            </div>
          </div>
        </section>

        {/* ============ STATS STRIP ============ */}
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Trophy} value={hackathons.length} suffix="+" label="Hackathons" delay={0} />
            <StatCard icon={Target} value={contests.length} suffix="+" label="Contests" delay={100} />
            <StatCard icon={Rocket} value={projects.length} suffix="+" label="Projects" delay={200} />
            <StatCard icon={Award} value={certificates.length} suffix="+" label="Certificates" delay={300} />
          </div>
        </section>

        {/* ============ ABOUT ============ */}
        <section id="about" className="py-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <SectionHeader eyebrow="Who I am" title="About Me" icon={Sparkles} />
            <AboutBlock profile={profile} editMode={edit.editMode} onSaved={refresh} />
          </div>
        </section>

        {/* ============ SKILLS ============ */}
        <section id="skills" className="py-24 px-4 sm:px-6 bg-muted/20">
          <div className="max-w-5xl mx-auto">
            <SectionHeader eyebrow="Tech Stack" title="Skills & Tools" icon={Code} subtitle="Technologies I use to bring ideas to life" />
            {edit.editMode && (
              <div className="flex justify-center mb-8">
                <AddButton entity="skill" label="Add Skill" fields={FIELD_DEFS.skill} onSaved={refresh} />
              </div>
            )}
            <SkillsGrid skills={skills} editMode={edit.editMode} onSaved={refresh} />
          </div>
        </section>

        {/* ============ EDUCATION ============ */}
        <section id="education" className="py-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <SectionHeader eyebrow="Academic Journey" title="Education" icon={GraduationCap} subtitle="Where I built my foundations" />
            {edit.editMode && (
              <div className="flex justify-center mb-8">
                <AddButton entity="education" label="Add Education" fields={FIELD_DEFS.education} onSaved={refresh} />
              </div>
            )}
            <EducationTimeline education={education} editMode={edit.editMode} onSaved={refresh} />
          </div>
        </section>

        {/* ============ HACKATHONS ============ */}
        <section id="hackathons" className="py-24 px-4 sm:px-6 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <SectionHeader eyebrow="Building Under Pressure" title="Hackathons" icon={Trophy} subtitle="Where ideas meet deadlines — and I thrive" />
            {edit.editMode && (
              <div className="flex justify-center mb-8">
                <AddButton entity="hackathon" label="Add Hackathon" fields={FIELD_DEFS.hackathon} onSaved={refresh} />
              </div>
            )}
            <HackathonGrid hackathons={hackathons} editMode={edit.editMode} onSaved={refresh} onOpenLightbox={(imgs, i) => setLightbox({ images: imgs, index: i })} />
          </div>
        </section>

        {/* ============ CONTESTS ============ */}
        <section id="contests" className="py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <SectionHeader eyebrow="Competitive Programming" title="Contests & Rankings" icon={Target} subtitle="Algorithms are my sport" />
            {edit.editMode && (
              <div className="flex justify-center mb-8">
                <AddButton entity="contest" label="Add Contest" fields={FIELD_DEFS.contest} onSaved={refresh} />
              </div>
            )}
            <ContestList contests={contests} editMode={edit.editMode} onSaved={refresh} />
          </div>
        </section>

        {/* ============ PROJECTS ============ */}
        <section id="projects" className="py-24 px-4 sm:px-6 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <SectionHeader eyebrow="Things I've Built" title="Projects" icon={Rocket} subtitle="From competitive programming tools to full-stack apps" />
            {edit.editMode && (
              <div className="flex justify-center mb-8">
                <AddButton entity="project" label="Add Project" fields={FIELD_DEFS.project} onSaved={refresh} />
              </div>
            )}
            <ProjectsShowcaseWithFilter
              projects={projects}
              editMode={edit.editMode}
              onSaved={refresh}
              onOpenLightbox={(imgs, i) => setLightbox({ images: imgs, index: i })}
            />
          </div>
        </section>

        {/* ============ CERTIFICATES ============ */}
        <section id="certificates" className="py-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeader eyebrow="Lifelong Learning" title="Certificates" icon={Award} subtitle="Verified credentials & specializations" />
            {edit.editMode && (
              <div className="flex justify-center mb-8">
                <AddButton entity="certificate" label="Add Certificate" fields={FIELD_DEFS.certificate} onSaved={refresh} />
              </div>
            )}
            <CertificateGallery certificates={certificates} editMode={edit.editMode} onSaved={refresh} onOpenLightbox={(imgs, i) => setLightbox({ images: imgs, index: i })} />
          </div>
        </section>

        {/* ============ ACHIEVEMENTS ============ */}
        <section id="achievements" className="py-24 px-4 sm:px-6 bg-muted/20">
          <div className="max-w-5xl mx-auto">
            <SectionHeader eyebrow="Highlights" title="Achievements" icon={Medal} subtitle="Milestones along the way" />
            {edit.editMode && (
              <div className="flex justify-center mb-8">
                <AddButton entity="achievement" label="Add Achievement" fields={FIELD_DEFS.achievement} onSaved={refresh} />
              </div>
            )}
            <AchievementsGrid achievements={achievements} editMode={edit.editMode} onSaved={refresh} />
          </div>
        </section>

        {/* ============ CONTACT ============ */}
        <section id="contact" className="py-24 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <SectionHeader eyebrow="Get In Touch" title="Let's Connect" icon={Send} subtitle="Have an opportunity, idea, or just want to say hi? Drop me a message." />
            <Card className="glow-card">
              <CardContent className="p-6 sm:p-8">
                <ContactForm email={displayEmail} location={displayLocation} socialLinks={socialLinks} />
                {edit.editMode && (
                  <div className="mt-6 pt-6 border-t">
                    <AddButton entity="socialLink" label="Add Social Link" fields={FIELD_DEFS.socialLink} onSaved={refresh} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
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

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

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
    </div>
  )
}

/* ===================== Sub-components (hooks-safe) ===================== */

function AboutBlock({ profile, editMode, onSaved }: { profile: PortfolioData['profile']; editMode: boolean; onSaved: () => void }) {
  return (
    <Reveal>
      <Card className="glow-card relative">
        <CardContent className="p-6 sm:p-8">
          {editMode && profile && (
            <div className="absolute top-4 right-4 z-20">
              <EditActions entity="profile" id={profile.id} fields={FIELD_DEFS.profile} data={profile as unknown as Record<string, unknown>} onSaved={onSaved} compact />
            </div>
          )}
          <p className="text-base sm:text-lg leading-relaxed text-foreground/90">
            {profile?.about ||
              "I'm a final-year Computer Science undergraduate passionate about problem solving and building things that ship."}
          </p>
          {profile?.location && (
            <div className="flex items-center gap-2 mt-6 pt-6 border-t text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {profile.location}
            </div>
          )}
        </CardContent>
      </Card>
    </Reveal>
  )
}

function SkillsGrid({ skills, editMode, onSaved }: { skills: PortfolioData['skills']; editMode: boolean; onSaved: () => void }) {
  const categories = Object.keys(skills)
  if (!categories.length) return <p className="text-center text-muted-foreground">No skills added yet.</p>
  return (
    <div className="space-y-8">
      {categories.map((cat, ci) => (
        <Reveal key={cat} delay={ci * 80}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {cat}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skills[cat].map((s, si) => (
              <SkillBar key={si} skill={s} editMode={editMode} onSaved={onSaved} />
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  )
}

function SkillBar({ skill, editMode, onSaved }: { skill: { name: string; level: number; id?: string }; editMode: boolean; onSaved: () => void }) {
  const { ref, visible } = useScrollReveal()
  return (
    <div ref={ref} className="relative group">
      {editMode && skill.id && (
        <div className="absolute top-2 right-2 z-20">
          <EditActions entity="skill" id={skill.id} fields={FIELD_DEFS.skill} data={skill as Record<string, unknown>} onSaved={onSaved} compact />
        </div>
      )}
      <div className="p-4 rounded-xl border bg-card hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm">{skill.name}</span>
          <span className="text-xs text-muted-foreground">{skill.level}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-pink-500 transition-all duration-1000"
            style={{ width: visible ? `${skill.level}%` : '0%' }}
          />
        </div>
      </div>
    </div>
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

function HackathonGrid({ hackathons, editMode, onSaved, onOpenLightbox }: {
  hackathons: Hackathon[]
  editMode: boolean
  onSaved: () => void
  onOpenLightbox: (imgs: { url: string; title?: string; subtitle?: string }[], i: number) => void
}) {
  if (!hackathons.length) return <p className="text-center text-muted-foreground">No hackathons added yet.</p>
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {hackathons.map((h, i) => (
        <Reveal key={h.id} delay={(i % 2) * 100}>
          <HackathonCard hackathon={h} editMode={editMode} onSaved={onSaved} onOpenLightbox={onOpenLightbox} />
        </Reveal>
      ))}
    </div>
  )
}

function HackathonCard({ hackathon, editMode, onSaved, onOpenLightbox }: {
  hackathon: Hackathon
  editMode: boolean
  onSaved: () => void
  onOpenLightbox: (imgs: { url: string; title?: string; subtitle?: string }[], i: number) => void
}) {
  return (
    <div className="relative project-card h-full">
      {editMode && (
        <div className="absolute top-3 right-3 z-30">
          <EditActions entity="hackathon" id={hackathon.id} fields={FIELD_DEFS.hackathon} data={hackathon as unknown as Record<string, unknown>} onSaved={onSaved} compact />
        </div>
      )}
      <Card className="glow-card hover-lift group overflow-hidden h-full">
        {hackathon.imageUrl && (
          <div className="relative aspect-video overflow-hidden bg-muted">
            <img src={hackathon.imageUrl} alt={hackathon.title} className="project-img w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {hackathon.result && (
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur text-white text-xs font-semibold flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" /> {hackathon.result}
              </div>
            )}
          </div>
        )}
        <CardContent className="p-5">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{hackathon.title}</h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {hackathon.date}</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Team of {hackathon.teamSize}</span>
            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> {hackathon.organizer}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">{hackathon.description}</p>
          {hackathon.tags && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {hackathon.tags.split(',').map((t, i) => (
                <Badge key={i} variant="secondary" className="text-xs font-normal">{t.trim()}</Badge>
              ))}
            </div>
          )}
          <div className="flex gap-3 pt-3 border-t">
            {hackathon.imageUrl && (
              <button
                onClick={() => onOpenLightbox([{ url: hackathon.imageUrl!, title: hackathon.title, subtitle: hackathon.result || undefined }], 0)}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Eye className="w-4 h-4" /> View
              </button>
            )}
            {hackathon.projectUrl && (
              <a href={hackathon.projectUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ExternalLink className="w-4 h-4" /> Project
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ContestList({ contests, editMode, onSaved }: { contests: Contest[]; editMode: boolean; onSaved: () => void }) {
  if (!contests.length) return <p className="text-center text-muted-foreground">No contests added yet.</p>
  return (
    <div className="space-y-4">
      {contests.map((c, i) => (
        <Reveal key={c.id} delay={i * 60}>
          <ContestRow contest={c} editMode={editMode} onSaved={onSaved} />
        </Reveal>
      ))}
    </div>
  )
}

function ContestRow({ contest, editMode, onSaved }: { contest: Contest; editMode: boolean; onSaved: () => void }) {
  return (
    <div className="relative">
      {editMode && (
        <div className="absolute top-3 right-3 z-20">
          <EditActions entity="contest" id={contest.id} fields={FIELD_DEFS.contest} data={contest as unknown as Record<string, unknown>} onSaved={onSaved} compact />
        </div>
      )}
      <Card className="glow-card hover-lift overflow-hidden">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl">
                {contest.badge || getPlatformIcon(contest.platform, 'w-6 h-6')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{contest.name}</h3>
                  <Badge variant="outline" className="text-xs">{contest.platform}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{contest.description}</p>
              </div>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 sm:text-right sm:min-w-[140px]">
              {contest.rank && (
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold text-primary">{contest.rank}</span>
                </div>
              )}
              {contest.rating && (
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium">{contest.rating}</span>
                </div>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {contest.date}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CertificateGallery({ certificates, editMode, onSaved, onOpenLightbox }: {
  certificates: Certificate[]
  editMode: boolean
  onSaved: () => void
  onOpenLightbox: (imgs: { url: string; title?: string; subtitle?: string }[], i: number) => void
}) {
  if (!certificates.length) return <p className="text-center text-muted-foreground">No certificates added yet.</p>
  const lightboxImages = certificates.filter((c) => c.imageUrl).map((c) => ({ url: c.imageUrl!, title: c.title, subtitle: `${c.issuer} · ${c.date}` }))
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {certificates.map((cert, i) => (
        <Reveal key={cert.id} delay={(i % 3) * 80}>
          <CertificateCard cert={cert} editMode={editMode} onSaved={onSaved} onOpenLightbox={onOpenLightbox} lightboxImages={lightboxImages} />
        </Reveal>
      ))}
    </div>
  )
}

function CertificateCard({ cert, editMode, onSaved, onOpenLightbox, lightboxImages }: {
  cert: Certificate
  editMode: boolean
  onSaved: () => void
  onOpenLightbox: (imgs: { url: string; title?: string; subtitle?: string }[], i: number) => void
  lightboxImages: { url: string; title?: string; subtitle?: string }[]
}) {
  return (
    <div className="relative project-card h-full">
      {editMode && (
        <div className="absolute top-3 right-3 z-30">
          <EditActions entity="certificate" id={cert.id} fields={FIELD_DEFS.certificate} data={cert as unknown as Record<string, unknown>} onSaved={onSaved} compact />
        </div>
      )}
      <Card className="glow-card hover-lift group overflow-hidden h-full">
        {cert.imageUrl && (
          <div
            className="relative aspect-[4/3] overflow-hidden bg-muted cursor-pointer"
            onClick={() => {
              const idx = lightboxImages.findIndex((l) => l.url === cert.imageUrl)
              onOpenLightbox(lightboxImages, Math.max(0, idx))
            }}
          >
            <img src={cert.imageUrl} alt={cert.title} className="project-img w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-white/90 text-black text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <Eye className="w-3 h-3" /> View certificate
            </div>
          </div>
        )}
        <CardContent className="p-5">
          <div className="flex items-start gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <h3 className="font-semibold leading-tight">{cert.title}</h3>
          </div>
          <p className="text-sm text-primary font-medium mb-1">{cert.issuer}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {cert.date}
          </p>
          {cert.credentialId && (
            <p className="text-xs text-muted-foreground mt-2 font-mono">ID: {cert.credentialId}</p>
          )}
          {cert.credentialUrl && (
            <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-3">
              <ExternalLink className="w-3 h-3" /> Verify credential
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function AchievementsGrid({ achievements, editMode, onSaved }: { achievements: Achievement[]; editMode: boolean; onSaved: () => void }) {
  if (!achievements.length) return <p className="text-center text-muted-foreground">No achievements added yet.</p>
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {achievements.map((a, i) => (
        <Reveal key={a.id} delay={(i % 3) * 80}>
          <div className="relative">
            {editMode && (
              <div className="absolute top-2 right-2 z-20">
                <EditActions entity="achievement" id={a.id} fields={FIELD_DEFS.achievement} data={a as unknown as Record<string, unknown>} onSaved={onSaved} compact />
              </div>
            )}
            <Card className="glow-card hover-lift text-center h-full">
              <CardContent className="p-5">
                <div className="text-4xl mb-2">{a.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{a.title}</h3>
                <p className="text-xs text-muted-foreground">{a.description}</p>
              </CardContent>
            </Card>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

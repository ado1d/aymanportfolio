'use client'

import { useEffect, useRef } from 'react'
import {
  ArrowRight,
  Eye,
  FileText,
  Send,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSocialIcon } from '../icons'
import { MagneticButton } from '../magnetic-button'
import { VisitorBadge } from '../visitor-badge'
import { FavoritesCount } from '../favorite-toggle'
import { TechMarquee } from '../tech-marquee'
import { useTypewriter } from '@/hooks/use-typewriter'
import { downloadVCard } from '@/lib/vcard'
import type { Profile, SocialLink } from '@/lib/types'

/* ------------------------------------------------------------------ */
/*  Isolated typewriter — re-renders every ~40ms but ONLY this tiny    */
/*  component, never the whole page (previously it re-rendered the     */
/*  entire 60 KB home component tree on each keystroke).               */
/* ------------------------------------------------------------------ */
function HeroTypewriter() {
  const typedRole = useTypewriter(
    [
      'Competitive Programmer',
      'Hackathon Participants',
      'Full-Stack Builder',
      'Software Engineering Undergraduate',
      'Problem Solver',
    ],
    { typeSpeed: 40, deleteSpeed: 40, pauseEnd: 1600 }
  )
  return (
    <span className="text-lg sm:text-xl md:text-2xl font-semibold gradient-text-static inline-flex items-center">
      {typedRole}
      <span className="inline-block w-0.5 h-6 sm:h-7 ml-1 bg-primary animate-blink" aria-hidden />
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Zero-re-render parallax — moves the avatar via direct DOM writes   */
/*  inside rAF. No setState, so scrolling never triggers React work.   */
/* ------------------------------------------------------------------ */
function ParallaxAvatar({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Parallax is invisible polish — skip it for reduced-motion users.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (!ref.current) return
        const y = Math.min(window.scrollY, 600)
        ref.current.style.transform = `translateY(${y * 0.15}px)`
        const glow = ref.current.firstElementChild as HTMLElement | null
        if (glow) glow.style.transform = `translateY(${y * 0.3}px) scale(${1 + y * 0.0005})`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} className="relative parallax-slow">
      {children}
    </div>
  )
}

interface HeroSectionProps {
  profile: Profile | null
  socialLinks: SocialLink[]
  displayName: string
  firstName: string
}

export function HeroSection({ profile, socialLinks, displayName, firstName }: HeroSectionProps) {
  return (
    <section id="home" className="min-h-[90vh] px-4 sm:px-6 pt-8">
      <div className="text-center max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <ParallaxAvatar>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-violet-500 to-cyan-500 blur-2xl opacity-40 animate-pulse" />
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={displayName}
                width={180}
                height={180}
                decoding="async"
                className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-4 ring-background shadow-2xl"
              />
            ) : (
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-primary via-violet-500 to-cyan-500 flex items-center justify-center text-5xl font-bold text-white ring-4 ring-background shadow-2xl">
                {firstName[0]}
              </div>
            )}
            {profile?.available && (
              <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-green-500 border-4 border-background" />
            )}
          </ParallaxAvatar>
        </div>

        {profile?.available && (
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium mb-6 border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Open to Work
          </span>
        )}

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4">
          Hi, I&apos;m <span className="gradient-text">{firstName}</span>
        </h1>

        <div className="flex items-center justify-center gap-2 mb-3 h-9">
          <span className="text-lg sm:text-xl md:text-2xl text-muted-foreground">I&apos;m a</span>
          <HeroTypewriter />
        </div>
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

        {/* Primary CTAs — stack vertically on mobile */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 px-4">
          <MagneticButton size="lg" className="hover-lift w-full sm:w-auto" asChild>
            <a href="#contact">
              <Send className="w-4 h-4 mr-2" /> Let&apos;s Connect
            </a>
          </MagneticButton>
          <MagneticButton variant="outline" size="lg" className="hover-lift w-full sm:w-auto" asChild>
            <a href="#projects">
              <Eye className="w-4 h-4 mr-2" /> View Projects
            </a>
          </MagneticButton>
        </div>

        {/* Secondary CTAs — wrap on mobile */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="hover-lift"
            onClick={() => downloadVCard(profile, socialLinks)}
            title="Download contact as vCard"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Save Contact
          </Button>
          {profile?.resumeUrl && (
            <Button variant="ghost" size="sm" className="hover-lift" asChild>
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="w-3.5 h-3.5 mr-1.5" /> Resume
              </a>
            </Button>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
          <VisitorBadge />
          <FavoritesCount />
        </div>

        <div className="mt-12 w-full">
          <TechMarquee />
        </div>

        <div className="mt-8 animate-bounce">
          <ArrowRight className="w-5 h-5 mx-auto rotate-90 text-muted-foreground" />
        </div>
      </div>
    </section>
  )
}

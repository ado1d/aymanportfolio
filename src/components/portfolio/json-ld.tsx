'use client'

import { useMemo } from 'react'
import type { Profile, Project, SocialLink } from '@/lib/types'

interface JsonLdProps {
  profile: Profile | null
  projects: Project[]
  socialLinks: SocialLink[]
}

/** JSON-LD structured data for SEO (Person schema). Rendered as a script tag. */
export function JsonLd({ profile, projects, socialLinks }: JsonLdProps) {
  const json = useMemo(() => {
    const name = profile?.name || 'Ayman'
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name,
      jobTitle: profile?.title || 'Computer Science Student',
      description: profile?.about || profile?.tagline || '',
      email: profile?.email ? `mailto:${profile.email}` : undefined,
      address: profile?.location
        ? { '@type': 'PostalAddress', addressLocality: profile.location }
        : undefined,
      sameAs: socialLinks.filter((s) => s.url.startsWith('http')).map((s) => s.url),
      knowsAbout: projects
        .flatMap((p) => (p.tags ? p.tags.split(',').map((t) => t.trim()) : []))
        .filter((v, i, a) => v && a.indexOf(v) === i)
        .slice(0, 20),
    }
  }, [profile, projects, socialLinks])

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}

'use client'

import { Github, Linkedin, Mail, Facebook, ExternalLink, Code2, Twitter, Globe, Youtube, Instagram } from 'lucide-react'

export function CodeforcesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className || 'w-5 h-5'} fill="currentColor" aria-hidden>
      <path d="M4.5 7.5a1.5 1.5 0 0 1 3 0v9a1.5 1.5 0 0 1-3 0v-9Zm6 0a1.5 1.5 0 0 1 3 0v9a1.5 1.5 0 0 1-3 0v-9Zm6.75 0a1.5 1.5 0 0 1 3 0v6.75a1.5 1.5 0 0 1-3 0V7.5Z" />
    </svg>
  )
}

export function CodeChefIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className || 'w-5 h-5'} fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 3.5c1.8 0 3.4.7 4.6 1.9l-1.4 1.4A4.5 4.5 0 0 0 12 7.5c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5c1.6 0 3-.8 3.8-2.1l1.6 1A6.5 6.5 0 1 1 12 5.5Z" />
    </svg>
  )
}

export function AtCoderIcon({ className }: { className?: string }) {
  return <Code2 className={className || 'w-5 h-5'} />
}

export function getSocialIcon(platform: string, className?: string) {
  const cls = className || 'w-5 h-5'
  switch (platform.toLowerCase()) {
    case 'github':
      return <Github className={cls} />
    case 'linkedin':
      return <Linkedin className={cls} />
    case 'facebook':
      return <Facebook className={cls} />
    case 'codeforces':
      return <CodeforcesIcon className={cls} />
    case 'codechef':
      return <CodeChefIcon className={cls} />
    case 'twitter':
    case 'x':
      return <Twitter className={cls} />
    case 'instagram':
      return <Instagram className={cls} />
    case 'youtube':
      return <Youtube className={cls} />
    case 'mail':
    case 'email':
      return <Mail className={cls} />
    case 'website':
    case 'portfolio':
      return <Globe className={cls} />
    default:
      return <ExternalLink className={cls} />
  }
}

export function getPlatformIcon(platform: string, className?: string) {
  const p = platform.toLowerCase()
  if (p.includes('codeforces')) return <CodeforcesIcon className={className} />
  if (p.includes('codechef')) return <CodeChefIcon className={className} />
  if (p.includes('atcoder')) return <AtCoderIcon className={className} />
  return <Code2 className={className} />
}

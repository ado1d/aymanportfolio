'use client'

import type { Profile } from '@/lib/types'

/** Generate a vCard 3.0 string and trigger a download as a .vcf file. */
export function downloadVCard(profile: Profile | null, socialLinks: { platform: string; url: string }[] = []) {
  const name = profile?.name || 'Ayman'
  const parts = name.split(' ')
  const firstName = parts[0] || ''
  const lastName = parts.slice(1).join(' ') || ''

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${name}`,
    profile?.title ? `TITLE:${profile.title}` : '',
    profile?.email ? `EMAIL;TYPE=INTERNET:${profile.email}` : '',
    profile?.phone ? `TEL;TYPE=CELL:${profile.phone}` : '',
    profile?.location ? `ADR;TYPE=HOME:;;${profile.location};;;;` : '',
    profile?.about ? `NOTE:${profile.about.replace(/\n/g, ' ').slice(0, 200)}` : '',
    profile?.resumeUrl ? `URL:${profile.resumeUrl}` : '',
  ]

  // Add social URLs
  for (const s of socialLinks) {
    if (s.url && s.url.startsWith('http')) {
      lines.push(`URL;TYPE=${s.platform.toUpperCase().replace(/[^A-Z]/g, '')}:${s.url}`)
    }
  }

  lines.push('END:VCARD')

  const vcard = lines.filter(Boolean).join('\r\n')
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${name.toLowerCase().replace(/\s+/g, '-')}.vcf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

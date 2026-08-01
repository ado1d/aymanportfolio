import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const OUT = join(process.cwd(), 'public', 'uploads')
mkdirSync(OUT, { recursive: true })

const palettes = [
  ['#7c3aed', '#ec4899'], ['#06b6d4', '#7c3aed'], ['#f59e0b', '#ef4444'],
  ['#10b981', '#06b6d4'], ['#ec4899', '#f59e0b'], ['#8b5cf6', '#06b6d4'],
  ['#f43f5e', '#8b5cf6'], ['#0ea5e9', '#10b981'], ['#f59e0b', '#ec4899'],
  ['#7c3aed', '#10b981'],
]

const captions = [
  { icon: '🏆', title: 'Hackathon Win', sub: 'All-nighter' },
  { icon: '🌿', title: 'SUST Campus', sub: 'Autumn' },
  { icon: '🥇', title: 'Champions', sub: '1200+ teams' },
  { icon: '🏔️', title: 'Jaflong', sub: 'River trip' },
  { icon: '☕', title: 'Code Setup', sub: 'Dual monitor' },
  { icon: '🍕', title: 'ICPC Team', sub: 'Post-contest' },
  { icon: '🎤', title: 'Tech Talk', sub: 'CP 101' },
  { icon: '🌅', title: 'Sunset', sub: 'Dorm view' },
  { icon: '🛰️', title: 'NASA Space Apps', sub: '48h sprint' },
  { icon: '🏔️', title: 'Bandarban', sub: 'Road trip' },
]

for (let i = 0; i < 10; i++) {
  const [c1, c2] = palettes[i]
  const cap = captions[i]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="g${i}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <pattern id="p${i}" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="15" cy="15" r="1" fill="rgba(255,255,255,0.1)"/>
    </pattern>
  </defs>
  <rect width="800" height="600" fill="url(#g${i})"/>
  <rect width="800" height="600" fill="url(#p${i})"/>
  <text x="400" y="270" font-size="80" text-anchor="middle" dominant-baseline="central">${cap.icon}</text>
  <text x="400" y="360" font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="white" text-anchor="middle">${cap.title}</text>
  <text x="400" y="395" font-family="system-ui,sans-serif" font-size="16" fill="rgba(255,255,255,0.7)" text-anchor="middle">${cap.sub}</text>
</svg>`
  writeFileSync(join(OUT, `life-${i + 1}.svg`), svg)
}
console.log('✅ Generated 10 lifestyle images')

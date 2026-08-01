import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const OUT = join(process.cwd(), 'public', 'uploads')
mkdirSync(OUT, { recursive: true })

const palettes = [
  ['#7c3aed', '#ec4899', '#06b6d4'],
  ['#f59e0b', '#ef4444', '#ec4899'],
  ['#10b981', '#06b6d4', '#3b82f6'],
  ['#8b5cf6', '#d946ef', '#f43f5e'],
  ['#0ea5e9', '#6366f1', '#8b5cf6'],
  ['#f43f5e', '#f59e0b', '#eab308'],
]

function svg(opts: { w: number; h: number; c1: string; c2: string; c3: string; title: string; subtitle: string; icon: string; pattern?: 'grid' | 'dots' | 'waves' | 'circuit' }): string {
  const { w, h, c1, c2, c3, title, subtitle, icon, pattern = 'grid' } = opts
  let bgPattern = ''
  if (pattern === 'grid') {
    bgPattern = `<defs><pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/></pattern></defs><rect width="${w}" height="${h}" fill="url(#p)"/>`
  } else if (pattern === 'dots') {
    bgPattern = `<defs><pattern id="p" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1.5" fill="rgba(255,255,255,0.15)"/></pattern></defs><rect width="${w}" height="${h}" fill="url(#p)"/>`
  } else if (pattern === 'circuit') {
    bgPattern = `<g opacity="0.18" stroke="white" stroke-width="1.5" fill="none"><path d="M0 ${h*0.3} L${w*0.3} ${h*0.3} L${w*0.4} ${h*0.2} L${w*0.7} ${h*0.2}"/><path d="M0 ${h*0.7} L${w*0.25} ${h*0.7} L${w*0.35} ${h*0.85} L${w} ${h*0.85}"/><path d="M${w*0.6} 0 L${w*0.6} ${h*0.4} L${w*0.8} ${h*0.55} L${w*0.8} ${h}"/><circle cx="${w*0.3}" cy="${h*0.3}" r="4" fill="white"/><circle cx="${w*0.7}" cy="${h*0.2}" r="4" fill="white"/><circle cx="${w*0.25}" cy="${h*0.7}" r="4" fill="white"/><circle cx="${w*0.8}" cy="${h*0.55}" r="4" fill="white"/></g>`
  } else {
    bgPattern = `<g opacity="0.2"><path d="M0 ${h*0.6} Q${w*0.25} ${h*0.4} ${w*0.5} ${h*0.6} T${w} ${h*0.6} L${w} ${h} L0 ${h} Z" fill="white"/><path d="M0 ${h*0.75} Q${w*0.25} ${h*0.55} ${w*0.5} ${h*0.75} T${w} ${h*0.75} L${w} ${h} L0 ${h} Z" fill="white" opacity="0.5"/></g>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c1}"/><stop offset="50%" stop-color="${c2}"/><stop offset="100%" stop-color="${c3}"/></linearGradient><linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="white" stop-opacity="0.25"/><stop offset="100%" stop-color="white" stop-opacity="0"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><rect width="${w}" height="${h}" fill="url(#glow)"/>${bgPattern}<g transform="translate(${w/2}, ${h/2 - 30})"><circle cx="0" cy="0" r="48" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/><text x="0" y="0" font-size="44" text-anchor="middle" dominant-baseline="central">${icon}</text></g><text x="${w/2}" y="${h/2 + 60}" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="white" text-anchor="middle">${title}</text><text x="${w/2}" y="${h/2 + 92}" font-family="system-ui, sans-serif" font-size="15" fill="rgba(255,255,255,0.8)" text-anchor="middle">${subtitle}</text></svg>`
}

function cert(opts: { c1: string; c2: string; c3: string; title: string; issuer: string; icon: string }): string {
  const w = 800, h = 560
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#f8fafc"/></linearGradient><linearGradient id="ribbon" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="${opts.c1}"/><stop offset="50%" stop-color="${opts.c2}"/><stop offset="100%" stop-color="${opts.c3}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#bg)"/><rect x="0" y="0" width="${w}" height="14" fill="url(#ribbon)"/><rect x="0" y="${h-14}" width="${w}" height="14" fill="url(#ribbon)"/><rect x="30" y="40" width="${w-60}" height="${h-80}" fill="none" stroke="#e2e8f0" stroke-width="2" rx="8"/><rect x="40" y="50" width="${w-80}" height="${h-100}" fill="none" stroke="url(#ribbon)" stroke-width="1" stroke-dasharray="4 4" rx="6"/><g transform="translate(${w/2}, 150)"><circle cx="0" cy="0" r="52" fill="url(#ribbon)"/><text x="0" y="0" font-size="48" text-anchor="middle" dominant-baseline="central">${opts.icon}</text></g><text x="${w/2}" y="260" font-family="Georgia, serif" font-size="16" fill="#64748b" text-anchor="middle" letter-spacing="4">CERTIFICATE OF COMPLETION</text><text x="${w/2}" y="310" font-family="system-ui, sans-serif" font-size="30" font-weight="700" fill="#0f172a" text-anchor="middle">${opts.title}</text><text x="${w/2}" y="345" font-family="system-ui, sans-serif" font-size="16" fill="${opts.c1}" text-anchor="middle" font-weight="600">${opts.issuer}</text><line x1="${w/2 - 80}" y1="420" x2="${w/2 + 80}" y2="420" stroke="#cbd5e1" stroke-width="1"/><text x="${w/2}" y="445" font-family="system-ui, sans-serif" font-size="12" fill="#94a3b8" text-anchor="middle">Ayman</text><text x="${w/2}" y="475" font-family="system-ui, sans-serif" font-size="11" fill="#cbd5e1" text-anchor="middle">Verified Credential</text><g transform="translate(${w-110}, ${h-90})"><circle cx="0" cy="0" r="28" fill="none" stroke="url(#ribbon)" stroke-width="2"/><text x="0" y="0" font-size="22" text-anchor="middle" dominant-baseline="central">★</text></g></svg>`
}

const avatar = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><linearGradient id="ag" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#7c3aed"/><stop offset="50%" stop-color="#ec4899"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs><rect width="400" height="400" fill="url(#ag)"/><circle cx="200" cy="200" r="180" fill="rgba(255,255,255,0.1)"/><text x="200" y="270" font-family="system-ui, sans-serif" font-size="180" font-weight="800" fill="white" text-anchor="middle">A</text></svg>`
writeFileSync(join(OUT, 'avatar.svg'), avatar)

const images = [
  { file: 'project-1.svg', title: 'AlgoArena', sub: 'Competitive Judge', icon: '⚔️', pattern: 'circuit' as const, idx: 0 },
  { file: 'project-2.svg', title: 'ShikkhoPath', sub: 'AI Tutor', icon: '📚', pattern: 'waves' as const, idx: 1 },
  { file: 'project-3.svg', title: 'DevSync', sub: 'Collab Editor', icon: '💻', pattern: 'grid' as const, idx: 2 },
  { file: 'project-4.svg', title: 'RouteWise', sub: 'Logistics AI', icon: '🗺️', pattern: 'circuit' as const, idx: 3 },
  { file: 'project-5.svg', title: 'CF Visualizer', sub: 'Analytics', icon: '📊', pattern: 'dots' as const, idx: 4 },
  { file: 'project-6.svg', title: 'CampusConnect', sub: 'Student App', icon: '🎓', pattern: 'waves' as const, idx: 5 },
  { file: 'hackathon-1.svg', title: 'Smart Bangladesh', sub: 'National Champion', icon: '🥇', pattern: 'grid' as const, idx: 0 },
  { file: 'hackathon-2.svg', title: 'NASA Space Apps', sub: '2nd Place', icon: '🛰️', pattern: 'dots' as const, idx: 4 },
  { file: 'hackathon-3.svg', title: 'BUET CSE Fest', sub: 'Top 5 Finalist', icon: '🏆', pattern: 'circuit' as const, idx: 2 },
  { file: 'hackathon-4.svg', title: 'HackTheNorth', sub: 'Best Cloud API', icon: '🎯', pattern: 'waves' as const, idx: 5 },
]
for (const img of images) {
  const p = palettes[img.idx]
  writeFileSync(join(OUT, img.file), svg({ w: 1200, h: 800, c1: p[0], c2: p[1], c3: p[2], title: img.title, subtitle: img.sub, icon: img.icon, pattern: img.pattern }))
  console.log('wrote', img.file)
}

const certs = [
  { file: 'cert-1.svg', title: 'Front-End Developer', issuer: 'Meta / Coursera', icon: '⚛️', idx: 0 },
  { file: 'cert-2.svg', title: 'Cloud Practitioner', issuer: 'Amazon Web Services', icon: '☁️', idx: 4 },
  { file: 'cert-3.svg', title: 'Machine Learning', issuer: 'DeepLearning.AI', icon: '🤖', idx: 3 },
  { file: 'cert-4.svg', title: 'Problem Solving', issuer: 'HackerRank', icon: '🧩', idx: 1 },
  { file: 'cert-5.svg', title: 'Associate Developer', issuer: 'MongoDB University', icon: '🍃', idx: 2 },
]
for (const c of certs) {
  const p = palettes[c.idx]
  writeFileSync(join(OUT, c.file), cert({ c1: p[0], c2: p[1], c3: p[2], title: c.title, issuer: c.issuer, icon: c.icon }))
  console.log('wrote', c.file)
}
console.log('✅ All images generated')

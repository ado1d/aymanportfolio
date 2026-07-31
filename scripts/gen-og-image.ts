import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const OUT = join(process.cwd(), 'public')
mkdirSync(OUT, { recursive: true })

// Open Graph social preview image (1200x630)
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0712"/>
      <stop offset="50%" stop-color="#1a0f2e"/>
      <stop offset="100%" stop-color="#0a0712"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="50%" stop-color="#ec4899"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#ec4899" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <!-- Glow blobs -->
  <circle cx="200" cy="150" r="180" fill="url(#glow)" opacity="0.5"/>
  <circle cx="1000" cy="500" r="200" fill="url(#glow)" opacity="0.4"/>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="1200" height="4" fill="url(#accent)"/>

  <!-- Avatar circle -->
  <g transform="translate(100, 200)">
    <circle cx="80" cy="80" r="78" fill="none" stroke="url(#accent)" stroke-width="3"/>
    <circle cx="80" cy="80" r="70" fill="url(#accent)" opacity="0.15"/>
    <text x="80" y="100" font-family="system-ui, sans-serif" font-size="72" font-weight="800" fill="url(#accent)" text-anchor="middle">A</text>
  </g>

  <!-- Status badge -->
  <g transform="translate(100, 120)">
    <rect x="0" y="0" width="220" height="32" rx="16" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.3)" stroke-width="1"/>
    <circle cx="18" cy="16" r="4" fill="#10b981"/>
    <text x="32" y="21" font-family="system-ui, sans-serif" font-size="13" font-weight="500" fill="#34d399">Available for opportunities</text>
  </g>

  <!-- Name -->
  <text x="100" y="380" font-family="system-ui, sans-serif" font-size="76" font-weight="800" fill="#fafafa">Ayman</text>

  <!-- Title -->
  <text x="100" y="440" font-family="system-ui, sans-serif" font-size="28" font-weight="500" fill="url(#accent)">CS Undergraduate · Competitive Programmer · Full-Stack Builder</text>

  <!-- Tagline -->
  <text x="100" y="480" font-family="system-ui, sans-serif" font-size="18" fill="#a1a1aa">Turning algorithms into products, one problem at a time.</text>

  <!-- Stats row -->
  <g transform="translate(100, 530)" font-family="system-ui, sans-serif">
    <g>
      <text x="0" y="0" font-size="32" font-weight="700" fill="#a78bfa">4+</text>
      <text x="0" y="24" font-size="13" fill="#71717a">Hackathons</text>
    </g>
    <g transform="translate(160, 0)">
      <text x="0" y="0" font-size="32" font-weight="700" fill="#a78bfa">6+</text>
      <text x="0" y="24" font-size="13" fill="#71717a">Contests</text>
    </g>
    <g transform="translate(320, 0)">
      <text x="0" y="0" font-size="32" font-weight="700" fill="#a78bfa">6+</text>
      <text x="0" y="24" font-size="13" fill="#71717a">Projects</text>
    </g>
    <g transform="translate(480, 0)">
      <text x="0" y="0" font-size="32" font-weight="700" fill="#a78bfa">5+</text>
      <text x="0" y="24" font-size="13" fill="#71717a">Certificates</text>
    </g>
  </g>

  <!-- Tech badges on the right -->
  <g transform="translate(900, 200)" font-family="system-ui, sans-serif" font-size="14" font-weight="500">
    <g>
      <rect x="0" y="0" width="100" height="32" rx="16" fill="rgba(124,58,237,0.15)" stroke="rgba(124,58,237,0.3)"/>
      <text x="50" y="21" fill="#a78bfa" text-anchor="middle">C++</text>
    </g>
    <g transform="translate(110, 0)">
      <rect x="0" y="0" width="100" height="32" rx="16" fill="rgba(236,72,153,0.15)" stroke="rgba(236,72,153,0.3)"/>
      <text x="50" y="21" fill="#f472b6" text-anchor="middle">Python</text>
    </g>
    <g transform="translate(55, 44)">
      <rect x="0" y="0" width="100" height="32" rx="16" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.3)"/>
      <text x="50" y="21" fill="#22d3ee" text-anchor="middle">Next.js</text>
    </g>
    <g transform="translate(0, 88)">
      <rect x="0" y="0" width="100" height="32" rx="16" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.3)"/>
      <text x="50" y="21" fill="#fbbf24" text-anchor="middle">Codeforces</text>
    </g>
    <g transform="translate(110, 88)">
      <rect x="0" y="0" width="100" height="32" rx="16" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.3)"/>
      <text x="50" y="21" fill="#34d399" text-anchor="middle">React</text>
    </g>
  </g>

  <!-- Bottom URL -->
  <text x="100" y="600" font-family="monospace" font-size="14" fill="#52525b">ayman.dev</text>
</svg>`

writeFileSync(join(OUT, 'og-image.svg'), og)
console.log('✅ OG image generated: public/og-image.svg')

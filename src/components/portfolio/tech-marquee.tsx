'use client'

import { Code2 } from 'lucide-react'

// Tech items with display labels + emoji/icon glyphs
const TECH_ITEMS = [
  { label: 'C++', glyph: '⚙️' },
  { label: 'Python', glyph: '🐍' },
  { label: 'TypeScript', glyph: '📘' },
  { label: 'Next.js', glyph: '▲' },
  { label: 'React', glyph: '⚛️' },
  { label: 'Node.js', glyph: '🟢' },
  { label: 'Tailwind', glyph: '🎨' },
  { label: 'Prisma', glyph: '◐' },
  { label: 'PostgreSQL', glyph: '🐘' },
  { label: 'Redis', glyph: '🔴' },
  { label: 'Docker', glyph: '🐳' },
  { label: 'Git', glyph: '🌿' },
  { label: 'Codeforces', glyph: '🟣' },
  { label: 'Linux', glyph: '🐧' },
  { label: 'TensorFlow', glyph: '🧠' },
  { label: 'WebAssembly', glyph: '🕸️' },
]

/** A horizontally-scrolling marquee of tech items, duplicated for seamless loop. */
export function TechMarquee() {
  return (
    <div className="relative w-full overflow-hidden py-4 mask-fade" aria-hidden>
      <div className="marquee">
        <div className="marquee-track">
          {TECH_ITEMS.map((t, i) => (
            <span
              key={`a-${i}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border text-sm font-medium whitespace-nowrap"
            >
              <span className="text-base">{t.glyph}</span>
              {t.label}
            </span>
          ))}
        </div>
        <div className="marquee-track" aria-hidden>
          {TECH_ITEMS.map((t, i) => (
            <span
              key={`b-${i}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border text-sm font-medium whitespace-nowrap"
            >
              <span className="text-base">{t.glyph}</span>
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

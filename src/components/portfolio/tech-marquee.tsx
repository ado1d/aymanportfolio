'use client'

// Tech items with devicon logo slugs for real brand logos
const TECH_ITEMS = [
  { label: 'C++', slug: 'cplusplus' },
  { label: 'Python', slug: 'python' },
  { label: 'TypeScript', slug: 'typescript' },
  { label: 'Next.js', slug: 'nextjs' },
  { label: 'React', slug: 'react' },
  { label: 'Node.js', slug: 'nodejs' },
  { label: 'Tailwind', slug: 'tailwindcss' },
  { label: 'Prisma', slug: 'prisma' },
  { label: 'PostgreSQL', slug: 'postgresql' },
  { label: 'Docker', slug: 'docker' },
  { label: 'Git', slug: 'git' },
  { label: 'Linux', slug: 'linux' },
  { label: 'TensorFlow', slug: 'tensorflow' },
  { label: 'JavaScript', slug: 'javascript' },
  { label: 'Figma', slug: 'figma' },
  { label: 'Java', slug: 'java' },
]

function getLogoUrl(slug: string): string {
  return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-original.svg`
}

/** A horizontally-scrolling marquee of tech items with real brand logos. */
export function TechMarquee() {
  return (
    <div className="relative w-full overflow-hidden py-4 mask-fade" aria-hidden>
      <div className="marquee">
        {[0, 1].map((track) => (
          <div key={track} className="marquee-track" aria-hidden={track === 1}>
            {TECH_ITEMS.map((t, i) => (
              <span
                key={`${track === 0 ? 'a' : 'b'}-${i}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border text-sm font-medium whitespace-nowrap"
              >
                <img
                  src={getLogoUrl(t.slug)}
                  alt={t.label}
                  className="w-4 h-4 object-contain"
                  loading="lazy"
                />
                {t.label}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

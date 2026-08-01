'use client'

interface SignatureLogoProps {
  name?: string
  className?: string
}

/** A signature-style cursive SVG logo for "Ayman".
 *  Renders the name in a handwritten script path with a gradient stroke. */
export function SignatureLogo({ name = 'Ayman', className = '' }: SignatureLogoProps) {
  return (
    <svg
      viewBox="0 0 180 50"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={name}
      role="img"
    >
      <defs>
        <linearGradient id="sig-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      {/* "Ayman" in a cursive/script style using path data */}
      <path
        d="M10 38 Q14 20 22 18 Q30 16 28 28 Q27 36 24 38 Q22 39 23 34 L28 22 Q32 14 38 16 Q42 18 40 28 Q39 36 36 37 M40 28 Q46 16 52 18 Q56 20 54 30 Q53 36 50 37 Q48 37 49 32 L54 20 Q58 14 62 18 Q64 22 62 30 Q61 36 58 37 Q56 37 57 32 L62 20 Q66 14 70 18 Q72 22 70 30 Q69 36 66 37 Q64 37 65 32 L70 20 Q74 14 78 18 Q80 22 78 30 Q77 36 74 37 M82 22 Q88 16 92 20 Q94 24 92 30 Q90 36 86 37 Q84 37 85 32 L90 22 Q94 16 98 20 Q100 24 98 30 Q96 36 92 37 M102 18 Q108 14 114 18 Q118 22 116 30 Q114 38 108 39 Q104 39 104 34 L108 22 Q112 16 116 20 M118 18 Q124 14 130 18 Q134 22 132 30 Q130 38 124 39 Q120 39 120 34 L124 22 Q128 16 132 20 M138 20 Q142 16 146 20 Q148 24 146 30 Q144 36 140 37 Q138 37 139 32 L144 22 Q148 16 152 20 M155 18 Q160 16 162 22 L158 36"
        stroke="url(#sig-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Dot over the 'i' equivalent — a small flourish */}
      <circle cx="165" cy="14" r="2" fill="url(#sig-grad)" />
    </svg>
  )
}

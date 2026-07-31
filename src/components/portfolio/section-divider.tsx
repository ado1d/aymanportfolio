'use client'

import { useScrollReveal } from '@/hooks/use-scroll-reveal'

interface SectionDividerProps {
  /** Flip the wave direction. */
  flip?: boolean
  /** Color variant. */
  variant?: 'default' | 'muted'
  className?: string
}

/** An animated gradient wave divider between sections.
 *  Renders an SVG wave with a subtle gradient fill. */
export function SectionDivider({ flip = false, variant = 'default', className = '' }: SectionDividerProps) {
  const { ref, visible } = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden ${flip ? 'rotate-180' : ''} ${className}`}
      style={{ height: '48px' }}
      aria-hidden
    >
      <svg
        className={`absolute inset-0 w-full h-full transition-transform duration-1000 ${visible ? 'scale-x-100' : 'scale-x-0'}`}
        viewBox="0 0 1200 48"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`divider-grad-${variant}-${flip}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path
          d="M0,24 C200,48 400,0 600,24 C800,48 1000,0 1200,24 L1200,48 L0,48 Z"
          fill={`url(#divider-grad-${variant}-${flip})`}
          opacity={variant === 'muted' ? '0.15' : '0.2'}
        />
        <path
          d="M0,28 C200,8 400,44 600,28 C800,8 1000,44 1200,28"
          fill="none"
          stroke={`url(#divider-grad-${variant}-${flip})`}
          strokeWidth="1.5"
          opacity="0.5"
        />
      </svg>
    </div>
  )
}

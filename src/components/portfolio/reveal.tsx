'use client'

import { ReactNode } from 'react'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

/** Wrapper that reveals its children on scroll into view. */
export function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const { ref, visible } = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'active' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

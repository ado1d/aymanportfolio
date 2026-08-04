'use client'

import { useEffect, useRef } from 'react'

/** A spotlight that follows the cursor, revealing a brighter grid area.
 *  Renders an overlay div with a radial gradient mask positioned at the cursor.
 *  Disabled on touch devices. */
export function HeroSpotlight() {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only enable on devices with a fine pointer
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (e: MouseEvent) => {
      if (!overlayRef.current) return
      overlayRef.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(124, 58, 237, 0.06), transparent 40%)`
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300"
      aria-hidden
    />
  )
}

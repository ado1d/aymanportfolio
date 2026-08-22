'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

interface LazySectionProps {
  children: ReactNode
  /** Placeholder height before the section mounts — prevents layout shift */
  minHeight?: number
  /** How far outside the viewport the section starts loading (px) */
  rootMargin?: string
  className?: string
}

/**
 * LazySection — mounts its children only when they scroll near the viewport.
 *
 * Why: the portfolio renders ~15 heavy sections (charts, heatmaps, galleries).
 * Loading them all up-front meant megabytes of JS executed on page load —
 * the main reason the site felt heavy on phones. Combined with next/dynamic,
 * each section's code is also split into its own chunk that is only fetched
 * when needed.
 */
export function LazySection({ children, minHeight = 500, rootMargin = '900px 0px', className }: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // No IntersectionObserver (very old browser) — render everything
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin }
    )
    io.observe(el)
    // Fallback for instant programmatic jumps (e.g. scrollTo bottom, anchor
    // links): an IntersectionObserver callback can be skipped entirely when a
    // fast jump moves an element from below the viewport to above it between
    // frames. A cheap one-shot late check catches those cases.
    const lateCheck = setTimeout(() => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setVisible(true)
          io.disconnect()
        }
      }
    }, 1500)
    return () => {
      io.disconnect()
      clearTimeout(lateCheck)
    }
  }, [rootMargin])

  return (
    <div ref={ref} className={className}>
      {visible ? children : <div style={{ minHeight }} aria-hidden="true" />}
    </div>
  )
}

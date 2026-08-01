'use client'

import { useEffect, useState } from 'react'

/** Returns a scroll-based offset (in pixels) for parallax effects.
 *  The offset increases as the user scrolls down, capped at `maxScroll`.
 *  Uses requestAnimationFrame + passive scroll listener for performance. */
export function useParallax(maxScroll = 600) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, maxScroll)
        setOffset(y)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [maxScroll])

  return offset
}

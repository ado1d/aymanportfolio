'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'

// Client-only "mounted" flag via useSyncExternalStore (no setState-in-effect).
function subscribe(cb: () => void) {
  return () => {}
}
function getSnapshot() {
  return true
}
function getServerSnapshot() {
  return false
}

/** A lightweight, smooth custom cursor: a single small dot that follows the
 *  mouse instantly (no rAF loop, no trailing ring — minimal overhead).
 *  Disabled on touch devices and when prefers-reduced-motion. */
export function CursorFollower() {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mounted) return
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    // Use CSS transform with transition for smoothness — no rAF needed.
    let visible = false
    const onMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
        if (!visible) {
          visible = true
          dotRef.current.style.opacity = '0.7'
        }
      }
    }
    const onLeave = () => {
      if (dotRef.current) {
        visible = false
        dotRef.current.style.opacity = '0'
      }
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 w-3 h-3 rounded-full bg-primary pointer-events-none z-[55] transition-opacity duration-300"
      style={{ opacity: 0, willChange: 'transform' }}
      aria-hidden
    />
  )
}

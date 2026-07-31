'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'

// Client-only "mounted" flag via useSyncExternalStore (no setState-in-effect).
function subscribe(cb: () => void) {
  // The store never changes after mount; we just need to trigger a re-read.
  // useSyncExternalStore calls getSnapshot on every render, so returning
  // a constant is fine — the value flips from false→true once hydrated.
  return () => {}
}
function getSnapshot() {
  return true // always true on client
}
function getServerSnapshot() {
  return false // false during SSR
}

/** A custom cursor follower: a soft gradient blob that trails the mouse with
 *  spring-like easing. Disabled on touch devices and when prefers-reduced-motion.
 *  Renders two layers: a large soft ring + a small precise dot. */
export function CursorFollower() {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const raf = useRef(0)

  useEffect(() => {
    if (!mounted) return
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
        dotRef.current.style.opacity = '1'
      }
      if (ringRef.current) ringRef.current.style.opacity = '1'
    }
    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0'
      if (ringRef.current) ringRef.current.style.opacity = '0'
    }

    const tick = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf.current)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary/60 pointer-events-none z-[55] transition-opacity duration-200 mix-blend-difference"
        style={{ opacity: 0 }}
        aria-hidden
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-primary pointer-events-none z-[55] transition-opacity duration-200"
        style={{ opacity: 0 }}
        aria-hidden
      />
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'

/** A thin gradient bar fixed to the very top of the viewport that reflects
 *  how far the user has scrolled through the page. */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(Math.min(100, Math.max(0, pct)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 pointer-events-none" aria-hidden>
      <div
        className="h-full bg-gradient-to-r from-primary via-violet-500 to-cyan-500 transition-[width] duration-150 ease-out shadow-[0_0_10px_rgba(124,58,237,0.6)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

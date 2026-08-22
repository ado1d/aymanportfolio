'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * VantaGlobe — the Vanta.js GLOBE effect, restored with performance guards.
 *
 * The raw effect downloads Three.js (~600 KB) from a CDN and runs a
 * full-screen WebGL animation loop, which was the main cause of mobile lag.
 * This version keeps the exact same visual but:
 *
 *   - renders on desktop-size viewports only (>= 768px); phones keep the
 *     lightweight CSS aurora background
 *   - initializes AFTER first paint (requestIdleCallback) so it never
 *     competes with page load / LCP
 *   - is skipped entirely for prefers-reduced-motion users
 *   - cleans up its WebGL context on unmount
 *   - falls back gracefully: if the CDN is unreachable, the CSS aurora
 *     background (rendered underneath) simply stays visible
 */

const DESKTOP_QUERY = '(min-width: 768px)'

// Store the VANTA.GLOBE constructor once loaded
type VantaEffect = { destroy: () => void }
type VantaGlobal = {
  GLOBE: (opts: Record<string, unknown>) => VantaEffect
}

interface VantaGlobeProps {
  color?: number
  color2?: number
  backgroundColor?: number
  size?: number
  scale?: number
  scaleMobile?: number
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Skip if already loaded (e.g. client-side navigation back to the page)
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.body.appendChild(script)
  })
}

export function VantaGlobe({
  color = 0xff3b8d,
  color2 = 0x2dd4bf,
  backgroundColor = 0x020617,
  size = 1.2,
  scale = 1.15,
  scaleMobile = 1.0,
}: VantaGlobeProps) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const effectRef = useRef<VantaEffect | null>(null)
  const [enabled, setEnabled] = useState(false)

  // Decide (and re-decide on resize) whether this viewport gets the globe.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Load Three.js + Vanta once the browser is idle, then start the effect.
  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false

    const init = async () => {
      try {
        // 1. Load Three.js (r134 — the version Vanta expects)
        await loadScript(
          'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js'
        )

        // 2. Load Vanta GLOBE (official package path first, then a fallback CDN)
        const vantaScriptUrls = [
          'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js',
          'https://cdn.jsdelivr.net/gh/tengbao/vanta@latest/dist/vanta.globe.min.js',
        ]

        let vantaLoaded = false
        let lastError: unknown

        for (const src of vantaScriptUrls) {
          try {
            await loadScript(src)
            const VANTA = (window as unknown as { VANTA?: VantaGlobal }).VANTA
            if (typeof VANTA?.GLOBE === 'function') {
              vantaLoaded = true
              break
            }
          } catch (err) {
            lastError = err
          }
        }

        if (cancelled || !vantaRef.current) return

        if (!vantaLoaded) {
          console.warn('VANTA.GLOBE not available after script load', lastError)
          return
        }

        // 3. Initialise the effect (identical options to the original site)
        const VANTA = (window as unknown as { VANTA: VantaGlobal }).VANTA
        if (!VANTA?.GLOBE) {
          console.warn('VANTA.GLOBE not available after script load')
          return
        }

        effectRef.current = VANTA.GLOBE({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 600,
          minWidth: 600,
          scale,
          scaleMobile,
          color,
          color2,
          size,
          backgroundColor,
        })
      } catch (err) {
        console.error('VantaGlobe init failed:', err)
      }
    }

    // Wait for idle so the globe never delays first paint or hydration.
    const idleId = 'requestIdleCallback' in window
      ? window.requestIdleCallback(() => init(), { timeout: 2000 })
      : window.setTimeout(init, 1200)

    return () => {
      cancelled = true
      if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId as number)
      } else {
        window.clearTimeout(idleId as number)
      }
      if (effectRef.current) {
        effectRef.current.destroy()
        effectRef.current = null
      }
    }
  }, [enabled, scale, scaleMobile, color, color2, size, backgroundColor])

  if (!enabled) return null

  return (
    <div
      className="vanta-bg fixed inset-0 z-0 min-h-screen w-screen overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Vanta renders its WebGL canvas here */}
      <div ref={vantaRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'

/**
 * VantaGlobe — the Vanta.js GLOBE effect, restored everywhere.
 *
 * The raw effect downloads Three.js (~600 KB) from a CDN and runs a
 * full-screen WebGL animation loop, which was the main cause of the old
 * mobile lag. Now that the page itself is 46% lighter and sections are
 * lazy-loaded, the globe runs on mobile again — but with guards so it
 * stays as smooth as possible:
 *
 *   - initializes AFTER first paint (requestIdleCallback) so it never
 *     competes with page load / LCP
 *   - skipped entirely for prefers-reduced-motion users
 *   - skipped on very low-end devices (budget phones with < 2 GB RAM or
 *     fewer than 2 cores) where a full-screen WebGL loop would stutter
 *   - cleans up its WebGL context on unmount
 *   - falls back gracefully: if the CDN is unreachable, the CSS aurora
 *     background (rendered underneath) simply stays visible
 */

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

/** Cheap capability probe: skip WebGL on very low-end devices only. */
function canRunWebGL(): boolean {
  try {
    const nav = navigator as Navigator & { deviceMemory?: number }
    if ((nav.hardwareConcurrency || 4) < 2) return false
    // Chrome/Android expose deviceMemory in GB; iOS Safari doesn't
    if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 2) return false
    return true
  } catch {
    return true
  }
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

  // Load Three.js + Vanta once the browser is idle, then start the effect.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!canRunWebGL()) return

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
      ? window.requestIdleCallback(() => init(), { timeout: 2500 })
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
  }, [scale, scaleMobile, color, color2, size, backgroundColor])

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

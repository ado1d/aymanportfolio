'use client'

import { useEffect, useRef } from 'react'

/**
 * VantaGlobe — A React wrapper for the Vanta.js GLOBE effect.
 * Renders an animated 3D wireframe globe as a background behind its children.
 *
 * Usage:
 *   <VantaGlobe>
 *     ...your hero content...
 *   </VantaGlobe>
 *
 * Props:
 *   - color / color2: primary and secondary globe line colors (hex numbers)
 *   - backgroundColor: background fill (hex number, default 0x0 = black)
 *   - size: globe dot/line scale (default 0.80)
 *   - scale / scaleMobile: overall scale factors
 *   - className: extra classes on the wrapper section
 *   - showGlobe: toggle the effect on/off (default true)
 */

interface VantaGlobeProps {
  color?: number
  color2?: number
  backgroundColor?: number
  size?: number
  scale?: number
  scaleMobile?: number
  className?: string
  showGlobe?: boolean
  children?: React.ReactNode
}

// Store the VANTA.GLOBE constructor once loaded
type VantaEffect = { destroy: () => void }
type VantaGlobal = {
  GLOBE: (opts: Record<string, unknown>) => VantaEffect
}

export function VantaGlobe({
  color = 0xff3b8d,
  color2 = 0x2dd4bf,
  backgroundColor = 0x020617,
  size = 1.2,
  scale = 1.15,
  scaleMobile = 1.0,
  className = '',
  showGlobe = true,
  children,
}: VantaGlobeProps) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const effectRef = useRef<VantaEffect | null>(null)

  useEffect(() => {
    if (!showGlobe) return

    let cancelled = false

    // Dynamically load Three.js + Vanta GLOBE script, then initialise.
    // We load them in order because vanta.globe.min.js depends on THREE.
    const loadScript = (src: string): Promise<void> =>
      new Promise((resolve, reject) => {
        // Skip if already loaded
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

    const initVanta = async () => {
      try {
        // 1. Load Three.js (r134 — the version Vanta expects)
        await loadScript(
          'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js'
        )

        // 2. Load Vanta GLOBE (try the official package path first, then a fallback CDN)
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

        // 3. Initialise the effect
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

    initVanta()

    // Cleanup
    return () => {
      cancelled = true
      if (effectRef.current) {
        effectRef.current.destroy()
        effectRef.current = null
      }
    }
  }, [showGlobe]) // re-init only when showGlobe toggles

  return (
    <>
      <div className="fixed inset-0 z-0 min-h-screen w-screen overflow-hidden pointer-events-none">
        {/* Vanta renders its WebGL canvas here */}
        <div
          ref={vantaRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />
      </div>
      {/* Content sits on top */}
      <div className={`relative z-10 min-h-screen w-full ${className}`}>{children}</div>
    </>
  )
}
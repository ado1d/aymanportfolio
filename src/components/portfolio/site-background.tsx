'use client'

import { AuroraBackground } from './aurora-background'
import { VantaGlobe } from './vanta-globe'

/**
 * SiteBackground — the layered page background.
 *
 * Layer 1: CSS aurora — instant, 0 KB JS, always painted underneath. It is
 *          the permanent background while the globe's scripts stream in, and
 *          the fallback if the CDN is unreachable or the device is too
 *          low-end for a full-screen WebGL loop.
 * Layer 2: Vanta globe — desktop AND mobile, initialized after the page goes
 *          idle so it never competes with first paint.
 */
export function SiteBackground() {
  return (
    <>
      <AuroraBackground />
      <VantaGlobe />
    </>
  )
}

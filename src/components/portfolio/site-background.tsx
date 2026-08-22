'use client'

import { AuroraBackground } from './aurora-background'
import { VantaGlobe } from './vanta-globe'

/**
 * SiteBackground — the layered page background.
 *
 * Layer 1: CSS aurora — instant, 0 KB JS, always painted. Mobile users keep
 *          this permanently (the WebGL globe was the main cause of phone lag).
 * Layer 2: Vanta globe — desktop viewports only, initialized after the page
 *          goes idle. Its canvas is opaque, so it visually replaces the
 *          aurora once ready; if the CDN is unreachable the aurora remains.
 */
export function SiteBackground() {
  return (
    <>
      <AuroraBackground />
      <VantaGlobe />
    </>
  )
}

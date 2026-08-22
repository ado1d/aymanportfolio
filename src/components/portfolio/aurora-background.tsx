'use client'

/**
 * AuroraBackground — A pure-CSS animated background (aurora gradient mesh + grid).
 *
 * Replaces the previous Vanta.js GLOBE effect, which downloaded Three.js
 * (~600 KB) from a CDN at runtime and ran a full-screen WebGL animation loop
 * continuously — the single biggest cause of mobile lag and battery drain.
 *
 * This component:
 *   - Costs 0 KB of JavaScript at runtime (plain markup + CSS)
 *   - Animates `transform` / `opacity` only (GPU-composited, no repaints)
 *   - Is disabled automatically under `prefers-reduced-motion`
 *   - Paints instantly with the first render — no loading flash
 */
export function AuroraBackground() {
  return (
    <div className="aurora-bg" aria-hidden="true">
      <span className="aurora-blob aurora-blob-1" />
      <span className="aurora-blob aurora-blob-2" />
      <span className="aurora-blob aurora-blob-3" />
      <span className="aurora-grid" />
    </div>
  )
}

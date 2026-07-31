'use client'

/** Animated gradient mesh background blobs.
 *  Renders 3 large, slowly-drifting colored blobs behind the content
 *  for a premium ambient effect. Uses the existing `.mesh-blob` CSS animation.
 *  Respects prefers-reduced-motion (the CSS disables the animation). */
export function MeshBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
      <div
        className="mesh-blob absolute rounded-full blur-3xl opacity-30 dark:opacity-20"
        style={{
          width: '40vw',
          height: '40vw',
          top: '-10%',
          left: '-10%',
          background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
          animationDelay: '0s',
        }}
      />
      <div
        className="mesh-blob absolute rounded-full blur-3xl opacity-25 dark:opacity-15"
        style={{
          width: '35vw',
          height: '35vw',
          top: '40%',
          right: '-10%',
          background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
          animationDelay: '-6s',
          animationDirection: 'reverse',
        }}
      />
      <div
        className="mesh-blob absolute rounded-full blur-3xl opacity-20 dark:opacity-12"
        style={{
          width: '30vw',
          height: '30vw',
          bottom: '-10%',
          left: '30%',
          background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
          animationDelay: '-12s',
        }}
      />
    </div>
  )
}

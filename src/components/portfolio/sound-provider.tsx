'use client'

import { useEffect, type ReactNode } from 'react'
import { useSoundEffects } from '@/hooks/use-sound-effects'

/** Wraps the app and plays a subtle UI click sound on any button/link click
 *  when sound is enabled. This avoids needing to wrap every individual button.
 *  Also plays a "toggle" sound for switches/checkboxes and a "success" sound
 *  when a toast with "sent"/"copied"/"saved" appears. */
export function SoundProvider({ children }: { children: ReactNode }) {
  const { play, enabled } = useSoundEffects()

  useEffect(() => {
    if (!enabled) return

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Walk up to find the closest interactive element
      const interactive = target.closest('button, a, [role="button"], [role="switch"]')
      if (!interactive) return
      // Don't play for nav anchor links (too noisy) — only buttons and [role=switch]
      if (interactive.tagName === 'A') return
      if (interactive.getAttribute('role') === 'switch') {
        play('toggle')
      } else {
        play('click')
      }
    }

    document.addEventListener('click', onClick, { passive: true })
    return () => document.removeEventListener('click', onClick)
  }, [enabled, play])

  return <>{children}</>
}

'use client'

import { useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useSoundEffects } from '@/hooks/use-sound-effects'

/** A toast helper that also plays a sound effect.
 *  Use this instead of useToast when you want success/error sounds. */
export function useSoundToast() {
  const { toast } = useToast()
  const { play } = useSoundEffects()

  const soundToast = useCallback(
    (params: {
      title: string
      description?: string
      variant?: 'default' | 'destructive'
      sound?: 'success' | 'toggle' | 'click'
    }) => {
      const { title, description, variant = 'default', sound } = params
      // Play the appropriate sound
      if (sound) {
        play(sound)
      } else if (variant === 'destructive') {
        play('toggle') // a lower-pitched sound for errors
      } else {
        play('success')
      }
      toast({ title, description, variant })
    },
    [toast, play]
  )

  return { toast: soundToast }
}

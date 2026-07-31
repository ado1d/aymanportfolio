'use client'

import { useRef, type ReactNode, type MouseEvent } from 'react'
import { useSoundEffects } from '@/hooks/use-sound-effects'

interface SoundButtonProps {
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  className?: string
  /** Sound profile to play on click. */
  sound?: 'click' | 'toggle' | 'success'
  /** Render as a different element via asChild pattern (simplified). */
  as?: 'button'
  title?: string
  'aria-label'?: string
  disabled?: boolean
}

/** A button wrapper that plays a UI sound effect on click (when sound is enabled).
 *  Drop-in replacement for <button> — forwards all props + adds sound. */
export function SoundButton({
  children,
  onClick,
  className = '',
  sound = 'click',
  title,
  'aria-label': ariaLabel,
  disabled,
}: SoundButtonProps) {
  const { play } = useSoundEffects()
  const ref = useRef<HTMLButtonElement>(null)

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    play(sound)
    onClick?.(e)
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={className}
      title={title}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

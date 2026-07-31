'use client'

import { useRef, type ReactNode, type MouseEvent } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { Slot } from '@radix-ui/react-slot'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
  /** Strength of the magnetic pull (px). Default 12. */
  strength?: number
  title?: string
}

/** A button that subtly pulls toward the cursor when hovered,
 *  creating a tactile magnetic effect. Uses the `.magnetic-btn` CSS class. */
export function MagneticButton({
  children,
  className = '',
  onClick,
  variant = 'default',
  size = 'default',
  asChild = false,
  strength = 12,
  title,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const btn = ref.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const moveX = (x / rect.width) * strength
    const moveY = (y / rect.height) * strength
    btn.style.transform = `translate(${moveX}px, ${moveY}px)`
  }

  const handleMouseLeave = () => {
    const btn = ref.current
    if (!btn) return
    btn.style.transform = 'translate(0, 0)'
  }

  const classes = `magnetic-btn ${buttonVariants({ variant, size, className })}`

  if (asChild) {
    return (
      <Slot
        ref={ref as any}
        className={classes}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        title={title}
      >
        {children}
      </Slot>
    )
  }

  return (
    <button
      ref={ref as any}
      className={classes}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  )
}

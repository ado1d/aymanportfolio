'use client'

import { useEffect, useState, useRef } from 'react'

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']

interface KonamiEasterEggProps {
  children?: React.ReactNode
}

/** Listens for the Konami code (↑↑↓↓←→←→BA) and triggers a fun overlay.
 *  Wrap the app: renders children normally, overlays confetti when activated. */
export function KonamiEasterEgg({ children }: KonamiEasterEggProps) {
  const [active, setActive] = useState(false)
  const seqRef = useRef<string[]>([])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      seqRef.current = [...seqRef.current, key].slice(-KONAMI.length)
      if (seqRef.current.join(',') === KONAMI.join(',')) {
        setActive(true)
        seqRef.current = []
        // Auto-dismiss after a few seconds
        setTimeout(() => setActive(false), 6000)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {children}
      {active && <ConfettiOverlay />}
    </>
  )
}

function ConfettiOverlay() {
  const pieces = Array.from({ length: 80 })
  const colors = ['#7c3aed', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#a855f7']

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center" aria-hidden>
      {/* Floating emoji + confetti */}
      {pieces.map((_, i) => {
        const left = Math.random() * 100
        const delay = Math.random() * 0.5
        const duration = 2.5 + Math.random() * 2
        const size = 6 + Math.random() * 10
        const color = colors[i % colors.length]
        const isEmoji = i % 5 === 0
        const emojis = ['🏆', '⚡', '💻', '🎯', '🚀', '⭐']
        return (
          <div
            key={i}
            className="absolute font-bold"
            style={{
              left: `${left}%`,
              top: '-20px',
              animation: `confetti-fall ${duration}s linear ${delay}s forwards`,
              fontSize: isEmoji ? `${size + 8}px` : undefined,
              width: isEmoji ? undefined : `${size}px`,
              height: isEmoji ? undefined : `${size}px`,
              backgroundColor: isEmoji ? undefined : color,
              borderRadius: isEmoji ? undefined : '2px',
            }}
          >
            {isEmoji ? emojis[i % emojis.length] : ''}
          </div>
        )
      })}

      <div className="relative z-10 text-center px-6">
        <div className="inline-flex p-5 rounded-full bg-primary/20 backdrop-blur-sm mb-4 pop-in">
          <span className="text-5xl">🎮</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-2 pop-in">You found the Konami code!</h2>
        <p className="text-muted-foreground pop-in" style={{ animationDelay: '0.15s' }}>
          A true problem-solver explores every corner. 🏆
        </p>
      </div>
    </div>
  )
}

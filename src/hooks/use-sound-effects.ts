'use client'

import { useState, useCallback, useRef, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'portfolio-sound-enabled'

// External store for the sound-enabled preference (localStorage-backed)
const listeners = new Set<() => void>()
let cachedValue: boolean | null = null

function getSnapshot(): boolean {
  if (cachedValue === null) {
    try {
      cachedValue = localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      cachedValue = false
    }
  }
  return cachedValue
}

function getServerSnapshot(): boolean {
  return false
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      cachedValue = null
      listener()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

function writeValue(value: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value))
  } catch {
    // ignore
  }
  cachedValue = value
  listeners.forEach((l) => l())
}

/** Hook for playing subtle UI sound effects on interactions.
 *  Sounds are synthesized via the Web Audio API (no asset files needed).
 *  Respects a localStorage preference toggle (via useSyncExternalStore). */
export function useSoundEffects() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const ctxRef = useRef<AudioContext | null>(null)

  const toggle = useCallback(() => {
    writeValue(!getSnapshot())
  }, [])

  const play = useCallback(
    (type: 'click' | 'hover' | 'success' | 'toggle' = 'click') => {
      if (!enabled) return
      try {
        if (!ctxRef.current) {
          const AC = window.AudioContext || (window as any).webkitAudioContext
          if (!AC) return
          ctxRef.current = new AC()
        }
        const ctx = ctxRef.current
        if (ctx.state === 'suspended') ctx.resume()

        const now = ctx.currentTime
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        const profiles = {
          click: { freq: 800, type: 'sine' as OscillatorType, dur: 0.06, vol: 0.04 },
          hover: { freq: 1200, type: 'sine' as OscillatorType, dur: 0.03, vol: 0.02 },
          success: { freq: 660, type: 'triangle' as OscillatorType, dur: 0.15, vol: 0.05 },
          toggle: { freq: 500, type: 'square' as OscillatorType, dur: 0.05, vol: 0.03 },
        }
        const p = profiles[type]

        osc.type = p.type
        osc.frequency.setValueAtTime(p.freq, now)
        osc.frequency.exponentialRampToValueAtTime(p.freq * 1.5, now + p.dur)
        gain.gain.setValueAtTime(p.vol, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + p.dur)

        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + p.dur)
      } catch {
        // audio not available — silently fail
      }
    },
    [enabled]
  )

  return { enabled, toggle, play }
}

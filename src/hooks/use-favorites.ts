'use client'

import { useSyncExternalStore, useCallback } from 'react'

const STORAGE_KEY = 'portfolio-favorites'

// --- External store backed by localStorage ---
const listeners = new Set<() => void>()
let cachedSnapshot: string[] | null = null

function readRaw(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function getSnapshot(): string[] {
  // Memoize per-render; invalidate on writes.
  if (cachedSnapshot === null) {
    cachedSnapshot = readRaw()
  }
  return cachedSnapshot
}

function getServerSnapshot(): string[] {
  return []
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      cachedSnapshot = null
      listener()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

function writeFavorites(arr: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
  } catch {
    // ignore quota errors
  }
  cachedSnapshot = null
  listeners.forEach((l) => l())
}

/** Hook for managing bookmarked/favorited project IDs in localStorage.
 *  Uses useSyncExternalStore for correct hydration + cross-tab sync. */
export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const hydrated = typeof window !== 'undefined'

  const toggle = useCallback((id: string) => {
    const current = getSnapshot()
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    writeFavorites(next)
  }, [])

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids])

  return {
    favorites: new Set(ids),
    toggle,
    isFavorite,
    hydrated,
    count: ids.length,
  }
}

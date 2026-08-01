'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, Loader2, Camera, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Photo {
  id: string
  imageUrl: string
  caption: string
  category: string
  claps: number
  order: number
}

const CATEGORY_COLORS: Record<string, string> = {
  Events: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  Travel: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  Achievement: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Friends: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  Life: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Campus: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
}

export default function LifestylePage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [clapping, setClapping] = useState<Set<string>>(new Set())

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/lifestyle')
      const data = await res.json()
      setPhotos(data.photos || [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const categories = ['All', ...Array.from(new Set(photos.map(p => p.category)))]

  const filtered = activeCategory === 'All' ? photos : photos.filter(p => p.category === activeCategory)

  const clap = async (id: string) => {
    if (clapping.has(id)) return
    setClapping(prev => new Set(prev).add(id))
    // Optimistic update
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, claps: p.claps + 1 } : p))
    try {
      await fetch(`/api/lifestyle/${id}/clap`, { method: 'POST' })
    } catch {
      // Revert on failure
      setPhotos(prev => prev.map(p => p.id === id ? { ...p, claps: p.claps - 1 } : p))
    }
    setTimeout(() => setClapping(prev => { const n = new Set(prev); n.delete(id); return n }), 500)
  }

  const nextPhoto = () => setLightbox(i => i === null ? null : (i + 1) % filtered.length)
  const prevPhoto = () => setLightbox(i => i === null ? null : (i - 1 + filtered.length) % filtered.length)

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') nextPhoto()
      if (e.key === 'ArrowLeft') prevPhoto()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, filtered.length])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div className="aurora" />

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
          <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            <span className="gradient-text">My Lifestyle</span>
          </h1>
        </div>
      </header>

      {/* Hero intro */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" /> Life Beyond Code
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="gradient-text">Moments That Shape Me</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Hackathons, campus life, travels, friends, and the little moments in between.
            These are the stories behind the code. Tap the heart to clap! ❤️
          </p>
        </div>
      </section>

      {/* Category filter */}
      <div className="px-4 sm:px-6 mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-md scale-105'
                  : 'bg-card border text-muted-foreground hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Photo gallery — masonry style */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((photo, i) => (
            <div
              key={photo.id}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden border bg-card hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div
                className="relative cursor-pointer overflow-hidden"
                onClick={() => setLightbox(i)}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                {/* Category badge */}
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold ${CATEGORY_COLORS[photo.category] || 'bg-muted text-muted-foreground'}`}>
                  {photo.category}
                </span>
              </div>

              {/* Caption + clap */}
              <div className="p-4">
                <p className="text-sm text-foreground/90 leading-relaxed mb-3">{photo.caption}</p>
                <button
                  onClick={() => clap(photo.id)}
                  disabled={clapping.has(photo.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    clapping.has(photo.id)
                      ? 'bg-pink-500 text-white scale-110'
                      : 'bg-muted hover:bg-pink-500/10 hover:text-pink-600 dark:hover:text-pink-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 transition-transform ${clapping.has(photo.id) ? 'scale-125 fill-current' : ''}`} />
                  <span className="tabular-nums">{photo.claps}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); setLightbox(null) }}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {filtered.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); prevPhoto() }}
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); nextPhoto() }}
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={filtered[lightbox].imageUrl}
              alt={filtered[lightbox].caption}
              className="w-full max-h-[70vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center">
              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold mb-2 ${CATEGORY_COLORS[filtered[lightbox].category] || 'bg-muted text-muted-foreground'}`}>
                {filtered[lightbox].category}
              </span>
              <p className="text-white/90 text-sm sm:text-base">{filtered[lightbox].caption}</p>
              <button
                onClick={() => clap(filtered[lightbox].id)}
                disabled={clapping.has(filtered[lightbox].id)}
                className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  clapping.has(filtered[lightbox].id) ? 'bg-pink-500 text-white scale-110' : 'bg-white/10 text-white hover:bg-pink-500/20'
                }`}
              >
                <Heart className={`w-4 h-4 ${clapping.has(filtered[lightbox].id) ? 'fill-current' : ''}`} />
                <span className="tabular-nums">{filtered[lightbox].claps}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

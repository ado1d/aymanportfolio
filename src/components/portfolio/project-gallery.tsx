'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, ImageOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'

interface ProjectGalleryProps {
  title: string
  imageUrl?: string | null
  gallery?: string | null // comma-separated URLs
  featured?: boolean
  onOpenLightbox: (url: string) => void
  onClose: () => void
}

/** A carousel gallery for the project detail modal.
 *  Combines the cover image + gallery URLs into a swipeable image set. */
export function ProjectGallery({
  title,
  imageUrl,
  gallery,
  featured,
  onOpenLightbox,
  onClose,
}: ProjectGalleryProps) {
  // Build the image list: cover first, then gallery URLs (deduped)
  const images = (() => {
    const all: string[] = []
    if (imageUrl) all.push(imageUrl)
    if (gallery) {
      gallery
        .split(',')
        .map((u) => u.trim())
        .filter((u) => u && u !== imageUrl)
        .forEach((u) => all.push(u))
    }
    return all
  })()

  const [index, setIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="relative aspect-[2/1] overflow-hidden bg-muted flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <ImageOff className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No images</p>
        </div>
      </div>
    )
  }

  const current = images[index]
  const hasMultiple = images.length > 1

  const next = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIndex((i) => (i + 1) % images.length)
  }
  const prev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIndex((i) => (i - 1 + images.length) % images.length)
  }

  return (
    <div
      className="relative aspect-[2/1] overflow-hidden bg-muted cursor-pointer group"
      onClick={() => onOpenLightbox(current)}
    >
      {/* Current image with fade transition */}
      <img
        key={index}
        src={current}
        alt={`${title} — image ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 quote-fade"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Featured badge */}
      {featured && (
        <Badge className="absolute top-3 left-3 bg-yellow-500/90 text-black hover:bg-yellow-500 z-20">
          <Star className="w-3 h-3 mr-1 fill-current" /> Featured
        </Badge>
      )}

      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-20"
        aria-label="Close"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Zoom hint */}
      <div className="absolute bottom-3 right-3 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
        <ZoomIn className="w-4 h-4" />
      </div>

      {/* Carousel controls */}
      {hasMultiple && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-20"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-20"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation()
                  setIndex(i)
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-medium z-20 pointer-events-none">
            {index + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'

interface LightboxImage {
  url: string
  title?: string
  subtitle?: string
}

interface ImageLightboxProps {
  images: LightboxImage[]
  open: boolean
  startIndex: number
  onClose: () => void
}

export function ImageLightbox({ images, open, startIndex, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(startIndex)

  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])
  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, next, prev, onClose])

  if (!images.length) return null
  const current = images[index]

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-black/95 border-white/10" showCloseButton={false} aria-describedby={undefined}>
        <DialogTitle className="sr-only">Image viewer</DialogTitle>
        <div className="relative w-full h-[80vh] flex items-center justify-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <img
            src={current.url}
            alt={current.title || 'Image'}
            className="max-w-full max-h-full object-contain"
          />

          {(current.title || current.subtitle) && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
              {current.title && <h3 className="text-xl font-bold">{current.title}</h3>}
              {current.subtitle && <p className="text-sm text-white/70">{current.subtitle}</p>}
            </div>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-white/10 text-white text-xs">
              {index + 1} / {images.length}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ZoomableImageProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  title?: string
  subtitle?: string
  onZoom?: () => void
}

export function ZoomableImage({ src, alt, className = '', imgClassName = '', title, subtitle, onZoom }: ZoomableImageProps) {
  return (
    <div className={`relative group ${className}`}>
      <img src={src} alt={alt} className={imgClassName} loading="lazy" />
      <button
        onClick={onZoom}
        className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Zoom image"
      >
        <span className="p-3 rounded-full bg-white/90 text-black transform scale-75 group-hover:scale-100 transition-transform">
          <ZoomIn className="w-5 h-5" />
        </span>
      </button>
      {(title || subtitle) && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          {title && <p className="font-semibold text-sm">{title}</p>}
          {subtitle && <p className="text-xs text-white/80">{subtitle}</p>}
        </div>
      )}
    </div>
  )
}

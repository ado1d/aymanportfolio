'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Loader2, Camera, X, ChevronLeft, ChevronRight,
  Plus, Pencil, Trash2, ShieldCheck, Upload, Loader2 as Spinner,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { uploadImage } from '@/components/portfolio/use-edit-mode'

interface Photo {
  id: string
  imageUrl: string
  caption: string
  category: string
  claps: number
  order: number
  gallery?: string | null
}

const CATEGORY_COLORS: Record<string, string> = {
  Events: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  Travel: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  Achievement: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  Friends: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  Life: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  Campus: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
}

function ClapIcon({ className = '', filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 11l-3.5-7a1.5 1.5 0 0 0-2.7 1.3L11 12" />
      <path d="M9.5 8.5l-1-2a1.5 1.5 0 0 0-2.7 1.3L7 12" />
      <path d="M14 7l-1.5-3a1.5 1.5 0 0 0-2.7 1.3L11.5 9" />
      <path d="M5 14l-1-2a1.5 1.5 0 0 0-2.7 1.3L3 16" />
      <path d="M17 11l2 4a6 6 0 0 1-5 9H9a6 6 0 0 1-6-6v-2" />
      <path d="M17.5 11.5L15 9" />
    </svg>
  )
}

export default function LifestylePage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [clapping, setClapping] = useState<Set<string>>(new Set())
  const [clapBursts, setClapBursts] = useState<Record<string, number>>({})
  const [editMode, setEditMode] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [editPhoto, setEditPhoto] = useState<Photo | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/lifestyle')
      const data = await res.json()
      setPhotos(data.photos || [])
    } catch {}
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const categories = ['All', ...Array.from(new Set(photos.map(p => p.category)))]
  const filtered = activeCategory === 'All' ? photos : photos.filter(p => p.category === activeCategory)

  const clap = async (id: string) => {
    if (clapping.has(id)) return
    setClapping(prev => new Set(prev).add(id))
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, claps: p.claps + 1 } : p))
    setClapBursts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
    try { await fetch(`/api/lifestyle/${id}/clap`, { method: 'POST' }) } catch {
      setPhotos(prev => prev.map(p => p.id === id ? { ...p, claps: p.claps - 1 } : p))
    }
    setTimeout(() => setClapping(prev => { const n = new Set(prev); n.delete(id); return n }), 600)
  }

  const login = async () => {
    try {
      const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      if (!res.ok) { toast({ title: 'Wrong password', variant: 'destructive' }); return }
      setAuthed(true); setEditMode(true); setShowLogin(false)
      toast({ title: 'Edit mode on' })
    } catch { toast({ title: 'Login failed', variant: 'destructive' }) }
  }

  const handleEdit = (photo: Photo | null) => { setEditPhoto(photo); setEditOpen(true) }

  const savePhoto = async (data: Record<string, unknown>) => {
    const isEdit = !!data.id
    const url = isEdit ? `/api/admin/lifestylePhoto/${data.id}` : '/api/admin/lifestylePhoto'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (!res.ok) throw new Error()
    toast({ title: isEdit ? 'Updated' : 'Created' })
    setEditOpen(false); load()
  }

  const deletePhoto = async (id: string) => {
    if (!confirm('Delete this photo?')) return
    await fetch(`/api/admin/lifestylePhoto/${id}`, { method: 'DELETE' })
    toast({ title: 'Deleted' }); load()
  }

  const toggleEditMode = () => {
    if (!authed) { setShowLogin(true); return }
    setEditMode(m => !m)
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
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div className="aurora" />

      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Portfolio</span>
            </Link>
            <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              <span className="gradient-text">My Lifestyle</span>
            </h1>
            <div className="flex items-center gap-2">
              <Button variant={editMode ? 'default' : 'outline'} size="sm" onClick={toggleEditMode}>
                {editMode ? <><Pencil className="w-3.5 h-3.5 mr-1.5" /> Editing</> : <><ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Edit</>}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 relative z-10 pt-16">
        <section className="py-12 sm:py-16 px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5" /> Life Beyond Code
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              <span className="gradient-text">Moments That Shape Me</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
              A visual diary of hackathons, campus life, travels, and the little moments in between.
              Tap <ClapIcon className="inline w-4 h-4 text-primary" /> to clap for your favorites!
            </p>
          </div>
        </section>

        <div className="px-4 sm:px-6 mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat ? 'bg-primary text-primary-foreground shadow-md scale-105' : 'bg-card border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}>
                {cat}
                {cat !== 'All' && <span className="ml-1.5 text-xs opacity-60">{photos.filter(p => p.category === cat).length}</span>}
              </button>
            ))}
          </div>
          {editMode && (
            <div className="flex justify-center mt-4">
              <Button onClick={() => handleEdit(null)} size="sm">
                <Plus className="w-4 h-4 mr-1.5" /> Add Photo
              </Button>
            </div>
          )}
        </div>

        <section className="px-4 sm:px-6 pb-24">
          <div className="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((photo, i) => (
              <PhotoCard key={photo.id} photo={photo} index={i} editMode={editMode}
                onEdit={() => handleEdit(photo)} onDelete={() => deletePhoto(photo.id)}
                onOpenLightbox={() => !editMode && setLightbox(i)}
                onClap={() => clap(photo.id)} clapping={clapping.has(photo.id)} clapBursts={clapBursts[photo.id] || 0}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Camera className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No photos in this category yet.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t relative z-10 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Ayman Chowdhury · Life Beyond Code</p>
        </div>
      </footer>

      {lightbox !== null && filtered[lightbox] && (
        <LightboxView photo={filtered[lightbox]} onClose={() => setLightbox(null)}
          onPrev={prevPhoto} onNext={nextPhoto} hasMultiple={filtered.length > 1}
          onClap={() => clap(filtered[lightbox].id)} clapping={clapping.has(filtered[lightbox].id)}
        />
      )}

      {showLogin && (
        <Dialog open={showLogin} onOpenChange={setShowLogin}>
          <DialogContent className="max-w-sm" aria-describedby={undefined}>
            <DialogTitle className="sr-only">Admin login</DialogTitle>
            <div className="text-center py-2">
              <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-3"><ShieldCheck className="w-6 h-6" /></div>
              <h3 className="font-semibold mb-1">Enter Edit Mode</h3>
              <p className="text-xs text-muted-foreground mb-4">Authenticate to manage photos</p>
              <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} className="mb-3" autoFocus />
              <Button onClick={login} className="w-full">Unlock</Button>
              <p className="text-[10px] text-muted-foreground mt-2">Demo: <code className="px-1 py-0.5 rounded bg-muted">portfolio2024</code></p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <PhotoEditDialog open={editOpen} onOpenChange={setEditOpen} photo={editPhoto} onSave={savePhoto} uploading={uploading} setUploading={setUploading} />
    </div>
  )
}

function getAllImages(photo: Photo): string[] {
  const all = [photo.imageUrl]
  if (photo.gallery) {
    photo.gallery.split(',').map(u => u.trim()).filter(Boolean).forEach(u => {
      if (u !== photo.imageUrl) all.push(u)
    })
  }
  return all
}

function PhotoCard({ photo, index, editMode, onEdit, onDelete, onOpenLightbox, onClap, clapping, clapBursts }: {
  photo: Photo; index: number; editMode: boolean;
  onEdit: () => void; onDelete: () => void; onOpenLightbox: () => void;
  onClap: () => void; clapping: boolean; clapBursts: number
}) {
  const [imgIndex, setImgIndex] = useState(0)
  const images = getAllImages(photo)
  const hasMultiple = images.length > 1

  const nextImg = (e: React.MouseEvent) => { e.stopPropagation(); setImgIndex(i => (i + 1) % images.length) }
  const prevImg = (e: React.MouseEvent) => { e.stopPropagation(); setImgIndex(i => (i - 1 + images.length) % images.length) }

  return (
    <div className="break-inside-avoid relative group rounded-2xl overflow-hidden border bg-card hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{ transform: `rotate(${(index % 3 - 1) * 0.5}deg)` }}>
      {editMode && (
        <div className="absolute top-2 right-2 z-30 flex gap-1">
          <button onClick={onEdit} className="p-1.5 rounded-lg bg-card/90 border hover:border-primary" aria-label="Edit"><Pencil className="w-3.5 h-3.5" /></button>
          <button onClick={onDelete} className="p-1.5 rounded-lg bg-card/90 border hover:border-destructive hover:text-destructive" aria-label="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      )}
      <div className="relative cursor-pointer overflow-hidden" onClick={onOpenLightbox}>
        <img key={imgIndex} src={images[imgIndex]} alt={photo.caption} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 gallery-fade" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${CATEGORY_COLORS[photo.category] || 'bg-muted text-muted-foreground border-border'}`}>{photo.category}</span>
        {hasMultiple && (
          <>
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium flex items-center gap-1">
              <Camera className="w-2.5 h-2.5" /> {imgIndex + 1}/{images.length}
            </span>
            <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity z-10" aria-label="Previous image"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity z-10" aria-label="Next image"><ChevronRight className="w-4 h-4" /></button>
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, di) => (
                <button key={di} onClick={(e) => { e.stopPropagation(); setImgIndex(di) }}
                  className={`h-1.5 rounded-full transition-all ${di === imgIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`} aria-label={`Image ${di + 1}`} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm text-foreground/90 leading-relaxed mb-3">{photo.caption}</p>
        <div className="flex items-center justify-between">
          <button onClick={onClap} disabled={clapping}
            className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all overflow-visible ${clapping ? 'bg-primary text-primary-foreground scale-110' : 'bg-muted hover:bg-primary/10 hover:text-primary'}`}>
            <ClapIcon className="w-4 h-4" filled={clapping} />
            <span className="tabular-nums">{photo.claps}</span>
            {clapBursts > 0 && (
              <span key={clapBursts} className="absolute -top-2 left-1/2 -translate-x-1/2 text-primary font-bold text-lg" style={{ animation: 'clap-burst 0.6s ease-out forwards' }}>+1</span>
            )}
          </button>
          <span className="text-[10px] text-muted-foreground">{new Date(photo.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  )
}

function LightboxView({ photo, onClose, onPrev, onNext, hasMultiple, onClap, clapping }: {
  photo: Photo; onClose: () => void; onPrev: () => void; onNext: () => void;
  hasMultiple: boolean; onClap: () => void; clapping: boolean
}) {
  const [imgIndex, setImgIndex] = useState(0)
  const images = getAllImages(photo)
  const hasGallery = images.length > 1
  const [lastPhotoId, setLastPhotoId] = useState<string | null>(null)
  if (photo.id !== lastPhotoId) {
    setLastPhotoId(photo.id)
    if (imgIndex !== 0) setImgIndex(0)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <button className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 z-20" onClick={(e) => { e.stopPropagation(); onClose() }} aria-label="Close"><X className="w-6 h-6" /></button>
      {hasMultiple && <>
        <button className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 z-20" onClick={(e) => { e.stopPropagation(); onPrev() }} aria-label="Previous photo"><ChevronLeft className="w-6 h-6" /></button>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 z-20" onClick={(e) => { e.stopPropagation(); onNext() }} aria-label="Next photo"><ChevronRight className="w-6 h-6" /></button>
      </>}
      <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
        <div className="relative">
          <img key={imgIndex} src={images[imgIndex]} alt={photo.caption} className="w-full max-h-[65vh] object-contain rounded-lg gallery-fade" />
          {hasGallery && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setImgIndex(i => (i - 1 + images.length) % images.length) }} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/30 z-10" aria-label="Previous image"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={(e) => { e.stopPropagation(); setImgIndex(i => (i + 1) % images.length) }} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/30 z-10" aria-label="Next image"><ChevronRight className="w-5 h-5" /></button>
              <div className="flex justify-center gap-2 mt-3">
                {images.map((img, di) => (
                  <button key={di} onClick={(e) => { e.stopPropagation(); setImgIndex(di) }}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${di === imgIndex ? 'border-primary scale-110' : 'border-white/20 opacity-50 hover:opacity-80'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="mt-4 text-center">
          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold mb-2 border ${CATEGORY_COLORS[photo.category] || 'bg-muted text-muted-foreground border-border'}`}>{photo.category}</span>
          {hasGallery && <span className="ml-2 text-[10px] text-white/50">{imgIndex + 1} / {images.length}</span>}
          <p className="text-white/90 text-sm sm:text-base mb-3">{photo.caption}</p>
          <button onClick={onClap} disabled={clapping}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${clapping ? 'bg-primary text-primary-foreground scale-110' : 'bg-white/10 text-white hover:bg-primary/20'}`}>
            <ClapIcon className="w-4 h-4" filled={clapping} />
            <span className="tabular-nums">{photo.claps}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function PhotoEditDialog({ open, onOpenChange, photo, onSave, uploading, setUploading }: {
  open: boolean; onOpenChange: (o: boolean) => void; photo: Photo | null;
  onSave: (data: Record<string, unknown>) => void; uploading: boolean; setUploading: (b: boolean) => void
}) {
  const [form, setForm] = useState({ imageUrl: '', gallery: '', caption: '', category: 'Life', order: 0 })
  const [lastPhotoId, setLastPhotoId] = useState<string | null>(null)
  const currentPhotoId = photo?.id || null
  if (open && currentPhotoId !== lastPhotoId) {
    setLastPhotoId(currentPhotoId)
    setForm({
      imageUrl: photo?.imageUrl || '', gallery: photo?.gallery || '',
      caption: photo?.caption || '', category: photo?.category || 'Life', order: photo?.order || 0,
    })
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    const url = await uploadImage(file)
    setUploading(false)
    if (url) setForm(f => ({ ...f, imageUrl: url }))
  }

  const handleGalleryUpload = async (file: File) => {
    setUploading(true)
    const url = await uploadImage(file)
    setUploading(false)
    if (url) setForm(f => ({ ...f, gallery: f.gallery ? `${f.gallery},${url}` : url }))
  }

  const removeGalleryImage = (idx: number) => {
    setForm(f => {
      const images = f.gallery ? f.gallery.split(',').map(s => s.trim()).filter(Boolean) : []
      images.splice(idx, 1)
      return { ...f, gallery: images.join(',') }
    })
  }

  const handleSave = () => {
    const data: Record<string, unknown> = { ...form }
    if (photo?.id) data.id = photo.id
    onSave(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{photo ? 'Edit Photo' : 'Add Photo'}</DialogTitle>
          <DialogDescription>Add a photo with a caption and category.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {form.imageUrl && <img src={form.imageUrl} alt="preview" className="w-full h-40 object-cover rounded-lg border" />}
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Image</Label>
            <label className="flex items-center justify-center gap-2 w-full h-10 rounded-lg border border-dashed cursor-pointer hover:bg-muted/50 text-sm text-muted-foreground">
              {uploading ? <><Spinner className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload image</>}
              <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} />
            </label>
            <Input placeholder="or paste image URL" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} className="mt-2" />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Caption</Label>
            <Textarea value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} rows={2} placeholder="What's happening in this photo?" />
          </div>
          <div>
            <Label className="mb-1.5 block text-sm font-medium">Gallery Images (optional)</Label>
            <p className="text-xs text-muted-foreground mb-2">Add more photos to this moment — they'll show as a carousel.</p>
            {form.gallery && form.gallery.split(',').filter(Boolean).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {form.gallery.split(',').map(s => s.trim()).filter(Boolean).map((img, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removeGalleryImage(idx)} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity" aria-label="Remove"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            )}
            <label className="flex items-center justify-center gap-2 w-full h-9 rounded-lg border border-dashed cursor-pointer hover:bg-muted/50 text-sm text-muted-foreground">
              {uploading ? <><Spinner className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Add gallery image</>}
              <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleGalleryUpload(f) }} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 block text-sm font-medium">Category</Label>
              <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Life, Travel, Events..." />
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-medium">Order</Label>
              <Input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!form.imageUrl || !form.caption}>{photo ? 'Save' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

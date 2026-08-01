'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Loader2, Camera, X, ChevronLeft, ChevronRight,
  Plus, Pencil, Trash2, ShieldCheck, Moon, Sun, Upload, Loader2 as Spinner,
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
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
}

const CATEGORY_COLORS: Record<string, string> = {
  Events: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  Travel: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  Achievement: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  Friends: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
  Life: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  Campus: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
}

/** Custom clap icon (two hands clapping) */
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

  // Theme
  const [isDark, setIsDark] = useState(false)

  // Admin
  const [editMode, setEditMode] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [editPhoto, setEditPhoto] = useState<Photo | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = saved === 'dark' || (!saved && prefersDark)
    setIsDark(dark)
    if (dark) document.documentElement.classList.add('dark')
  }, [])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    if (next) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark') }
    else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light') }
  }

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
    // Burst animation
    setClapBursts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
    try { await fetch(`/api/lifestyle/${id}/clap`, { method: 'POST' }) } catch {
      setPhotos(prev => prev.map(p => p.id === id ? { ...p, claps: p.claps - 1 } : p))
    }
    setTimeout(() => setClapping(prev => { const n = new Set(prev); n.delete(id); return n }), 600)
  }

  // Admin functions
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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div className="aurora" />
      <div ref={(el) => { if (el && isDark) el.style.opacity = '1' }} className="fixed inset-0 pointer-events-none z-0">
        <div className="mouse-light" style={{ position: 'absolute', top: '40%', left: '30%' }} />
      </div>

      {/* Navigation */}
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
              <div className="hidden sm:flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-muted-foreground" />
                <Switch checked={isDark} onCheckedChange={toggleTheme} aria-label="Toggle dark mode" />
                <Moon className="w-4 h-4 text-muted-foreground" />
              </div>
              <Button variant={editMode ? 'default' : 'outline'} size="sm" onClick={toggleEditMode}>
                {editMode ? <><Pencil className="w-3.5 h-3.5 mr-1.5" /> Editing</> : <><ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Edit</>}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 relative z-10 pt-16">
        {/* Hero */}
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

        {/* Category filter */}
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

        {/* Gallery — scrapbook / masonry layout */}
        <section className="px-4 sm:px-6 pb-24">
          <div className="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((photo, i) => (
              <div key={photo.id}
                className="break-inside-avoid relative group rounded-2xl overflow-hidden border bg-card hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ transform: `rotate(${(i % 3 - 1) * 0.5}deg)` }}
              >
                {/* Edit controls */}
                {editMode && (
                  <div className="absolute top-2 right-2 z-30 flex gap-1">
                    <button onClick={() => handleEdit(photo)} className="p-1.5 rounded-lg bg-card/90 border hover:border-primary" aria-label="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deletePhoto(photo.id)} className="p-1.5 rounded-lg bg-card/90 border hover:border-destructive hover:text-destructive" aria-label="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                )}

                {/* Image */}
                <div className="relative cursor-pointer overflow-hidden" onClick={() => !editMode && setLightbox(i)}>
                  <img src={photo.imageUrl} alt={photo.caption} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${CATEGORY_COLORS[photo.category] || 'bg-muted text-muted-foreground border-border'}`}>{photo.category}</span>
                </div>

                {/* Caption + clap */}
                <div className="p-4">
                  <p className="text-sm text-foreground/90 leading-relaxed mb-3">{photo.caption}</p>
                  <div className="flex items-center justify-between">
                    <button onClick={() => clap(photo.id)} disabled={clapping.has(photo.id)}
                      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all overflow-visible ${
                        clapping.has(photo.id) ? 'bg-primary text-primary-foreground scale-110' : 'bg-muted hover:bg-primary/10 hover:text-primary'
                      }`}>
                      <ClapIcon className="w-4 h-4" filled={clapping.has(photo.id)} />
                      <span className="tabular-nums">{photo.claps}</span>
                      {/* Clap burst animation */}
                      {clapBursts[photo.id] > 0 && (
                        <span key={clapBursts[photo.id]} className="absolute -top-2 left-1/2 -translate-x-1/2 text-primary font-bold text-lg" style={{ animation: 'clap-burst 0.6s ease-out forwards' }}>
                          +1
                        </span>
                      )}
                    </button>
                    <span className="text-[10px] text-muted-foreground">{new Date(photo.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
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

      {/* Footer */}
      <footer className="border-t relative z-10 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Ayman Chowdhury · Life Beyond Code</p>
        </div>
      </footer>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 z-20" onClick={(e) => { e.stopPropagation(); setLightbox(null) }} aria-label="Close"><X className="w-6 h-6" /></button>
          {filtered.length > 1 && <>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 z-20" onClick={(e) => { e.stopPropagation(); prevPhoto() }} aria-label="Previous"><ChevronLeft className="w-6 h-6" /></button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 z-20" onClick={(e) => { e.stopPropagation(); nextPhoto() }} aria-label="Next"><ChevronRight className="w-6 h-6" /></button>
          </>}
          <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <img src={filtered[lightbox].imageUrl} alt={filtered[lightbox].caption} className="w-full max-h-[70vh] object-contain rounded-lg" />
            <div className="mt-4 text-center">
              <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold mb-2 border ${CATEGORY_COLORS[filtered[lightbox].category] || 'bg-muted text-muted-foreground border-border'}`}>{filtered[lightbox].category}</span>
              <p className="text-white/90 text-sm sm:text-base mb-3">{filtered[lightbox].caption}</p>
              <button onClick={() => clap(filtered[lightbox].id)} disabled={clapping.has(filtered[lightbox].id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${clapping.has(filtered[lightbox].id) ? 'bg-primary text-primary-foreground scale-110' : 'bg-white/10 text-white hover:bg-primary/20'}`}>
                <ClapIcon className="w-4 h-4" filled={clapping.has(filtered[lightbox].id)} />
                <span className="tabular-nums">{filtered[lightbox].claps}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login dialog */}
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

      {/* Edit dialog */}
      <PhotoEditDialog open={editOpen} onOpenChange={setEditOpen} photo={editPhoto} onSave={savePhoto} uploading={uploading} setUploading={setUploading} />
    </div>
  )
}

function PhotoEditDialog({ open, onOpenChange, photo, onSave, uploading, setUploading }: {
  open: boolean; onOpenChange: (o: boolean) => void; photo: Photo | null;
  onSave: (data: Record<string, unknown>) => void; uploading: boolean; setUploading: (b: boolean) => void
}) {
  // Initialize form from photo when it changes (adjust-during-render pattern)
  const [form, setForm] = useState({ imageUrl: '', caption: '', category: 'Life', order: 0 })
  const [lastPhotoId, setLastPhotoId] = useState<string | null>(null)
  const currentPhotoId = photo?.id || null
  if (open && currentPhotoId !== lastPhotoId) {
    setLastPhotoId(currentPhotoId)
    setForm({
      imageUrl: photo?.imageUrl || '',
      caption: photo?.caption || '',
      category: photo?.category || 'Life',
      order: photo?.order || 0,
    })
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    const url = await uploadImage(file)
    setUploading(false)
    if (url) setForm(f => ({ ...f, imageUrl: url }))
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

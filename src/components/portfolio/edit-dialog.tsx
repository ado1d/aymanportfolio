'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, Upload, X } from 'lucide-react'
import { uploadImage } from './use-edit-mode'
import { useToast } from '@/hooks/use-toast'

export interface FieldDef {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'checkbox' | 'image' | 'tags'
  placeholder?: string
  required?: boolean
  full?: boolean
}

interface EditDialogProps {
  open: boolean
  onOpenChange: (o: boolean) => void
  entity: string
  title: string
  fields: FieldDef[]
  initial?: Record<string, unknown> | null
  onSaved: () => void
}

export function EditDialog({ open, onOpenChange, entity, title, fields, initial, onSaved }: EditDialogProps) {
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      const init: Record<string, unknown> = {}
      for (const f of fields) {
        init[f.key] = initial?.[f.key] ?? (f.type === 'checkbox' ? false : f.type === 'number' ? 0 : '')
      }
      if (initial?.id) init.id = initial.id
      setForm(init)
    }
  }, [open, initial, fields])

  const set = (key: string, value: unknown) => setForm((p) => ({ ...p, [key]: value }))

  const handleUpload = async (key: string, file: File) => {
    setUploadingKey(key)
    const url = await uploadImage(file)
    setUploadingKey(null)
    if (url) {
      set(key, url)
      toast({ title: 'Image uploaded' })
    } else {
      toast({ title: 'Upload failed', variant: 'destructive' })
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const isEdit = !!form.id
      const payload = { ...form }
      // coerce numbers
      for (const f of fields) {
        if (f.type === 'number' && payload[f.key] !== '') {
          payload[f.key] = Number(payload[f.key])
        }
      }
      const url = isEdit ? `/api/admin/${entity}/${form.id}` : `/api/admin/${entity}`
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Save failed')
      toast({ title: isEdit ? 'Updated' : 'Created' })
      onSaved()
      onOpenChange(false)
    } catch {
      toast({ title: 'Save failed', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Fill in the details below. Changes are saved to the database.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          {fields.map((f) => (
            <div key={f.key} className={f.full || f.type === 'textarea' || f.type === 'image' ? 'sm:col-span-2' : ''}>
              <Label htmlFor={f.key} className="mb-1.5 block text-sm font-medium">
                {f.label} {f.required && <span className="text-destructive">*</span>}
              </Label>

              {f.type === 'text' && (
                <Input
                  id={f.key}
                  value={(form[f.key] as string) || ''}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              )}

              {f.type === 'tags' && (
                <Input
                  id={f.key}
                  value={(form[f.key] as string) || ''}
                  placeholder="Comma-separated values, e.g. React, Node.js, Prisma"
                  onChange={(e) => set(f.key, e.target.value)}
                />
              )}

              {f.type === 'number' && (
                <Input
                  id={f.key}
                  type="number"
                  value={(form[f.key] as number) || 0}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              )}

              {f.type === 'textarea' && (
                <Textarea
                  id={f.key}
                  value={(form[f.key] as string) || ''}
                  placeholder={f.placeholder}
                  rows={3}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              )}

              {f.type === 'checkbox' && (
                <div className="flex items-center gap-2 h-10">
                  <Checkbox
                    id={f.key}
                    checked={(form[f.key] as boolean) || false}
                    onCheckedChange={(v) => set(f.key, v === true)}
                  />
                  <Label htmlFor={f.key} className="text-sm text-muted-foreground cursor-pointer">
                    Enable
                  </Label>
                </div>
              )}

              {f.type === 'image' && (
                <div className="space-y-2">
                  {(form[f.key] as string) && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                      <img src={form[f.key] as string} alt="preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => set(f.key, '')}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                        type="button"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <label className="flex items-center justify-center gap-2 w-full h-10 rounded-lg border border-dashed cursor-pointer hover:bg-muted/50 transition-colors text-sm text-muted-foreground">
                    {uploadingKey === f.key ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" /> Upload image
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleUpload(f.key, file)
                      }}
                    />
                  </label>
                  <Input
                    placeholder="or paste image URL"
                    value={(form[f.key] as string) || ''}
                    onChange={(e) => set(f.key, e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {form.id ? 'Save changes' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

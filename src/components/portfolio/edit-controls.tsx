'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { EditDialog, FieldDef } from './edit-dialog'
import { createEntity, updateEntity, deleteEntity } from './use-edit-mode'
import { useToast } from '@/hooks/use-toast'

interface AddButtonProps {
  entity: string
  label: string
  fields: FieldDef[]
  onSaved: () => void
  className?: string
}

export function AddButton({ entity, label, fields, onSaved, className }: AddButtonProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" size="sm" className={className} onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-1.5" /> {label}
      </Button>
      <EditDialog
        open={open}
        onOpenChange={setOpen}
        entity={entity}
        title={`Add ${label}`}
        fields={fields}
        onSaved={onSaved}
      />
    </>
  )
}

interface EditActionsProps {
  entity: string
  id: string
  fields: FieldDef[]
  data: Record<string, unknown>
  onSaved: () => void
  compact?: boolean
}

export function EditActions({ entity, id, fields, data, onSaved, compact }: EditActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!confirm('Delete this item? This cannot be undone.')) return
    setDeleting(true)
    try {
      await deleteEntity(entity, id)
      toast({ title: 'Deleted' })
      onSaved()
    } catch {
      toast({ title: 'Delete failed', variant: 'destructive' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className={`flex gap-1 ${compact ? '' : 'absolute top-3 right-3 z-20'}`}>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 edit-pulse"
          onClick={() => setEditOpen(true)}
          title="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleDelete}
          disabled={deleting}
          title="Delete"
        >
          {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        </Button>
      </div>
      <EditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        entity={entity}
        title={`Edit`}
        fields={fields}
        initial={data}
        onSaved={onSaved}
      />
    </>
  )
}

interface EditableWrapperProps {
  entity: string
  id: string
  fields: FieldDef[]
  data: Record<string, unknown>
  onSaved: () => void
  editMode: boolean
  children: React.ReactNode
  className?: string
}

export function EditableCard({ entity, id, fields, data, onSaved, editMode, children, className }: EditableWrapperProps) {
  if (!editMode) return <>{children}</>
  return (
    <div className={`relative ${className || ''}`}>
      <EditActions entity={entity} id={id} fields={fields} data={data} onSaved={onSaved} />
      {children}
    </div>
  )
}

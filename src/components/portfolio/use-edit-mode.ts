'use client'

import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

const AUTH_PASSWORD = 'portfolio2024'

export function useEditMode() {
  const [editMode, setEditMode] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const { toast } = useToast()

  const login = useCallback(
    async (password: string) => {
      try {
        const res = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        })
        if (!res.ok) {
          toast({ title: 'Wrong password', description: 'Try again.', variant: 'destructive' })
          return false
        }
        setAuthed(true)
        setEditMode(true)
        setShowLogin(false)
        toast({ title: 'Edit mode on', description: 'You can now add, edit, and delete content.' })
        return true
      } catch {
        toast({ title: 'Login failed', variant: 'destructive' })
        return false
      }
    },
    [toast]
  )

  const logout = useCallback(() => {
    setAuthed(false)
    setEditMode(false)
    toast({ title: 'Edit mode off' })
  }, [toast])

  const toggleEditMode = useCallback(() => {
    if (!authed) {
      setShowLogin(true)
      return
    }
    setEditMode((m) => !m)
  }, [authed])

  return { editMode, authed, showLogin, setShowLogin, login, logout, toggleEditMode, AUTH_PASSWORD }
}

export async function uploadImage(file: File): Promise<string | null> {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) return null
    const data = await res.json()
    return data.url as string
  } catch {
    return null
  }
}

export async function createEntity(entity: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/admin/${entity}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create')
  return res.json()
}

export async function updateEntity(entity: string, id: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/admin/${entity}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update')
  return res.json()
}

export async function deleteEntity(entity: string, id: string) {
  const res = await fetch(`/api/admin/${entity}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete')
  return res.json()
}

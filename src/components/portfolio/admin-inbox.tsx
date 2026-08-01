'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, Trash2, MailOpen, RefreshCw, Loader2, Inbox, Reply } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Message {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  read: boolean
  createdAt: string
}

interface AdminInboxProps {
  open: boolean
  onOpenChange: (o: boolean) => void
  authed: boolean
}

export function AdminInbox({ open, onOpenChange, authed }: AdminInboxProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Message | null>(null)
  const { toast } = useToast()

  const load = useCallback(async () => {
    if (!authed) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/messages')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setMessages(data.data || [])
    } catch {
      toast({ title: 'Failed to load messages', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [authed, toast])

  useEffect(() => {
    if (open) {
      load()
      setSelected(null)
    }
  }, [open, load])

  const toggleRead = async (msg: Message) => {
    try {
      const res = await fetch(`/api/admin/messages/${msg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !msg.read }),
      })
      if (!res.ok) throw new Error()
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, read: !m.read } : m)))
      if (selected?.id === msg.id) setSelected({ ...msg, read: !msg.read })
    } catch {
      toast({ title: 'Update failed', variant: 'destructive' })
    }
  }

  const remove = async (msg: Message) => {
    if (!confirm('Delete this message permanently?')) return
    try {
      const res = await fetch(`/api/admin/messages/${msg.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setMessages((prev) => prev.filter((m) => m.id !== msg.id))
      if (selected?.id === msg.id) setSelected(null)
      toast({ title: 'Message deleted' })
    } catch {
      toast({ title: 'Delete failed', variant: 'destructive' })
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Message inbox</DialogTitle>
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Inbox</h2>
            {unreadCount > 0 && (
              <Badge className="bg-primary text-primary-foreground">{unreadCount} unread</Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={load} disabled={loading} aria-label="Refresh">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 h-[60vh]">
          {/* List */}
          <div className="sm:col-span-2 border-r overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
                <Mail className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm">No messages yet.</p>
                <p className="text-xs mt-1">Contact form submissions will appear here.</p>
              </div>
            ) : (
              messages.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelected(m)
                    if (!m.read) toggleRead(m)
                  }}
                  className={`w-full text-left p-3 border-b hover:bg-muted/50 transition-colors ${
                    selected?.id === m.id ? 'bg-primary/5' : ''
                  } ${!m.read ? 'font-medium' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-sm truncate flex-1">{m.name}</span>
                    {!m.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {m.subject || m.message.slice(0, 50) + '...'}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">
                    {new Date(m.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Detail */}
          <div className="sm:col-span-3 overflow-y-auto">
            {selected ? (
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg break-words">
                      {selected.subject || '(no subject)'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      From <span className="font-medium text-foreground">{selected.name}</span>
                    </p>
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Your message')}`}
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      <Reply className="w-3 h-3" /> {selected.email}
                    </a>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleRead(selected)}
                      title={selected.read ? 'Mark unread' : 'Mark read'}
                    >
                      {selected.read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => remove(selected)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(selected.createdAt).toLocaleString()}
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border whitespace-pre-wrap text-sm leading-relaxed">
                  {selected.message}
                </div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Your message')}`}>
                    <Reply className="w-4 h-4 mr-2" /> Reply via email
                  </a>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
                <MailOpen className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm">Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

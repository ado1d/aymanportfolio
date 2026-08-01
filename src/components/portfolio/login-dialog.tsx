'use client'

import { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { ShieldCheck, Loader2, KeyRound } from 'lucide-react'

interface LoginDialogProps {
  open: boolean
  onOpenChange: (o: boolean) => void
  onLogin: (password: string) => Promise<boolean>
}

export function LoginDialog({ open, onOpenChange, onLogin }: LoginDialogProps) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const ok = await onLogin(password)
    setLoading(false)
    if (ok) {
      setPassword('')
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm" aria-describedby={undefined}>
        <DialogHeader>
          <div className="mx-auto mb-2 p-3 rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <DialogTitle className="text-center">Enter Edit Mode</DialogTitle>
          <DialogDescription className="text-center">
            Authenticate to add, edit, and delete portfolio content.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="pwd" className="mb-1.5 block text-sm font-medium flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" /> Admin password
            </Label>
            <Input
              id="pwd"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Demo password: <code className="px-1 py-0.5 rounded bg-muted font-mono">portfolio2024</code>
            </p>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={loading || !password}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Unlock Edit Mode
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

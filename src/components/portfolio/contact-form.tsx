'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Send, CheckCircle2, Mail, MapPin, Copy } from 'lucide-react'
import { useSoundToast } from '@/hooks/use-sound-toast'
import { getSocialIcon } from './icons'
import type { SocialLink } from '@/lib/types'

interface ContactFormProps {
  email: string
  location: string
  socialLinks: SocialLink[]
}

export function ContactForm({ email, location, socialLinks }: ContactFormProps) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const { toast } = useSoundToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Could not send', description: data.error, variant: 'destructive' })
        return
      }
      setSent(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      toast({
        title: 'Message sent! 🎉',
        description: "Thanks for reaching out — I'll get back to you soon.",
        sound: 'success',
      })
    } catch {
      toast({ title: 'Network error', description: 'Please try again.', variant: 'destructive' })
    } finally {
      setSending(false)
    }
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      toast({ title: 'Email copied to clipboard', sound: 'toggle' })
    } catch {
      toast({ title: 'Could not copy', variant: 'destructive' })
    }
  }

  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex p-4 rounded-full bg-green-500/10 text-green-500 mb-4 pop-in">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold mb-2">Message sent!</h3>
        <p className="text-muted-foreground mb-6">
          Thanks for reaching out. I&apos;ll get back to you as soon as possible.
        </p>
        <Button variant="outline" onClick={() => setSent(false)}>
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-5 gap-8">
      {/* Left: contact info */}
      <div className="md:col-span-2 space-y-6">
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" /> Email
          </h3>
          <button
            onClick={copyEmail}
            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-full text-left p-3 rounded-lg border hover:border-primary/40 bg-card"
          >
            <span className="truncate flex-1">{email}</span>
            <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {location && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Location
            </h3>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-3">Find me online</h3>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-card border hover:border-primary hover:text-primary hover:-translate-y-1 transition-all duration-300"
                title={link.platform}
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cf-name" className="mb-1.5 block text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cf-name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
              required
              maxLength={120}
            />
          </div>
          <div>
            <Label htmlFor="cf-email" className="mb-1.5 block text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cf-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
              required
              maxLength={200}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="cf-subject" className="mb-1.5 block text-sm font-medium">
            Subject
          </Label>
          <Input
            id="cf-subject"
            value={form.subject}
            onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
            placeholder="What's this about?"
            maxLength={200}
          />
        </div>
        <div>
          <Label htmlFor="cf-message" className="mb-1.5 block text-sm font-medium">
            Message <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="cf-message"
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            placeholder="Tell me a bit about your opportunity, idea, or question..."
            rows={5}
            required
            maxLength={5000}
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">{form.message.length}/5000</p>
        </div>
        <Button type="submit" disabled={sending} className="w-full sm:w-auto hover-lift">
          {sending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" /> Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  )
}

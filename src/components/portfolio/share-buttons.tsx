'use client'

import { useToast } from '@/hooks/use-toast'
import { Link2, Twitter, Linkedin, Facebook, Share2 } from 'lucide-react'

interface ShareButtonsProps {
  /** The project title to pre-fill share text. */
  title: string
  /** Optional URL to share; defaults to the current page URL (read lazily on click). */
  url?: string
  className?: string
}

/** A row of social share + copy-link buttons. */
export function ShareButtons({ title, url, className = '' }: ShareButtonsProps) {
  const { toast } = useToast()

  // Resolve the share URL lazily at click-time (avoids SSR/hydration mismatch
  // and the need for state/effects).
  const getShareUrl = () => url || (typeof window !== 'undefined' ? window.location.href : '')

  const shareText = `Check out "${title}" — a project by Ayman`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl())
      toast({ title: 'Link copied to clipboard!' })
    } catch {
      toast({ title: 'Could not copy link', variant: 'destructive' })
    }
  }

  const tweet = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(getShareUrl())}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const shareLinkedin = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const nativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title, text: shareText, url: getShareUrl() })
      } catch {
        // user cancelled
      }
    } else {
      copyLink()
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1">
        <Share2 className="w-3 h-3" /> Share
      </span>
      <button
        onClick={copyLink}
        className="p-2 rounded-lg border bg-card hover:border-primary hover:text-primary transition-colors"
        aria-label="Copy link"
        title="Copy link"
      >
        <Link2 className="w-4 h-4" />
      </button>
      <button
        onClick={tweet}
        className="p-2 rounded-lg border bg-card hover:border-primary hover:text-primary transition-colors"
        aria-label="Share on Twitter / X"
        title="Share on Twitter / X"
      >
        <Twitter className="w-4 h-4" />
      </button>
      <button
        onClick={shareLinkedin}
        className="p-2 rounded-lg border bg-card hover:border-primary hover:text-primary transition-colors"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </button>
      <button
        onClick={shareFacebook}
        className="p-2 rounded-lg border bg-card hover:border-primary hover:text-primary transition-colors"
        aria-label="Share on Facebook"
        title="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </button>
      <button
        onClick={nativeShare}
        className="p-2 rounded-lg border bg-card hover:border-primary hover:text-primary transition-colors sm:hidden"
        aria-label="Share via device"
        title="More share options"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  )
}

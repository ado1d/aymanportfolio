'use client'

import { Heart, Star } from 'lucide-react'
import { useFavorites } from '@/hooks/use-favorites'
import { useSoundToast } from '@/hooks/use-sound-toast'

interface FavoriteToggleProps {
  projectId: string
  projectTitle: string
}

/** A heart button on each project card to bookmark it. */
export function FavoriteToggle({ projectId, projectTitle }: FavoriteToggleProps) {
  const { isFavorite, toggle, hydrated } = useFavorites()
  const { toast } = useSoundToast()
  const fav = isFavorite(projectId)

  if (!hydrated) return null

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(projectId)
    toast({
      title: fav ? 'Removed from favorites' : 'Added to favorites',
      description: fav ? undefined : projectTitle,
      sound: fav ? 'toggle' : 'success',
    })
  }

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 text-sm transition-colors ${
        fav ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'
      }`}
      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={fav}
      title={fav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`w-4 h-4 ${fav ? 'fill-current' : ''}`} />
      <span className="hidden sm:inline">{fav ? 'Saved' : 'Save'}</span>
    </button>
  )
}

/** A small badge showing total favorites count, for the nav or hero. */
export function FavoritesCount({ className = '' }: { className?: string }) {
  const { count, hydrated } = useFavorites()
  if (!hydrated || count === 0) return null
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-medium border border-rose-500/20 ${className}`}
      title={`${count} favorited project${count !== 1 ? 's' : ''}`}
    >
      <Star className="w-3.5 h-3.5 fill-current" />
      <span className="font-semibold tabular-nums">{count}</span>
      <span className="opacity-70">saved</span>
    </span>
  )
}

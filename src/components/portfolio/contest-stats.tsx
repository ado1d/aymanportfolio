'use client'

import { useMemo } from 'react'
import { Trophy, Target, Star, TrendingUp, Award } from 'lucide-react'
import { Reveal } from './reveal'
import type { Contest } from '@/lib/types'

interface ContestStatsProps {
  contests: Contest[]
}

/** Extracts summary statistics from the contest list and renders
 *  a row of stat cards: total contests, best rank, platforms count, peak rating. */
export function ContestStats({ contests }: ContestStatsProps) {
  const stats = useMemo(() => {
    if (!contests.length) {
      return { total: 0, bestRank: null, platforms: 0, peakRating: null, medals: 0 }
    }

    // Try to parse numeric rank from strings like "Ranked 47th globally" or "1st Place"
    const rankNumbers = contests
      .map((c) => {
        if (!c.rank) return null
        const match = c.rank.match(/(\d+)/)
        return match ? parseInt(match[1], 10) : null
      })
      .filter((n): n is number => n !== null)

    const bestRank = rankNumbers.length ? Math.min(...rankNumbers) : null

    // Unique platforms
    const platformSet = new Set(contests.map((c) => c.platform))
    const platforms = platformSet.size

    // Peak rating (parse numbers from rating strings like "1845 (Specialist)")
    const ratingNumbers = contests
      .map((c) => {
        if (!c.rating) return null
        const match = c.rating.match(/(\d{3,4})/)
        return match ? parseInt(match[1], 10) : null
      })
      .filter((n): n is number => n !== null)
    const peakRating = ratingNumbers.length ? Math.max(...ratingNumbers) : null

    // Count medals (badge contains 🥇🥈🥉)
    const medals = contests.filter((c) => {
      const b = c.badge || ''
      return b.includes('🥇') || b.includes('🥈') || b.includes('🥉')
    }).length

    return {
      total: contests.length,
      bestRank,
      platforms,
      peakRating,
      medals,
    }
  }, [contests])

  if (!contests.length) return null

  const cards = [
    {
      icon: Trophy,
      label: 'Contests',
      value: `${stats.total}`,
      suffix: '+',
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
    },
    {
      icon: Target,
      label: 'Best Rank',
      value: stats.bestRank ? `#${stats.bestRank}` : '—',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: TrendingUp,
      label: 'Peak Rating',
      value: stats.peakRating ? `${stats.peakRating}` : '—',
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
    },
    {
      icon: Award,
      label: 'Platforms',
      value: `${stats.platforms}`,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
    },
    {
      icon: Star,
      label: 'Medals',
      value: `${stats.medals}`,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
  ]

  return (
    <Reveal>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <div
              key={i}
              className="glow-card hover-lift p-4 text-center rounded-xl"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={`inline-flex p-2 rounded-lg ${card.bg} ${card.color} mb-2`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className={`text-xl font-bold ${card.color}`}>{card.value}{card.suffix || ''}</div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground mt-0.5">{card.label}</div>
            </div>
          )
        })}
      </div>
    </Reveal>
  )
}

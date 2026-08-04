import { NextResponse } from 'next/server'

// In-memory cache (1 hour)
let cache: { data: unknown; ts: number } | null = null
const CACHE_TTL = 60 * 60 * 1000

const HANDLE = 'adold_op'

// Codeforces rank-tier color for a given problem rating bucket.
// Buckets are multiples of 100 (800, 900, ..., 3500) — matches CF exactly.
function colorForRating(r: number): string {
  if (r < 1200) return '#9ca3af' // Newbie — gray
  if (r < 1400) return '#00a651' // Pupil — green
  if (r < 1600) return '#0891b2' // Specialist — cyan
  if (r < 1900) return '#3b82f6' // Expert — blue
  if (r < 2100) return '#a855f7' // Candidate Master — purple
  if (r < 2300) return '#f59e0b' // Master — amber
  if (r < 2400) return '#f97316' // International Master — orange
  if (r < 2600) return '#ef4444' // Grandmaster — red
  if (r < 3000) return '#b91c1c' // International Grandmaster — dark red
  return '#7f1d1d'               // Legendary Grandmaster — near-black red
}

export async function GET() {
  try {
    if (cache && Date.now() - cache.ts < CACHE_TTL) {
      return NextResponse.json(cache.data)
    }

    // Fetch rating history + user info + solved submissions in parallel
    const [ratingRes, infoRes, statusRes] = await Promise.all([
      fetch(`https://codeforces.com/api/user.rating?handle=${HANDLE}`, {
        headers: { 'User-Agent': 'Portfolio/1.0' },
        signal: AbortSignal.timeout(10000),
      }),
      fetch(`https://codeforces.com/api/user.info?handles=${HANDLE}`, {
        headers: { 'User-Agent': 'Portfolio/1.0' },
        signal: AbortSignal.timeout(10000),
      }),
      // count=10000 grabs up to 10k most recent submissions — comfortably
      // covers a typical user's full solved set. CF API has no "all" param.
      fetch(`https://codeforces.com/api/user.status?handle=${HANDLE}&count=10000`, {
        headers: { 'User-Agent': 'Portfolio/1.0' },
        signal: AbortSignal.timeout(15000),
      }),
    ])

    if (!ratingRes.ok || !infoRes.ok) {
      throw new Error('Codeforces API error')
    }

    const ratingJson = await ratingRes.json()
    const infoJson = await infoRes.json()

    if (ratingJson.status !== 'OK' || infoJson.status !== 'OK') {
      throw new Error('Codeforces API returned error status')
    }

    const ratingHistory = ratingJson.result.map((r: any) => ({
      contestName: r.contestName,
      contestId: r.contestId,
      rank: r.rank,
      rating: r.newRating,
      oldRating: r.oldRating,
      delta: r.newRating - r.oldRating,
      date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString(),
    }))

    const info = infoJson.result[0]
    const userInfo = {
      handle: info.handle,
      firstName: info.firstName || '',
      lastName: info.lastName || '',
      avatar: info.avatar,
      titlePhoto: info.titlePhoto,
      rank: info.rank,
      maxRank: info.maxRank,
      rating: info.rating,
      maxRating: info.maxRating,
      organization: info.organization,
      city: info.city,
      country: info.country,
      friendOfCount: info.friendOfCount,
      contribution: info.contribution,
      registrationTime: new Date(info.registrationTimeSeconds * 1000).toISOString(),
    }

    // ----- Solved problems bucketed by difficulty rating -----
    // We count each unique problem only once (a problem solved in contest
    // and then re-solved in practice should not be double-counted). CF problem
    // ratings are always multiples of 100, so the rating IS the bucket key.
    let problemRatings: { rating: number; count: number; color: string }[] = []
    let totalSolvedRated = 0
    let maxDifficulty: number | null = null

    if (statusRes.ok) {
      const statusJson = await statusRes.json()
      if (statusJson.status === 'OK') {
        const solved = new Map<string, number>() // problemKey -> rating
        for (const sub of statusJson.result) {
          if (sub.verdict !== 'OK') continue
          const p = sub.problem
          if (!p || typeof p.rating !== 'number') continue
          // contestId + index uniquely identifies a problem across contests
          // and practice; fall back to name if contestId is missing (gym).
          const key = p.contestId ? `${p.contestId}-${p.index}` : `name-${p.name}`
          if (!solved.has(key)) solved.set(key, p.rating)
        }

        const bucketCount = new Map<number, number>()
        for (const rating of solved.values()) {
          bucketCount.set(rating, (bucketCount.get(rating) || 0) + 1)
        }

        // Fill zero buckets between min (800) and max so the chart has no gaps.
        const minBucket = 800
        const maxBucket = Math.max(3500, ...bucketCount.keys())
        for (let r = minBucket; r <= maxBucket; r += 100) {
          if (!bucketCount.has(r)) bucketCount.set(r, 0)
        }

        problemRatings = Array.from(bucketCount.entries())
          .filter(([r]) => r >= minBucket)
          .map(([rating, count]) => ({ rating, count, color: colorForRating(rating) }))
          .sort((a, b) => a.rating - b.rating)

        const solvedRatings = Array.from(solved.values())
        totalSolvedRated = solvedRatings.length
        if (solvedRatings.length) maxDifficulty = Math.max(...solvedRatings)
      }
    }

    const data = {
      handle: HANDLE,
      userInfo,
      ratingHistory,
      total: ratingHistory.length,
      currentRating: info.rating,
      maxRating: info.maxRating,
      rank: info.rank,
      maxRank: info.maxRank,
      problemRatings,
      totalSolvedRated,
      maxDifficulty,
    }

    cache = { data, ts: Date.now() }
    return NextResponse.json(data)
  } catch (error) {
    console.error('Codeforces API error:', error)
    return NextResponse.json({ error: 'Failed to fetch Codeforces data' }, { status: 500 })
  }
}

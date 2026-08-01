import { NextResponse } from 'next/server'

let cache: { data: unknown; ts: number } | null = null
const CACHE_TTL = 60 * 60 * 1000
const HANDLE = 'adold_op'

export async function GET() {
  try {
    if (cache && Date.now() - cache.ts < CACHE_TTL) {
      return NextResponse.json(cache.data)
    }
    const [ratingRes, infoRes] = await Promise.all([
      fetch(`https://codeforces.com/api/user.rating?handle=${HANDLE}`, { headers: { 'User-Agent': 'Portfolio/1.0' } }),
      fetch(`https://codeforces.com/api/user.info?handles=${HANDLE}`, { headers: { 'User-Agent': 'Portfolio/1.0' } }),
    ])
    if (!ratingRes.ok || !infoRes.ok) throw new Error('Codeforces API error')
    const ratingJson = await ratingRes.json()
    const infoJson = await infoRes.json()
    if (ratingJson.status !== 'OK' || infoJson.status !== 'OK') throw new Error('Codeforces API error')

    const ratingHistory = ratingJson.result.map((r: any) => ({
      contestName: r.contestName, contestId: r.contestId, rank: r.rank,
      rating: r.newRating, oldRating: r.oldRating, delta: r.newRating - r.oldRating,
      date: new Date(r.ratingUpdateTimeSeconds * 1000).toISOString(),
    }))
    const info = infoJson.result[0]
    const data = {
      handle: HANDLE,
      userInfo: {
        avatar: info.avatar, organization: info.organization, city: info.city, country: info.country,
      },
      ratingHistory, total: ratingHistory.length,
      currentRating: info.rating, maxRating: info.maxRating, rank: info.rank, maxRank: info.maxRank,
    }
    cache = { data, ts: Date.now() }
    return NextResponse.json(data)
  } catch (error) {
    console.error('Codeforces API error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

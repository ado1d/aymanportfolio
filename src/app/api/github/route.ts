import { NextResponse } from 'next/server'

// In-memory cache (1 hour)
let cache: { data: unknown; ts: number } | null = null
const CACHE_TTL = 60 * 60 * 1000

const USERNAME = 'ado1d'

export async function GET() {
  try {
    if (cache && Date.now() - cache.ts < CACHE_TTL) {
      return NextResponse.json(cache.data)
    }

    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      Accept: 'application/vnd.github.v3+json',
    }

    // Use Promise.allSettled so individual failures don't break everything.
    // The contributions page scrape (no rate limit) is the most important.
    const [userResult, eventsResult, reposResult, contribResult] = await Promise.allSettled([
      fetch(`https://api.github.com/users/${USERNAME}`, { headers, signal: AbortSignal.timeout(8000) }),
      fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=100`, { headers, signal: AbortSignal.timeout(8000) }),
      fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`, { headers, signal: AbortSignal.timeout(8000) }),
      fetch(`https://github.com/users/${USERNAME}/contributions`, {
        headers: { 'User-Agent': headers['User-Agent'] },
        signal: AbortSignal.timeout(10000),
      }),
    ])

    // Parse contributions HTML (most important — no rate limit)
    let heatmap: { date: string; count: number; level: number }[] = []
    if (contribResult.status === 'fulfilled' && contribResult.value.ok) {
      const contribHtml = await contribResult.value.text()
      const dayRegex = /data-date="([^"]+)"[^>]*data-level="(\d+)"/g
      let match
      while ((match = dayRegex.exec(contribHtml)) !== null) {
        heatmap.push({
          date: match[1],
          level: parseInt(match[2], 10),
          count: parseInt(match[2], 10),
        })
      }
    }

    // If scraping failed, fall back to building from events
    if (heatmap.length === 0 && eventsResult.status === 'fulfilled' && eventsResult.value.ok) {
      const events = await eventsResult.value.json()
      const days: Record<string, number> = {}
      const today = new Date()
      for (let i = 364; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        days[d.toISOString().slice(0, 10)] = 0
      }
      for (const e of events) {
        const dateStr = e.created_at?.slice(0, 10)
        if (dateStr && dateStr in days) days[dateStr]++
      }
      heatmap = Object.entries(days).map(([date, count]) => ({
        date,
        count,
        level: count === 0 ? 0 : Math.min(4, Math.ceil(count / 2)),
      }))
    }

    // Parse user profile (optional)
    let profile = {
      name: USERNAME,
      avatar: `https://avatars.githubusercontent.com/u/156225408?v=4`,
      bio: null as string | null,
      followers: 0,
      following: 0,
      publicRepos: 0,
      htmlUrl: `https://github.com/${USERNAME}`,
      createdAt: '',
    }
    if (userResult.status === 'fulfilled' && userResult.value.ok) {
      const user = await userResult.value.json()
      profile = {
        name: user.name || user.login,
        avatar: user.avatar_url,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        publicRepos: user.public_repos,
        htmlUrl: user.html_url,
        createdAt: user.created_at,
      }
    }

    // Parse repos (optional)
    let topRepos: any[] = []
    let languages: { language: string; count: number }[] = []
    if (reposResult.status === 'fulfilled' && reposResult.value.ok) {
      const repos = await reposResult.value.json()
      topRepos = repos
        .filter((r: any) => !r.fork)
        .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6)
        .map((r: any) => ({
          name: r.name,
          description: r.description,
          stars: r.stargazers_count,
          forks: r.forks_count,
          language: r.language,
          url: r.html_url,
          updatedAt: r.updated_at,
        }))
      const langCount: Record<string, number> = {}
      for (const r of repos) {
        if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1
      }
      languages = Object.entries(langCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([lang, count]) => ({ language: lang, count }))
    }

    const activeDays = heatmap.filter((d) => d.level > 0).length
    const totalContributions = heatmap.reduce((s, d) => s + d.level, 0)

    // Parse events count (only if not already consumed by fallback)
    let totalEvents = 0
    if (eventsResult.status === 'fulfilled' && eventsResult.value.ok && heatmap.length > 0) {
      try {
        const events = await eventsResult.value.json()
        totalEvents = Array.isArray(events) ? events.length : 0
      } catch { /* already consumed or parse error */ }
    }

    const data = {
      username: USERNAME,
      profile,
      heatmap,
      totalDays: heatmap.length,
      activeDays,
      totalContributions,
      totalEvents,
      topRepos,
      languages,
    }

    cache = { data, ts: Date.now() }
    return NextResponse.json(data)
  } catch (error) {
    console.error('GitHub API error:', error)
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 })
  }
}

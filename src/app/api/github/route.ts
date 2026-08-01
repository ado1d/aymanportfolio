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

    // Fetch user profile, events, repos, AND the full-year contribution calendar
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      Accept: 'application/vnd.github.v3+json',
    }

    const [userRes, eventsRes, reposRes, contribRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`, { headers }),
      fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=100`, { headers }),
      fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`, { headers }),
      // This endpoint returns the full-year contribution calendar HTML
      fetch(`https://github.com/users/${USERNAME}/contributions`, {
        headers: { 'User-Agent': headers['User-Agent'] },
      }),
    ])

    if (!userRes.ok) throw new Error('GitHub user API error')

    const user = await userRes.json()
    const events = eventsRes.ok ? await eventsRes.json() : []
    const repos = reposRes.ok ? await reposRes.json() : []
    const contribHtml = contribRes.ok ? await contribRes.text() : ''

    // Parse the contribution calendar: extract data-date + data-level pairs
    // data-level is 0-4 (0 = no contributions, 4 = most)
    const dayRegex = /data-date="([^"]+)"[^>]*data-level="(\d+)"/g
    const heatmap: { date: string; count: number; level: number }[] = []
    let match
    while ((match = dayRegex.exec(contribHtml)) !== null) {
      heatmap.push({
        date: match[1],
        level: parseInt(match[2], 10),
        count: parseInt(match[2], 10), // use level as count proxy for coloring
      })
    }

    // If scraping failed, fall back to building from events
    if (heatmap.length === 0) {
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
      heatmap.push(...Object.entries(days).map(([date, count]) => ({ date, count, level: 0 })))
    }

    // Count active days (level > 0) and total activity
    const activeDays = heatmap.filter((d) => d.level > 0).length
    const totalContributions = heatmap.reduce((s, d) => s + d.level, 0)

    // Top repos by stars
    const topRepos = repos
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

    // Language breakdown from repos
    const langCount: Record<string, number> = {}
    for (const r of repos) {
      if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1
    }
    const languages = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([lang, count]) => ({ language: lang, count }))

    const data = {
      username: USERNAME,
      profile: {
        name: user.name || user.login,
        avatar: user.avatar_url,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        publicRepos: user.public_repos,
        htmlUrl: user.html_url,
        createdAt: user.created_at,
      },
      heatmap, // full year of {date, level, count}
      totalDays: heatmap.length,
      activeDays,
      totalContributions,
      totalEvents: events.length,
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

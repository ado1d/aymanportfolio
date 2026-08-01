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

    // Fetch user profile, events, and repos in parallel
    const [userRes, eventsRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`, {
        headers: {
          'User-Agent': 'Portfolio/1.0',
          Accept: 'application/vnd.github.v3+json',
        },
      }),
      fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=100`, {
        headers: {
          'User-Agent': 'Portfolio/1.0',
          Accept: 'application/vnd.github.v3+json',
        },
      }),
      fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`, {
        headers: {
          'User-Agent': 'Portfolio/1.0',
          Accept: 'application/vnd.github.v3+json',
        },
      }),
    ])

    if (!userRes.ok) throw new Error('GitHub user API error')

    const user = await userRes.json()
    const events = eventsRes.ok ? await eventsRes.json() : []
    const repos = reposRes.ok ? await reposRes.json() : []

    // Aggregate events into a contribution-like heatmap (last 365 days)
    const days: Record<string, number> = {}
    const today = new Date()
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      days[d.toISOString().slice(0, 10)] = 0
    }

    let totalContributions = 0
    const eventTypes: Record<string, number> = {}
    for (const e of events) {
      const dateStr = e.created_at?.slice(0, 10)
      if (dateStr && dateStr in days) {
        days[dateStr]++
        totalContributions++
      }
      eventTypes[e.type] = (eventTypes[e.type] || 0) + 1
    }

    // Build the heatmap data array
    const heatmap = Object.entries(days).map(([date, count]) => ({ date, count }))

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
      heatmap,
      totalEvents: events.length,
      totalContributions,
      eventTypes,
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

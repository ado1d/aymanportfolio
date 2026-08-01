import { NextResponse } from 'next/server'

let cache: { data: unknown; ts: number } | null = null
const CACHE_TTL = 60 * 60 * 1000
const USERNAME = 'ado1d'

export async function GET() {
  try {
    if (cache && Date.now() - cache.ts < CACHE_TTL) return NextResponse.json(cache.data)
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      Accept: 'application/vnd.github.v3+json',
    }
    const [userResult, eventsResult, reposResult, contribResult] = await Promise.allSettled([
      fetch(`https://api.github.com/users/${USERNAME}`, { headers, signal: AbortSignal.timeout(8000) }),
      fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=100`, { headers, signal: AbortSignal.timeout(8000) }),
      fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`, { headers, signal: AbortSignal.timeout(8000) }),
      fetch(`https://github.com/users/${USERNAME}/contributions`, { headers: { 'User-Agent': headers['User-Agent'] }, signal: AbortSignal.timeout(10000) }),
    ])

    // Parse contributions HTML
    let heatmap: { date: string; count: number; level: number }[] = []
    if (contribResult.status === 'fulfilled' && contribResult.value.ok) {
      const html = await contribResult.value.text()
      const re = /data-date="([^"]+)"[^>]*data-level="(\d+)"/g
      let m
      while ((m = re.exec(html)) !== null) {
        heatmap.push({ date: m[1], level: parseInt(m[2], 10), count: parseInt(m[2], 10) })
      }
    }
    // Fallback from events
    if (heatmap.length === 0 && eventsResult.status === 'fulfilled' && eventsResult.value.ok) {
      const events = await eventsResult.value.json()
      const days: Record<string, number> = {}
      const today = new Date()
      for (let i = 364; i >= 0; i--) { const d = new Date(today); d.setDate(d.getDate() - i); days[d.toISOString().slice(0, 10)] = 0 }
      for (const e of events) { const ds = e.created_at?.slice(0, 10); if (ds && ds in days) days[ds]++ }
      heatmap = Object.entries(days).map(([date, count]) => ({ date, count, level: count === 0 ? 0 : Math.min(4, Math.ceil(count / 2)) }))
    }

    let profile = { name: USERNAME, avatar: `https://avatars.githubusercontent.com/u/156225408?v=4`, bio: null as string | null, followers: 0, following: 0, publicRepos: 0, htmlUrl: `https://github.com/${USERNAME}` }
    if (userResult.status === 'fulfilled' && userResult.value.ok) {
      const u = await userResult.value.json()
      profile = { name: u.name || u.login, avatar: u.avatar_url, bio: u.bio, followers: u.followers, following: u.following, publicRepos: u.public_repos, htmlUrl: u.html_url }
    }

    let topRepos: any[] = []
    if (reposResult.status === 'fulfilled' && reposResult.value.ok) {
      const repos = await reposResult.value.json()
      topRepos = repos.filter((r: any) => !r.fork).sort((a: any, b: any) => b.stargazers_count - a.stargazers_count).slice(0, 6).map((r: any) => ({ name: r.name, description: r.description, stars: r.stargazers_count, forks: r.forks_count, language: r.language, url: r.html_url }))
    }

    const activeDays = heatmap.filter(d => d.level > 0).length
    const data = { username: USERNAME, profile, heatmap, totalDays: heatmap.length, activeDays, totalContributions: heatmap.reduce((s, d) => s + d.level, 0), topRepos }
    cache = { data, ts: Date.now() }
    return NextResponse.json(data)
  } catch (error) {
    console.error('GitHub API error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'

// In-memory cache (15 min)
let cache: { data: unknown; ts: number } | null = null
const CACHE_TTL = 15 * 60 * 1000
const USERNAME = 'ado1d'

export async function GET() {
  try {
    if (cache && Date.now() - cache.ts < CACHE_TTL) return NextResponse.json(cache.data)

    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      Accept: 'application/vnd.github.v3+json',
    }

    const [profileResult, contribResult, reposResult] = await Promise.allSettled([
      fetch(`https://github.com/${USERNAME}`, { headers: { 'User-Agent': headers['User-Agent'] }, signal: AbortSignal.timeout(10000) }),
      fetch(`https://github.com/users/${USERNAME}/contributions`, { headers: { 'User-Agent': headers['User-Agent'] }, signal: AbortSignal.timeout(10000) }),
      fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`, { headers, signal: AbortSignal.timeout(8000) }),
    ])

    // Parse profile page
    let profile = {
      name: USERNAME,
      avatar: `https://avatars.githubusercontent.com/u/156225408?v=4`,
      bio: null as string | null,
      followers: 0,
      following: 0,
      publicRepos: 0,
      htmlUrl: `https://github.com/${USERNAME}`,
    }
    if (profileResult.status === 'fulfilled' && profileResult.value.ok) {
      const html = await profileResult.value.text()
      const nameMatch = html.match(/<span class="p-name[^"]*"[^>]*>\s*([^<]+?)\s*<\/span>/)
      const repoMatch = html.match(/(\d+)\s*repositories?/i)
      const followerMatch = html.match(/(\d+)\s*followers?/i)
      const avatarMatch = html.match(/avatars\.githubusercontent\.com\/u\/(\d+)/)
      if (nameMatch) profile.name = nameMatch[1].trim()
      if (repoMatch) profile.publicRepos = parseInt(repoMatch[1], 10)
      if (followerMatch) profile.followers = parseInt(followerMatch[1], 10)
      if (avatarMatch) profile.avatar = `https://avatars.githubusercontent.com/u/${avatarMatch[1]}?v=4`
    }

    // Parse contributions page — extract date + level + real count from tooltips
    let heatmap: { date: string; count: number; level: number }[] = []
    let totalContributions = 0
    if (contribResult.status === 'fulfilled' && contribResult.value.ok) {
      const html = await contribResult.value.text()

      // Get total from heading
      const totalMatch = html.match(/(\d+)\s*contributions?\s*in\s*the\s*last\s*year/i)
      if (totalMatch) totalContributions = parseInt(totalMatch[1], 10)

      // GitHub lays out the contribution grid as a 7-row × N-week table.
      // DOM order is: all Sundays (week 0..N), then all Mondays (week 0..N), etc.
      // The cell id encodes the coordinate: id="contribution-day-component-{dayOfWeek}-{week}".
      // We capture that coordinate so we can sort the days chronologically afterwards.
      const dayRegex = /data-date="([^"]+)"[^>]*id="contribution-day-component-(\d+)-(\d+)"[^>]*data-level="(\d+)"/g
      let match: RegExpExecArray | null
      const dayMap = new Map<string, { date: string; level: number; dayOfWeek: number; week: number; count: number }>()
      while ((match = dayRegex.exec(html)) !== null) {
        const [, date, dowStr, weekStr, levelStr] = match
        const key = `${dowStr}-${weekStr}`
        if (!dayMap.has(key)) {
          dayMap.set(key, {
            date,
            dayOfWeek: parseInt(dowStr, 10),
            week: parseInt(weekStr, 10),
            level: parseInt(levelStr, 10),
            count: 0,
          })
        }
      }

      // Tooltips look like: "5 contributions on November 16th." or "No contributions on August 3rd."
      // Each tooltip's `for` attribute points back to the day-component id, so we use that
      // to associate the real count with the right day (instead of relying on DOM order).
      const tooltipRegex = /tool-tip[^>]*for="contribution-day-component-(\d+)-(\d+)"[^>]*>([\s\S]*?)<\/tool-tip>/g
      let tMatch: RegExpExecArray | null
      while ((tMatch = tooltipRegex.exec(html)) !== null) {
        const [, dowStr, weekStr, content] = tMatch
        const key = `${dowStr}-${weekStr}`
        const day = dayMap.get(key)
        if (!day) continue
        const text = content.trim()
        if (text.includes('No contributions')) {
          day.count = 0
        } else {
          const countMatch = text.match(/(\d[\d,]*)/)
          day.count = countMatch ? parseInt(countMatch[1].replace(/,/g, ''), 10) : 0
        }
      }

      // Sort by ISO date string (lexicographic === chronological for ISO dates).
      heatmap = Array.from(dayMap.values())
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(({ date, level, count }) => ({ date, level, count }))
    }

    // Parse repos
    let topRepos: any[] = []
    if (reposResult.status === 'fulfilled' && reposResult.value.ok) {
      const repos = await reposResult.value.json()
      topRepos = repos
        .filter((r: any) => !r.fork)
        .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6)
        .map((r: any) => ({ name: r.name, description: r.description, stars: r.stargazers_count, forks: r.forks_count, language: r.language, url: r.html_url }))
    }

    const activeDays = heatmap.filter((d) => d.count > 0).length
    const data = {
      username: USERNAME,
      profile,
      heatmap,
      totalDays: heatmap.length,
      activeDays,
      totalContributions,
      topRepos,
    }

    cache = { data, ts: Date.now() }
    return NextResponse.json(data)
  } catch (error) {
    console.error('GitHub API error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

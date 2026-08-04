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

      // Extract all td elements with data-date + data-level
      const dayRegex = /data-date="([^"]+)"[^>]*data-level="(\d+)"/g
      let match
      const days: { date: string; level: number }[] = []
      while ((match = dayRegex.exec(html)) !== null) {
        days.push({ date: match[1], level: parseInt(match[2], 10) })
      }

      // Extract tooltips to get real contribution counts
      // Tooltips look like: "5 contributions on November 16th." or "No contributions on August 3rd."
      const tooltipRegex = /tool-tip[^>]*for="[^"]*contribution[^"]*"[^>]*>(.*?)<\/tool-tip>/gs
      const tooltips: string[] = []
      let tMatch
      while ((tMatch = tooltipRegex.exec(html)) !== null) {
        const text = tMatch[1].trim()
        if (text.includes('No contributions')) {
          tooltips.push('0')
        } else {
          const countMatch = text.match(/(\d+)/)
          tooltips.push(countMatch ? countMatch[1] : '0')
        }
      }

      // Combine days + counts
      heatmap = days.map((day, i) => ({
        date: day.date,
        level: day.level,
        count: i < tooltips.length ? parseInt(tooltips[i], 10) : 0,
      }))
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

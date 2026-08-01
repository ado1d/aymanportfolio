import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [
      profile,
      skills,
      education,
      hackathons,
      contests,
      certificates,
      achievements,
      projects,
      socialLinks,
      testimonials,
      currentlyItems,
      faqs,
    ] = await Promise.all([
      db.profile.findFirst(),
      db.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] }),
      db.education.findMany({ orderBy: { order: 'asc' } }),
      db.hackathon.findMany({ orderBy: { order: 'asc' } }),
      db.contest.findMany({ orderBy: { order: 'asc' } }),
      db.certificate.findMany({ orderBy: { order: 'asc' } }),
      db.achievement.findMany({ orderBy: { order: 'asc' } }),
      db.project.findMany({ orderBy: [{ featured: 'desc' }, { order: 'asc' }] }),
      db.socialLink.findMany({ orderBy: { order: 'asc' } }),
      db.testimonial.findMany({ orderBy: { order: 'asc' } }),
      db.currentlyItem.findMany({ orderBy: { order: 'asc' } }),
      db.faq.findMany({ orderBy: { order: 'asc' } }),
    ])

    const groupedSkills = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = []
      acc[skill.category].push({ id: skill.id, name: skill.name, level: skill.level })
      return acc
    }, {} as Record<string, { id: string; name: string; level: number }[]>)

    // Group currently items by type
    const groupedCurrently = currentlyItems.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = []
      acc[item.type].push(item.label)
      return acc
    }, {} as Record<string, string[]>)

    return NextResponse.json({
      profile,
      skills: groupedSkills,
      education,
      hackathons,
      contests,
      certificates,
      achievements,
      projects,
      socialLinks,
      testimonials,
      currently: groupedCurrently,
      faqs,
    })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio data' }, { status: 500 })
  }
}

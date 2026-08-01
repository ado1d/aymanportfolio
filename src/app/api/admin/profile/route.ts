import { db } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const profile = await db.profile.findFirst()
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, title, tagline, description, email, phone, location, resumeUrl } = body

    // Check if profile exists
    const existingProfile = await db.profile.findFirst()

    let profile
    if (existingProfile) {
      profile = await db.profile.update({
        where: { id: existingProfile.id },
        data: { name, title, tagline, description, email, phone, location, resumeUrl },
      })
    } else {
      profile = await db.profile.create({
        data: { name, title, tagline, description, email, phone, location, resumeUrl },
      })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

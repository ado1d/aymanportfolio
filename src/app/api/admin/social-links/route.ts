import { db } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const socialLinks = await db.socialLink.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(socialLinks)
  } catch (error) {
    console.error('Error fetching social links:', error)
    return NextResponse.json({ error: 'Failed to fetch social links' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { platform, url, icon } = body

    const maxOrder = await db.socialLink.aggregate({ _max: { order: true } })

    const socialLink = await db.socialLink.create({
      data: {
        platform,
        url,
        icon,
        order: (maxOrder._max.order || 0) + 1,
      },
    })

    return NextResponse.json(socialLink)
  } catch (error) {
    console.error('Error creating social link:', error)
    return NextResponse.json({ error: 'Failed to create social link' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, platform, url, icon, order } = body

    const socialLink = await db.socialLink.update({
      where: { id },
      data: { platform, url, icon, order },
    })

    return NextResponse.json(socialLink)
  } catch (error) {
    console.error('Error updating social link:', error)
    return NextResponse.json({ error: 'Failed to update social link' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await db.socialLink.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting social link:', error)
    return NextResponse.json({ error: 'Failed to delete social link' }, { status: 500 })
  }
}

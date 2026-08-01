import { db } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const achievements = await db.achievement.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(achievements)
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { icon, title, description } = body

    const maxOrder = await db.achievement.aggregate({ _max: { order: true } })

    const achievement = await db.achievement.create({
      data: {
        icon,
        title,
        description,
        order: (maxOrder._max.order || 0) + 1,
      },
    })

    return NextResponse.json(achievement)
  } catch (error) {
    console.error('Error creating achievement:', error)
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, icon, title, description, order } = body

    const achievement = await db.achievement.update({
      where: { id },
      data: { icon, title, description, order },
    })

    return NextResponse.json(achievement)
  } catch (error) {
    console.error('Error updating achievement:', error)
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 })
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

    await db.achievement.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting achievement:', error)
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 })
  }
}

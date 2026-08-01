import { db } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const skills = await db.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] })
    return NextResponse.json(skills)
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { category, name } = body

    // Get max order for this category
    const maxOrder = await db.skill.aggregate({
      where: { category },
      _max: { order: true },
    })

    const skill = await db.skill.create({
      data: {
        category,
        name,
        order: (maxOrder._max.order || 0) + 1,
      },
    })

    return NextResponse.json(skill)
  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 })
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

    await db.skill.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting skill:', error)
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 })
  }
}

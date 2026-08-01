import { db } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const proficiencies = await db.proficiency.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(proficiencies)
  } catch (error) {
    console.error('Error fetching proficiencies:', error)
    return NextResponse.json({ error: 'Failed to fetch proficiencies' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { icon, title, description } = body

    const maxOrder = await db.proficiency.aggregate({ _max: { order: true } })

    const proficiency = await db.proficiency.create({
      data: {
        icon,
        title,
        description,
        order: (maxOrder._max.order || 0) + 1,
      },
    })

    return NextResponse.json(proficiency)
  } catch (error) {
    console.error('Error creating proficiency:', error)
    return NextResponse.json({ error: 'Failed to create proficiency' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, icon, title, description, order } = body

    const proficiency = await db.proficiency.update({
      where: { id },
      data: { icon, title, description, order },
    })

    return NextResponse.json(proficiency)
  } catch (error) {
    console.error('Error updating proficiency:', error)
    return NextResponse.json({ error: 'Failed to update proficiency' }, { status: 500 })
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

    await db.proficiency.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting proficiency:', error)
    return NextResponse.json({ error: 'Failed to delete proficiency' }, { status: 500 })
  }
}

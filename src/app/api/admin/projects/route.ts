import { db } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'asc' }],
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, imageUrl, githubUrl, liveUrl, tags, featured } = body

    const maxOrder = await db.project.aggregate({ _max: { order: true } })

    const project = await db.project.create({
      data: {
        title,
        description,
        imageUrl,
        githubUrl,
        liveUrl,
        tags,
        featured: featured || false,
        order: (maxOrder._max.order || 0) + 1,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, description, imageUrl, githubUrl, liveUrl, tags, featured, order } = body

    const project = await db.project.update({
      where: { id },
      data: { title, description, imageUrl, githubUrl, liveUrl, tags, featured, order },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
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

    await db.project.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}

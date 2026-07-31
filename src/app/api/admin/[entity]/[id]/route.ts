import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '../../auth/route'

const ENTITY_CONFIG: Record<string, { model: keyof typeof db }> = {
  profile: { model: 'profile' },
  skill: { model: 'skill' },
  education: { model: 'education' },
  hackathon: { model: 'hackathon' },
  contest: { model: 'contest' },
  certificate: { model: 'certificate' },
  achievement: { model: 'achievement' },
  project: { model: 'project' },
  socialLink: { model: 'socialLink' },
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { entity, id } = await params
  const config = ENTITY_CONFIG[entity]
  if (!config) return NextResponse.json({ error: 'Unknown entity' }, { status: 404 })
  try {
    const body = await request.json()
    const model = db[config.model] as any
    const { id: _ignored, ...rest } = body
    const updated = await model.update({ where: { id }, data: rest })
    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ entity: string; id: string }> }
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { entity, id } = await params
  const config = ENTITY_CONFIG[entity]
  if (!config) return NextResponse.json({ error: 'Unknown entity' }, { status: 404 })
  try {
    const model = db[config.model] as any
    await model.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}

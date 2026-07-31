import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '../auth/route'

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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ entity: string }> }
) {
  const { entity } = await params
  const config = ENTITY_CONFIG[entity]
  if (!config) return NextResponse.json({ error: 'Unknown entity' }, { status: 404 })
  try {
    const model = db[config.model] as any
    const data = await model.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json({ data })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ entity: string }> }
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { entity } = await params
  const config = ENTITY_CONFIG[entity]
  if (!config) return NextResponse.json({ error: 'Unknown entity' }, { status: 404 })
  try {
    const body = await request.json()
    const model = db[config.model] as any
    const { id, ...rest } = body
    const created = await model.create({ data: rest })
    return NextResponse.json({ data: created })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const photo = await db.lifestylePhoto.update({ where: { id }, data: { claps: { increment: 1 } }, select: { id: true, claps: true } })
    return NextResponse.json(photo)
  } catch (error) {
    console.error('Clap error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

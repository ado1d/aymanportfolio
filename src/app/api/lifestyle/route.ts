import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const photos = await db.lifestylePhoto.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json({ photos })
  } catch (error) {
    console.error('Lifestyle fetch error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

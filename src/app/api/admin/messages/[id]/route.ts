import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '../../auth/route'

// Mark a message as read/unread
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  try {
    const body = await request.json()
    const updated = await db.message.update({
      where: { id },
      data: { read: body.read === true },
    })
    return NextResponse.json({ data: updated })
  } catch (error) {
    console.error('Update message error:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

// Delete a message
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  try {
    await db.message.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Delete message error:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}

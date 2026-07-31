import { NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'portfolio2024'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }
    const token = Buffer.from(`${ADMIN_PASSWORD}:${Date.now()}`).toString('base64')
    const res = NextResponse.json({ token })
    res.cookies.set('portfolio_admin', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true })
}

export function verifyAuth(request: Request): boolean {
  const cookie = request.headers.get('cookie') || ''
  const token = cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('portfolio_admin='))
  if (!token) return false
  const value = token.split('=')[1]
  try {
    const decoded = Buffer.from(value, 'base64').toString()
    return decoded.startsWith(`${ADMIN_PASSWORD}:`)
  } catch {
    return false
  }
}

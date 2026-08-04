import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/gif']
    if (!allowed.includes(file.type)) return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return uploadLocal(file)
    }

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'portfolio', resource_type: 'image',
      transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
    })

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

async function uploadLocal(file: File) {
  const { writeFileSync, mkdirSync } = await import('fs')
  const { join } = await import('path')
  const { randomUUID } = await import('crypto')
  const ext = file.name.split('.').pop()?.toLowerCase() || (file.type === 'image/svg+xml' ? 'svg' : 'png')
  const filename = `${randomUUID()}.${ext}`
  const uploadDir = join(process.cwd(), 'public', 'uploads')
  mkdirSync(uploadDir, { recursive: true })
  const bytes = await file.arrayBuffer()
  writeFileSync(join(uploadDir, filename), Buffer.from(bytes))
  return NextResponse.json({ url: `/uploads/${filename}`, filename })
}

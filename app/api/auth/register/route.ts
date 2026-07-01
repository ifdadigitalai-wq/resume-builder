import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/jwt'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['STUDENT', 'OFFICER']).default('STUDENT'),
  studentId: z.string().optional(),
  enrollmentNo: z.string().optional(),
  course: z.string().optional(),
  department: z.string().optional(),
  batch: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await db.user.findUnique({ where: { email: parsed.data.email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12)

  const finalStudentId = parsed.data.studentId || parsed.data.enrollmentNo
  const finalCourse = parsed.data.course || parsed.data.department

  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role,
      studentId: finalStudentId,
      course: finalCourse,
      batch: parsed.data.batch,
    },
    select: { id: true, email: true, name: true, role: true },
  })

  // Auto-login after register: issue token
  const token = await signToken({ id: user.id, email: user.email, name: user.name, role: user.role as any })

  const res = NextResponse.json({ user }, { status: 201 })
  res.cookies.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return res
}
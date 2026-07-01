import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/authGuard'
import { db } from '@/lib/db'

export async function GET() {
  const { session, error } = await requireAuth()
  if (error) return error

  const user = await db.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      phone: true,
      studentId: true,
      batch: true,
      course: true,
      linkedIn: true,
      github: true,
    },
  })

  if (!user) {
    const res = NextResponse.json({ error: 'User not found' }, { status: 401 })
    res.cookies.set('token', '', { maxAge: 0, path: '/' })
    res.cookies.set('session_token', '', { maxAge: 0, path: '/' })
    return res
  }

  return NextResponse.json({ user })
}

export async function PATCH(req: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error

  const body = await req.json()

  const user = await db.user.update({
    where: { id: session.id },
    data: {
      name: body.name,
      phone: body.phone,
      studentId: body.studentId,
      batch: body.batch,
      course: body.course,
      linkedIn: body.linkedIn,
      github: body.github,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      phone: true,
      studentId: true,
      batch: true,
      course: true,
      linkedIn: true,
      github: true,
    },
  })

  return NextResponse.json({ user })
}
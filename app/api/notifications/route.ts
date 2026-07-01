import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/authGuard'
import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error

  try {
    const notifications = await db.notification.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to recent 50 notifications
    })

    return NextResponse.json({ result: notifications })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { error: authError } = await requireAuth('OFFICER')
  if (authError) return authError

  try {
    const body = await req.json()
    const schema = z.object({
      studentIds: z.array(z.string()).min(1),
      message: z.string().min(1),
      type: z.string().default('MATCH'),
    })

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid notification data: ' + parsed.error.message }, { status: 400 })
    }

    const { studentIds, message, type } = parsed.data

    // Create notifications for all students in a transaction
    const notifications = await db.$transaction(
      studentIds.map((studentId) =>
        db.notification.create({
          data: {
            userId: studentId,
            message,
            type,
          },
        })
      )
    )

    return NextResponse.json({ success: true, count: notifications.length })
  } catch (e: any) {
    console.error('Failed to create notifications:', e)
    return NextResponse.json({ error: e.message || 'Failed to send notifications' }, { status: 500 })
  }
}

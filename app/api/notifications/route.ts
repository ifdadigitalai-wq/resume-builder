import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/authGuard'
import { db } from '@/lib/db'
import { z } from 'zod'
import { sendManyNotifications } from '@/lib/notificationService'

export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error

  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')

    const notifications = await db.notification.findMany({
      where: { 
        userId: session.id,
        type: type ? type : undefined,
      },
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

    // Create and broadcast notifications in a single batch
    const createdNotifs = await sendManyNotifications(studentIds, message, type);

    return NextResponse.json({ success: true, count: createdNotifs.length })
  } catch (e: any) {
    console.error('Failed to create notifications:', e)
    return NextResponse.json({ error: e.message || 'Failed to send notifications' }, { status: 500 })
  }
}

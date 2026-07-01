import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/authGuard'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error

  try {
    await db.notification.updateMany({
      where: { userId: session.id, isRead: false },
      data: { isRead: true },
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

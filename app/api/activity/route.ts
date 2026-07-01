import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/authGuard'
import { db } from '@/lib/db'

export async function GET() {
  const { session, error } = await requireAuth()
  if (error) return error

  const activities = await db.activity.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return NextResponse.json({ activities })
}

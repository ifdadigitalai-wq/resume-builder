import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/authGuard'
import { db } from '@/lib/db'

export async function GET() {
  const { session, error: authError } = await requireAuth('OFFICER')
  if (authError) return authError

  try {
    const resumes = await db.resume.findMany({
      where: { deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            course: true,
            batch: true,
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
    })

    const mapped = resumes.map(r => {
      const sections = (r.sections as any) || {}
      return {
        id: r.id,
        title: r.title,
        status: r.status,
        personal: sections.personal || null,
        course: r.user.course,
        user: {
          id: r.user.id,
          name: r.user.name,
          email: r.user.email,
        }
      }
    })

    return NextResponse.json({ data: mapped })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch resumes' }, { status: 500 })
  }
}

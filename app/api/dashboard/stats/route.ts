import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/authGuard'
import { db } from '@/lib/db'

export async function GET() {
  const { session, error } = await requireAuth()
  if (error) return error

  if (session.role === 'STUDENT') {
    const [resumes, resumesWithAts, downloads] = await Promise.all([
      db.resume.count({ where: { userId: session.id } }),
      db.resume.findMany({
        where: { userId: session.id, atsScore: { not: null } },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: { atsScore: true, updatedAt: true, title: true },
      }),
      db.activity.count({
        where: { userId: session.id, type: 'RESUME_DOWNLOADED' },
      }),
    ]) as [number, Array<{ atsScore: number | null; updatedAt: Date; title: string }>, number]

    const latestResume = await db.resume.findFirst({
      where: { userId: session.id },
      orderBy: { updatedAt: 'desc' },
      select: { completionScore: true, title: true, id: true, atsScore: true },
    })

    const recentAnalyses = resumesWithAts.map(r => ({
      overallScore: r.atsScore ?? 0,
      createdAt: r.updatedAt,
      jobTitle: r.title,
    }))

    return NextResponse.json({
      resumeCount: resumes,
      latestAtsScore: latestResume?.atsScore ?? 0,
      downloadCount: downloads,
      completionScore: latestResume?.completionScore ?? 0,
      latestResumeId: latestResume?.id ?? null,
      recentAnalyses,
    })
  }

  // Officer stats
  const [totalStudents, resumesCreated, resumesWithAts, placementReady] = await Promise.all([
    db.user.count({ where: { role: 'STUDENT' } }),
    db.resume.count({ where: { deletedAt: null } }),
    db.resume.findMany({
      where: { atsScore: { not: null }, deletedAt: null },
      select: { atsScore: true },
    }),
    db.resume.count({
      where: {
        deletedAt: null,
        completionScore: { gte: 80 },
        atsScore: { gte: 80 },
      },
    }),
  ]) as [number, number, Array<{ atsScore: number | null }>, number]

  const avgAtsScore = resumesWithAts.length
    ? Math.round(resumesWithAts.reduce((acc, r) => acc + (r.atsScore ?? 0), 0) / resumesWithAts.length)
    : 0

  return NextResponse.json({ totalStudents, resumesCreated, avgAtsScore, readyForPlacement: placementReady })
}

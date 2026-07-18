import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/authGuard'
import { db } from '@/lib/db'

export async function GET() {
  const { session, error } = await requireAuth()
  if (error) return error

  if (session.role === 'STUDENT') {
    const [resumes, resumesWithAts, downloads] = await Promise.all([
      db.resume.count({ where: { userId: session.id, deletedAt: null } }),
      db.resume.findMany({
        where: { userId: session.id, deletedAt: null, atsScore: { not: null } },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: { atsScore: true, updatedAt: true, title: true },
      }),
      db.activity.count({
        where: { userId: session.id, type: 'RESUME_DOWNLOADED' },
      }),
    ]) as [number, Array<{ atsScore: number | null; updatedAt: Date; title: string }>, number]

    // Use the latest non-deleted resume as the single source of truth
    // so that latestAtsScore, completionScore, and latestResumeId all reference the same resume
    const latestResume = await db.resume.findFirst({
      where: { userId: session.id, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      select: { completionScore: true, title: true, id: true, atsScore: true, sections: true },
    })

    const recentAnalyses = resumesWithAts.map(r => ({
      overallScore: r.atsScore ?? 0,
      createdAt: r.updatedAt,
      jobTitle: r.title,
    }))

    let projectCount = 0
    let skillCount = 0
    let hasLinkedIn = false

    if (latestResume) {
      const sections = (latestResume.sections as any) || {}
      projectCount = sections.projects?.length ?? 0
      const rawSkills = sections.skills || []
      if (Array.isArray(rawSkills)) {
        rawSkills.forEach((item: any) => {
          if (typeof item === 'string') {
            skillCount++
          } else if (item && typeof item === 'object') {
            if (Array.isArray(item.skills)) {
              skillCount += item.skills.length
            } else if (typeof item.name === 'string') {
              skillCount++
            }
          }
        })
      }
      hasLinkedIn = !!(sections.personal?.socials?.linkedIn || sections.personal?.linkedIn)
    }

    return NextResponse.json({
      resumeCount: resumes,
      latestAtsScore: latestResume?.atsScore ?? 0,
      downloadCount: downloads,
      completionScore: latestResume?.completionScore ?? 0,
      latestResumeId: latestResume?.id ?? null,
      recentAnalyses,
      projectCount,
      skillCount,
      hasLinkedIn,
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
        completionScore: { gte: 90 },
        atsScore: { gte: 80 },
      },
    }),
  ]) as [number, number, Array<{ atsScore: number | null }>, number]

  const avgAtsScore = resumesWithAts.length
    ? Math.round(resumesWithAts.reduce((acc, r) => acc + (r.atsScore ?? 0), 0) / resumesWithAts.length)
    : 0

  return NextResponse.json({ totalStudents, resumesCreated, avgAtsScore, readyForPlacement: placementReady })
}

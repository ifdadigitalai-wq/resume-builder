import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/authGuard'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const { session, error: authError } = await requireAuth('OFFICER')
  if (authError) return authError

  const { searchParams } = new URL(req.url)
  const batch = searchParams.get('batch')
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  const whereClause: any = {
    role: 'STUDENT',
  }

  if (batch) {
    whereClause.batch = batch
  }

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { studentId: { contains: search, mode: 'insensitive' } },
    ]
  }

  const students = await db.user.findMany({
    where: whereClause,
    include: {
      resumes: {
        where: { deletedAt: null },
        orderBy: { updatedAt: 'desc' },
        take: 1,
      },
      _count: { select: { resumes: true } },
    },
  }) as Array<{
    id: string
    name: string
    email: string
    studentId: string | null
    course: string | null
    batch: string | null
    updatedAt: Date
    resumes: Array<{
      atsScore: number | null
      completionScore: number
      sections: any
    }>
    _count: {
      resumes: number
    }
  }>

  let records = students.map(s => {
    const latestResume = s.resumes[0]
    const sections = (latestResume?.sections as any) || {}
    const skills: string[] = []

    if (Array.isArray(sections.skills)) {
      sections.skills.forEach((item: any) => {
        if (typeof item === 'string') {
          skills.push(item)
        } else if (item && typeof item === 'object') {
          if (Array.isArray(item.skills)) {
            item.skills.forEach((subSkill: any) => {
              if (typeof subSkill === 'string') {
                skills.push(subSkill)
              }
            })
          } else if (typeof item.name === 'string') {
            skills.push(item.name)
          }
        }
      })
    }

    // Also extract techStack from projects for richer skill matching
    if (Array.isArray(sections.projects)) {
      sections.projects.forEach((proj: any) => {
        if (Array.isArray(proj?.techStack)) {
          proj.techStack.forEach((tech: any) => {
            if (typeof tech === 'string' && !skills.includes(tech)) {
              skills.push(tech)
            }
          })
        }
      })
    }

    return {
      id: s.id,
      name: s.name,
      email: s.email,
      studentId: s.studentId,
      course: s.course,
      batch: s.batch,
      resumeCount: s._count.resumes,
      latestAtsScore: latestResume?.atsScore ?? null,
      placementStatus: deriveStatus(latestResume?.completionScore, latestResume?.atsScore ?? undefined),
      lastActive: s.updatedAt.toISOString(),
      skills,
    }
  })

  if (status) {
    const lowerStatus = status.toLowerCase()
    records = records.filter(r => r.placementStatus.toLowerCase() === lowerStatus)
  }

  return NextResponse.json({ students: records })
}

import bcrypt from 'bcryptjs'
import { z } from 'zod'

export async function POST(req: Request) {
  const { session, error: authError } = await requireAuth('OFFICER')
  if (authError) return authError

  try {
    const body = await req.json()
    const createStudentSchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      course: z.string().optional(),
      studentId: z.string().optional(),
      batch: z.string().optional(),
    })

    const parsed = createStudentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { name, email, password, course, studentId, batch } = parsed.data

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    if (studentId) {
      const existingStudentId = await db.user.findFirst({ where: { studentId } })
      if (existingStudentId) {
        return NextResponse.json({ error: 'Student ID already registered' }, { status: 409 })
      }
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'STUDENT',
        course,
        studentId,
        batch,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        course: true,
        studentId: true,
        batch: true,
      }
    })

    return NextResponse.json({ student: user }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 })
  }
}

function deriveStatus(completion?: number, atsScore?: number) {
  if (!completion) return 'Not Started'
  if (atsScore && atsScore >= 80 && completion >= 90) return 'Ready'
  if (completion >= 50) return 'In Progress'
  return 'Not Started'
}

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/authGuard'
import { db } from '@/lib/db'
import { calculateCompletion } from '@/lib/resumeUtils'

export async function GET() {
  const { session, error } = await requireAuth()
  if (error) return error

  const resumes = await db.resume.findMany({
    where: { userId: session.id, deletedAt: null },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      status: true,
      completionScore: true,
      atsScore: true,
      updatedAt: true,
    },
  })

  return NextResponse.json({ resumes })
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error

  const body = await req.json()

  const sections = body.sections ?? {
    personal: { fullName: session.name, email: session.email, phone: '', location: '', socials: {} },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
  }

  const completionScore = calculateCompletion(sections)

  const resume = await db.resume.create({
    data: {
      userId: session.id,
      title: body.title ?? 'My Resume',
      status: 'DRAFT',
      completionScore,
      sections,
    },
  })

  await db.activity.create({
    data: {
      userId: session.id,
      type: 'RESUME_CREATED',
      description: `Created new resume: "${resume.title}"`,
      metadata: { resumeId: resume.id },
    },
  })

  return NextResponse.json({ resume }, { status: 201 })
}
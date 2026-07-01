import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/authGuard'
import { db } from '@/lib/db'
import { calculateCompletion } from '@/lib/resumeUtils'

export async function GET(req: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = await params
  const { session, error } = await requireAuth()
  if (error) return error

  // Resolve target resume: look for the specific ID or user's first resume if using 'resume-001'
  const resume = await db.resume.findFirst({
    where: {
      id: resumeId === 'resume-001' ? undefined : resumeId,
      userId: session.id,
      deletedAt: null,
    },
    orderBy: { updatedAt: 'desc' },
  })

  if (!resume) {
    if (resumeId === 'resume-001') {
      const newResume = await db.resume.create({
        data: {
          id: 'resume-001',
          userId: session.id,
          title: 'My Resume',
          status: 'DRAFT',
          sections: {
            personal: { fullName: session.name, email: session.email, phone: '', location: '', socials: {} },
            summary: '',
            education: [],
            experience: [],
            projects: [],
            skills: [],
            certifications: [],
          }
        },
      })
      return NextResponse.json({ resume: newResume })
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ resume })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = await params
  const { session, error } = await requireAuth()
  if (error) return error

  const body = await req.json()
  const sections = body.sections || body

  const completionScore = calculateCompletion({
    personal: sections.personal,
    summary: sections.summary,
    experience: sections.experience,
    education: sections.education,
    skills: sections.skills,
    projects: sections.projects,
    certifications: sections.certifications,
  } as any)

  // Find target resume to update (either the matching ID, or if 'resume-001', the user's latest resume)
  const targetResume = await db.resume.findFirst({
    where: {
      id: resumeId === 'resume-001' ? undefined : resumeId,
      userId: session.id,
      deletedAt: null,
    },
    orderBy: { updatedAt: 'desc' },
  })

  let resume;
  const sectionsPayload = {
    personal: sections.personal ?? { fullName: '', email: '', phone: '', location: '', socials: {} },
    summary: sections.summary ?? '',
    education: sections.education ?? [],
    experience: sections.experience ?? [],
    projects: sections.projects ?? [],
    skills: sections.skills ?? [],
    certifications: sections.certifications ?? [],
  }

  if (targetResume) {
    resume = await db.resume.update({
      where: { id: targetResume.id },
      data: {
        title: body.title,
        status: body.status || (completionScore >= 80 ? 'COMPLETE' : 'DRAFT'),
        completionScore,
        sections: sectionsPayload,
      },
    })
  } else {
    // Fallback: create a new resume with the requested ID if none exists at all
    resume = await db.resume.create({
      data: {
        id: resumeId,
        userId: session.id,
        title: body.title || 'My Resume',
        status: body.status || (completionScore >= 80 ? 'COMPLETE' : 'DRAFT'),
        completionScore,
        sections: sectionsPayload,
      },
    })
  }

  return NextResponse.json({ resume })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = await params
  const { session, error } = await requireAuth()
  if (error) return error

  const targetResume = await db.resume.findFirst({
    where: {
      id: resumeId === 'resume-001' ? undefined : resumeId,
      userId: session.id,
      deletedAt: null,
    },
    orderBy: { updatedAt: 'desc' },
  })

  if (targetResume) {
    await db.resume.update({
      where: { id: targetResume.id },
      data: { deletedAt: new Date() }
    })
  }
  return NextResponse.json({ success: true })
}
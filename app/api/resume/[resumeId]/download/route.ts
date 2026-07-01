import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/authGuard'
import { db } from '@/lib/db'
import { jsPDF } from 'jspdf'

export async function GET(req: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = await params
  const { session, error } = await requireAuth()
  if (error) return error

  // Resolve target resume: look for the specific ID or user's first resume if using 'resume-001'
  const targetResume = await db.resume.findFirst({
    where: {
      id: resumeId === 'resume-001' ? undefined : resumeId,
      userId: session.id,
      deletedAt: null,
    },
    orderBy: { updatedAt: 'desc' },
  })

  if (!targetResume) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  }

  // Parse sections
  const sections = (targetResume.sections as any) || {}
  const personal = sections.personal || {}
  const summary = sections.summary || ''
  const experience = sections.experience || []
  const education = sections.education || []
  const skills = sections.skills || []
  const projects = sections.projects || []
  const certifications = sections.certifications || []

  // Create a new jsPDF instance (standard portrait A4)
  const doc = new jsPDF()

  // Embed resume structure in metadata for reliable future imports/parsers
  const sectionsData = {
    personal: sections.personal || {},
    summary: sections.summary || '',
    experience: sections.experience || [],
    education: sections.education || [],
    skills: sections.skills || [],
    projects: sections.projects || [],
    certifications: sections.certifications || [],
  }
  doc.setProperties({
    title: targetResume.title || 'Resume',
    subject: JSON.stringify(sectionsData),
    keywords: 'resume-builder-data-v1',
    creator: 'AI Resume Builder'
  })

  // Build the layout dynamically (using simple coordinate spacing)
  let y = 20
  doc.setFontSize(22)
  doc.text(personal.fullName || 'Unnamed Resume', 20, y)
  
  y += 8
  doc.setFontSize(10)
  doc.text(`${personal.email || ''} | ${personal.phone || ''} | ${personal.location || ''}`, 20, y)
  
  if (personal.socials?.linkedIn || personal.socials?.github) {
    y += 5
    const linkedin = personal.socials.linkedIn ? `LinkedIn: ${personal.socials.linkedIn}` : ''
    const github = personal.socials.github ? `GitHub: ${personal.socials.github}` : ''
    doc.text([linkedin, github].filter(Boolean).join('  |  '), 20, y)
  }

  if (summary) {
    y += 12
    doc.setFontSize(14)
    doc.text('PROFESSIONAL SUMMARY', 20, y)
    doc.line(20, y + 2, 190, y + 2)
    y += 8
    doc.setFontSize(10)
    const splitSummary = doc.splitTextToSize(summary, 170)
    doc.text(splitSummary, 20, y)
    y += splitSummary.length * 5
  }

  if (experience.length > 0) {
    y += 8
    doc.setFontSize(14)
    doc.text('EXPERIENCE', 20, y)
    doc.line(20, y + 2, 190, y + 2)
    y += 8
    
    experience.forEach((exp: any) => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFontSize(11)
      doc.text(`${exp.role || ''} - ${exp.company || ''}`, 20, y)
      doc.setFontSize(9)
      doc.text(`${exp.startDate || ''} to ${exp.current ? 'Present' : exp.endDate || ''}`, 150, y)
      y += 6
      if (exp.bullets && Array.isArray(exp.bullets)) {
        exp.bullets.forEach((bullet: string) => {
          if (bullet.trim()) {
            const cleaned = bullet.replace(/^[\s*•\-◦▪]+/g, '').trim()
            if (cleaned) {
              if (y > 260) { doc.addPage(); y = 20; }
              doc.setFontSize(10)
              const splitBullet = doc.splitTextToSize(`• ${cleaned}`, 165)
              doc.text(splitBullet, 25, y)
              y += splitBullet.length * 5
            }
          }
        })
      }
      y += 4
    })
  }

  if (education.length > 0) {
    y += 6
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(14)
    doc.text('EDUCATION', 20, y)
    doc.line(20, y + 2, 190, y + 2)
    y += 8

    education.forEach((edu: any) => {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFontSize(11)
      doc.text(`${edu.degree || ''} in ${edu.field || ''}`, 20, y)
      doc.text(edu.institution || '', 20, y + 5)
      doc.setFontSize(9)
      doc.text(`${edu.startDate || ''} - ${edu.endDate || ''}`, 150, y)
      y += 10
      if (edu.highlights) {
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(9)
        const splitHighlights = doc.splitTextToSize(edu.highlights, 160)
        doc.text(splitHighlights, 20, y)
        y += splitHighlights.length * 5
      }
      y += 4
    })
  }

  if (skills.length > 0) {
    y += 4
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(14)
    doc.text('SKILLS', 20, y)
    doc.line(20, y + 2, 190, y + 2)
    y += 8
    doc.setFontSize(10)
    
    let skillsText = ''
    if (typeof skills[0] === 'string') {
      skillsText = skills.join(', ')
    } else {
      skillsText = skills.map((g: any) => `${g.category || 'Skills'}: ${(g.skills || []).join(', ')}`).join(' | ')
    }
    const splitSkills = doc.splitTextToSize(skillsText, 170)
    doc.text(splitSkills, 20, y)
    y += splitSkills.length * 5
  }

  const fileName = `${targetResume.title.replace(/\s+/g, '_')}_Resume.pdf`
  
  // Create system notification
  await db.notification.create({
    data: {
      userId: session.id,
      message: `Successfully generated and downloaded PDF: "${fileName}".`,
      type: 'download',
    },
  })

  await db.activity.create({
    data: {
      userId: session.id,
      type: 'RESUME_DOWNLOADED',
      description: `Downloaded resume PDF via GET stream: "${fileName}"`,
      metadata: { resumeId: targetResume.id },
    },
  })

  const pdfOutput = doc.output('arraybuffer')
  return new NextResponse(Buffer.from(pdfOutput), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
  })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = await params
  const { session, error } = await requireAuth()
  if (error) return error

  const { fileName } = await req.json()

  // Find target resume to associate the download log with (resolve 'resume-001' dynamically)
  const targetResume = await db.resume.findFirst({
    where: {
      id: resumeId === 'resume-001' ? undefined : resumeId,
      userId: session.id,
      deletedAt: null,
    },
    orderBy: { updatedAt: 'desc' },
  })

  if (!targetResume) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  }

  // Create system notification
  await db.notification.create({
    data: {
      userId: session.id,
      message: `Successfully generated and downloaded PDF: "${fileName ?? 'resume.pdf'}".`,
      type: 'download',
    },
  })

  await db.activity.create({
    data: {
      userId: session.id,
      type: 'RESUME_DOWNLOADED',
      description: `Downloaded resume PDF: "${fileName ?? 'resume.pdf'}"`,
      metadata: { resumeId: targetResume.id },
    },
  })

  return NextResponse.json({ success: true })
}
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/authGuard'
import { db } from '@/lib/db'
import OpenAI from 'openai'

export async function POST(req: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
  const { resumeId } = await params
  const { session, error } = await requireAuth()
  if (error) return error

  try {
    const body = await req.json()
    const { jobDescription, resumeData } = body

    if (!jobDescription || !jobDescription.trim()) {
      return NextResponse.json({ error: 'Job description is required for ATS audit' }, { status: 400 })
    }
    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data is required for ATS audit' }, { status: 400 })
    }

    let apiKey = process.env.GROQ_API_KEY
    let baseURL = 'https://api.groq.com/openai/v1'
    let model = process.env.AI_MODEL || 'llama-3.3-70b-versatile'

    if (!apiKey && process.env.OPENAI_API_KEY) {
      apiKey = process.env.OPENAI_API_KEY
      baseURL = 'https://api.openai.com/v1'
      model = 'gpt-4o-mini'
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'AI Assistant API keys are not configured on the server.' }, { status: 500 })
    }

    const client = new OpenAI({ apiKey, baseURL })
    const resumeText = buildResumeText(resumeData)

    const completion = await client.chat.completions.create({
      model,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are an ATS (Applicant Tracking System) expert. Analyze the resume against the job description and return a JSON object with this exact structure:
{
  "overallScore": number (0-100),
  "keywordScore": number (0-100),
  "formattingScore": number (0-100),
  "completenessScore": number (0-100),
  "jobTitle": string,
  "keywords": {
    "matched": string[],
    "missing": string[],
    "matchRate": number
  },
  "suggestions": [
    { "section": string, "issue": string, "fix": string, "priority": "high"|"medium"|"low" }
  ],
  "sections": [
    { "name": string, "score": number, "maxScore": number, "issues": string[] }
  ]
}
Note: The overallScore MUST be calculated exactly based on the weights: keywordScore (35%), completenessScore (40%), and formattingScore (25%).`,
        },
        {
          role: 'user',
          content: `JOB DESCRIPTION:\n${jobDescription}\n\nRESUME:\n${resumeText}`,
        },
      ],
    })

    const rawContent = completion.choices[0].message.content
    if (!rawContent) {
      throw new Error('Empty response received from AI service')
    }

    const result = JSON.parse(rawContent)

  // Programmatically evaluate overallScore using the strict 35-40-25 weight criteria
  const keywordWeight = 0.35
  const completenessWeight = 0.40
  const formattingWeight = 0.25

  const evaluatedScore = Math.round(
    (result.keywordScore || 0) * keywordWeight +
    (result.completenessScore || 0) * completenessWeight +
    (result.formattingScore || 0) * formattingWeight
  )
  
  result.overallScore = Math.min(100, Math.max(0, evaluatedScore))

  // Find target resume to associate the ATS analysis with (resolve 'resume-001' dynamically)
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

  await db.resume.update({
    where: { id: targetResume.id },
    data: { atsScore: result.overallScore }
  })

  // Create system notification
  await db.notification.create({
    data: {
      userId: session.id,
      message: `Your resume scored ${result.overallScore}% compatibility for the role "${result.jobTitle || 'Job Role'}".`,
      type: 'ats',
    },
  })

  await db.activity.create({
      data: {
        userId: session.id,
        type: 'ATS_RUN',
        description: `Ran ATS analysis for "${result.jobTitle || 'Job Role'}"`,
        metadata: { resumeId: targetResume.id, score: result.overallScore },
      },
    })

    return NextResponse.json({ result: { ...result, id: Math.random().toString(), analyzedAt: new Date().toISOString() } })
  } catch (err: any) {
    console.error('ATS Audit endpoint error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to complete ATS audit' }, { status: 500 })
  }
}

function buildResumeText(data: any): string {
  const lines: string[] = []
  if (data.personal) {
    lines.push(`Name: ${data.personal.fullName}`)
    lines.push(`Email: ${data.personal.email}`)
    lines.push(`Phone: ${data.personal.phone}`)
    lines.push(`Location: ${data.personal.location}`)
  }
  if (data.summary) lines.push(`\nSUMMARY:\n${data.summary}`)
  
  if (data.experience?.length) {
    lines.push('\nEXPERIENCE:')
    data.experience.forEach((e: any) => {
      lines.push(`${e.role} at ${e.company} (${e.startDate} - ${e.current ? 'Present' : e.endDate})`)
      e.bullets?.forEach((b: string) => lines.push(`  • ${b}`))
    })
  }
  
  if (data.education?.length) {
    lines.push('\nEDUCATION:')
    data.education.forEach((e: any) => lines.push(`${e.degree} in ${e.field} — ${e.institution} (${e.startDate}–${e.endDate})`))
  }
  
  if (data.skills?.length) {
    lines.push('\nSKILLS:')
    if (typeof data.skills[0] === 'string') {
      lines.push(data.skills.join(', '))
    } else {
      data.skills.forEach((g: any) => {
        if (g && typeof g === 'object' && Array.isArray(g.skills)) {
          lines.push(`${g.category || 'Skills'}: ${g.skills.join(', ')}`)
        } else if (typeof g === 'string') {
          lines.push(g)
        }
      })
    }
  }
  
  if (data.projects?.length) {
    lines.push('\nPROJECTS:')
    data.projects.forEach((p: any) => {
      lines.push(`${p.name}: ${p.description}`)
      if (p.techStack?.length) lines.push(`  Tech: ${p.techStack.join(', ')}`)
    })
  }
  
  if (data.certifications?.length) {
    lines.push('\nCERTIFICATIONS:')
    data.certifications.forEach((c: any) => lines.push(`${c.name} — ${c.issuer} (${c.date})`))
  }
  
  return lines.join('\n')
}
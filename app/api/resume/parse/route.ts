import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/authGuard'
import { getDocumentProxy, extractText } from 'unpdf'
import OpenAI from 'openai'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  const { session, error: authError } = await requireAuth()
  if (authError) return authError

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    let parsedText = ''
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const pdfProxy = await getDocumentProxy(new Uint8Array(buffer))
      const metadata = await pdfProxy.getMetadata().catch(() => null)

      const info = metadata?.info as any
      // If the PDF has our embedded structured resume sections metadata, parse it instantly and accurately!
      if (metadata && info && info.Keywords === 'resume-builder-data-v1') {
        try {
          const parsedData = JSON.parse(info.Subject)
          if (parsedData && parsedData.personal) {
            const sections = {
              personal: {
                fullName: parsedData.personal.fullName || '',
                email: parsedData.personal.email || '',
                phone: parsedData.personal.phone || '',
                location: parsedData.personal.location || '',
                socials: {
                  linkedIn: parsedData.personal.socials?.linkedIn || '',
                  github: parsedData.personal.socials?.github || '',
                  portfolio: parsedData.personal.socials?.portfolio || '',
                }
              },
              summary: parsedData.summary || '',
              education: (parsedData.education || []).map((edu: any) => ({
                id: edu.id || uuidv4(),
                institution: edu.institution || '',
                degree: edu.degree || '',
                field: edu.field || '',
                startDate: edu.startDate || '',
                endDate: edu.endDate || '',
              })),
              experience: (parsedData.experience || []).map((exp: any) => ({
                id: exp.id || uuidv4(),
                company: exp.company || '',
                role: exp.role || '',
                startDate: exp.startDate || '',
                endDate: exp.endDate || '',
                current: !!exp.current,
                bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
              })),
              projects: (parsedData.projects || []).map((proj: any) => ({
                id: proj.id || uuidv4(),
                name: proj.name || '',
                description: proj.description || '',
                techStack: Array.isArray(proj.techStack) ? proj.techStack : [],
              })),
              skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
              certifications: (parsedData.certifications || []).map((cert: any) => ({
                id: cert.id || uuidv4(),
                name: cert.name || '',
                issuer: cert.issuer || '',
                date: cert.date || '',
              })),
            }
            return NextResponse.json({ sections })
          }
        } catch (jsonErr) {
          console.error('Failed to parse embedded metadata Subject JSON:', jsonErr)
        }
      }

      // Otherwise, fall back to standard text extraction
      const { text } = await extractText(pdfProxy, { mergePages: true })
      parsedText = text
    } else {
      // Fallback for docx or txt: read buffer as text
      parsedText = buffer.toString('utf-8')
    }

    if (!parsedText || !parsedText.trim()) {
      return NextResponse.json({ error: 'Could not extract text from the file. This PDF might be scanned or image-only. Please upload a text-based PDF (e.g., exported from Word, Google Docs, or the dashboard).' }, { status: 400 })
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

    const systemPrompt = `You are an expert resume parsing AI.
Analyze the provided resume text and extract the information into the exact JSON format specified below.
Ensure that dates are standard strings (e.g., "June 2021 - Present" or "2019 - 2023").

The output JSON structure MUST be exactly:
{
  "personal": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string (e.g. City, State)",
    "socials": {
      "linkedIn": "string (URL or username)",
      "github": "string (URL or username)",
      "portfolio": "string (URL)"
    }
  },
  "summary": "string (professional summary/profile)",
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string (field of study)",
      "startDate": "string",
      "endDate": "string"
    }
  ],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "startDate": "string",
      "endDate": "string",
      "current": boolean,
      "bullets": ["string"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "techStack": ["string"]
    }
  ],
  "skills": ["string"],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "string"
    }
  ]
}

If a section is completely missing or empty, return an empty array or empty fields for it.
Provide ONLY the raw JSON object, no markdown blocks, no commentary.`

    const response = await client.chat.completions.create({
      model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: parsedText },
      ],
      temperature: 0.1,
    })

    const parsedJsonStr = response.choices[0]?.message?.content || '{}'
    const parsedData = JSON.parse(parsedJsonStr)

    // Ensure all sections are present and add valid UUIDs to list items
    const sections = {
      personal: {
        fullName: parsedData.personal?.fullName || session.name || '',
        email: parsedData.personal?.email || session.email || '',
        phone: parsedData.personal?.phone || '',
        location: parsedData.personal?.location || '',
        socials: {
          linkedIn: parsedData.personal?.socials?.linkedIn || '',
          github: parsedData.personal?.socials?.github || '',
          portfolio: parsedData.personal?.socials?.portfolio || '',
        }
      },
      summary: parsedData.summary || '',
      education: (parsedData.education || []).map((edu: any) => ({
        id: uuidv4(),
        institution: edu.institution || '',
        degree: edu.degree || '',
        field: edu.field || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
      })),
      experience: (parsedData.experience || []).map((exp: any) => ({
        id: uuidv4(),
        company: exp.company || '',
        role: exp.role || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        current: !!exp.current,
        bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
      })),
      projects: (parsedData.projects || []).map((proj: any) => ({
        id: uuidv4(),
        name: proj.name || '',
        description: proj.description || '',
        techStack: Array.isArray(proj.techStack) ? proj.techStack : [],
      })),
      skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
      certifications: (parsedData.certifications || []).map((cert: any) => ({
        id: uuidv4(),
        name: cert.name || '',
        issuer: cert.issuer || '',
        date: cert.date || '',
      })),
    }

    return NextResponse.json({ sections })
  } catch (err: any) {
    console.error('Parser error:', err)
    return NextResponse.json({ error: err.message || 'Failed to parse resume file' }, { status: 500 })
  }
}

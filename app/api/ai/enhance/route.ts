import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/authGuard'
import OpenAI from 'openai'

const PROMPTS: Record<string, (input: string, ctx: any) => string> = {
  enhance_bullet: (input, ctx) =>
    `You are a professional resume writer. Improve this resume bullet point to be more impactful, quantified, and ATS-friendly. Use strong action verbs. Keep it under 15 words. Return only the improved bullet, no explanation.
Person: ${ctx.name}, Role: ${ctx.role}
Original: ${input}`,

  enhance_bullets: (input, ctx) =>
    `You are a professional resume writer. Improve this resume bullet point to be more impactful, quantified, and ATS-friendly. Use strong action verbs. Keep it under 15 words. Return only the improved bullet, no explanation.
Person: ${ctx.name}, Role: ${ctx.role}
Original: ${input}`,

  generate_summary: (input, ctx) =>
    `Write a professional resume summary (3-4 sentences, max 80 words) for this candidate. Make it ATS-optimized and compelling.
Name: ${ctx.name}, Skills: ${ctx.skills}
Context from user: ${input}
Return only the summary text.`,

  enhance_summary: (input, ctx) =>
    `Write a professional resume summary (3-4 sentences, max 80 words) for this candidate. Make it ATS-optimized and compelling.
Name: ${ctx.name}, Skills: ${ctx.skills}
Context from user: ${input}
Return only the summary text.`,

  improve_description: (input, ctx) =>
    `Improve this project/experience description for a resume. Make it concise, impactful, and highlight technical skills.
Original: ${input}
Return only the improved text.`,

  suggest_skills: (input, ctx) =>
    `Based on this job role context, suggest relevant skills to add to a resume.
Candidate's existing skills: ${ctx.skills || 'None'}
Return as a comma-separated list of skills only. Do NOT suggest any skills that are already present in the candidate's existing skills list. Keep suggestions strictly relevant to the role context: "${input}".`,

  fix_ats: (input, ctx) =>
    `You are an ATS optimization expert. Fix this specific ATS compatibility issue in the resume. 
Context: ${ctx.name}, Role: ${ctx.role}, Skills: ${ctx.skills}
Issue to fix: ${input}
Return only the optimized text/bullet replacement without explanation.`,

  suggest_certifications: (input, ctx) =>
    `Suggest 3-4 professional and industry-standard certifications for a candidate with role/skills context: "${input}". 
Candidate's existing certifications: ${ctx.certifications || 'None'}
Return a comma-separated list of certification names only. Do NOT suggest any certifications that are already present in the candidate's existing certifications list. No explanation.`,

  suggest_highlights: (input, ctx) =>
    `Based on the education/institution/field context: "${input}", suggest 2-3 key academic highlights, coursework, or project achievements that stand out on a resume. 
Return as a short list of bullets (maximum 15 words per bullet). No other explanation.`,

  categorise_skills: (input, ctx) =>
    `Categorise this comma-separated list of skills: "${input}" into logical categories (e.g. Frontend, Backend, Programming Languages, Tools). 
Return the formatted categories and skills only, in a clean, concise list.`,

  suggest_title: (input, ctx) =>
    `Suggest 3 professional, short, and punchy resume headlines or target role titles (e.g. "Full Stack Engineer | React & Node.js") for a candidate with this profile context: "${input}".
Candidate's current target roles/titles: ${ctx.role || 'None'}
Return only the list of titles separated by pipe | symbol. Do NOT suggest any title that is already present in the candidate's current titles. No explanation.`,

  chat: (input, ctx) =>
    `You are an expert AI resume writing assistant. Assist the candidate with their resume editing query.
Candidate context: Name: ${ctx.name || 'Candidate'}, Role: ${ctx.role || 'Software Engineer'}, Skills: ${ctx.skills || 'Not specified'}, Certifications: ${ctx.certifications || 'Not specified'}
Candidate query: "${input}"
Provide a helpful, professional, and direct response or recommended resume copy without introductory filler.`,
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth()
  if (error) return error

  try {
    const body = await req.json()
    const { action, input, context } = body

    if (!action || !input) {
      return NextResponse.json({ error: 'Missing action or input in request body' }, { status: 400 })
    }

    const promptFn = PROMPTS[action]
    if (!promptFn) {
      return NextResponse.json({ error: 'Unknown action type' }, { status: 400 })
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
    const abortController = new AbortController()
    const timeoutId = setTimeout(() => abortController.abort(), 12000) // 12-second timeout limit

    const completion = await client.chat.completions.create({
      model,
      max_tokens: 350,
      messages: [{ role: 'user', content: promptFn(input, context) }],
      stream: true,
    }, {
      signal: abortController.signal,
    })

    clearTimeout(timeoutId)

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content || ''
            controller.enqueue(new TextEncoder().encode(text))
          }
          controller.close()
        } catch (streamErr: any) {
          console.error('Error during AI stream generation:', streamErr)
          controller.error(streamErr)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    })
  } catch (err: any) {
    console.error('AI Enhance endpoint error:', err)
    return NextResponse.json({ error: err?.message || 'Failed to complete AI request' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authGuard';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  const { error: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const body = await req.json();
    const { jobDescription, resumeData } = body;

    if (!jobDescription || !jobDescription.trim()) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }
    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
    }

    let apiKey = process.env.GROQ_API_KEY;
    let baseURL = 'https://api.groq.com/openai/v1';
    let model = process.env.AI_MODEL || 'llama-3.3-70b-versatile';

    if (!apiKey && process.env.OPENAI_API_KEY) {
      apiKey = process.env.OPENAI_API_KEY;
      baseURL = 'https://api.openai.com/v1';
      model = 'gpt-4o-mini';
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'AI API keys are not configured.' }, { status: 500 });
    }

    const client = new OpenAI({ apiKey, baseURL });
    const resumeText = buildResumeText(resumeData);

    const systemPrompt = `You are an ATS (Applicant Tracking System) expert. Analyze the resume against the job description and return a JSON object with this exact structure:
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
Note: The overallScore MUST be calculated exactly based on the weights: keywordScore (35%), completenessScore (40%), and formattingScore (25%).`;

    const response = await client.chat.completions.create({
      model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `JOB DESCRIPTION:\n${jobDescription}\n\nRESUME:\n${resumeText}` },
      ],
      temperature: 0,
      seed: 42,
    });

    const parsedJsonStr = response.choices[0]?.message?.content || '{}';
    const result = JSON.parse(parsedJsonStr);

    const keywordWeight = 0.35;
    const completenessWeight = 0.40;
    const formattingWeight = 0.25;

    const evaluatedScore = Math.round(
      (result.keywordScore || 0) * keywordWeight +
      (result.completenessScore || 0) * completenessWeight +
      (result.formattingScore || 0) * formattingWeight
    );
    const finalScore = Math.min(100, Math.max(0, evaluatedScore));

    const matchedKeywords = result.keywords?.matched || [];
    const missingKeywords = result.keywords?.missing || [];
    const suggestions = (result.suggestions || []).map((s: any) => `${s.section}: ${s.fix}`);

    return NextResponse.json({
      result: {
        matchScore: finalScore,
        matchingSkills: matchedKeywords,
        missingSkills: missingKeywords,
        suggestions: suggestions
      }
    });
  } catch (err: any) {
    console.error('Job match AI API error:', err);
    return NextResponse.json({ error: err.message || 'Failed to analyze job matching' }, { status: 500 });
  }
}

function buildResumeText(data: any): string {
  const lines: string[] = [];
  if (data.personal) {
    lines.push(`Name: ${data.personal.fullName}`);
    lines.push(`Email: ${data.personal.email}`);
    lines.push(`Phone: ${data.personal.phone}`);
    lines.push(`Location: ${data.personal.location}`);
  }
  if (data.summary) lines.push(`\nSUMMARY:\n${data.summary}`);

  if (data.experience?.length) {
    lines.push('\nEXPERIENCE:');
    data.experience.forEach((e: any) => {
      lines.push(`${e.role} at ${e.company} (${e.startDate} - ${e.current ? 'Present' : e.endDate})`);
      e.bullets?.forEach((b: string) => lines.push(`  • ${b}`));
    });
  }

  if (data.education?.length) {
    lines.push('\nEDUCATION:');
    data.education.forEach((e: any) =>
      lines.push(`${e.degree} in ${e.field} — ${e.institution} (${e.startDate}–${e.endDate})`)
    );
  }

  if (data.skills?.length) {
    lines.push('\nSKILLS:');
    if (typeof data.skills[0] === 'string') {
      lines.push(data.skills.join(', '));
    } else {
      data.skills.forEach((g: any) => {
        if (g && typeof g === 'object' && Array.isArray(g.skills)) {
          lines.push(`${g.category || 'Skills'}: ${g.skills.join(', ')}`);
        } else if (typeof g === 'string') {
          lines.push(g);
        }
      });
    }
  }

  if (data.projects?.length) {
    lines.push('\nPROJECTS:');
    data.projects.forEach((p: any) => {
      lines.push(`${p.name}: ${p.description}`);
      if (p.techStack?.length) lines.push(`  Tech: ${p.techStack.join(', ')}`);
    });
  }

  if (data.certifications?.length) {
    lines.push('\nCERTIFICATIONS:');
    data.certifications.forEach((c: any) => lines.push(`${c.name} — ${c.issuer} (${c.date})`));
  }

  return lines.join('\n');
}

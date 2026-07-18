import type { ResumeData } from '@/types/resume'

export function calculateCompletion(resume: Partial<ResumeData>): number {
  let earned = 0
  const total = 100

  // ── Personal (20 pts) ────────────────────────────────────────
  // Core fields: 2 pts each (8 pts)
  // Socials: LinkedIn 4pts, GitHub 4pts, Portfolio 4pts (12 pts)
  const p = resume.personal
  if (p) {
    if (p.fullName?.trim()) earned += 2
    if (p.email?.trim()) earned += 2
    if (p.phone?.trim()) earned += 2
    if (p.location?.trim()) earned += 2
    const socials = p.socials || ({} as any)
    // Also check top-level legacy keys (linkedIn / github)
    if (socials.linkedIn?.trim() || (p as any).linkedIn?.trim()) earned += 4
    if (socials.github?.trim() || (p as any).github?.trim()) earned += 4
    if (socials.portfolio?.trim() || (p as any).portfolio?.trim()) earned += 4
  }

  // ── Summary (10 pts) ─────────────────────────────────────────
  // 5 pts if exists, another 5 if over 80 chars (meaningful)
  const summary = resume.summary || ''
  if (summary.trim().length > 0) earned += 5
  if (summary.trim().length >= 80) earned += 5

  // ── Experience (25 pts) ──────────────────────────────────────
  // 10 pts for having ≥1 entry, 5 pts for ≥2 entries
  // 5 pts if first entry has ≥2 bullets, 5 pts if first bullet > 30 chars
  const exp = resume.experience || []
  if (exp.length >= 1) earned += 10
  if (exp.length >= 2) earned += 5
  if (exp[0]?.bullets?.filter((b: string) => b?.trim()).length >= 2) earned += 5
  if (exp[0]?.bullets?.[0]?.trim()?.length > 30) earned += 5

  // ── Education (15 pts) ───────────────────────────────────────
  // 8 pts for having ≥1 entry, 4 pts for institution + degree, 3 pts for dates
  const edu = resume.education || []
  if (edu.length >= 1) earned += 8
  if (edu[0]?.institution?.trim() && edu[0]?.degree?.trim()) earned += 4
  if (edu[0]?.startDate?.trim() && edu[0]?.endDate?.trim()) earned += 3

  // ── Skills (15 pts) ──────────────────────────────────────────
  // 8 pts for having skills, 7 pts for having ≥3 skills/categories
  const skills = resume.skills || []
  if (skills.length > 0) earned += 8
  if (skills.length >= 3) earned += 7

  // ── Projects (10 pts) ────────────────────────────────────────
  // 5 pts for having ≥1 project, 3 pts for description, 2 pts for tech stack
  const projects = resume.projects || []
  if (projects.length >= 1) earned += 5
  if (projects[0]?.description?.trim()?.length > 20) earned += 3
  if (projects[0]?.techStack?.length > 0) earned += 2

  // ── Certifications (5 pts bonus) ─────────────────────────────
  // Up to 5 bonus pts for having certifications (capped at 100)
  const certs = resume.certifications || []
  if (certs.length >= 1) earned += 3
  if (certs.length >= 2) earned += 2

  return Math.min(total, earned)
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function isValidUrl(value: string): boolean {
  if (!value) return true
  return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})/i.test(value)
}

export function normalizePhone(phone: string): string {
  if (!phone) return ''
  const cleaned = phone.replace(/[^\d+]/g, '')
  if (cleaned.startsWith('+91') && cleaned.length === 13) {
    return `+91 ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`
  }
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }
  return phone
}

export function cleanBullet(bullet: string): string {
  if (!bullet) return ''
  return bullet.replace(/^[\s*•\-◦▪]+/g, '').trim()
}

export function isPlacementReady(completion: number, ats: number): boolean {
  return completion >= 90 && ats >= 80
}

export function derivePlacementStatus(completion: number, ats: number): 'Ready' | 'In Progress' | 'Not Started' {
  if (isPlacementReady(completion, ats)) return 'Ready'
  if (completion >= 50) return 'In Progress'
  return 'Not Started'
}



'use client'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { EditorLayout } from '@/components/editor/EditorLayout'
import { useResumeStore } from '@/store/resumeStore'
import { useResumeSync } from '@/hooks/useResumeSync'
import { useATSStore } from '@/store/atsStore'
import { LoadingState } from '@/components/ui/LoadingState'
import { useState } from 'react'

export default function ResumeEditorPage() {
  const { resumeId } = useParams<{ resumeId: string }>()
  const setResume = useResumeStore(s => s.setResume)
  const setATSResult = useATSStore(s => s.setResult)
  const setATSJobDescription = useATSStore(s => s.setJobDescription)
  const [loading, setLoading] = useState(true)
  useResumeSync(resumeId)

  useEffect(() => {
    fetch(`/api/resume/${resumeId}`)
      .then(r => r.json())
      .then(({ resume }) => {
        if (resume) {
          const sections = (resume.sections as any) || {}
          setResume({
            id: resume.id,
            title: resume.title,
            personal: (sections.personal as any) ?? { fullName: '', email: '', phone: '', location: '', socials: {} },
            summary: sections.summary ?? '',
            experience: (sections.experience as any[]) ?? [],
            education: (sections.education as any[]) ?? [],
            skills: (sections.skills as any[]) ?? [],
            projects: (sections.projects as any[]) ?? [],
            certifications: (sections.certifications as any[]) ?? [],
            completionScore: resume.completionScore,
            status: resume.status,
          })
          if (resume.atsAnalyses && resume.atsAnalyses[0]) {
            const lastAnalysis = resume.atsAnalyses[0]
            setATSResult({
              overallScore: lastAnalysis.overallScore,
              keywordScore: lastAnalysis.keywordScore,
              formattingScore: lastAnalysis.formattingScore,
              completenessScore: lastAnalysis.completenessScore,
              jobTitle: lastAnalysis.jobTitle,
              keywords: lastAnalysis.keywords,
              suggestions: lastAnalysis.suggestions,
              sections: lastAnalysis.sections,
            } as any)
            setATSJobDescription(lastAnalysis.jobDescription || '')
          }
        }
      })
      .finally(() => setLoading(false))
  }, [resumeId])

  if (loading) return <LoadingState message="Loading resume..." />
  return <EditorLayout resumeId={resumeId} />
}

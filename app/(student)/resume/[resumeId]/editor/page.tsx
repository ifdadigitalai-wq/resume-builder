'use client'
import { useParams } from 'next/navigation'
import { EditorLayout } from '@/components/editor/EditorLayout'
import { useResumeStore } from '@/store/resumeStore'
import { useResumeSync } from '@/hooks/useResumeSync'
import { LoadingState } from '@/components/ui/LoadingState'

export default function ResumeEditorPage() {
  const { resumeId } = useParams<{ resumeId: string }>()
  const resume = useResumeStore(s => s.resume)
  useResumeSync(resumeId)

  const isLoaded = resume.id === resumeId

  if (!isLoaded) return <LoadingState message="Loading resume..." />
  return <EditorLayout resumeId={resumeId} />
}

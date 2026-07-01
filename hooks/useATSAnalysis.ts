'use client'
import { useParams } from 'next/navigation'
import { useATSStore } from '@/store/atsStore'
import { useResumeStore } from '@/store/resumeStore'
import { useUIStore } from '@/store/uiStore'

export function useATSAnalysis() {
  const params = useParams<{ resumeId?: string }>()
  const atsStore = useATSStore()
  const resume = useResumeStore(s => s.resume)
  const showToast = useUIStore(s => s.showToast)

  async function analyze(jobDescription?: string) {
    const jd = jobDescription ?? atsStore.jobDescription
    if (!jd.trim()) {
      showToast('Please enter a job description first', 'error')
      return null
    }

    atsStore.setJobDescription(jd)
    const currentResumeId = resume.id || params?.resumeId
    if (!currentResumeId) {
      showToast('No resume ID found to analyze', 'error')
      return null
    }

    atsStore.setAnalyzing(true)
    atsStore.setError(null)

    try {
      const res = await fetch(`/api/resume/${currentResumeId}/ats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd, resumeData: resume }),
      })

      if (!res.ok) throw new Error('ATS analysis failed')
      const data = await res.json()
      atsStore.setResult(data.result)
      showToast('ATS analysis complete!', 'success')
      return data.result
    } catch (e: any) {
      atsStore.setError(e.message)
      showToast('ATS analysis failed. Try again.', 'error')
      return null
    }
  }

  return {
    analyze,
    result: atsStore.result,
    isAnalyzing: atsStore.isAnalyzing,
    jobDescription: atsStore.jobDescription,
    setJobDescription: atsStore.setJobDescription,
    error: atsStore.error,
  }
}
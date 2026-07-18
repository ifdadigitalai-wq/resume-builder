'use client'
import { useEffect, useRef } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import { useUIStore } from '@/store/uiStore'
import { useATSStore } from '@/store/atsStore'

export function useResumeSync(resumeId?: string) {
  const { resume, isDirty, isSaving, setIsSaving, markSaved, resetDirty } = useResumeStore()
  const showToast = useUIStore(s => s.showToast)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch real-time records on mount
  useEffect(() => {
    if (!resumeId) return
    const setResume = useResumeStore.getState().setResume
    const setATSResult = useATSStore.getState().setResult
    const setATSJobDescription = useATSStore.getState().setJobDescription

    fetch(`/api/resume/${resumeId}`)
      .then((r) => r.json())
      .then(({ resume: serverResume }) => {
        if (serverResume) {
          // Merge sections flatly into the store
          const sections = serverResume.sections ?? {}
          setResume({
            id: serverResume.id,
            title: serverResume.title,
            status: serverResume.status,
            completionScore: serverResume.completionScore,
            personal: sections.personal ?? serverResume.personal ?? { fullName: '', email: '', phone: '', location: '', socials: {} },
            summary: sections.summary ?? serverResume.summary ?? '',
            education: sections.education ?? serverResume.education ?? [],
            experience: sections.experience ?? serverResume.experience ?? [],
            projects: sections.projects ?? serverResume.projects ?? [],
            skills: sections.skills ?? serverResume.skills ?? [],
            certifications: sections.certifications ?? serverResume.certifications ?? [],
          })

          // Hydrate the ATS analysis results from server record
          if (serverResume.atsAnalyses && serverResume.atsAnalyses[0]) {
            const lastAnalysis = serverResume.atsAnalyses[0]
            setATSResult(lastAnalysis)
            setATSJobDescription(lastAnalysis.jobDescription || '')
          } else {
            // Reset if no analysis history exists on the server
            setATSResult(null)
            setATSJobDescription('')
          }
        }
      })
      .catch(() => {})
  }, [resumeId])

  // Save changes
  async function save() {
    const targetId = resume.id || resumeId
    if (!targetId || isSaving) return

    const validationErrors = useResumeStore.getState().validationErrors;
    const hasErrors = Object.values(validationErrors || {}).some(Boolean);
    if (hasErrors) {
      showToast('Cannot save. Please fix validation errors first.', 'error')
      return
    }

    setIsSaving(true)

    try {
      const sections = {
        personal: resume.personal,
        summary: resume.summary,
        education: resume.education,
        experience: resume.experience,
        projects: resume.projects,
        skills: resume.skills,
        certifications: resume.certifications,
      }
      const res = await fetch(`/api/resume/${targetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: resume.title,
          status: resume.status,
          completionScore: resume.completionScore,
          sections,
        }),
      })
      if (!res.ok) throw new Error('Save failed')
      markSaved()
    } catch {
      showToast('Save failed', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // Auto-save on change (debounced 1500ms)
  useEffect(() => {
    if (!isDirty || !resume.id) return
    if (saveTimer.current) clearTimeout(saveTimer.current)

    // Inside active update loop
    saveTimer.current = setTimeout(async () => {
      const validationErrors = useResumeStore.getState().validationErrors;
      const hasErrors = Object.values(validationErrors || {}).some(Boolean);
      if (hasErrors) return; // Block auto-save if errors exist

      try {
        const sections = {
          personal: resume.personal,
          summary: resume.summary,
          education: resume.education,
          experience: resume.experience,
          projects: resume.projects,
          skills: resume.skills,
          certifications: resume.certifications,
        };
        const resumeWithSections = { ...resume, sections };
        
        await fetch(`/api/resume/${resume.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: resume.title,
            status: resume.status,
            completionScore: resume.completionScore,
            sections: resumeWithSections.sections,
          })
        });
        resetDirty();
      } catch {
        showToast('Auto-save failed', 'error')
      }
    }, 1500);

    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [resume, isDirty, resetDirty, showToast])

  return { save, isSaving, isDirty }
}
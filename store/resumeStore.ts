import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import type { ResumeData, ResumeSections, SectionKey, ResumeLayoutOptions } from '@/types/resume'
import { v4 as uuid } from 'uuid'
import { calculateCompletion } from '@/lib/resumeUtils'

interface ResumeState {
  resume: ResumeData
  activeSection: SectionKey
  isDirty: boolean
  isSaving: boolean
  lastSavedAt: string | null
  validationErrors: Record<string, string>
  // Actions
  setResume: (resume: ResumeData) => void
  setActiveSection: (section: SectionKey) => void
  updateSection: <K extends keyof ResumeSections>(key: K, value: ResumeSections[K]) => void
  updatePersonal: (data: Partial<ResumeData['personal']>) => void
  updateSummary: (summary: string) => void
  addExperience: () => void
  updateExperience: (id: string, data: any) => void
  removeExperience: (id: string) => void
  addBullet: (expId: string) => void
  removeBullet: (expId: string, idx: number) => void
  addEducation: () => void
  updateEducation: (id: string, data: any) => void
  removeEducation: (id: string) => void
  addProject: () => void
  updateProject: (id: string, data: any) => void
  removeProject: (id: string) => void
  addTech: (projectId: string, tech: string) => void
  removeTech: (projectId: string, tech: string) => void
  addCertification: () => void
  updateCertification: (id: string, data: any) => void
  removeCertification: (id: string) => void
  markSaved: () => void
  resetDirty: () => void
  setIsSaving: (v: boolean) => void
  setValidationError: (field: string, error: string | null) => void
  updateLayout: (data: Partial<ResumeLayoutOptions>) => void
}

const defaultResume: ResumeData = {
  title: 'My Resume',
  status: 'DRAFT',
  completionScore: 0,
  personal: { fullName: '', email: '', phone: '', location: '', socials: { linkedIn: '', github: '', portfolio: '' } },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  layout: {
    themeColor: '#2563EB',
    fontSize: 'md',
    fontFamily: 'sans',
    lineHeight: 'normal',
    spacing: 'normal',
  }
}

export const useResumeStore = create<ResumeState>()(
  persist(
    immer((set) => {
      // Helper that performs the state change and automatically updates the completion score
      const setWithComp = (recipe: (state: ResumeState) => void) => {
        set((s: any) => {
          recipe(s);
          s.resume.completionScore = calculateCompletion(s.resume);
        });
      };

      return {
        resume: defaultResume,
        activeSection: 'personal',
        isDirty: false,
        isSaving: false,
        lastSavedAt: null,
        validationErrors: {},

        setResume: (resume) => setWithComp((s) => {
          // Ensure defaults are merged
          s.resume = {
            ...defaultResume,
            ...resume,
            personal: {
              ...defaultResume.personal,
              ...resume?.personal,
              socials: {
                ...defaultResume.personal.socials,
                ...resume?.personal?.socials,
              }
            },
            layout: {
              themeColor: resume?.layout?.themeColor ?? defaultResume.layout!.themeColor,
              fontSize: resume?.layout?.fontSize ?? defaultResume.layout!.fontSize,
              fontFamily: resume?.layout?.fontFamily ?? defaultResume.layout!.fontFamily,
              lineHeight: resume?.layout?.lineHeight ?? defaultResume.layout!.lineHeight,
              spacing: resume?.layout?.spacing ?? defaultResume.layout!.spacing,
            }
          };
          // Expose linkedIn/github/portfolio flat on personal for old components compatibility
          const p = s.resume.personal;
          const soc = p.socials ?? {};
          if (!(p as any).linkedIn && soc.linkedIn) (p as any).linkedIn = soc.linkedIn;
          if (!(p as any).github && soc.github) (p as any).github = soc.github;
          if (!(p as any).portfolio && soc.portfolio) (p as any).portfolio = soc.portfolio;
          
          s.isDirty = false;
        }),
        setActiveSection: (section) => set((s) => { s.activeSection = section }),
        markSaved: () => set((s) => { s.isDirty = false; s.lastSavedAt = new Date().toISOString() }),
        resetDirty: () => set((s) => { s.isDirty = false }),
        setIsSaving: (v) => set((s) => { s.isSaving = v }),

        updateSection: (key, value) => setWithComp((s) => {
          s.resume[key] = value as any;
          s.isDirty = true;
        }),

        updatePersonal: (data) => setWithComp((s) => {
          if (!s.resume.personal.socials) {
            s.resume.personal.socials = {};
          }
          Object.assign(s.resume.personal, data);

          const anyData = data as any;
          // Expose linkedIn, github, portfolio directly on personal for older code access
          if ('linkedIn' in anyData) (s.resume.personal as any).linkedIn = anyData.linkedIn;
          if ('github' in anyData) (s.resume.personal as any).github = anyData.github;
          if ('portfolio' in anyData) (s.resume.personal as any).portfolio = anyData.portfolio;

          // Also map to nested socials for new code compliance
          if ('linkedIn' in anyData) s.resume.personal.socials.linkedIn = anyData.linkedIn;
          if ('github' in anyData) s.resume.personal.socials.github = anyData.github;
          if ('portfolio' in anyData) s.resume.personal.socials.portfolio = anyData.portfolio;

          s.isDirty = true;
        }),
        updateSummary: (summary) => setWithComp((s) => { s.resume.summary = summary; s.isDirty = true }),

        addExperience: () => setWithComp((s) => {
          s.resume.experience.push({ id: uuid(), company: '', role: '', startDate: '', endDate: '', current: false, bullets: [''] })
          s.isDirty = true
        }),
        updateExperience: (id, data) => setWithComp((s) => {
          const i = s.resume.experience.findIndex(e => e.id === id)
          if (i >= 0) { Object.assign(s.resume.experience[i], data); s.isDirty = true }
        }),
        removeExperience: (id) => setWithComp((s) => {
          s.resume.experience = s.resume.experience.filter(e => e.id !== id); s.isDirty = true
        }),
        addBullet: (expId) => setWithComp((s) => {
          const exp = s.resume.experience.find(e => e.id === expId)
          if (exp) { exp.bullets.push(''); s.isDirty = true }
        }),
        removeBullet: (expId, idx) => setWithComp((s) => {
          const exp = s.resume.experience.find(e => e.id === expId)
          if (exp) { exp.bullets.splice(idx, 1); s.isDirty = true }
        }),

        addEducation: () => setWithComp((s) => {
          s.resume.education.push({ id: uuid(), institution: '', degree: '', field: '', startDate: '', endDate: '' })
          s.isDirty = true
        }),
        updateEducation: (id, data) => setWithComp((s) => {
          const i = s.resume.education.findIndex(e => e.id === id)
          if (i >= 0) { Object.assign(s.resume.education[i], data); s.isDirty = true }
        }),
        removeEducation: (id) => setWithComp((s) => {
          s.resume.education = s.resume.education.filter(e => e.id !== id); s.isDirty = true
        }),

        addProject: () => setWithComp((s) => {
          s.resume.projects.push({ id: uuid(), name: '', description: '', techStack: [] })
          s.isDirty = true
        }),
        updateProject: (id, data) => setWithComp((s) => {
          const i = s.resume.projects.findIndex(p => p.id === id)
          if (i >= 0) { Object.assign(s.resume.projects[i], data); s.isDirty = true }
        }),
        removeProject: (id) => setWithComp((s) => {
          s.resume.projects = s.resume.projects.filter(p => p.id !== id); s.isDirty = true
        }),
        addTech: (projectId, tech) => setWithComp((s) => {
          const p = s.resume.projects.find(p => p.id === projectId)
          if (p && !p.techStack.includes(tech)) { p.techStack.push(tech); s.isDirty = true }
        }),
        removeTech: (projectId, tech) => setWithComp((s) => {
          const p = s.resume.projects.find(p => p.id === projectId)
          if (p) { p.techStack = p.techStack.filter(t => t !== tech); s.isDirty = true }
        }),

        addCertification: () => setWithComp((s) => {
          s.resume.certifications.push({ id: uuid(), name: '', issuer: '', date: '' })
          s.isDirty = true
        }),
        updateCertification: (id, data) => setWithComp((s) => {
          const i = s.resume.certifications.findIndex(c => c.id === id)
          if (i >= 0) { Object.assign(s.resume.certifications[i], data); s.isDirty = true }
        }),
        removeCertification: (id) => setWithComp((s) => {
          s.resume.certifications = s.resume.certifications.filter(c => c.id !== id); s.isDirty = true
        }),
        setValidationError: (field, error) => set((s) => {
          if (!s.validationErrors) s.validationErrors = {}
          if (error) {
            s.validationErrors[field] = error
          } else {
            delete s.validationErrors[field]
          }
        }),
        updateLayout: (data) => setWithComp((s) => {
          if (!s.resume.layout) {
            s.resume.layout = {
              themeColor: '#2563EB',
              fontSize: 'md',
              fontFamily: 'sans',
              lineHeight: 'normal',
              spacing: 'normal',
            }
          }
          Object.assign(s.resume.layout, data);
          s.isDirty = true;
        }),
      };
    }),
    { name: 'resume-draft' }
  )
)
'use client'
import { useState } from 'react'
import { SectionNavigator } from './SectionNavigator'
import { ResumePreview } from './ResumePreview'
import { InsightPanel } from './InsightPanel'
import { DesignSettingsPanel } from './DesignSettingsPanel'
import { AIDrawer } from './AIDrawer'
import { PersonalForm } from './forms/PersonalForm'
import { SummaryForm } from './forms/SummaryForm'
import { ExperienceForm } from './forms/ExperienceForm'
import { EducationForm } from './forms/EducationForm'
import { SkillsForm } from './forms/SkillsForm'
import { ProjectsForm } from './forms/ProjectsForm'
import { CertificationsForm } from './forms/CertificationsForm'
import { useResumeStore } from '@/store/resumeStore'
import { useUIStore } from '@/store/uiStore'
import { MobileTabBar } from '@/components/layout/MobileTabBar'
import { TopBar } from '@/components/layout/TopBar'

const FORM_MAP: Record<string, React.ComponentType> = {
  personal: PersonalForm,
  summary: SummaryForm,
  experience: ExperienceForm,
  education: EducationForm,
  skills: SkillsForm,
  projects: ProjectsForm,
  certifications: CertificationsForm,
}

interface EditorLayoutProps {
  resumeId: string
}

export function EditorLayout({ resumeId }: EditorLayoutProps) {
  const activeSection = useResumeStore(s => s.activeSection)
  const mobileTab = useUIStore(s => s.mobileTab)
  const [rightPanelTab, setRightPanelTab] = useState<'preview' | 'insights' | 'design'>('preview')

  const ActiveForm = FORM_MAP[activeSection] ?? PersonalForm

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top bar with save indicator */}
      <TopBar resumeId={resumeId} />

      {/* Three-column editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — Section Navigator */}
        <aside className="hidden lg:flex w-64 flex-col border-r bg-white overflow-y-auto shrink-0">
          <SectionNavigator />
        </aside>

        {/* Center — Active Form */}
        <main
          className={`flex-1 overflow-y-auto p-6 
            ${mobileTab !== 'editor' ? 'hidden lg:block' : ''}`}
        >
          <ActiveForm />
        </main>

        {/* Right — Preview + Insights + Design */}
        <aside
          className={`hidden lg:flex w-[400px] flex-col border-l bg-white shrink-0
            ${mobileTab === 'preview' ? '!flex w-full' : ''}`}
        >
          {/* Panel Selector */}
          <div className="flex border-b shrink-0 bg-slate-50 p-1 gap-1">
            <button
              onClick={() => setRightPanelTab('preview')}
              className={`flex-1 py-2 text-xs font-bold text-center rounded-[8px] transition-all ${
                rightPanelTab === 'preview'
                  ? 'bg-white text-primary-DEFAULT shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setRightPanelTab('insights')}
              className={`flex-1 py-2 text-xs font-bold text-center rounded-[8px] transition-all ${
                rightPanelTab === 'insights'
                  ? 'bg-white text-primary-DEFAULT shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Insights
            </button>
            <button
              onClick={() => setRightPanelTab('design')}
              className={`flex-1 py-2 text-xs font-bold text-center rounded-[8px] transition-all ${
                rightPanelTab === 'design'
                  ? 'bg-white text-primary-DEFAULT shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Style Settings
            </button>
          </div>

          <div className="flex-1 overflow-y-auto relative">
            {rightPanelTab === 'insights' && <InsightPanel />}
            {rightPanelTab === 'design' && <DesignSettingsPanel />}
            
            <div className={rightPanelTab !== 'preview' ? 'absolute -left-[9999px] -top-[9999px] w-[374px]' : 'w-full'}>
              <ResumePreview />
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile tab bar */}
      <MobileTabBar />

      {/* AI Suggestion Drawer */}
      <AIDrawer />
    </div>
  )
}
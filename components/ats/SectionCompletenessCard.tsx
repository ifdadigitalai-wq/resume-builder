'use client';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Check, AlertTriangle, Sparkles } from 'lucide-react';
import { useATSStore } from '@/store/atsStore';
import { useAIAction } from '@/hooks/useAIAction';
import { useResumeStore } from '@/store/resumeStore';
import { useUIStore } from '@/store/uiStore';

export function SectionCompletenessCard() {
  const result = useATSStore((s) => s.result);
  const rawSections = result?.completeness ?? [];
  const sections = rawSections.length > 0 ? rawSections.map((s: any) => ({
    name: s.section,
    pct: Math.round((s.score / s.maxScore) * 100),
    status: s.score === s.maxScore ? 'complete' : 'partial'
  })) : [
    { name: 'Personal Info', pct: 100, status: 'complete' },
    { name: 'Summary', pct: 100, status: 'complete' },
    { name: 'Education', pct: 100, status: 'complete' },
    { name: 'Skills', pct: 100, status: 'complete' },
    { name: 'Projects', pct: 100, status: 'complete' },
    { name: 'Experience', pct: 60, status: 'partial' },
    { name: 'Certifications', pct: 100, status: 'complete' },
  ];

  const { trigger, isLoading } = useAIAction();
  const showToast = useUIStore((s) => s.showToast);

  const handleAutoFill = (sectionName: string) => {
    let actionType: 'improve_description' | 'generate_summary' | 'suggest_skills' = 'improve_description';
    let label = 'Auto-Fill Section';
    if (sectionName.toLowerCase().includes('summary')) {
      actionType = 'generate_summary';
      label = 'Generate Summary';
    } else if (sectionName.toLowerCase().includes('skills')) {
      actionType = 'suggest_skills';
      label = 'Suggest Skills';
    }

    trigger(
      actionType,
      `Auto-complete and optimize the ${sectionName} section of my resume with professional content.`,
      label,
      (text) => {
        const resumeStore = useResumeStore.getState();
        const sectionLower = sectionName.toLowerCase();
        
        if (sectionLower.includes('summary')) {
          resumeStore.updateSummary(text);
          showToast('Summary generated and updated!', 'success');
        } else if (sectionLower.includes('skills')) {
          const skillsList = text.split(/,|\n/).map(s => s.trim()).filter(Boolean);
          const currentSkills = resumeStore.resume.skills ?? [];
          const updated = Array.from(new Set([...currentSkills, ...skillsList]));
          resumeStore.updateSection('skills', updated);
          showToast('Added AI skills!', 'success');
        } else if (sectionLower.includes('project')) {
          let proj = resumeStore.resume.projects[0];
          if (!proj) {
            resumeStore.addProject();
            proj = useResumeStore.getState().resume.projects[0];
          }
          if (proj) {
            resumeStore.updateProject(proj.id, { description: text });
            showToast('Project description generated and updated!', 'success');
          } else {
            showToast('Could not find a project to update.', 'error');
          }
        } else if (sectionLower.includes('education') || sectionLower.includes('coursework')) {
          let edu = resumeStore.resume.education[0];
          if (!edu) {
            resumeStore.addEducation();
            edu = useResumeStore.getState().resume.education[0];
          }
          if (edu) {
            resumeStore.updateEducation(edu.id, { highlights: text });
            showToast('Education highlights generated and updated!', 'success');
          } else {
            showToast('Could not find an education entry to update.', 'error');
          }
        } else if (sectionLower.includes('cert')) {
          const certNames = text.split(/,|\n/).map((c) => c.replace(/^\d+\.\s*/, '').replace(/^[-*•]\s*/, '').trim()).filter(Boolean);
          const currentCerts = resumeStore.resume.certifications ?? [];
          const newCerts = certNames.map(name => ({
            id: crypto.randomUUID(),
            name,
            issuer: 'Suggested Organization',
            date: new Date().getFullYear().toString(),
          }));
          resumeStore.updateSection('certifications', [...currentCerts, ...newCerts]);
          showToast('Added suggested certifications successfully!', 'success');
        } else {
          let exp = resumeStore.resume.experience[0];
          if (!exp) {
            resumeStore.addExperience();
            exp = useResumeStore.getState().resume.experience[0];
          }
          if (exp) {
            const nextBullets = [...exp.bullets];
            nextBullets[0] = text;
            resumeStore.updateExperience(exp.id, { bullets: nextBullets });
            showToast('Enhanced experience bullet!', 'success');
          } else {
            showToast('Could not find experience entry to update.', 'error');
          }
        }
      }
    );
  };

  return (
    <div className="rounded-[14px] border border-[#CFE0F7] bg-[#F7FAFF] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_16px_38px_rgba(59,73,223,0.09)] transition-all duration-200 hover:-translate-y-1 hover:border-primary-DEFAULT/35 hover:bg-[#EFF6FF]">
      <h3 className="text-sm font-extrabold text-[#10233F] mb-4">Section Completeness</h3>
      <div className="space-y-3">
        {sections.map((s) => (
          <div key={s.name} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${s.status === 'complete' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
              {s.status === 'complete'
                ? <Check className="h-3 w-3 text-success" />
                : <AlertTriangle className="h-3 w-3 text-warning" />}
            </div>
            <span className="text-xs font-bold text-[#10233F] w-24 shrink-0 truncate">{s.name}</span>
            <div className="flex-1">
              <ProgressBar value={s.pct} color={s.status === 'complete' ? 'green' : 'amber'} size="sm" />
            </div>
            <span className="text-xs font-bold text-text-muted w-10 text-right shrink-0">{s.pct}%</span>
            {s.status !== 'complete' && (
              <button
                onClick={() => handleAutoFill(s.name)}
                disabled={isLoading}
                title="Auto-Fill with AI"
                className="flex items-center justify-center p-1 rounded hover:bg-amber-100 text-warning"
              >
                <Sparkles className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

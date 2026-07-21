'use client';
import { useState, KeyboardEvent } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { useATSStore } from '@/store/atsStore';
import { Button } from '@/components/ui/Button';
import { X, Plus, Sparkles, Check } from 'lucide-react';
import { useAIAction } from '@/hooks/useAIAction';
import { useUIStore } from '@/store/uiStore';

export function SkillsForm() {
  const rawSkills = useResumeStore((s) => s.resume.skills) ?? [];
  const skills = (Array.isArray(rawSkills) ? rawSkills : []).map((s) => {
    if (typeof s === 'string') return s;
    if (s && typeof s === 'object') {
      return (s as any).keyword || (s as any).name || (s as any).skill || JSON.stringify(s);
    }
    return String(s);
  });
  const updateSection = useResumeStore((s) => s.updateSection);
  const showToast = useUIStore((s) => s.showToast);

  const [skillInput, setSkillInput] = useState('');

  const resume = useResumeStore((s) => s.resume);
  const primaryRole = resume.experience[0]?.role || resume.education[0]?.field || 'Professional';
  const { trigger, isLoading } = useAIAction();

  const atsResult = useATSStore((s) => s.result);
  const atsKeywords = atsResult?.keywords ?? [];

  const handleAISuggestSkills = () => {
    trigger('suggest_skills', primaryRole);
  };

  const handleCategoriseSkills = () => {
    if (skills.length < 5) return;
    const skillsListStr = skills.join(', ');
    trigger('categorise_skills', skillsListStr, 'Categorise Skills', (text) => {
      showToast('Skills successfully categorised with AI!', 'success');
    });
  };

  const handleAddSkill = () => {
    const val = skillInput.trim();
    if (!val) return;
    const newSkills = val.split(',').map(s => s.trim()).filter(Boolean);
    const updatedSkills = Array.from(new Set([...skills, ...newSkills]));
    updateSection('skills', updatedSkills);
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    updateSection('skills', skills.filter(s => s !== skill));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleAddSuggestedSkill = (s: string) => {
    if (!skills.includes(s)) {
      updateSection('skills', [...skills, s]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border border-border rounded-[10px] p-5 space-y-4 bg-white shadow-sm">
        <h3 className="text-sm font-bold text-text-primary">Skills List</h3>
        
        {/* Skill Chips */}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 text-primary-DEFAULT rounded-full text-xs font-semibold animate-in fade-in-50 duration-200"
            >
              {skill}
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="hover:text-danger transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {skills.length === 0 && (
            <p className="text-xs text-text-muted italic">No skills added yet.</p>
          )}
        </div>

        {/* Add Skill Input */}
        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a skill (e.g. React) and press Enter or comma..."
            className="flex-1 text-xs px-3 py-2 border border-border rounded-[8px] focus:outline-none focus:border-primary-DEFAULT"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddSkill}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* ATS Keywords Section */}
        {atsKeywords.length > 0 && (
          <div className="border-t border-slate-100 pt-4">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
              Keywords from Job Description Audit
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
              {atsKeywords.map((k: any) => {
                const isFound = skills.some(s => s.toLowerCase() === k.keyword.toLowerCase());
                if (isFound) {
                  return (
                    <span
                      key={k.keyword}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-xs text-emerald-700 font-semibold"
                    >
                      <Check className="h-2.5 w-2.5" />
                      {k.keyword}
                    </span>
                  );
                } else {
                  return (
                    <button
                      key={k.keyword}
                      onClick={() => handleAddSuggestedSkill(k.keyword)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 border border-red-200 bg-red-50 hover:bg-red-100 rounded-full text-xs text-red-650 font-semibold transition-all hover:scale-105"
                    >
                      <Plus className="h-2.5 w-2.5" />
                      {k.keyword}
                    </button>
                  );
                }
              })}
            </div>
          </div>
        )}


      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="secondary"
          size="md"
          onClick={handleAISuggestSkills}
          loading={isLoading}
          className="flex-1 border border-blue-200 bg-blue-50 text-primary-DEFAULT hover:bg-blue-500 flex items-center justify-center gap-2"
        >
          <Sparkles className="h-4 w-4" /> Suggest Skills with AI
        </Button>

        {skills.length >= 5 && (
          <Button
            variant="secondary"
            size="md"
            onClick={handleCategoriseSkills}
            loading={isLoading}
            className="flex-1 border border-cyan-200 bg-cyan-50 text-[#0e7490] hover:bg-cyan-500 flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" /> Categorise Skills with AI
          </Button>
        )}
      </div>
    </div>
  );
}

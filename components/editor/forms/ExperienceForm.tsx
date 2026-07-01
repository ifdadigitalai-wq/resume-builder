'use client';
import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Trash2, Plus, X, Sparkles } from 'lucide-react';
import { useAIAction } from '@/hooks/useAIAction';

export function ExperienceForm() {
  const experience = useResumeStore((s) => s.resume.experience);
  const { addExperience, removeExperience, updateExperience, addBullet, removeBullet } = useResumeStore();

  const { trigger } = useAIAction();

  const handleEnhance = (expId: string, idx: number, currentText: string) => {
    trigger('enhance_bullet', currentText || 'Develop major features for dashboard', undefined, (text) => {
      const exp = experience.find(e => e.id === expId);
      if (exp) {
        const nextBullets = [...exp.bullets];
        nextBullets[idx] = text;
        updateExperience(expId, { bullets: nextBullets });
      }
    });
  };

  return (
    <div className="space-y-6">
      {experience.map((exp) => (
        <div key={exp.id} className="border border-border rounded-[10px] p-5 space-y-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text-primary">Work Experience</p>
            <button
              onClick={() => removeExperience(exp.id)}
              className="text-danger hover:opacity-70 transition-opacity p-1.5 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company"
              value={exp.company}
              onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
              placeholder="e.g. Razorpay"
            />
            <Input
              label="Role / Title"
              value={exp.role}
              onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
              placeholder="e.g. Software Engineering Intern"
            />
            <Input
              label="Start Date"
              value={exp.startDate}
              onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
              placeholder="e.g. May 2024"
            />
            <Input
              label="End Date"
              value={exp.endDate}
              disabled={exp.current}
              onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
              placeholder="e.g. Jul 2024"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`curr-${exp.id}`}
              checked={exp.current}
              onChange={(e) => updateExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? 'Present' : '' })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <label htmlFor={`curr-${exp.id}`} className="text-xs font-semibold text-text-secondary">
              I currently work here
            </label>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-primary mb-3">Description Bullets</p>
            <div className="space-y-3 mb-3">
              {exp.bullets.map((bullet, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <span className="text-primary-DEFAULT font-bold text-sm shrink-0">•</span>
                  <input
                    value={bullet}
                    onChange={(e) => {
                      const next = [...exp.bullets];
                      next[i] = e.target.value;
                      updateExperience(exp.id, { bullets: next });
                    }}
                    placeholder="Describe a key achievement or task..."
                    className="flex-1 text-xs px-3 py-2 border border-border rounded-[8px] focus:outline-none focus:border-primary-DEFAULT"
                  />
                  <button
                    onClick={() => handleEnhance(exp.id, i, bullet)}
                    title="Enhance with AI"
                    className="p-2 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 text-blue-600 transition shrink-0"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => removeBullet(exp.id, i)}
                    className="p-2 text-danger hover:bg-red-50 rounded-lg shrink-0 transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => addBullet(exp.id)}
              className="flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              <Plus className="h-3.5 w-3.5" /> Add Bullet Point
            </Button>
          </div>
        </div>
      ))}

      <Button variant="primary" size="md" onClick={addExperience} className="w-full bg-gradient-to-r from-blue-600 to-blue-600
      hover:from-blue-700 hover:to-blue-700
      text-white font-semibold rounded-lg
      shadow-md hover:shadow-lg
      border border-blue-700
      transition-all duration-200">
        <Plus className="h-4 w-4 mr-2" /> Add Work Experience
      </Button>
    </div>
  );
}

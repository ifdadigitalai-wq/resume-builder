'use client';
import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Trash2, Plus, X, Sparkles } from 'lucide-react';
import { useAIAction } from '@/hooks/useAIAction';

export function ProjectsForm() {
  const projects = useResumeStore((s) => s.resume.projects);
  const { addProject, removeProject, updateProject, addTech, removeTech } = useResumeStore();

  const [techInputs, setTechInputs] = useState<Record<string, string>>({});

  const { trigger } = useAIAction();

  const handleEnhance = (projId: string, currentText: string) => {
    trigger('improve_description', currentText || 'Developed campus marketplace website', undefined, (text) => {
      updateProject(projId, { description: text });
    });
  };

  const handleAddTech = (projId: string) => {
    const val = (techInputs[projId] ?? '').trim();
    if (!val) return;
    const newTechs = val.split(',').map(t => t.trim()).filter(Boolean);
    const proj = projects.find(p => p.id === projId);
    if (proj) {
      const existing = proj.techStack ?? [];
      const updated = Array.from(new Set([...existing, ...newTechs]));
      updateProject(projId, { techStack: updated });
    }
    setTechInputs(prev => ({ ...prev, [projId]: '' }));
  };

  const handleKeyDown = (projId: string) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTech(projId);
    }
  };

  return (
    <div className="space-y-6">
      {projects.map((proj) => (
        <div key={proj.id} className="border border-border rounded-[10px] p-5 space-y-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text-primary">Project</p>
            <button
              onClick={() => removeProject(proj.id)}
              className="text-danger hover:opacity-70 transition-opacity p-1.5 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <Input
            label="Project Name"
            value={proj.name}
            onChange={(e) => updateProject(proj.id, { name: e.target.value })}
            placeholder="e.g. StudySync — AI Planner"
          />

          <div className="relative">
            <Textarea
              label="Description"
              value={proj.description}
              onChange={(e) => updateProject(proj.id, { description: e.target.value })}
              placeholder="Describe what you built, technologies used, and impact..."
              rows={4}
            />
<button
  onClick={() => handleEnhance(proj.id, proj.description)}
  title="Enhance Description with AI"
  className="absolute right-2 bottom-2 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur border border-violet-200 text-violet-700 hover:bg-violet-50 rounded-lg text-xs font-semibold shadow-md transition-all duration-200"
>
  <Sparkles className="h-3.5 w-3.5" />
  AI Enhance
</button>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-primary mb-2">Tech Stack</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {proj.techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 rounded-full text-xs font-medium"
                >
                  {tech}
                  <button onClick={() => removeTech(proj.id, tech)} className="hover:text-danger">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {proj.techStack.length === 0 && (
                <p className="text-xs text-text-muted italic">No technologies added yet.</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={techInputs[proj.id] ?? ''}
                onChange={(e) => setTechInputs(prev => ({ ...prev, [proj.id]: e.target.value }))}
                onKeyDown={handleKeyDown(proj.id)}
                placeholder="Add tech (e.g. React) and press Enter..."
                className="flex-1 text-xs px-3 py-2 border border-border rounded-[8px] focus:outline-none focus:border-primary-DEFAULT"
              />
              <Button variant="secondary" size="sm" onClick={() => handleAddTech(proj.id)}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <Input
            label="Project Link (GitHub / Live)"
            value={proj.link ?? ''}
            onChange={(e) => updateProject(proj.id, { link: e.target.value })}
            placeholder="e.g. https://github.com/..."
          />
        </div>
      ))}

      <Button variant="primary" size="md" onClick={addProject} className="w-full bg-gradient-to-r from-blue-600 to-blue-600
      hover:from-blue-700 hover:to-blue-700
      text-white font-semibold rounded-lg
      shadow-md hover:shadow-lg
      border border-blue-700
      transition-all duration-200">
        <Plus className="h-4 w-4 mr-2" /> Add Project
      </Button>
    </div>
  );
}

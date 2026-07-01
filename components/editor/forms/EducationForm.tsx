'use client';
import { useResumeStore } from '@/store/resumeStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Trash2, Plus, Sparkles } from 'lucide-react';
import { useAIAction } from '@/hooks/useAIAction';
import { useUIStore } from '@/store/uiStore';
import { Textarea } from '@/components/ui/Textarea';

export function EducationForm() {
  const education = useResumeStore((s) => s.resume.education);
  const { addEducation, removeEducation, updateEducation } = useResumeStore();
  const { trigger, isLoading } = useAIAction();
  const showToast = useUIStore((s) => s.showToast);

  const handleSuggestHighlights = (edu: any) => {
    const inputStr = `${edu.degree || 'Degree'} in ${edu.field || 'Field of Study'} at ${edu.institution || 'Institution'}`;
    trigger('suggest_highlights', inputStr, 'Education Highlights', (text) => {
      updateEducation(edu.id, { highlights: text });
      showToast('Here are suggested coursework & highlights for your resume!', 'success');
    });
  };

  return (
    <div className="space-y-6">
      {education.map((edu, idx) => (
        <div key={edu.id} className="border border-border rounded-[10px] p-5 space-y-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text-primary">
              {idx === 0 ? 'College / University' : 'School / Education'}
            </p>
            <button
              onClick={() => removeEducation(edu.id)}
              className="text-danger hover:opacity-70 transition-opacity p-1.5 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Institution / School"
              value={edu.institution}
              onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
              placeholder="e.g. IIT Delhi"
              className="sm:col-span-2"
            />
            <Input
              label="Degree / Certificate"
              value={edu.degree}
              onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
              placeholder="e.g. B.Tech"
            />
            <Input
              label="Field of Study"
              value={edu.field}
              onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
              placeholder="e.g. Computer Science"
            />
            <Input
              label="Start Date"
              value={edu.startDate}
              onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
              placeholder="e.g. 2022"
            />
            <Input
              label="End Date (or expected)"
              value={edu.endDate}
              onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
              placeholder="e.g. 2026"
            />
            <Input
              label="CGPA / Grade"
              value={edu.cgpa ?? ''}
              onChange={(e) => updateEducation(edu.id, { cgpa: e.target.value })}
              placeholder="e.g. 8.4"
              className="sm:col-span-2"
            />
            <Textarea
              label="Coursework / Academic Highlights"
              value={edu.highlights ?? ''}
              onChange={(e) => updateEducation(edu.id, { highlights: e.target.value })}
              placeholder="e.g. Coursework: Data Structures, Algorithms. Achievement: First Place in Smart India Hackathon."
              className="sm:col-span-2"
              rows={3}
            />
          </div>

          {edu.institution && (edu.degree || edu.field) && (
            <div className="flex justify-end pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleSuggestHighlights(edu)}
                loading={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Suggest Highlights & Coursework
              </Button>
            </div>
          )}
        </div>
      ))}

      <Button variant="primary" size="md" onClick={addEducation} className="w-full bg-gradient-to-r from-blue-600 to-blue-600
      hover:from-blue-700 hover:to-blue-700
      text-white font-semibold rounded-lg
      shadow-md hover:shadow-lg
      border border-blue-700
      transition-all duration-200">
        <Plus className="h-4 w-4 mr-2 bg-green-300" /> Add Education
      </Button>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { useATSStore } from '@/store/atsStore';
import { useAIStore } from '@/store/aiStore';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useAIAction } from '@/hooks/useAIAction';
import { Sparkles, Check, AlertCircle, RefreshCw, X } from 'lucide-react';

const TONES = [
  { label: 'Professional', value: 'professional' },
  { label: 'Confident & Bold', value: 'bold' },
  { label: 'Shorter & Punchy', value: 'shorter' },
  { label: 'Detailed & Longer', value: 'longer' },
];

export function SummaryForm() {
  const summary = useResumeStore((s) => s.resume.summary);
  const updateSummary = useResumeStore((s) => s.updateSummary);
  
  const atsResult = useATSStore((s) => s.result);
  const atsKeywords = atsResult?.keywords ?? [];
  const aiStore = useAIStore();

  const [selectedTone, setSelectedTone] = useState('professional');

  const { trigger, isLoading } = useAIAction({
    onApply: (text) => updateSummary(text),
  });

  const handleGenerate = () => {
    const promptText = summary || 'Write a professional summary';
    const finalPrompt = `Write an AI optimized resume summary with a ${selectedTone} tone. Original: ${promptText}`;
    trigger('generate_summary', finalPrompt, 'Summary Enhancement');
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Textarea
          label="Professional Summary"
          value={summary}
          onChange={(e) => updateSummary(e.target.value)}
          rows={6}
          placeholder="Write a compelling 2-3 sentence summary that highlights your skills, experience, and career goals..."
        />
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-[10px] animate-fade-in">
            <RefreshCw className="h-6 w-6 text-primary-DEFAULT animate-spin mb-2" />
            <p className="text-xs font-bold text-primary-DEFAULT">AI is writing your summary...</p>
          </div>
        )}
      </div>

      {/* Tone Controls */}
      <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
        <p className="text-xs font-bold text-[#647A9A] mb-2.5">Adjust Tone & Length</p>
        <div className="flex flex-wrap gap-2">
          {TONES.map((tone) => (
            <button
              key={tone.value}
              type="button"
              onClick={() => setSelectedTone(tone.value)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                selectedTone === tone.value
                  ? 'border-primary-DEFAULT bg-blue-50 text-primary-DEFAULT shadow-sm'
                  : 'border-slate-200 bg-white text-slate-650 hover:bg-slate-50'
              }`}
            >
              {tone.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleGenerate}
          disabled={isLoading}
          className="border border-blue-500 bg-blue-50 hover:bg-blue-100 hover:text-black flex items-center gap-1.5 shadow-sm"
        >
          <Sparkles className="h-4 w-4" />
          Generate with AI
        </Button>
      </div>

      {atsKeywords.length > 0 && (
        <div className="border-t border-slate-100 pt-4 mt-2">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
            Target Keywords Reference
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto">
            {atsKeywords.map((k: any) => {
              const isFound = summary.toLowerCase().includes(k.keyword.toLowerCase());
              return (
                <span
                  key={k.keyword}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    isFound 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : 'bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  {isFound ? <Check className="h-2.5 w-2.5" /> : <AlertCircle className="h-2.5 w-2.5 text-slate-400" />}
                  {k.keyword}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

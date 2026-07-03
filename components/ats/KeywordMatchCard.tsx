'use client';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useATSStore } from '@/store/atsStore';
import { useAIAction } from '@/hooks/useAIAction';
import { useResumeStore } from '@/store/resumeStore';
import { useUIStore } from '@/store/uiStore';
import { Sparkles } from 'lucide-react';

export function KeywordMatchCard() {
  const result = useATSStore((s) => s.result);
  const rawKeywords = result?.keywords;
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];
  let keywordMatch = 0;

  if (Array.isArray(rawKeywords)) {
    matchedKeywords = rawKeywords.filter((k) => k.found).map((k) => k.keyword);
    missingKeywords = rawKeywords.filter((k) => !k.found).map((k) => k.keyword);
    keywordMatch = rawKeywords.length > 0
      ? Math.round((matchedKeywords.length / rawKeywords.length) * 100)
      : (result?.keywordScore ?? 0);
  } else if (rawKeywords && typeof rawKeywords === 'object') {
    const matchedArr = (rawKeywords as any).matched || [];
    const missingArr = (rawKeywords as any).missing || [];
    matchedKeywords = matchedArr;
    missingKeywords = missingArr;
    const total = matchedArr.length + missingArr.length;
    keywordMatch = total > 0
      ? Math.round((matchedArr.length / total) * 100)
      : ((rawKeywords as any).matchRate ?? result?.keywordScore ?? 0);
  } else {
    keywordMatch = result?.keywordScore ?? 0;
  }

  const { trigger, isLoading } = useAIAction();
  const showToast = useUIStore((s) => s.showToast);

  const handleAddMissingKeywords = () => {
    if (missingKeywords.length === 0) return;
    trigger(
      'suggest_skills',
      `Generate matching technical skills to add to my resume. Include these missing keywords: ${missingKeywords.join(', ')}`,
      'Integrate Keywords',
      (text) => {
        const skillsList = text.split(',').map((s) => s.trim()).filter(Boolean);
        const resumeStore = useResumeStore.getState();
        const currentSkills = resumeStore.resume.skills ?? [];
        const updated = Array.from(new Set([...currentSkills, ...skillsList]));
        resumeStore.updateSection('skills', updated);
        showToast(`Added missing keywords to skills!`, 'success');
      }
    );
  };

  const handleAddSingleKeyword = (keyword: string) => {
    const resumeStore = useResumeStore.getState();
    const currentSkills = resumeStore.resume.skills ?? [];
    if (!currentSkills.some(s => s.toLowerCase() === keyword.toLowerCase())) {
      resumeStore.updateSection('skills', [...currentSkills, keyword]);
      showToast(`Added "${keyword}" to skills!`, 'success');
    } else {
      showToast(`"${keyword}" is already in skills!`, 'info');
    }
  };

  return (
    <div className="rounded-[14px] border border-[#CFE0F7] bg-[#F7FAFF] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_16px_38px_rgba(59,73,223,0.09)] transition-all duration-200 hover:-translate-y-1 hover:border-primary-DEFAULT/35 hover:bg-[#EFF6FF]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#10233F]">Keyword Match</h3>
        <span className="text-lg font-extrabold text-primary-DEFAULT">{keywordMatch}%</span>
      </div>
      <ProgressBar value={keywordMatch} color="blue" size="md" className="mb-5" />
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-xs font-bold text-[#647A9A]">Matched Keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {matchedKeywords.map((keyword) => (
              <Badge key={keyword} variant="green" size="sm">{keyword}</Badge>
            ))}
            {matchedKeywords.length === 0 && (
              <span className="text-xs text-text-muted italic">None yet.</span>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-[#647A9A]">Missing Keywords</p>
            {missingKeywords.length > 0 && (
              <button
                onClick={handleAddMissingKeywords}
                disabled={isLoading}
                className="flex items-center gap-1 text-[10px] font-bold text-primary-DEFAULT hover:underline bg-blue-50 px-2 py-0.5 rounded border border-blue-100 transition-all hover:bg-blue-100"
              >
                <Sparkles className="h-2.5 w-2.5" /> Integrate with AI
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.map((keyword) => (
              <button
                key={keyword}
                onClick={() => handleAddSingleKeyword(keyword)}
                className="transition hover:scale-105 active:scale-95 text-left"
                title="Click to add directly to skills"
              >
                <Badge variant="red" size="sm" className="cursor-pointer hover:bg-red-200">
                  + {keyword}
                </Badge>
              </button>
            ))}
            {missingKeywords.length === 0 && (
              <span className="text-xs text-text-muted italic">None yet.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

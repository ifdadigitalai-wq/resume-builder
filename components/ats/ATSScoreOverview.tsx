'use client';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RefreshCw } from 'lucide-react';
import { useATSStore } from '@/store/atsStore';
import { useATSAnalysis } from '@/hooks/useATSAnalysis';

export function ATSScoreOverview() {
  const result = useATSStore((state) => state.result);
  const { analyze, isAnalyzing } = useATSAnalysis();

  const score = result?.overallScore ?? 0;
  let keywordMatchRate = 0;
  const rawKeywords = result?.keywords;

  if (Array.isArray(rawKeywords)) {
    const foundCount = rawKeywords.filter((k) => k.found).length;
    keywordMatchRate = rawKeywords.length > 0
      ? Math.round((foundCount / rawKeywords.length) * 100)
      : (result?.keywordScore ?? 0);
  } else if (rawKeywords && typeof rawKeywords === 'object') {
    const matchedArr = (rawKeywords as any).matched || [];
    const missingArr = (rawKeywords as any).missing || [];
    const total = matchedArr.length + missingArr.length;
    keywordMatchRate = total > 0
      ? Math.round((matchedArr.length / total) * 100)
      : ((rawKeywords as any).matchRate ?? result?.keywordScore ?? 0);
  } else {
    keywordMatchRate = result?.keywordScore ?? 0;
  }

  return (
    <div className="relative isolate overflow-hidden rounded-[16px] border border-[#BFD7FF] bg-[#EAF3FF] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_18px_42px_rgba(37,99,235,0.12)]">
      <div className="absolute right-8 top-6 -z-10 h-32 w-32 rounded-full bg-primary-DEFAULT/15 blur-2xl" />
      <div className="absolute bottom-0 right-0 -z-10 h-20 w-72 bg-gradient-to-l from-cyan-200/35 to-transparent blur-xl" />
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="rounded-[18px] border border-white/70 bg-white/75 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_14px_32px_rgba(37,99,235,0.10)]">
          <ScoreRing score={score} max={100} size={120} strokeWidth={11} color="#2563EB" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#647A9A]">Resume intelligence</p>
          <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-[#10233F] mb-2">ATS Compatibility Score</h2>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
            <Badge variant="green" size="md">Formatting: {result?.formattingScore ?? 0}%</Badge>
            <Badge variant="amber" size="md">Keywords: {keywordMatchRate}%</Badge>
            <Badge variant="blue" size="md">Completeness: {result?.completenessScore ?? 0}%</Badge>
          </div>
          <p className="text-sm font-medium leading-relaxed text-[#45607F] mb-4">
            Your resume scores {score}/100 matching the pasted job description. Review missing keywords below to raise your score.
          </p>
          <Button
            variant="secondary"
            size="md"
            onClick={() => analyze()}
            loading={isAnalyzing}
            className="bg-[#DDEBFF] text-[#07111F] hover:from-[#1F5BE3] hover:to-[#1746BF] hover:bg-gradient-to-br hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            {isAnalyzing ? 'Analyzing...' : 'Re-analyze Resume'}
          </Button>
        </div>
      </div>
    </div>
  );
}

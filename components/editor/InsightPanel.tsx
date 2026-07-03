'use client';
import { useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useATSStore } from '@/store/atsStore';
import { useResumeStore } from '@/store/resumeStore';
import { Tabs } from '@/components/ui/Tabs';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { Sparkles, RefreshCw, Lightbulb, Wrench } from 'lucide-react';
import { useAIAction, type AIAction } from '@/hooks/useAIAction';
import { useATSAnalysis } from '@/hooks/useATSAnalysis';

const TAB_ITEMS = [
  { key: 'ats', label: 'ATS Score' },
  { key: 'suggestions', label: 'Suggestions' },
  { key: 'keywords', label: 'Keywords' },
  { key: 'ai', label: <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" />AI</span> },
];

const AI_ACTIONS = [
  { label: 'Improve Description', action: 'improve_description' as const, prompt: 'Enhance details and structure' },
  { label: 'Generate Summary', action: 'generate_summary' as const, prompt: 'Draft an ATS-optimized professional summary' },
  { label: 'Suggest Skills', action: 'suggest_skills' as const, prompt: 'Brainstorm additional relevant skills' },
];

function isSuggestionResolved(s: { section: string; issue: string; fix: string }, resume: any): boolean {
  if (!resume) return false;
  
  const personal = resume.personal || {};
  const summary = resume.summary || '';
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];

  const section = (s.section || '').toLowerCase();
  const issue = (s.issue || '').toLowerCase();
  const fix = (s.fix || '').toLowerCase();
  const text = `${section} ${issue} ${fix}`;

  // 1. LinkedIn
  if (text.includes('linkedin')) {
    return !!(personal.socials?.linkedIn || personal.linkedIn);
  }

  // 2. Phone / Contact Info
  if (text.includes('phone') || text.includes('contact number') || text.includes('phone number')) {
    return !!personal.phone;
  }

  // 3. Email
  if (text.includes('email')) {
    return !!personal.email;
  }

  // 4. Location / Address / City
  if (text.includes('location') || text.includes('address') || text.includes('city')) {
    return !!personal.location;
  }

  // 5. Portfolio / Website / Links
  if (text.includes('portfolio') || text.includes('website') || text.includes('personal link')) {
    return !!(personal.socials?.portfolio || personal.portfolio);
  }
  if (text.includes('github')) {
    return !!(personal.socials?.github || personal.github);
  }

  // 6. Professional Summary
  if (section === 'summary' || text.includes('summary')) {
    if (text.includes('missing') || text.includes('add') || text.includes('write')) {
      return summary.trim().length > 10;
    }
    if (text.includes('short') || text.includes('length') || text.includes('extend') || text.includes('expand')) {
      return summary.trim().length > 50;
    }
    return summary.trim().length > 0;
  }

  // 7. Experience
  if (section === 'experience' || section === 'work' || text.includes('experience') || text.includes('work experience')) {
    if (text.includes('missing') || text.includes('add') || text.includes('no work')) {
      return experience.length > 0;
    }
    if (text.includes('bullet') || text.includes('action verb') || text.includes('describe')) {
      return experience.some((exp: any) => exp.bullets && exp.bullets.length > 0 && exp.bullets.some((b: string) => b.trim().length > 5));
    }
    return experience.length > 0;
  }

  // 8. Education
  if (section === 'education' || text.includes('education') || text.includes('degree')) {
    if (text.includes('missing') || text.includes('add') || text.includes('no education')) {
      return education.length > 0;
    }
    return education.length > 0;
  }

  // 9. Projects
  if (section === 'projects' || text.includes('project')) {
    if (text.includes('minimum') || text.includes('at least 2') || text.includes('more projects')) {
      return projects.length >= 2;
    }
    return projects.length > 0;
  }

  // 10. Skills
  if (section === 'skills' || text.includes('skills') || text.includes('skill')) {
    if (text.includes('add more') || text.includes('more skills') || text.includes('technical skills')) {
      const skillCount = Array.isArray(skills)
        ? (typeof skills[0] === 'object'
          ? skills.reduce((acc: number, cat: any) => acc + (cat.skills?.length ?? 0), 0)
          : skills.length)
        : 0;
      return skillCount >= 8;
    }
    return skills.length > 0;
  }

  // 11. Certifications
  if (section === 'certifications' || text.includes('certification') || text.includes('certificates')) {
    return certifications.length > 0;
  }

  return false;
}

export function InsightPanel() {
  const [activeRightTab, setActiveRightTab] = useState<'ats' | 'suggestions' | 'keywords' | 'ai'>('ats');
  const { analyze, result, isAnalyzing } = useATSAnalysis();
  const { trigger } = useAIAction();
  const resume = useResumeStore((s) => s.resume);

  const score = result?.overallScore ?? 0;
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
  const sectionCompleteness = result?.completenessScore ?? 0;
  const formattingScore = result?.formattingScore ?? 0;

  const rawSuggestions = result?.suggestions || [];
  const suggestions = rawSuggestions
    .filter((s: any) => !isSuggestionResolved(s, resume))
    .map((s: any, idx: number) => ({
      id: idx.toString(),
      title: s.issue || `${s.section} Check`,
      description: s.fix || 'Improve this section structure.',
      priority: s.priority ? s.priority.charAt(0).toUpperCase() + s.priority.slice(1) : 'Medium'
    }));

  return (
    <aside className="flex w-full shrink-0 flex-col rounded-[14px] border border-[#CFE0F7] bg-[#EAF3FF] shadow-[0_18px_42px_rgba(59,73,223,0.10)] xl:h-[calc(100vh-56px)] xl:w-[320px] xl:rounded-none xl:border-y-0 xl:border-r-0">
      <div className="shrink-0 border-b border-[#CFE0F7] bg-white/[0.72] backdrop-blur-xl">
        <Tabs
          items={TAB_ITEMS}
          activeKey={activeRightTab}
          onChange={(k) => setActiveRightTab(k as 'ats' | 'suggestions' | 'keywords' | 'ai')}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ATS Tab */}
        {activeRightTab === 'ats' && (
          <>
            <div className="flex flex-col items-center rounded-[12px] border border-[#CFE0F7] bg-[#F7FAFF] p-4 shadow-card">
              <ScoreRing score={score} max={100} size={100} strokeWidth={9} color="#3B49DF" />
              <h3 className="mt-3 font-semibold text-text-primary text-sm">Good Match</h3>
              <p className="text-[11px] text-text-muted text-center mt-1">
                Fix {suggestions.length} issues to push your score past 90+.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3 w-full bg-[#EAF3FF] text-[#10233F] hover:bg-primary-DEFAULT hover:text-black"
                loading={isAnalyzing}
                onClick={() => analyze()}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
              </Button>
            </div>
            <div className="space-y-3 rounded-[12px] border border-[#CFE0F7] bg-[#F7FAFF] p-4 shadow-card">
              {[
                { label: 'Keyword Match', value: keywordMatch, color: 'blue' as const },
                { label: 'Section Fill', value: sectionCompleteness, color: 'green' as const },
                { label: 'Formatting', value: formattingScore, color: 'cyan' as const },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-text-muted font-medium">{label}</span>
                    <span className="text-xs font-bold text-primary-DEFAULT">{value}%</span>
                  </div>
                  <ProgressBar value={value} color={color} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Suggestions Tab */}
        {activeRightTab === 'suggestions' && (
          <div className="space-y-3">
            {suggestions.map((s) => (
              <div key={s.id} className={`rounded-[10px] border p-3 ${
                s.priority === 'High' ? 'bg-amber-50 border-amber-100' :
                s.priority === 'Medium' ? 'bg-blue-50 border-blue-100' :
                'bg-cyan-50 border-cyan-100'
              }`}>
                <div className="flex items-start gap-2">
                  <Lightbulb className={`h-4 w-4 mt-0.5 shrink-0 ${
                    s.priority === 'High' ? 'text-amber-600' :
                    s.priority === 'Medium' ? 'text-blue-600' : 'text-cyan-600'
                  }`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-bold text-text-primary">{s.title}</p>
                      <Badge variant={s.priority === 'High' ? 'amber' : s.priority === 'Medium' ? 'blue' : 'gray'} size="sm">
                        {s.priority}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed">{s.description}</p>
                  </div>
                </div>
              </div>
            ))}
            {suggestions.length === 0 && (
              <p className="text-xs text-text-muted italic text-center py-4">
                {result ? '🎉 All suggestions resolved! Your resume is fully optimized.' : 'No suggestions yet. Run ATS audit first.'}
              </p>
            )}
          </div>
        )}

        {/* Keywords Tab */}
        {activeRightTab === 'keywords' && (
          <div className="space-y-4">
            <div className="rounded-[12px] border border-[#CFE0F7] bg-[#F7FAFF] p-4 shadow-card">
              <p className="text-xs font-semibold text-text-primary mb-3">✅ Matched Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {matchedKeywords.map((kw) => (
                  <Badge key={kw} variant="green" size="sm">{kw}</Badge>
                ))}
                {matchedKeywords.length === 0 && (
                  <p className="text-xs text-text-muted italic">No matched keywords yet.</p>
                )}
              </div>
            </div>
            <div className="rounded-[12px] border border-[#CFE0F7] bg-[#F7FAFF] p-4 shadow-card">
              <p className="text-xs font-semibold text-text-primary mb-3">❌ Missing Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {missingKeywords.map((kw) => (
                  <Badge key={kw} variant="red" size="sm">{kw}</Badge>
                ))}
                {missingKeywords.length === 0 && (
                  <p className="text-xs text-text-muted italic">No missing keywords yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI Tab */}
        {activeRightTab === 'ai' && (
          <div className="space-y-3">
            <p className="text-xs text-text-muted font-medium">Choose an AI action to enhance your resume:</p>
            {AI_ACTIONS.map((item) => (
              <button
                key={item.action}
                onClick={() => trigger(item.action, item.prompt)}
                className="group w-full rounded-[10px] border border-[#CFE0F7] bg-[#F7FAFF] px-4 py-3 text-left text-sm font-bold text-[#10233F] transition-all hover:-translate-y-0.5 hover:border-primary-DEFAULT hover:bg-[#DDEBFF] hover:shadow-[0_12px_28px_rgba(59,73,223,0.12)]"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary-DEFAULT group-hover:rotate-12 transition-transform" />
                  <div>
                    <div>{item.label}</div>
                    <div className="text-[10px] font-normal text-slate-500 mt-0.5">{item.prompt}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="shrink-0 border-t border-[#CFE0F7] bg-white/[0.72] p-4 backdrop-blur-xl">
        <Button variant="primary" size="sm" className="w-full" onClick={() => analyze()} loading={isAnalyzing}>
          <Sparkles className="h-4 w-4" />
          Run Full ATS Audit
        </Button>
      </div>
    </aside>
  );
}

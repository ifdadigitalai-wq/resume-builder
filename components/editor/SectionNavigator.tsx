'use client';
import { cn } from '@/lib/utils';
import { useResumeStore } from '@/store/resumeStore';
import { RESUME_SECTIONS } from '@/lib/constants';
import { ScoreRing } from '@/components/ui/ScoreRing';
import {
  User, FileText, GraduationCap, Zap, FolderGit2, Briefcase, Award,
} from 'lucide-react';
import type { SectionKey } from '@/types/resume';

const ICON_MAP: Record<string, React.ElementType> = {
  User, FileText, GraduationCap, Zap, FolderGit2, Briefcase, Award,
};

interface SectionNavigatorProps {
  horizontal?: boolean;
}

export function SectionNavigator({ horizontal = false }: SectionNavigatorProps) {
  const { activeSection, setActiveSection } = useResumeStore();
  const completionScore = useResumeStore((s) => s.resume.completionScore);

  const scoreColor =
    completionScore >= 80 ? '#10B981' :
    completionScore >= 50 ? '#F59E0B' :
    '#EF4444';

  const scoreLabel =
    completionScore >= 90 ? 'Excellent' :
    completionScore >= 70 ? 'Good' :
    completionScore >= 50 ? 'Fair' :
    'Needs Work';

  return (
    <div className={cn(horizontal ? 'w-full text-text-primary' : 'relative flex flex-1 flex-col overflow-y-auto py-4 text-text-primary')}>
      <div className={cn(horizontal ? '' : 'px-4')}>
          <p className="text-[10px] uppercase tracking-[0.16em] font-extrabold mb-3 text-text-secondary">
            Resume Sections
          </p>
          <nav className={cn(horizontal ? 'flex gap-2 overflow-x-auto pb-1' : 'space-y-0.5')}>
            {RESUME_SECTIONS.map(({ key, label, icon }) => {
              const Icon = ICON_MAP[icon];
              const isActive = activeSection === key;
              return (
                <button
  key={key}
  onClick={() => setActiveSection(key as SectionKey)}
  className={cn(
    "flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all duration-300",
    horizontal ? "shrink-0" : "w-full",

    isActive
      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg scale-[1.02]"
      : horizontal
      ? "bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-600"
      : "text-slate-600 hover:bg-violet-50 hover:text-violet-600"
  )}
>
  {Icon && <Icon className="h-4 w-4 shrink-0" />}
  <span>{label}</span>
</button>
              );
            })}
          </nav>
      </div>

      {/* Resume Completion Ring */}
      {!horizontal && (
        <div className="mt-auto px-4 pt-5 pb-2">
          <div className="rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-4 shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.16em] font-extrabold mb-3 text-text-secondary text-center">
              Resume Completion
            </p>
            <div className="flex flex-col items-center">
              <ScoreRing
                score={completionScore}
                max={100}
                size={88}
                strokeWidth={8}
                color={scoreColor}
              />
              <p className="mt-2 text-xs font-bold" style={{ color: scoreColor }}>
                {scoreLabel}
              </p>
              <p className="mt-1 text-[10px] text-slate-400 text-center leading-relaxed">
                {completionScore < 80
                  ? 'Add LinkedIn, GitHub & portfolio to boost your score'
                  : 'Your resume is looking great!'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

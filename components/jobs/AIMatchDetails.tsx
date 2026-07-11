'use client';

import { ScoreRing } from '@/components/ui/ScoreRing';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIMatchDetailsProps {
  result: {
    matchScore: number;
    matchingSkills: string[];
    missingSkills: string[];
    suggestions: string[];
  };
}

export function AIMatchDetails({ result }: AIMatchDetailsProps) {
  const { matchScore, matchingSkills, missingSkills, suggestions } = result;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Success Green
    if (score >= 50) return '#F59E0B'; // Warning Amber
    return '#EF4444'; // Danger Red
  };

  const getScoreFeedback = (score: number) => {
    if (score >= 85) return 'Excellent Match! Your skills and background are highly compatible with this role. You are an ideal candidate.';
    if (score >= 65) return 'Good Match! You satisfy most core requirements, with minor adjustments recommended to optimize your visibility.';
    if (score >= 45) return 'Moderate Match. You have some transferable skills, but would benefit from closing the key skill gaps indicated below.';
    return 'Weak Match. Consider refining your resume or acquiring the core technical skills before applying to increase your selection chances.';
  };

  return (
    <div className="space-y-6">
      {/* Overview Ring & Description Card */}
      <div className="flex flex-col md:flex-row items-center gap-6 bg-slate-50 border border-slate-100 rounded-2xl p-5">
        <div className="shrink-0 flex items-center justify-center relative">
          <ScoreRing
            score={matchScore}
            max={100}
            size={120}
            strokeWidth={10}
            color={getScoreColor(matchScore)}
          />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h4 className="text-sm font-extrabold text-slate-800 flex items-center justify-center md:justify-start gap-1.5">
            <Sparkles className="h-4.5 w-4.5 text-blue-600 fill-blue-100 animate-pulse" />
            AI Resume Compatibility Report
          </h4>
          <p className="text-xs text-slate-600 font-semibold leading-relaxed">
            {getScoreFeedback(matchScore)}
          </p>
        </div>
      </div>

      {/* Skills Comparison Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matching Skills */}
        <div className="bg-emerald-50/50 border border-emerald-100/75 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            Matching Skills ({matchingSkills.length})
          </h4>
          {matchingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {matchingSkills.map((skill) => (
                <Badge key={skill} variant="green" size="md">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-semibold italic">No exact skill matches identified.</p>
          )}
        </div>

        {/* Missing Skills */}
        <div className="bg-red-50/30 border border-red-100/50 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-bold text-red-800 flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            Missing/Recommended Skills ({missingSkills.length})
          </h4>
          {missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map((skill) => (
                <Badge key={skill} variant="red" size="md">
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-600 font-semibold italic">Excellent! You have all the core skills listed.</p>
          )}
        </div>
      </div>

      {/* Tailored Suggestions */}
      <div className="bg-blue-50/30 border border-blue-100/50 rounded-2xl p-5 space-y-3">
        <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4 text-blue-600 shrink-0" />
          AI Optimization Suggestions
        </h4>
        {suggestions.length > 0 ? (
          <ul className="space-y-2 text-xs text-slate-700 font-semibold leading-relaxed list-inside list-disc pl-1">
            {suggestions.map((suggestion, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="hover:text-blue-700 transition-colors"
              >
                {suggestion}
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-slate-400 font-semibold italic">No suggestions required. Your resume matches perfectly.</p>
        )}
      </div>
    </div>
  );
}

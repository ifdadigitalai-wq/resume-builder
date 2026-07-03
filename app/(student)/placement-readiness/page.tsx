'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Layers3,
  Linkedin,
  Target,
  Wrench,
  Loader2,
} from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { calculateCompletion } from '@/lib/resumeUtils';

export default function PlacementReadinessPage() {
  const [stats, setStats] = useState({
    completionScore: 0,
    latestAtsScore: 0,
    projectCount: 0,
    skillCount: 0,
    hasLinkedIn: false,
    resumeId: null as string | null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((res) => res.json())
      .then(async (data) => {
        let projectCount = 0;
        let skillCount = 0;
        let hasLinkedIn = false;
        let completionScore = data.completionScore ?? 0;
        let atsScore = data.latestAtsScore ?? 0;
        const resumeId = data.latestResumeId || null;

        if (data.latestResumeId) {
          const res2 = await fetch(`/api/resume/${data.latestResumeId}`);
          if (res2.ok) {
            const { resume } = await res2.json();
            const sections = resume.sections || {};
            projectCount = sections.projects?.length ?? 0;
            const rawSkills = sections.skills || [];
            if (Array.isArray(rawSkills)) {
              rawSkills.forEach((item: any) => {
                if (typeof item === 'string') {
                  skillCount++;
                } else if (item && typeof item === 'object') {
                  if (Array.isArray(item.skills)) {
                    skillCount += item.skills.length;
                  } else if (typeof item.name === 'string') {
                    skillCount++;
                  }
                }
              });
            }
            hasLinkedIn = !!(sections.personal?.socials?.linkedIn || sections.personal?.linkedIn);
            completionScore = calculateCompletion(sections);
            // Use ATS score directly from the same resume to guarantee consistency
            atsScore = resume.atsScore ?? 0;
          }
        }

        setStats({
          completionScore,
          latestAtsScore: atsScore,
          projectCount,
          skillCount,
          hasLinkedIn,
          resumeId,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const readinessScore = Math.round((stats.completionScore * 0.5) + (stats.latestAtsScore * 0.5));

  const getReadinessTier = (score: number, completion: number, ats: number) => {
    if (ats >= 80 && completion >= 90) return { label: 'Ready', variant: 'green' as const, title: 'You are Placement Ready!', desc: "Excellent job! Your profile stands out. Keep auditing against job descriptions for absolute match confidence." };
    if (completion >= 75 || ats >= 70) return { label: 'Almost Ready', variant: 'amber' as const, title: "You're Almost Placement Ready", desc: "Optimize your resume with high-impact improvements to boost ATS score and recruiter trust." };
    if (completion >= 50 || ats >= 50) return { label: 'Getting There', variant: 'blue' as const, title: "Getting There", desc: "Add more details, technical skills, and projects to align your profile with standard placement benchmarks." };
    return { label: 'Not Ready', variant: 'gray' as const, title: "Let's build your profile", desc: "Complete more sections and run your first ATS audit to calculate baseline placement readiness." };
  };

  const tier = getReadinessTier(readinessScore, stats.completionScore, stats.latestAtsScore);

  const nextSteps = [];
  if (stats.projectCount < 2) {
    nextSteps.push({ text: 'Add more projects (minimum 2 recommended)', icon: Layers3 });
  }
  if (stats.latestAtsScore < 80) {
    nextSteps.push({ text: 'Improve resume keywords to match job descriptions', icon: Target });
  }
  if (!stats.hasLinkedIn) {
    nextSteps.push({ text: 'Complete your LinkedIn URL in personal info', icon: Linkedin });
  }
  if (stats.completionScore < 90) {
    nextSteps.push({ text: 'Fill out missing sections in your resume', icon: Wrench });
  }

  const actionCount = nextSteps.length;

  if (nextSteps.length === 0) {
    nextSteps.push({ text: 'Your resume is placement ready! Start applying to jobs.', icon: CheckCircle2 });
  }

  const readinessCards = [
    {
      label: 'Resume Completed',
      value: `${stats.completionScore}%`,
      detail: stats.completionScore >= 90 ? 'Excellent' : stats.completionScore >= 60 ? 'Most sections ready' : 'Need details',
      content: <ProgressBar value={stats.completionScore} color={stats.completionScore >= 80 ? 'green' : 'blue'} className="mt-4" />,
    },
    {
      label: 'ATS Score',
      value: stats.latestAtsScore > 0 ? `${stats.latestAtsScore}/100` : 'Not run',
      detail: stats.latestAtsScore >= 80 ? 'Excellent match' : stats.latestAtsScore >= 50 ? 'Good baseline' : 'Need audit',
      content: (
        <div className="mt-4 flex justify-center">
          <ScoreRing score={stats.latestAtsScore} size={82} color={stats.latestAtsScore >= 85 ? '#10B981' : stats.latestAtsScore >= 70 ? '#3B82F6' : '#EF4444'} />
        </div>
      ),
    },
    {
      label: 'Project Quality',
      value: `${stats.projectCount} Projects`,
      detail: stats.projectCount >= 2 ? 'Strong portfolio' : 'Add measurable impact',
      content: <ProgressBar value={Math.min(100, stats.projectCount * 50)} color="blue" className="mt-4" />,
    },
    {
      label: 'Skill Coverage',
      value: `${stats.skillCount} Skills`,
      detail: stats.skillCount >= 10 ? 'Good coverage' : 'Add more skills',
      content: <ProgressBar value={Math.min(100, stats.skillCount * 10)} color="cyan" className="mt-4" />,
    },
    {
      label: 'Profile Strength',
      value: stats.hasLinkedIn ? 'Excellent' : 'Good',
      detail: stats.hasLinkedIn ? 'LinkedIn connected' : 'LinkedIn missing',
      content: stats.hasLinkedIn ? (
        <Badge variant="green" className="mt-4">Linked</Badge>
      ) : (
        <Badge variant="amber" className="mt-4">Needs polish</Badge>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary-DEFAULT" />
        <p className="text-sm font-semibold text-slate-500">Calculating readiness...</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* 🌈 Background Glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-blue-50 blur-2xl opacity-70" />

      {/* 🧠 HERO */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl p-6 shadow-xl"
      >
        <div className="flex flex-col lg:flex-row justify-between gap-6 items-center">
          <div>
            <Badge variant={tier.variant} className="px-4 py-2 text-sm font-bold">
              🚀 {readinessScore}% - {tier.label}
            </Badge>

            <h1 className="mt-4 text-3xl font-extrabold text-gray-800">
              {tier.title}
            </h1>

            <p className="mt-2 text-sm text-gray-600 max-w-xl">
              {tier.desc}
            </p>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ScoreRing score={readinessScore} size={110} color={readinessScore >= 80 ? '#10B981' : readinessScore >= 60 ? '#F59E0B' : readinessScore >= 40 ? '#3B82F6' : '#94A3B8'} />
          </motion.div>
        </div>
      </motion.section>

      {/* 📊 STATS */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {readinessCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8, scale: 1.03 }}
            className="rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl p-5 shadow-md flex flex-col justify-between min-h-[180px]"
          >
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                {card.label}
              </p>

              <p className="mt-2 text-xl font-bold text-gray-800">
                {card.value}
              </p>

              <p className="text-xs text-gray-500 mt-0.5">
                {card.detail}
              </p>
            </div>

            {card.content}
          </motion.div>
        ))}
      </div>

      {/* 🚀 NEXT STEPS */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-100 p-6 shadow-xl"
      >
        <div className="mb-5 flex justify-between items-center">
          <div>
            <p className="text-xs uppercase text-gray-500 font-bold">
              Action Plan
            </p>
            <h2 className="text-xl font-bold text-gray-800">
              What to do next
            </h2>
          </div>

          <Badge variant="blue">{actionCount} actions</Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {nextSteps.map(({ text, icon: Icon }, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="flex justify-between items-center p-4 rounded-xl bg-white/70 backdrop-blur border border-white/50 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {text}
                  </p>
                  <p className="text-xs text-gray-500">
                    Step {i + 1}
                  </p>
                </div>
              </div>

              <Badge variant="blue">High</Badge>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ✅ CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          Resume synced with ATS
        </div>

        <Link
          href={stats.resumeId ? `/resume/${stats.resumeId}/editor` : '/resume/create'}
          className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 text-white font-semibold shadow-lg hover:scale-105 transition"
        >
          Improve Resume
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </Link>
      </motion.div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { AIMatchDetails } from '@/components/jobs/AIMatchDetails';
import { Job, AIMatchResult } from '@/lib/jobs/types';
import { useUIStore } from '@/store/uiStore';
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Sparkles,
  ArrowLeft,
  Calendar,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const showToast = useUIStore((s) => s.showToast);

  const [job, setJob] = useState<Job | null>(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [errorJob, setErrorJob] = useState<string | null>(null);

  // Resume states
  const [latestResumeId, setLatestResumeId] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<any | null>(null);
  const [loadingResume, setLoadingResume] = useState(true);

  // AI Matching States
  const [aiResult, setAiResult] = useState<AIMatchResult | null>(null);
  const [matching, setMatching] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Fetch Job details
    const fetchJobDetails = async () => {
      setLoadingJob(true);
      setErrorJob(null);
      try {
        const res = await fetch(`/api/jobs/detail?id=${id}`);
        if (!res.ok) {
          throw new Error('Failed to retrieve job details');
        }
        const data = await res.json();
        setJob(data.job || null);
      } catch (err: any) {
        console.error(err);
        setErrorJob(err.message || 'Failed to load details.');
      } finally {
        setLoadingJob(false);
      }
    };

    // Fetch latest resume details
    const fetchResumeDetails = async () => {
      setLoadingResume(true);
      try {
        const statsRes = await fetch('/api/dashboard/stats');
        if (!statsRes.ok) return;
        const stats = await statsRes.json();
        
        if (stats.latestResumeId) {
          setLatestResumeId(stats.latestResumeId);
          
          const resumeRes = await fetch(`/api/resume/${stats.latestResumeId}`);
          if (resumeRes.ok) {
            const data = await resumeRes.json();
            if (data.resume && data.resume.sections) {
              setResumeData(data.resume.sections);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load resume details:', err);
      } finally {
        setLoadingResume(false);
      }
    };

    fetchJobDetails();
    fetchResumeDetails();
  }, [id]);

  const handleMatchResume = async () => {
    if (!job || !resumeData) {
      showToast('No active resume found. Build a resume first!', 'error');
      return;
    }

    setMatching(true);
    try {
      const res = await fetch('/api/jobs/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: job.description,
          resumeData: resumeData,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to run AI resume analysis');
      }

      const data = await res.json();
      if (data.result) {
        setAiResult(data.result);
        showToast('AI resume match report generated!', 'success');
      } else {
        throw new Error('Incomplete matching data returned');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'AI Matching failed. Try again.', 'error');
    } finally {
      setMatching(false);
    }
  };

  const handleRunAtsAudit = () => {
    if (!latestResumeId) {
      showToast('Create a resume first to run an ATS audit!', 'error');
      return;
    }
    router.push(`/resume/${latestResumeId}/ats?jobId=${job?.id}`);
  };

  if (loadingJob) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <LoadingState message="Loading job details..." />
      </div>
    );
  }

  if (errorJob || !job) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <ErrorState
          title="Job details unavailable"
          message={errorJob || 'The requested job post could not be retrieved.'}
          onRetry={() => router.push('/jobs')}
        />
      </div>
    );
  }

  let timeAgo = 'Recently';
  try {
    timeAgo = formatDistanceToNow(new Date(job.postedAt), { addSuffix: true });
  } catch (e) {}

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/50 blur-3xl opacity-60" />

      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <button
          onClick={() => router.push('/jobs')}
          className="flex items-center gap-1.5 text-xs text-slate-500 font-bold hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs List
        </button>

        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
          <span>Jobs</span>
          <ChevronRight className="h-3 w-3" />
          <span>{job.company}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-600">{job.title}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Hand: Job Info (7 cols) */}
        <div className="lg:col-span-7 space-y-6 bg-white/80 backdrop-blur-md border border-[#CFE0F7] rounded-3xl p-6 shadow-sm">
          {/* Header section */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="blue" size="sm">
                {job.source}
              </Badge>
              <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Posted {timeAgo}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-snug">
              {job.title}
            </h1>
            <p className="text-sm font-bold text-slate-500 mt-1">{job.company}</p>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-slate-100 py-4 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100/50">
              <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Location</p>
                <p className="truncate text-slate-800 font-extrabold mt-0.5">{job.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100/50">
              <Briefcase className="h-4 w-4 text-blue-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Experience</p>
                <p className="truncate text-slate-800 font-extrabold mt-0.5">{job.experience}</p>
              </div>
            </div>
            {job.salary && (
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100/50">
                <IndianRupee className="h-4 w-4 text-blue-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Est. Salary</p>
                  <p className="truncate text-slate-800 font-extrabold mt-0.5">{job.salary}</p>
                </div>
              </div>
            )}
          </div>

          {/* Job Description details */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-800">Job Description</h3>
            <div className="text-xs text-slate-600 font-semibold leading-relaxed whitespace-pre-wrap">
              {job.description}
            </div>
          </div>

          {/* Skills Required */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-800">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Apply External */}
          <div className="pt-4 flex items-center justify-end">
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="bg-blue-600 text-white rounded-xl font-bold flex items-center gap-1.5 px-6">
                Apply Now
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>

        {/* Right Hand: AI Matching details & ATS Redirect (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Actions / Match with AI */}
          <div className="bg-white/80 backdrop-blur-md border border-[#CFE0F7] rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600 fill-blue-100 animate-pulse shrink-0" />
              <h2 className="text-sm font-extrabold text-slate-800">Resume Matching Assistant</h2>
            </div>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Match your active resume sections against this job description to see skill gaps, compatibility ratings, and optimization tips.
            </p>

            <div className="flex flex-col gap-3 pt-1">
              <Button
                variant="primary"
                onClick={handleMatchResume}
                loading={matching}
                disabled={!resumeData || matching || loadingResume}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold flex items-center justify-center gap-1.5"
              >
                {!matching && <FileCheck className="h-4.5 w-4.5" />}
                Match My Resume
              </Button>

              {latestResumeId && (
                <Button
                  variant="secondary"
                  onClick={handleRunAtsAudit}
                  disabled={loadingResume}
                  className="w-full border-[#BFD7FF] bg-[#EAF3FF] hover:bg-primary-DEFAULT hover:text-white text-[#10233F] rounded-xl font-extrabold flex items-center justify-center gap-1.5"
                >
                  <TrendingUp className="h-4.5 w-4.5" />
                  Analyze in ATS Audit
                </Button>
              )}
            </div>

            {!latestResumeId && !loadingResume && (
              <div className="text-center text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-100 rounded-xl p-3">
                No active resume found! Click <Link href="/resume/create" className="underline hover:text-amber-800 font-extrabold">here</Link> to create a resume first.
              </div>
            )}
          </div>

          {/* AI Report results once fetched */}
          {matching && (
            <div className="bg-white/80 border border-[#CFE0F7] rounded-3xl p-6 shadow-sm flex items-center justify-center min-h-[220px]">
              <LoadingState message="AI is auditing compatibility..." />
            </div>
          )}

          {aiResult && !matching && (
            <div className="bg-white/80 border border-[#CFE0F7] rounded-3xl p-6 shadow-sm animate-in fade-in duration-300">
              <AIMatchDetails result={aiResult} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

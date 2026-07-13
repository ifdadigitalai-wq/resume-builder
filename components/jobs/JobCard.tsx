'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Job } from '@/lib/jobs/types';
import { MapPin, Briefcase, IndianRupee, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: Job & { matchScore?: number | null };
  hasResume?: boolean;
}

export function JobCard({ job, hasResume = true }: JobCardProps) {
  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 50) return 'amber';
    return 'red';
  };

  const getSourceBadgeVariant = (source: string) => {
    const src = source.toLowerCase();
    if (src.includes('linkedin')) return 'blue';
    if (src.includes('naukri')) return 'purple';
    return 'gray';
  };

  // Format posted time
  let postedTime = 'Recently';
  try {
    postedTime = formatDistanceToNow(new Date(job.postedAt), { addSuffix: true });
  } catch (e) {
    postedTime = 'Recently';
  }

  return (
    <Card className="flex flex-col h-full border border-slate-200 bg-white hover:border-blue-300 shadow-sm rounded-xl overflow-hidden group transition-all duration-300">
      <div className="flex-1 flex flex-col justify-between p-1">
        <div>
          {/* Header row with provider badge and match score */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <Badge variant={getSourceBadgeVariant(job.source)} size="sm">
              {job.source}
            </Badge>

            {hasResume && typeof job.matchScore === 'number' ? (
              <div className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 fill-blue-100 shrink-0" />
                <Badge variant={getMatchScoreColor(job.matchScore)} size="sm" className="font-bold">
                  {job.matchScore}% Match
                </Badge>
              </div>
            ) : (
              <Badge variant="gray" size="sm" className="font-medium text-[10px]">
                Create resume to match
              </Badge>
            )}
          </div>

          {/* Job Title and Company */}
          <div className="mb-4">
            <h3 className="text-base font-extrabold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-xs font-bold text-slate-500 mt-0.5">{job.company}</p>
          </div>

          {/* Meta Details Grid */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-3 mb-4 text-xs text-slate-600 font-semibold">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{job.experience}</span>
            </div>
            {job.salary && (
              <div className="flex items-center gap-1.5 col-span-2 min-w-0">
                <IndianRupee className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{job.salary}</span>
              </div>
            )}
          </div>

          {/* Core Skills Badges */}
          <div className="flex flex-wrap gap-1 mb-4">
            {job.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[10px] text-slate-400 font-bold px-1.5 py-0.5">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Card Footer actions */}
        <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
            <Clock className="h-3.5 w-3.5" />
            <span>{postedTime}</span>
          </div>

          <Link
            href={{
              pathname: `/jobs/${job.id}`,
              query: {
                title: job.title,
                company: job.company,
                location: job.location,
                skills: (job.skills || []).join(','),
                applyUrl: job.applyUrl,
                experience: job.experience,
                salary: job.salary || '',
                source: job.source,
              },
            }}
            className="shrink-0"
          >
            <Button
              variant="secondary"
              size="sm"
              className="text-xs h-8 border-slate-200 text-blue-600 hover:bg-blue-50 font-bold px-3 py-1 flex items-center gap-1 rounded-lg"
            >
              Details
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

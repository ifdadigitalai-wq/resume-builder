'use client';

import { useState, useEffect, useCallback } from 'react';
import { JobSearch } from '@/components/jobs/JobSearch';
import { JobCard } from '@/components/jobs/JobCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Job } from '@/lib/jobs/types';
import { motion } from 'framer-motion';
import { Sparkles, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function JobsPage() {
  const [jobs, setJobs] = useState<(Job & { matchScore?: number | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasResume, setHasResume] = useState(true);

  // Pagination and query state
  const [filters, setFilters] = useState({
    query: '',
    location: '',
    experience: '',
    workmode: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: '6',
      });
      if (filters.query) searchParams.append('query', filters.query);
      if (filters.location) searchParams.append('location', filters.location);
      if (filters.experience) searchParams.append('experience', filters.experience);
      if (filters.workmode) searchParams.append('workmode', filters.workmode);

      const res = await fetch(`/api/jobs/search?${searchParams.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to retrieve jobs list');
      }
      const data = await res.json();
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setHasResume(!!data.hasResume);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
      {/* Background glow styling matching dashboard */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-cyan-50 blur-3xl opacity-60" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            AI Job Search Assistant
            <Sparkles className="h-5 w-5 text-blue-600 animate-pulse shrink-0" />
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Discover public listings on LinkedIn and Naukri.com, custom-matched with your resume.
          </p>
        </div>

        {!hasResume && (
          <Link href="/resume/create" className="shrink-0">
            <Button
              variant="secondary"
              size="sm"
              className="text-xs h-9 bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1.5 rounded-xl font-bold"
            >
              <FileText className="h-4 w-4 text-amber-600" />
              Build a Resume to Enable AI Matching
            </Button>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <JobSearch onSearch={handleSearch} isLoading={loading} />

      {/* Main Results Listing */}
      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center bg-white/50 border border-slate-100 rounded-2xl">
          <LoadingState message="Scraping & fetching matched jobs..." />
        </div>
      ) : error ? (
        <div className="min-h-[300px] flex items-center justify-center bg-white/50 border border-slate-100 rounded-2xl">
          <ErrorState message={error} onRetry={fetchJobs} />
        </div>
      ) : jobs.length === 0 ? (
        <div className="min-h-[300px] flex items-center justify-center bg-white/50 border border-slate-100 rounded-2xl">
          <EmptyState
            title="No matching jobs found"
            description="Try modifying your search queries, clearing active filters, or creating/updating your resume details to broaden matches."
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-xs font-bold text-slate-500 flex items-center justify-between border-b border-slate-100 pb-2">
            <span>Showing {jobs.length} of {total} jobs found</span>
            {hasResume && <span className="text-blue-600 font-extrabold flex items-center gap-1">✔ Skills matched with active resume</span>}
          </div>

          {/* Jobs Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <JobCard job={job} hasResume={hasResume} />
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className="h-8 w-8 p-0 rounded-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handlePageChange(p)}
                  className={`h-8 w-8 p-0 rounded-lg text-xs font-bold ${
                    p === page ? 'bg-blue-600 text-white shadow-sm' : ''
                  }`}
                >
                  {p}
                </Button>
              ))}

              <Button
                variant="secondary"
                size="sm"
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="h-8 w-8 p-0 rounded-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

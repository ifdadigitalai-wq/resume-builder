'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Loader2,
  Plus,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/store/uiStore';

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location?: string;
  requiredSkills: string[];
}

interface Student {
  id: string;
  name: string;
  branch: string;
  year: string;
  atsScore: number;
  skills: string[];
}

export default function MatchedJobsPage() {
  const { showToast } = useUIStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Modal and Form States for creating a job
  const [showAddModal, setShowAddModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobSkills, setJobSkills] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [notifying, setNotifying] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [resJobs, resStudents] = await Promise.all([
        fetch('/api/officer/jobs'),
        fetch('/api/officer/students'),
      ]);

      const jobsData = await resJobs.json();
      const studentsData = await resStudents.json();

      const fetchedJobs = (jobsData.data || []).map((j: any) => ({
        id: j.id,
        title: j.title,
        company: j.company,
        description: j.description,
        location: j.location || 'Remote',
        requiredSkills: j.requiredSkills || [],
      }));

      const fetchedStudents = (studentsData.students || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        branch: s.batch || 'N/A',
        year: s.course || 'N/A',
        atsScore: s.latestAtsScore ?? 0,
        skills: s.skills || [],
      }));

      setJobs(fetchedJobs);
      setStudents(fetchedStudents);

      if (fetchedJobs.length > 0) {
        setSelectedJob(fetchedJobs[0]);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch matched jobs or students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobCompany || !jobDescription) {
      showToast('Title, Company, and Description are required', 'error');
      return;
    }
    setFormLoading(true);

    try {
      const skillsArray = jobSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch('/api/officer/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: jobTitle,
          company: jobCompany,
          description: jobDescription,
          location: jobLocation || undefined,
          requiredSkills: skillsArray,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to create job requirement');
      }

      showToast('Job requirement created successfully!', 'success');
      setJobTitle('');
      setJobCompany('');
      setJobDescription('');
      setJobSkills('');
      setJobLocation('');
      setShowAddModal(false);
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'An error occurred', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleNotifyStudents = async () => {
    if (!selectedJob || matchedStudents.length === 0) return;
    setNotifying(true);
    try {
      const studentIds = matchedStudents.map((s) => s.id);
      const message = `Match Alert! You have been matched with the job role "${selectedJob.title}" at ${selectedJob.company} (${selectedJob.location || 'Remote'}). Please check your ATS audit panel for more details.`;
      
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentIds,
          message,
          type: 'MATCH',
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send notifications');
      }

      showToast(`Successfully notified ${matchedStudents.length} matched student(s)!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to notify students', 'error');
    } finally {
      setNotifying(false);
    }
  };

  const calculateMatch = (student: Student, job: Job) => {
    const required = job.requiredSkills || [];
    let skillScore = 100;
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    if (required.length > 0) {
      const studentSkillsLower = (student.skills || []).map((s) => s.toLowerCase().trim());
      required.forEach((reqSkill) => {
        const reqSkillLower = reqSkill.toLowerCase().trim();
        // More accurate matching: check for exact match, or word-boundary substring match
        const hasSkill = studentSkillsLower.some((s) => {
          // Exact match
          if (s === reqSkillLower) return true;
          // Check if multi-word required skill words are found in student skills or vice versa
          const reqWords = reqSkillLower.split(/[\s/,.-]+/).filter(Boolean);
          const sWords = s.split(/[\s/,.-]+/).filter(Boolean);
          // Required skill words found in student skill
          if (reqWords.length > 1 && reqWords.every(w => s.includes(w))) return true;
          // Student skill words found in required skill  
          if (sWords.length > 1 && sWords.every(w => reqSkillLower.includes(w))) return true;
          // Single word exact match (avoid 'c' matching 'react')
          if (reqWords.length === 1 && sWords.length === 1) {
            return s === reqSkillLower;
          }
          // One is a substring of the other, but only if the shorter one is at least 3 chars
          const shorter = s.length < reqSkillLower.length ? s : reqSkillLower;
          const longer = s.length < reqSkillLower.length ? reqSkillLower : s;
          if (shorter.length >= 3 && longer.includes(shorter)) return true;
          return false;
        });
        if (hasSkill) {
          matchedSkills.push(reqSkill);
        } else {
          missingSkills.push(reqSkill);
        }
      });
      skillScore = (matchedSkills.length / required.length) * 100;
    }

    const branchLower = student.branch.toLowerCase();
    const descLower = job.description.toLowerCase();
    const titleLower = job.title.toLowerCase();

    const branchKeywords = [branchLower];
    if (branchLower === 'cse' || branchLower.includes('computer')) {
      branchKeywords.push('computer science', 'software', 'cse', 'it', 'programming', 'developer');
    } else if (branchLower === 'ece' || branchLower.includes('electronics')) {
      branchKeywords.push('electronics', 'communication', 'ece', 'embedded', 'hardware');
    } else if (branchLower === 'me' || branchLower.includes('mechanical')) {
      branchKeywords.push('mechanical', 'cad', 'me', 'manufacturing');
    }

    const matchesBranch = branchKeywords.some(
      (keyword) => descLower.includes(keyword) || titleLower.includes(keyword)
    );
    const branchScore = matchesBranch ? 100 : 0;

    const atsScore = student.atsScore ?? 0;

    let overallScore = 0;
    if (required.length > 0) {
      overallScore = Math.round(skillScore * 0.5 + branchScore * 0.2 + atsScore * 0.3);
    } else {
      overallScore = Math.round(branchScore * 0.4 + atsScore * 0.6);
    }

    return {
      overallScore,
      matchedSkills,
      missingSkills,
      branchMatch: matchesBranch,
    };
  };

  const matchedStudents = useMemo(() => {
    if (!selectedJob) return [];

    return students
      .map((student) => {
        const matchDetails = calculateMatch(student, selectedJob);
        return {
          ...student,
          matchDetails,
        };
      })
      .filter((s) => {
        // A student matches if they have at least one matched skill, or branch alignment,
        // AND their overall score is meaningful (>= 20)
        const hasSkillMatch = s.matchDetails.matchedSkills.length > 0;
        const hasBranchMatch = s.matchDetails.branchMatch;
        const hasDecentScore = s.matchDetails.overallScore >= 20;
        
        // If the job has required skills, require at least one skill match or branch match
        if ((selectedJob.requiredSkills || []).length > 0) {
          return (hasSkillMatch || hasBranchMatch) && hasDecentScore;
        }
        // If no required skills, use branch + ATS with a reasonable threshold
        return hasBranchMatch || hasDecentScore;
      })
      .sort((a, b) => b.matchDetails.overallScore - a.matchDetails.overallScore);
  }, [selectedJob, students]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary-DEFAULT" />
        <p className="text-sm font-semibold text-slate-500">Loading jobs & matches...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-32 w-32 bg-white/10 blur-2xl rounded-full pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-5 w-5" />
              <p className="text-xs uppercase tracking-widest opacity-80">
                Smart Matching
              </p>
            </div>
            <h1 className="text-2xl font-extrabold">Matched Jobs & Students</h1>
            <p className="text-sm opacity-90 mt-1">
              AI-powered job-to-student matching based on field & ATS score
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors"
          >
           <Plus className="h-4 w-4" /> Add job Role
          </button>
        </div>
      </div>

      {/* JOB CARDS */}
      {jobs.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-xl border-slate-200 bg-white">
          <Briefcase className="h-10 w-10 text-slate-350 mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium">No job postings created yet.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-3 text-xs font-bold text-primary-DEFAULT hover:underline"
          >
            Post a job opportunity
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {jobs.map((job) => {
            const isActive = selectedJob?.id === job.id;

            return (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={cn(
                  'group cursor-pointer rounded-2xl p-4 border transition-all duration-300 backdrop-blur-lg',
                  isActive
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl scale-[1.02]'
                    : 'bg-white/70 border-[#DCE9FF] hover:shadow-lg hover:-translate-y-1'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <Briefcase className="h-5 w-5" />
                  <ArrowRight className="h-4 w-4 opacity-60 group-hover:translate-x-1 transition animate-pulse" />
                </div>

                <h3 className="font-bold text-sm truncate">{job.title}</h3>
                <p className={cn('text-xs mt-0.5 truncate', isActive ? 'text-white/90' : 'text-text-muted')}>{job.company} {job.location ? `• ${job.location}` : ''}</p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {job.requiredSkills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className={cn(
                        'text-[9px] px-1.5 py-0.5 rounded font-bold',
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                      )}
                    >
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills.length > 3 && (
                    <span className={cn('text-[9px] px-1.5 py-0.5 rounded font-bold', isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700')}>
                      +{job.requiredSkills.length - 3}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SELECTED JOB STATS */}
      {selectedJob && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* JOB INFO */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <p className="text-xs text-[#647A9A] font-bold mb-1">Selected Job</p>
              <h2 className="text-xl font-extrabold text-[#10233F]">{selectedJob.title}</h2>
              <p className="text-sm text-[#45607F]">{selectedJob.company} {selectedJob.location ? `• ${selectedJob.location}` : ''}</p>
              <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                {selectedJob.description}
              </p>
            </div>

            {/* STUDENT COUNT */}
            <div className="rounded-2xl bg-gradient-to-r from-[#EAF3FF] to-[#F5FAFF] p-5 border shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#647A9A]">Matched Students</p>
                <p className="text-2xl font-extrabold text-[#10233F]">{matchedStudents.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          {/* STUDENT LIST */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#10233F]">Student Matches</h3>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>

              <Button
                size="sm"
                onClick={handleNotifyStudents}
                loading={notifying}
                disabled={notifying || matchedStudents.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs h-9"
              >
                <Bell className="h-3.5 w-3.5" />
                Notify Students
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {matchedStudents.map((student) => {
                const score = student.matchDetails.overallScore;
                const matchBadgeColor =
                  score >= 75
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : score >= 50
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200';

                return (
                  <div
                    key={student.id}
                    className="rounded-xl border border-[#E6EEFF] p-4 hover:shadow-md hover:-translate-y-1 transition bg-[#FAFCFF] flex flex-col justify-between animate-in fade-in-50 duration-300"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-[#10233F]">{student.name}</p>
                        <span className={cn("text-xs px-2 py-0.5 rounded-full border font-extrabold", matchBadgeColor)}>
                          {score}% Match
                        </span>
                      </div>

                      <p className="text-xs text-[#647A9A] mb-3">
                        {student.branch} • {student.year}
                      </p>

                      {/* MATCH STATS */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] mb-3 p-2 bg-white rounded-lg border border-[#EBF2FF]">
                        <div>
                          <span className="text-[#647A9A] font-semibold block">ATS Score</span>
                          <span className="text-[#10233F] font-bold">{student.atsScore} / 100</span>
                        </div>
                        <div>
                          <span className="text-[#647A9A] font-semibold block">Branch Aligned</span>
                          <span className="text-[#10233F] font-bold">{student.matchDetails.branchMatch ? 'Yes' : 'No'}</span>
                        </div>
                      </div>

                      {/* SKILL CHIPS */}
                      {selectedJob.requiredSkills.length > 0 && (
                        <div className="space-y-1.5 mb-4">
                          {student.matchDetails.matchedSkills.length > 0 && (
                            <div className="flex flex-wrap gap-1 items-center">
                              <span className="text-[10px] text-emerald-600 font-bold mr-1">Matched:</span>
                              {student.matchDetails.matchedSkills.map(skill => (
                                <span key={skill} className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                          {student.matchDetails.missingSkills.length > 0 && (
                            <div className="flex flex-wrap gap-1 items-center">
                              <span className="text-[10px] text-slate-500 font-bold mr-1">Missing:</span>
                              {student.matchDetails.missingSkills.map(skill => (
                                <span key={skill} className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium border border-slate-200">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="h-1.5 w-full bg-[#E6EEFF] rounded-full overflow-hidden mt-auto">
                      <div
                        className={cn(
                          "h-full transition-all duration-500",
                          score >= 75
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                            : score >= 50
                            ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                            : "bg-gradient-to-r from-amber-500 to-orange-400"
                        )}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {matchedStudents.length === 0 && (
              <p className="text-center text-sm text-[#647A9A] py-6">
                No students matched for this role. Let's ask them to add matching skills or run ATS audits.
              </p>
            )}
          </div>
        </>
      )}

      {/* Add Job Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Job Requirement">
        <form onSubmit={handleCreateJob} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Job Role Title</label>
            <Input
              type="text"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. SDE Intern"
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</label>
            <Input
              type="text"
              required
              value={jobCompany}
              onChange={(e) => setJobCompany(e.target.value)}
              placeholder="e.g. Razorpay"
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Job Location (Optional)</label>
            <Input
              type="text"
              value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)}
              placeholder="e.g. Bangalore, India (Or leave empty to auto-extract with AI)"
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Job Description</label>
            <Textarea
              required
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Describe the job roles, responsibilities, and target branches..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Required Skills (Comma separated)</label>
            <Input
              type="text"
              value={jobSkills}
              onChange={(e) => setJobSkills(e.target.value)}
              placeholder="e.g. React, TypeScript, Node.js, SQL"
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={formLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors">
              Create Job Role
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ATSScoreOverview } from '@/components/ats/ATSScoreOverview';
import { FormattingCard } from '@/components/ats/FormattingCard';
import { KeywordMatchCard } from '@/components/ats/KeywordMatchCard';
import { SectionCompletenessCard } from '@/components/ats/SectionCompletenessCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { useATSAnalysis } from '@/hooks/useATSAnalysis';
import { useATSStore } from '@/store/atsStore';
import { useResumeStore } from '@/store/resumeStore';
import { useAIAction } from '@/hooks/useAIAction';
import { useUIStore } from '@/store/uiStore';
import { useResumeSync } from '@/hooks/useResumeSync';
import { Sparkles, ArrowRight, Loader2, Briefcase, History, ChevronDown, Check, CloudUpload } from 'lucide-react';

export default function ATSPage() {
  const router = useRouter();
  const { resumeId } = useParams<{ resumeId: string }>();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  useResumeSync(resumeId);
  const { result, isAnalyzing, analyze } = useATSAnalysis();
  const [jobDescription, setJobDescription] = useState('');
  const resume = useResumeStore((s) => s.resume);
  const setResume = useResumeStore((s) => s.setResume);
  const setATSResult = useATSStore((s) => s.setResult);
  const setATSJobDescription = useATSStore((s) => s.setJobDescription);
  const resetATS = useATSStore((s) => s.reset);
  const activeResumeId = useATSStore((s) => s.activeResumeId);
  const setActiveResumeId = useATSStore((s) => s.setActiveResumeId);
  const { trigger: triggerAI } = useAIAction();
  const showToast = useUIStore((s) => s.showToast);
  const [fixingIndex, setFixingIndex] = useState<number | null>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  // Resume File Upload inside ATS check state & handlers
  const atsFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const handleUploadResumeClick = () => {
    atsFileInputRef.current?.click();
  };

  const handleUploadResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);
    showToast('Uploading and parsing resume...', 'info');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const parseRes = await fetch('/api/resume/parse', {
        method: 'POST',
        body: formData,
      });

      if (!parseRes.ok) {
        const errorData = await parseRes.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to parse resume');
      }

      const { sections } = await parseRes.json();

      const updateRes = await fetch(`/api/resume/${resumeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections,
        }),
      });

      if (!updateRes.ok) throw new Error('Failed to update resume details');
      const { resume: updatedResume } = await updateRes.json();

      const parsedSections = updatedResume.sections || {};
      setResume({
        id: updatedResume.id,
        title: updatedResume.title,
        personal: parsedSections.personal ?? { fullName: '', email: '', phone: '', location: '', socials: {} },
        summary: parsedSections.summary ?? '',
        experience: parsedSections.experience ?? [],
        education: parsedSections.education ?? [],
        skills: parsedSections.skills ?? [],
        projects: parsedSections.projects ?? [],
        certifications: parsedSections.certifications ?? [],
        completionScore: updatedResume.completionScore,
        status: updatedResume.status,
      });

      showToast('Resume uploaded and updated successfully!', 'success');

      if (jobDescription.trim()) {
        await analyze(jobDescription);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to upload resume.', 'error');
    } finally {
      setIsUploadingResume(false);
      if (atsFileInputRef.current) atsFileInputRef.current.value = '';
    }
  };

  // Job description tracker & picker state
  const [officialJobs, setOfficialJobs] = useState<any[]>([]);
  const [publicJobs, setPublicJobs] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const history = useATSStore((s) => s.history);
  const activeTitle = useATSStore((s) => s.activeTitle);
  const addHistory = useATSStore((s) => s.addHistory);
  const clearHistory = useATSStore((s) => s.clearHistory);

  // Reset previous state if we are loading a different resume ID or another student session
  useEffect(() => {
    if (resumeId && activeResumeId !== resumeId) {
      resetATS();
      setActiveResumeId(resumeId);
    }
  }, [resumeId, activeResumeId, resetATS, setActiveResumeId]);

  // Reset previous state if we are loading a specific job ID
  useEffect(() => {
    if (jobId) {
      resetATS();
    }
  }, [jobId, resetATS]);

  useEffect(() => {
    if (!resumeId) return;
    fetch(`/api/resume/${resumeId}`)
      .then((r) => r.json())
      .then(({ resume }) => {
        if (resume) {
          const sections = (resume.sections as any) || {};
          setResume({
            id: resume.id,
            title: resume.title,
            personal: (sections.personal as any) ?? { fullName: '', email: '', phone: '', location: '', socials: {} },
            summary: sections.summary ?? '',
            experience: (sections.experience as any[]) ?? [],
            education: (sections.education as any[]) ?? [],
            skills: (sections.skills as any[]) ?? [],
            projects: (sections.projects as any[]) ?? [],
            certifications: (sections.certifications as any[]) ?? [],
            completionScore: resume.completionScore,
            status: resume.status,
          });
          
          // Bypasses cache if we are loading a specific job
          const lastAnalysis = (resume as any).atsAnalyses?.[0];
          if (lastAnalysis && !jobId) {
            setATSResult(lastAnalysis);
            setATSJobDescription(lastAnalysis.jobDescription || '');
            setJobDescription(lastAnalysis.jobDescription || '');
            if (lastAnalysis.jobDescription) {
              addHistory(lastAnalysis.jobDescription);
            }
          }
        }
      });
  }, [resumeId, jobId, setResume, setATSResult, setATSJobDescription, addHistory]);

  const triggerAudit = searchParams.get('triggerAudit') === 'true';

  // Load target jobId details if present
  useEffect(() => {
    if (!jobId || hasTriggered) return;
    
    setHasTriggered(true); // Prevent concurrent/looping fetch requests
    
    fetch(`/api/jobs/detail?id=${jobId}`)
      .then((r) => r.json())
      .then(({ job }) => {
        if (job) {
          setJobDescription(job.description);
          setATSJobDescription(job.description);
          useATSStore.getState().setActiveTitle(`${job.title} @ ${job.company}`);
          addHistory(job.description);
          showToast(`Prefilled details for ${job.title}`, 'success');

          if (triggerAudit) {
            analyze(job.description);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load job details in ATS audit:', err);
        setHasTriggered(false); // Reset on failure to allow retry
      });
  }, [jobId, triggerAudit, hasTriggered, setATSJobDescription, addHistory, showToast, analyze]);


  const studentCourse = resume.education?.[0]?.field;

  useEffect(() => {
    const courseQuery = studentCourse ? studentCourse : '';

    fetch('/api/officer/jobs')
      .then((r) => r.json())
      .then((res) => {
        if (res.data) {
          if (courseQuery) {
            const term = courseQuery.toLowerCase();
            const filtered = res.data.filter((job: any) => 
              job.title.toLowerCase().includes(term) ||
              job.description.toLowerCase().includes(term) ||
              (job.requiredSkills || []).some((s: string) => s.toLowerCase().includes(term))
            );
            setOfficialJobs(filtered);
          } else {
            setOfficialJobs(res.data);
          }
        }
      })
      .catch(() => {});

    const queryParam = courseQuery ? `?query=${encodeURIComponent(courseQuery)}&limit=10` : '?limit=10';
    fetch(`/api/jobs/search${queryParam}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.jobs) setPublicJobs(res.jobs);
      })
      .catch(() => {});
  }, [studentCourse]);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = result?.suggestions ?? [];

  const handleRunAudit = async () => {
    if (!jobDescription.trim()) return;
    await analyze(jobDescription);
    addHistory(jobDescription);
  };

  const handleFixWithAI = async (suggestion: any, index: number) => {
    setFixingIndex(index);
    let actionType: 'enhance_bullet' | 'generate_summary' | 'suggest_skills' = 'enhance_bullet';

    if (suggestion.section === 'summary') {
      actionType = 'generate_summary';
    } else if (suggestion.section === 'skills') {
      actionType = 'suggest_skills';
    }

    const input = `Fix the following issue in my resume: "${suggestion.issue}". Recommendation: "${suggestion.fix}". Provide a professional and clean replacement.`;

    try {
      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          input,
          context: {
            name: resume?.personal?.fullName || '',
            role: resume?.experience?.[0]?.role || '',
            skills: (resume?.skills as any[] || []).map(s => typeof s === 'string' ? s : (s as any).skills?.join(', ') || '').join(', '),
            certifications: (resume?.certifications || []).map(c => c.name).join(', '),
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch from AI');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader found');

      const decoder = new TextDecoder();
      let done = false;
      let text = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          text += decoder.decode(value, { stream: !done });
        }
      }

      const resumeStore = useResumeStore.getState();
      const sectionLower = suggestion.section.toLowerCase();

      if (sectionLower.includes('summary')) {
        resumeStore.updateSummary(text);
        showToast('Summary updated successfully!', 'success');
      } else if (sectionLower.includes('skills')) {
        const skillsList = text.split(/,|\n/).map((s) => s.trim()).filter(Boolean);
        const currentSkills = resumeStore.resume.skills ?? [];
        const updated = Array.from(new Set([...currentSkills, ...skillsList]));
        resumeStore.updateSection('skills', updated);
        showToast(`Added ${skillsList.length} skills successfully!`, 'success');
      } else if (sectionLower.includes('project')) {
        let proj = resumeStore.resume.projects[0];
        if (!proj) {
          resumeStore.addProject();
          proj = useResumeStore.getState().resume.projects[0];
        }
        if (proj) {
          resumeStore.updateProject(proj.id, { description: text });
          showToast('Project description updated successfully!', 'success');
        } else {
          showToast('Could not find a project to update.', 'error');
        }
      } else if (sectionLower.includes('education') || sectionLower.includes('coursework')) {
        let edu = resumeStore.resume.education[0];
        if (!edu) {
          resumeStore.addEducation();
          edu = useResumeStore.getState().resume.education[0];
        }
        if (edu) {
          resumeStore.updateEducation(edu.id, { highlights: text });
          showToast('Education highlights updated successfully!', 'success');
        } else {
          showToast('Could not find an education entry to update.', 'error');
        }
      } else if (sectionLower.includes('cert')) {
        const certNames = text.split(/,|\n/).map((c) => c.replace(/^\d+\.\s*/, '').replace(/^[-*•]\s*/, '').trim()).filter(Boolean);
        const currentCerts = resumeStore.resume.certifications ?? [];
        const newCerts = certNames.map(name => ({
          id: crypto.randomUUID(),
          name,
          issuer: 'Suggested Organization',
          date: new Date().getFullYear().toString(),
        }));
        resumeStore.updateSection('certifications', [...currentCerts, ...newCerts]);
        showToast(`Added ${newCerts.length} suggested certifications successfully!`, 'success');
      } else {
        let exp = resumeStore.resume.experience[0];
        if (!exp) {
          resumeStore.addExperience();
          exp = useResumeStore.getState().resume.experience[0];
        }
        if (exp) {
          const nextBullets = [...exp.bullets];
          nextBullets[0] = text;
          resumeStore.updateExperience(exp.id, { bullets: nextBullets });
          showToast('Experience bullet updated successfully!', 'success');
        } else {
          showToast('Could not find experience entry to update.', 'error');
        }
      }

      // Remove this suggestion from the ATS suggestions list
      const atsStore = useATSStore.getState();
      if (atsStore.result) {
        const updatedSuggestions = atsStore.result.suggestions.filter((_, i) => i !== index);
        atsStore.setResult({
          ...atsStore.result,
          suggestions: updatedSuggestions,
        });
      }
    } catch (err) {
      console.error(err);
      showToast('AI Auto-Fix failed. Please try again.', 'error');
    } finally {
      setFixingIndex(null);
    }
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50 blur-2xl opacity-70" />

      {/* JOB DESCRIPTION INPUT CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card 
          className="p-5 border border-[#CFE0F7] bg-white/80 backdrop-blur-md rounded-2xl shadow-sm"
          header={<h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            ATS Audit against Job Description
          </h2>}
        >
          <div className="space-y-4">
            {/* Description Tracker & Selector */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-hidden">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="shrink-0">Active Job Description:</span>
                <span className="text-slate-800 font-semibold truncate max-w-[150px] sm:max-w-[300px]">
                  {activeTitle || 'None selected'}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative" ref={dropdownRef}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 h-8 border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 text-slate-700 shrink-0"
                >
                  <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                  Choose Description
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </Button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-1.5 w-72 max-h-96 overflow-y-auto rounded-xl bg-white shadow-xl border border-slate-100 py-1.5 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                    
                    {/* Section: Campus Placement Jobs */}
                    {officialJobs.length > 0 && (
                      <div className="border-b border-slate-100 pb-1.5 mb-1.5">
                        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Campus Placement Jobs
                        </div>
                        {officialJobs.map((job) => {
                          const isActive = jobDescription === job.description;
                          return (
                            <button
                              key={job.id}
                              onClick={() => {
                                setJobDescription(job.description);
                                addHistory(job.description);
                                useATSStore.getState().setActiveTitle(`${job.title} @ ${job.company}`);
                                setShowDropdown(false);
                                showToast(`Selected ${job.title}`, 'success');
                              }}
                              className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-start justify-between gap-1.5 hover:bg-slate-50 ${
                                isActive ? 'bg-blue-50/50 text-blue-700 font-medium' : 'text-slate-700'
                              }`}
                            >
                              <div className="truncate flex-1">
                                <p className="font-semibold truncate text-slate-800">{job.title}</p>
                                <p className="text-[10px] text-slate-400 truncate">
                                  {job.company} {job.location ? `• ${job.location}` : ''}
                                </p>
                              </div>
                              {isActive && <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Section: Public Search Jobs */}
                    {publicJobs.length > 0 && (
                      <div className="border-b border-slate-100 pb-1.5 mb-1.5 mt-1.5">
                        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Scraped Public Jobs
                        </div>
                        {publicJobs.map((job) => {
                          const isActive = jobDescription === job.description;
                          return (
                            <button
                              key={job.id}
                              onClick={() => {
                                setJobDescription(job.description);
                                addHistory(job.description);
                                useATSStore.getState().setActiveTitle(`${job.title} @ ${job.company}`);
                                setShowDropdown(false);
                                showToast(`Selected ${job.title}`, 'success');
                              }}
                              className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-start justify-between gap-1.5 hover:bg-slate-50 ${
                                isActive ? 'bg-blue-50/50 text-blue-700 font-medium' : 'text-slate-700'
                              }`}
                            >
                              <div className="truncate flex-1">
                                <p className="font-semibold truncate text-slate-800">{job.title}</p>
                                <p className="text-[10px] text-slate-400 truncate">
                                  {job.company} {job.location ? `• ${job.location}` : ''}
                                </p>
                              </div>
                              {isActive && <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Section: Pasted History */}
                    <div>
                      <div className="px-3 py-1 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Pasted History
                        </span>
                        {history.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearHistory();
                              showToast('History cleared', 'info');
                            }}
                            className="text-[10px] text-red-500 hover:underline font-semibold"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      {history.length === 0 ? (
                        <div className="px-3 py-4 text-xs text-slate-400 text-center italic">
                          No past descriptions saved.
                        </div>
                      ) : (
                        history.map((item) => {
                          const isActive = jobDescription.trim() === item.text.trim();
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setJobDescription(item.text);
                                useATSStore.getState().setActiveTitle(item.title);
                                setShowDropdown(false);
                                showToast(`Loaded "${item.title}"`, 'success');
                              }}
                              className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-start justify-between gap-1.5 hover:bg-slate-50 ${
                                isActive ? 'bg-blue-50/50 text-blue-700 font-medium' : 'text-slate-700'
                              }`}
                            >
                              <div className="truncate flex-1">
                                <p className="font-semibold truncate text-slate-800">{item.title}</p>
                                <p className="text-[10px] text-slate-400 truncate">{item.timestamp}</p>
                              </div>
                              {isActive && <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />}
                            </button>
                          );
                        })
                      )}
                    </div>

                  </div>
                )}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isUploadingResume}
                  onClick={handleUploadResumeClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 h-8 border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 text-slate-700 shrink-0"
                >
                  {isUploadingResume ? (
                    <Loader2 className="h-3.5 w-3.5 text-slate-500 animate-spin" />
                  ) : (
                    <CloudUpload className="h-3.5 w-3.5 text-slate-500" />
                  )}
                  {isUploadingResume ? 'Uploading...' : 'Upload Resume'}
                </Button>
                <input
                  type="file"
                  ref={atsFileInputRef}
                  onChange={handleUploadResumeChange}
                  accept=".pdf,.docx"
                  className="hidden"
                />
              </div>
            </div>

            <Textarea
              label="Paste Job Description / Requirements"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description from the hiring portal (e.g. skills required, roles and responsibilities) to calculate keyword matching and section score suitability..."
              rows={5}
            />
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleRunAudit}
                loading={isAnalyzing}
                disabled={!jobDescription.trim() || isAnalyzing}
                className="bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-xl"
              >
                Run Full ATS Audit
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {result ? (
        <>
          {/* Score Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ATSScoreOverview />
          </motion.div>

          {/* Cards Grid */}
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-lg p-4"
            >
              <KeywordMatchCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-lg p-4"
            >
              <SectionCompletenessCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-lg p-4"
            >
              <FormattingCard />
            </motion.div>
          </div>

          {/* Suggestions Section */}
          <motion.section
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-100 p-6 shadow-xl"
          >
            <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Action Plan</p>
                <h2 className="text-xl font-extrabold text-gray-800">Improvement Suggestions</h2>
              </div>
              <Badge variant="blue" className="text-sm px-3 py-1">
                {suggestions.length} fixes
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  className="group rounded-2xl border border-white/50 bg-white/70 backdrop-blur-lg p-5 shadow-md transition-all"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800 capitalize">{suggestion.section} Issue</h3>
                    <Badge variant={suggestion.priority === 'high' ? 'amber' : suggestion.priority === 'medium' ? 'blue' : 'gray'}>
                      {suggestion.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed font-bold mb-1">Issue: {suggestion.issue}</p>
                  <p className="text-xs text-gray-650 leading-relaxed mb-4">Fix: {suggestion.fix}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={fixingIndex !== null}
                      onClick={() => handleFixWithAI(suggestion, index)}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center justify-center gap-1 rounded-xl disabled:opacity-75"
                    >
                      {fixingIndex === index ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Fixing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" /> Auto-Fix
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => router.push(`/resume/${resumeId}/editor`)}
                      className="flex-1 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl"
                    >
                      Fix Now →
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </>
      ) : (
        <div className="text-center py-16 border border-dashed rounded-[20px] bg-white/40 border-slate-300">
          <Sparkles className="h-10 w-10 text-slate-400 mx-auto mb-3 animate-bounce" />
          <h3 className="text-base font-bold text-slate-700">Audit your Resume against Jobs</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1.5 leading-relaxed">
            Enter the job specifications in the card above and click audit to get an detailed ATS score match.
          </p>
        </div>
      )}
    </div>
  );
}
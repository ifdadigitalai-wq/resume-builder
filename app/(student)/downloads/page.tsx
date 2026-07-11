'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Trash2, 
  Clock, 
  ArrowRight, 
  Loader2, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ResumePreview } from '@/components/editor/ResumePreview';

interface ResumeListItem {
  id: string;
  title: string;
  status: string;
  completionScore: number;
  atsScore?: number | null;
  updatedAt: string;
}

interface QueueItem {
  id: string;
  title: string;
  progress: number;
  status: 'Pending' | 'Generating' | 'Ready' | 'Failed';
}

export default function DownloadsPage() {
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadQueue, setDownloadQueue] = useState<QueueItem[]>([]);

  // Fetch student's resumes
  const fetchResumes = async () => {
    try {
      const res = await fetch('/api/resume');
      if (res.ok) {
        const data = await res.json();
        setResumes(data.resumes || []);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const [downloadResumeData, setDownloadResumeData] = useState<any | null>(null);
  const [activeQueueId, setActiveQueueId] = useState<string | null>(null);

  useEffect(() => {
    if (downloadResumeData && activeQueueId) {
      const timer = setTimeout(async () => {
        const queueId = activeQueueId;
        try {
          const html2pdf = (await import('html2pdf.js')).default;
          const element = document.getElementById('resume-preview-content');
          if (!element) throw new Error('Preview not found');

          const clonedElement = element.cloneNode(true) as HTMLElement;
          clonedElement.style.transform = 'none';
          clonedElement.style.position = 'relative';
          clonedElement.style.left = '0';
          clonedElement.style.top = '0';

          const worker = document.createElement('div');
          worker.style.position = 'absolute';
          worker.style.left = '-9999px';
          worker.style.top = '-9999px';
          worker.appendChild(clonedElement);
          document.body.appendChild(worker);

          const safeTitle = downloadResumeData.title ? downloadResumeData.title.replace(/\s+/g, '_') : 'export';
          const fileName = `${safeTitle}_Resume.pdf`;

          setDownloadQueue(prev => prev.map(item => item.id === queueId ? { ...item, progress: 70 } : item));

          await html2pdf().set({
            margin: 0,
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          })
          .from(clonedElement)
          .toPdf()
          .get('pdf')
          .then((pdf: any) => {
            const sectionsData = {
              personal: downloadResumeData.personal || {},
              summary: downloadResumeData.summary || '',
              experience: downloadResumeData.experience || [],
              education: downloadResumeData.education || [],
              skills: downloadResumeData.skills || [],
              projects: downloadResumeData.projects || [],
              certifications: downloadResumeData.certifications || [],
            };
            pdf.setProperties({
              title: downloadResumeData.title || 'Resume',
              subject: JSON.stringify(sectionsData),
              keywords: 'resume-builder-data-v1',
              creator: 'AI Resume Builder'
            });
            pdf.save(fileName);
          });

          document.body.removeChild(worker);

          // Log download event
          await fetch(`/api/resume/${downloadResumeData.id}/download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName }),
          });

          setDownloadQueue(prev => prev.map(item => item.id === queueId ? { ...item, progress: 100, status: 'Ready' } : item));
        } catch (err) {
          console.error(err);
          setDownloadQueue(prev => prev.map(item => item.id === queueId ? { ...item, status: 'Failed' } : item));
        } finally {
          setDownloadResumeData(null);
          setActiveQueueId(null);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [downloadResumeData, activeQueueId]);

  const handleDownloadTrigger = async (id: string, title: string) => {
    // 1. Add to the local download queue
    const queueId = `${id}-${Date.now()}`;
    const newQueueItem: QueueItem = {
      id: queueId,
      title,
      progress: 10,
      status: 'Pending'
    };
    setDownloadQueue(prev => [newQueueItem, ...prev]);

    try {
      // Fetch full resume details
      const res = await fetch(`/api/resume/${id}`);
      if (!res.ok) throw new Error();
      const { resume } = await res.json();

      const sections = resume.sections || {};
      const parsedResume = {
        ...resume,
        personal: sections.personal || {},
        summary: sections.summary || '',
        experience: sections.experience || [],
        education: sections.education || [],
        skills: sections.skills || [],
        projects: sections.projects || [],
        certifications: sections.certifications || [],
      };

      setDownloadQueue(prev => prev.map(item => item.id === queueId ? { ...item, progress: 40, status: 'Generating' } : item));
      setActiveQueueId(queueId);
      setDownloadResumeData(parsedResume);
    } catch {
      setDownloadQueue(prev => prev.map(item => item.id === queueId ? { ...item, status: 'Failed' } : item));
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      const res = await fetch(`/api/resume/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setResumes(prev => prev.filter(r => r.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary-DEFAULT" />
        <p className="text-sm font-semibold text-slate-500">Loading downloads...</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 blur-3xl opacity-70" />

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Downloads & Export Hub</h1>
        <p className="text-slate-500 mt-2">Manage your resume documents, audit scores, and download history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Resumes List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Structural Resume Benchmarks
            </h2>

            {resumes.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-xl border-slate-200">
                <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500 font-medium">No resumes found</p>
                <Link href="/resume/create" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary-DEFAULT hover:underline">
                  Create your first resume <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {resumes.map((resume) => (
                  <div 
                    key={resume.id} 
                    className="group border border-slate-150 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all bg-white"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-primary-DEFAULT transition-colors">
                            {resume.title}
                          </h3>
                          <Badge variant={resume.status === 'COMPLETE' ? 'green' : 'gray'}>
                            {resume.status}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Last modified {new Date(resume.updatedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadTrigger(resume.id, resume.title)}
                          className="flex items-center gap-1 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
                        >
                          <Download className="h-3.5 w-3.5" /> PDF
                        </button>
                        <Link
                          href={`/resume/${resume.id}/editor`}
                          className="flex items-center gap-1 px-3.5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteResume(resume.id)}
                          className="p-2 border border-slate-200 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-bold text-slate-500">Completion Score</span>
                          <span className="font-extrabold text-slate-800">{resume.completionScore}%</span>
                        </div>
                        <ProgressBar value={resume.completionScore} color={resume.completionScore >= 80 ? 'green' : 'blue'} size="sm" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-bold text-slate-500">ATS Match Score</span>
                          <span className="font-extrabold text-slate-800">{resume.atsScore !== null && resume.atsScore !== undefined ? `${resume.atsScore}%` : 'Not Audited'}</span>
                        </div>
                        {resume.atsScore !== null && resume.atsScore !== undefined ? (
                          <ProgressBar value={resume.atsScore} color={resume.atsScore >= 80 ? 'green' : resume.atsScore >= 50 ? 'amber' : 'red'} size="sm" />
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                            <AlertTriangle className="h-3.5 w-3.5 text-slate-350" />
                            <Link href={`/resume/${resume.id}/ats`} className="text-[10px] font-bold text-blue-500 hover:underline">
                              Run ATS Audit
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Download Queue */}
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Download Queue
            </h2>
            <p className="text-xs text-slate-400 mb-6">Track your live document exports in real time.</p>

            <div className="space-y-4">
              <AnimatePresence>
                {downloadQueue.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-slate-400 text-xs italic"
                  >
                    Queue is empty. Click PDF on any resume to export.
                  </motion.div>
                ) : (
                  downloadQueue.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="border border-slate-100 rounded-xl p-3 bg-slate-50/50 space-y-2"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700 truncate max-w-[150px]">{item.title}</span>
                        {item.status === 'Ready' && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Ready
                          </span>
                        )}
                        {item.status === 'Pending' && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                            Pending
                          </span>
                        )}
                        {item.status === 'Generating' && (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1">
                            <Loader2 className="h-3 w-3 animate-spin" /> Rendering...
                          </span>
                        )}
                        {item.status === 'Failed' && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                            Failed
                          </span>
                        )}
                      </div>
                      <ProgressBar 
                        value={item.progress} 
                        color={item.status === 'Ready' ? 'green' : item.status === 'Failed' ? 'red' : 'blue'} 
                        size="sm" 
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick FAQ / Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-blue-800 uppercase tracking-widest flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" /> FAQ Checklist
            </h3>
            <div className="space-y-2 text-xs text-blue-900/80 leading-relaxed font-medium">
              <p>📌 <strong>Where are downloads saved?</strong> Resumes download directly into your device's Downloads directory as a print-optimized PDF.</p>
              <p>📌 <strong>Is formatting preserved?</strong> Yes, the export matches your live selected style theme, fonts, margins, and spacing benchmarks exactly.</p>
            </div>
          </div>
        </div>
      </div>
      {downloadResumeData && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '794px' }}>
          <ResumePreview resumeData={downloadResumeData} />
        </div>
      )}
    </div>
  );
}
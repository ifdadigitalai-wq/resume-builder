'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { ArrowRight, CloudUpload, Sparkles, FilePlus, Download, Target, FolderOpen, Trash2, X } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { cleanBullet } from '@/lib/resumeUtils';
import { ResumePreview } from '@/components/editor/ResumePreview';

export function PrimaryActions() {
  const router = useRouter();
  const { showToast } = useUIStore();
  const [latestId, setLatestId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Uploaded Resumes state & handlers
  const [resumes, setResumes] = useState<any[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchResumesList = async () => {
    setIsLoadingResumes(true);
    try {
      const res = await fetch('/api/resume');
      const data = await res.json();
      if (data?.resumes) {
        setResumes(data.resumes);
      }
    } catch {
      showToast('Failed to fetch resumes.', 'error');
    } finally {
      setIsLoadingResumes(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/resume/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('Resume deleted successfully!', 'success');
        setResumes((prev) => prev.filter((r: any) => r.id !== id));
        if (latestId === id) {
          setLatestId(null);
        }
        // Reload dashboard stats and state after deletion
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        showToast('Failed to delete resume.', 'error');
      }
    } catch {
      showToast('Failed to delete resume.', 'error');
    }
  };

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if (data && data.latestResumeId) {
          setLatestId(data.latestResumeId);
        }
      });
  }, []);

  const [downloadResumeData, setDownloadResumeData] = useState<any | null>(null);

  useEffect(() => {
    if (downloadResumeData) {
      const timer = setTimeout(async () => {
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

          const fileName = `resume-${downloadResumeData.title || 'export'}-${Date.now()}.pdf`;
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

          showToast('PDF downloaded successfully!', 'success');
        } catch (err) {
          console.error(err);
          showToast('Download failed', 'error');
        } finally {
          setDownloadResumeData(null);
          setIsDownloading(false);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [downloadResumeData]);

  const handleDownload = async () => {
    if (!latestId) {
      showToast('No resumes found to download.', 'error');
      return;
    }
    setIsDownloading(true);
    try {
      const res = await fetch(`/api/resume/${latestId}`);
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

      setDownloadResumeData(parsedResume);
    } catch {
      showToast('Failed to download resume. Please try from editor.', 'error');
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Create Resume */}
        <button
          onClick={() => router.push('/resume/create')}
          className="text-left group relative isolate flex min-h-[124px] items-center justify-between overflow-hidden rounded-[12px] bg-gradient-to-br from-blue-600 to-indigo-650 p-5 text-white shadow-md transition-all duration-200 hover:-translate-y-1 active:scale-[0.98]"
        >
          <div>
            <h4 className="text-base font-bold">Create New Resume</h4>
            <p className="mt-1 max-w-[180px] text-xs leading-relaxed text-blue-100">Start with a guided template</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-transform group-hover:translate-x-1">
            <FilePlus className="h-5 w-5" />
          </span>
        </button>

        {/* Upload Resume */}
        <button
          onClick={() => router.push('/resume/upload')}
          className="text-left group relative isolate flex min-h-[124px] items-center justify-between overflow-hidden rounded-[12px] border border-[#BFD7FF] bg-[#EAF3FF] p-5 text-[#10233F] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-[#DDEBFF] active:scale-[0.98]"
        >
          <div>
            <h4 className="text-base font-extrabold">Upload Resume</h4>
            <p className="mt-1 max-w-[180px] text-xs leading-relaxed text-[#45607F]">Extract details from existing files</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-DEFAULT text-white shadow-md">
            <CloudUpload className="h-5 w-5" />
          </span>
        </button>

        {/* ATS Check */}
        <button
          onClick={() => {
            if (latestId) {
              router.push(`/resume/${latestId}/ats`);
            } else {
              showToast('Please create a resume first.', 'info');
            }
          }}
          className="text-left group relative isolate flex min-h-[124px] items-center justify-between overflow-hidden rounded-[12px] border border-cyan-200 bg-[#E7FBFF] p-5 text-[#083344] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-[#D9F7FF] active:scale-[0.98]"
        >
          <div>
            <h4 className="text-base font-extrabold text-[#06758A]">Run ATS Check</h4>
            <p className="mt-1 max-w-[180px] text-xs leading-relaxed text-[#3E6E78]">Audit score and keyword density</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#06B6D4] text-white">
            <Target className="h-5 w-5" />
          </span>
        </button>

        {/* Download Resume */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="text-left group relative isolate flex min-h-[124px] items-center justify-between overflow-hidden rounded-[12px] border border-emerald-250 bg-[#EAFBF3] p-5 text-[#064E3B] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-[#DDFBEB] active:scale-[0.98] disabled:opacity-50"
        >
          <div>
            <h4 className="text-base font-extrabold text-[#047857]">Download Resume</h4>
            <p className="mt-1 max-w-[180px] text-xs leading-relaxed text-[#047857] opacity-80">
              {isDownloading ? 'Exporting PDF...' : 'Download latest PDF'}
            </p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10B981] text-white">
            <Download className="h-5 w-5" />
          </span>
        </button>

        {/* Uploaded Resumes */}
        <button
          onClick={() => {
            fetchResumesList();
            setIsModalOpen(true);
          }}
          className="text-left group relative isolate flex min-h-[124px] items-center justify-between overflow-hidden rounded-[12px] border border-indigo-200 bg-[#F0F2FF] p-5 text-[#1E1B4B] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-[#E0E4FF] active:scale-[0.98]"
        >
          <div>
            <h4 className="text-base font-extrabold text-[#4F46E5]">Uploaded Resumes</h4>
            <p className="mt-1 max-w-[180px] text-xs leading-relaxed text-[#4F46E5] opacity-80">
              Manage and delete your resumes
            </p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6366F1] text-white">
            <FolderOpen className="h-5 w-5" />
          </span>
        </button>
      </div>

      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-indigo-600" />
                My Uploaded Resumes
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5 max-h-[300px] overflow-y-auto space-y-3">
              {isLoadingResumes ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
                </div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm italic">
                  No resumes found. Create or upload one to get started!
                </div>
              ) : (
                resumes.map((resume: any) => (
                  <div 
                    key={resume.id} 
                    className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:border-indigo-100 hover:bg-indigo-50/10 transition-all"
                  >
                    <div className="overflow-hidden mr-4">
                      <p className="font-bold text-slate-800 text-sm truncate">{resume.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                        <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">Score: {resume.completionScore}%</span>
                        {resume.atsScore && (
                          <span className="bg-cyan-50 text-cyan-700 px-1.5 py-0.5 rounded">ATS: {resume.atsScore}</span>
                        )}
                        <span>•</span>
                        <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(resume.id, resume.title)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shrink-0"
                      title="Delete Resume"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      {downloadResumeData && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '794px' }}>
          <ResumePreview resumeData={downloadResumeData} />
        </div>
      )}
    </>
  );
}

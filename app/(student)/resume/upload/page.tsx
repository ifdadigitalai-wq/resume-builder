'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CloudUpload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

export default function UploadResumePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<'upload' | 'processing'>('upload');
  const [fileName, setFileName] = useState('');

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setPhase('processing');

    try {
      // 1. Upload and Parse PDF/DOCX
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

      // 2. POST to /api/resume to create a new resume with parsed sections
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: file.name.replace(/\.[^/.]+$/, "") || 'My Resume',
          sections,
        }),
      });

      if (!res.ok) throw new Error('Create resume failed');
      const { resume } = await res.json();

      // 3. Redirect to the editor
      router.push(`/resume/${resume.id}/editor`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to upload/create resume. Please try again.');
      setPhase('upload');
    }
  };

  if (phase === 'processing') {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-primary-DEFAULT border-t-transparent" />
          <h2 className="text-lg font-bold text-text-primary">Parsing your resume...</h2>
          <p className="mt-1 text-sm text-text-muted">{fileName}</p>
          <ProgressBar value={78} color="blue" className="mt-5 animate-pulse-bar" />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-[12px] border-2 border-dashed border-border bg-white p-8 text-center shadow-card transition-colors hover:border-primary-DEFAULT hover:bg-blue-50/40">
        <CloudUpload className="mx-auto h-12 w-12 text-primary-DEFAULT" />
        <h2 className="mt-4 text-xl font-bold text-text-primary">Upload your resume</h2>
        <p className="mt-2 text-sm text-text-muted font-medium">Select a text-based PDF or DOCX file to extract info & start editing.</p>
        <p className="mt-1.5 text-xs text-text-muted/80 italic max-w-md mx-auto">Note: Scanned or image-only PDFs are not supported. If importing a resume generated on this platform, please download it from the dashboard for a text-based PDF.</p>
        <div className="mt-4 flex justify-center gap-2"><Badge>PDF</Badge><Badge variant="gray">DOCX</Badge></div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx"
          className="hidden"
        />

        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md mt-6 transition-colors" onClick={handleBrowseClick}>Browse File</Button>
      </div>
    </div>
  );
}

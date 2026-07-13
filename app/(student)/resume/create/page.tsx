'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { WizardShell } from '@/components/wizard/WizardShell';
import { useUIStore } from '@/store/uiStore';
import { Sparkles, ArrowRight } from 'lucide-react';

const titles = ['Personal Details', 'Education', 'Skills', 'Projects', 'Experience', 'Certifications', 'Generate'];

// Empty form state — no static sample data
const emptyPersonal = { fullName: '', email: '', phone: '', linkedIn: '', github: '', location: '', targetRole: '' };
const emptyEducation = [{ id: 'edu-new-1', institution: '', degree: '', field: '', cgpa: '' }];
const emptyProject = [{ id: 'proj-new-1', name: '', description: '', link: '' }];
const emptyExperience = { company: '', role: '', duration: '', bullets: '' };
const emptyCert = { name: '', issuer: '', date: '', credentialUrl: '' };

export default function CreateResumePage() {
  const router = useRouter();
  const { showToast } = useUIStore();
  const [step, setStep] = useState(1);
  const [touched, setTouched] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [personal, setPersonal] = useState(emptyPersonal);
  const [education, setEducation] = useState(emptyEducation);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = () => {
    const val = skillInput.trim();
    if (!val) return;
    const newSkills = val.split(',').map(s => s.trim()).filter(Boolean);
    setSkills(current => Array.from(new Set([...current, ...newSkills])));
    setSkillInput('');
  };
  const [projects, setProjects] = useState(emptyProject);
  const [experience, setExperience] = useState(emptyExperience);
  const [cert, setCert] = useState(emptyCert);

  const missingName = touched && step === 1 && !personal.fullName;

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${personal.fullName || 'My'}_Resume`,
          sections: {
            personal: {
              fullName: personal.fullName,
              email: personal.email,
              phone: personal.phone,
              location: personal.location,
              socials: {
                linkedIn: personal.linkedIn,
                github: personal.github,
              },
            },
            summary: '',
            education: education.filter(e => e.institution).map(e => ({
              id: e.id,
              institution: e.institution,
              degree: e.degree,
              field: e.field,
              startDate: '',
              endDate: '',
              cgpa: e.cgpa,
            })),
            skills,
            projects: projects.filter(p => p.name).map(p => ({
              id: p.id,
              name: p.name,
              description: p.description,
              techStack: [],
              link: p.link,
            })),
            experience: experience.company ? [{
              id: 'exp-new-1',
              company: experience.company,
              role: experience.role,
              startDate: experience.duration.split('-')[0]?.trim() || '',
              endDate: experience.duration.split('-')[1]?.trim() || '',
              current: false,
              bullets: experience.bullets.split('\n').filter(Boolean),
            }] : [],
            certifications: cert.name ? [{
              id: 'cert-new-1',
              name: cert.name,
              issuer: cert.issuer,
              date: cert.date,
              credentialUrl: cert.credentialUrl,
            }] : [],
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to create resume');
      const { resume } = await res.json();
      showToast('Resume created successfully!', 'success');
      router.push(`/resume/${resume.id}/editor`);
    } catch {
      showToast('Failed to create resume', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const content = useMemo(() => {
    if (step === 1) {
      return (
        <div className="grid gap-4 sm:grid-cols-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="sm:col-span-2 relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4.5 shadow-sm mb-2">
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 shadow-md shadow-blue-500/20">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-[#10233F] flex items-center gap-1.5">
                  Introducing Specialty Themes!
                </h4>
                <p className="text-xs text-[#45607F] leading-relaxed">
                  Looking for profession-specific templates? Create a theme-aware resume with specialized skills progress bars, tool badges, and custom timelines for 14 different course fields (Accounting, SAP, AI, Data Analytics, etc.).
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/resume/multi-course')}
                  className="mt-2.5 inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-700 transition"
                >
                  Launch Specialty Builder <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
          <Input label="Full Name" value={personal.fullName} onChange={(e) => setPersonal(p => ({ ...p, fullName: e.target.value }))} error={missingName ? 'Full name is required' : undefined} placeholder="e.g. Arjun Sharma" />
          <Input label="Email" value={personal.email} onChange={(e) => setPersonal(p => ({ ...p, email: e.target.value }))} placeholder="e.g. arjun@college.edu" />
          <Input label="Phone" value={personal.phone} onChange={(e) => setPersonal(p => ({ ...p, phone: e.target.value }))} placeholder="e.g. +91 98765 43210" />
          <Input label="LinkedIn" value={personal.linkedIn} onChange={(e) => setPersonal(p => ({ ...p, linkedIn: e.target.value }))} placeholder="e.g. linkedin.com/in/arjun" />
          <Input label="GitHub" value={personal.github} onChange={(e) => setPersonal(p => ({ ...p, github: e.target.value }))} placeholder="e.g. github.com/arjun" />
          <Input label="City" value={personal.location} onChange={(e) => setPersonal(p => ({ ...p, location: e.target.value }))} placeholder="e.g. New Delhi" />
          <Input className="sm:col-span-2" label="Target Role" value={personal.targetRole} onChange={(e) => setPersonal(p => ({ ...p, targetRole: e.target.value }))} placeholder="e.g. Software Engineer" />
        </div>
      );
    }
    if (step === 2) {
      return (
        <div className="space-y-4">
          {education.map((edu, idx) => (
            <div key={edu.id} className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-2">
              <Input label="Institution" value={edu.institution} onChange={(e) => { const next = [...education]; next[idx] = { ...next[idx], institution: e.target.value }; setEducation(next); }} placeholder="e.g. IIT Delhi" />
              <Input label="Degree" value={edu.degree} onChange={(e) => { const next = [...education]; next[idx] = { ...next[idx], degree: e.target.value }; setEducation(next); }} placeholder="e.g. B.Tech" />
              <Input label="Branch" value={edu.field} onChange={(e) => { const next = [...education]; next[idx] = { ...next[idx], field: e.target.value }; setEducation(next); }} placeholder="e.g. CSE" />
              <Input label="Score" value={edu.cgpa} onChange={(e) => { const next = [...education]; next[idx] = { ...next[idx], cgpa: e.target.value }; setEducation(next); }} placeholder="e.g. 8.4" />
            </div>
          ))}
          <button onClick={() => setEducation(prev => [...prev, { id: `edu-new-${prev.length + 1}`, institution: '', degree: '', field: '', cgpa: '' }])} className="text-xs font-semibold text-primary-DEFAULT hover:underline">+ Add another</button>
        </div>
      );
    }
    if (step === 3) {
      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="blue" className="flex items-center gap-1.5 py-1">
                {skill}
                <button
                  type="button"
                  onClick={() => setSkills(skills.filter(s => s !== skill))}
                  className="hover:text-red-500 font-bold ml-1 transition-colors text-xs"
                >
                  ×
                </button>
              </Badge>
            ))}
            {skills.length === 0 && <p className="text-xs text-text-muted italic">No skills added yet. Type your skills below.</p>}
          </div>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="Type a skill (e.g. React) and press Enter or comma..."
              className="flex-1 text-xs px-3 py-2 border border-border rounded-[8px] focus:outline-none focus:border-primary-DEFAULT bg-white text-slate-800"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddSkill}
            >
              Add
            </Button>
          </div>
        </div>
      );
    }
    if (step === 4) {
      return (
        <div className="space-y-4">
          {projects.map((project, idx) => (
            <div key={project.id} className="rounded-lg border border-border p-3">
              <Input label="Project name" value={project.name} onChange={(e) => { const next = [...projects]; next[idx] = { ...next[idx], name: e.target.value }; setProjects(next); }} placeholder="e.g. StudySync — AI Planner" />
              <Textarea className="mt-3" label="Description" value={project.description} onChange={(e) => { const next = [...projects]; next[idx] = { ...next[idx], description: e.target.value }; setProjects(next); }} placeholder="Describe what you built..." />
              <Input className="mt-3" label="Project link" value={project.link} onChange={(e) => { const next = [...projects]; next[idx] = { ...next[idx], link: e.target.value }; setProjects(next); }} placeholder="e.g. https://github.com/..." />
            </div>
          ))}
          <button onClick={() => setProjects(prev => [...prev, { id: `proj-new-${prev.length + 1}`, name: '', description: '', link: '' }])} className="text-xs font-semibold text-primary-DEFAULT hover:underline">+ Add another project</button>
        </div>
      );
    }
    if (step === 5) {
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Company" value={experience.company} onChange={(e) => setExperience(p => ({ ...p, company: e.target.value }))} placeholder="e.g. Razorpay" />
          <Input label="Role" value={experience.role} onChange={(e) => setExperience(p => ({ ...p, role: e.target.value }))} placeholder="e.g. SDE Intern" />
          <Input label="Duration" value={experience.duration} onChange={(e) => setExperience(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. May 2024 - Jul 2024" />
          <Textarea className="sm:col-span-2" label="Description bullets" value={experience.bullets} onChange={(e) => setExperience(p => ({ ...p, bullets: e.target.value }))} placeholder="One bullet per line..." />
        </div>
      );
    }
    if (step === 6) {
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Certification" value={cert.name} onChange={(e) => setCert(p => ({ ...p, name: e.target.value }))} placeholder="e.g. AWS Cloud Practitioner" />
          <Input label="Issuer" value={cert.issuer} onChange={(e) => setCert(p => ({ ...p, issuer: e.target.value }))} placeholder="e.g. Amazon Web Services" />
          <Input label="Date" value={cert.date} onChange={(e) => setCert(p => ({ ...p, date: e.target.value }))} placeholder="e.g. March 2024" />
          <Input label="Credential link" value={cert.credentialUrl} onChange={(e) => setCert(p => ({ ...p, credentialUrl: e.target.value }))} placeholder="e.g. https://verify.aws..." />
        </div>
      );
    }
    // Step 7: Summary
    const entries = [
      personal.fullName ? 'Personal complete' : 'Personal incomplete',
      `${education.filter(e => e.institution).length} education entries`,
      `${skills.length} skills`,
      `${projects.filter(p => p.name).length} projects`,
      experience.company ? '1 experience' : '0 experiences',
      cert.name ? '1 certification' : '0 certifications',
    ];
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {entries.map((item) => (
          <div key={item} className="rounded-lg border border-border bg-surface p-3 text-sm font-semibold text-text-primary">{item}</div>
        ))}
      </div>
    );
  }, [missingName, skills, step, personal, education, projects, experience, cert]);

  return (
    <WizardShell
      step={step}
      title={titles[step - 1]}
      footer={
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" disabled={step === 1} onClick={() => setStep((value) => Math.max(1, value - 1))}>Back</Button>
          <Button
            loading={isCreating}
            onClick={() => {
              setTouched(true);
              if (step < 7) setStep((value) => value + 1);
              else handleCreate();
            }}
          >
            {step === 7 ? 'Generate Resume' : 'Next'}
          </Button>
        </div>
      }
    >
      {content}
    </WizardShell>
  );
}

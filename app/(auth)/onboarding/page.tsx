'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useWizardStep } from '@/hooks/useWizardStep';

const ONBOARDING_STEPS = [
  { key: 'role', label: 'Account Setup' },
  { key: 'details', label: 'Institute Details' },
  { key: 'confirm', label: 'Confirm Setup' }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { currentStep, step, isFirst, isLast, next, prev } = useWizardStep(ONBOARDING_STEPS);
  
  const [formData, setFormData] = useState({
    role: 'STUDENT' as 'STUDENT' | 'OFFICER',
    name: '',
    email: '',
    password: '',
    enrollmentNo: '',
    department: 'Kalkaji',
    batch: '3rd',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateStep = () => {
    setError('');
    if (currentStep === 0) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in name, email, and password.');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return false;
      }
    } else if (currentStep === 1) {
      if (formData.role === 'STUDENT' && (!formData.enrollmentNo || !formData.department)) {
        setError('Please fill in your enrollment number and department.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      next();
    }
  };

  const handleRegister = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          enrollmentNo: formData.role === 'STUDENT' ? formData.enrollmentNo : undefined,
          department: formData.department,
          batch: formData.role === 'STUDENT' ? formData.batch : undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || 'Registration failed');
        setLoading(false);
        return;
      }

      const { user } = await res.json();
      setLoading(false);
      
      if (user.role === 'OFFICER') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('An error occurred during registration. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] p-4 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-blue-600/10 via-cyan-400/10 to-blue-400/10 blur-[120px] rounded-full" />

      <Card 
        className="w-full max-w-xl bg-black/60 backdrop-blur-xl border border-white/10 p-5 rounded-[24px] text-white" 
        header={<h1 className="text-xl font-bold text-center text-white">Complete Placement Setup</h1>}
      >
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {/* STEP 1: ACCOUNT ROLE & SECURE DETAILS */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Your Role</label>
              <div className="grid gap-3 sm:grid-cols-2">
                {(['STUDENT', 'OFFICER'] as const).map((r) => (
                  <button 
                    key={r} 
                    onClick={() => setFormData(f => ({ ...f, role: r }))} 
                    className={formData.role === r 
                      ? 'rounded-xl border border-blue-500 bg-blue-500/15 p-4 text-left font-bold text-blue-400 transition' 
                      : 'rounded-xl border border-white/10 bg-white/5 p-4 text-left font-bold text-slate-300 hover:bg-white/10 transition'
                    }
                  >
                    {r === 'STUDENT' ? 'Student Portal' : 'Placement Officer'}
                  </button>
                ))}
              </div>
            </div>

            <Input 
              label="Full Name" 
              value={formData.name} 
              onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Arjun Sharma"
            />
            <Input 
              label="Email Address" 
              type="email"
              value={formData.email} 
              onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
              placeholder="you@college.edu"
            />
            <Input 
              label="Choose Password" 
              type="password"
              value={formData.password} 
              onChange={(e) => setFormData(f => ({ ...f, password: e.target.value }))}
              placeholder="Min 6 characters"
            />
          </div>
        )}

        {/* STEP 2: DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-4">
            {formData.role === 'STUDENT' ? (
              <>
                <Input 
                  label="Enrollment Number" 
                  value={formData.enrollmentNo} 
                  onChange={(e) => setFormData(f => ({ ...f, enrollmentNo: e.target.value }))}
                  placeholder="e.g. 2022CSB1020"
                />
                <Select 
                  label="Branch" 
                  value={formData.department}
                  onChange={(e) => setFormData(f => ({ ...f, department: e.target.value }))}
                  options={[
                    { value: 'Kalkaji', label: 'Kalkaji' },
                    { value: 'Badarpur', label: 'Badarpur' },
                  ]}
                />
                <Select 
                  label="Current Batch Year" 
                  value={formData.batch}
                  onChange={(e) => setFormData(f => ({ ...f, batch: e.target.value }))}
                  options={[
                    { value: '1st', label: '1st Year' },
                    { value: '2nd', label: '2nd Year' },
                    { value: '3rd', label: '3rd Year' },
                    { value: '4th', label: '4th Year' },
                  ]}
                />
              </>
            ) : (
              <Input 
                label="Officer Department / Placement Cell Name" 
                value={formData.department} 
                onChange={(e) => setFormData(f => ({ ...f, department: e.target.value }))}
                placeholder="e.g. T&P Cell"
              />
            )}
          </div>
        )}

        {/* STEP 3: CONFIRM */}
        {currentStep === 2 && (
          <div className="space-y-3 text-sm">
            <h3 className="font-bold text-slate-300 border-b border-white/10 pb-2 mb-2">Review Registration details</h3>
            <div className="grid grid-cols-2 gap-2 text-slate-400">
              <div>Role:</div><div className="text-white font-bold">{formData.role}</div>
              <div>Name:</div><div className="text-white font-bold">{formData.name}</div>
              <div>Email:</div><div className="text-white font-bold">{formData.email}</div>
              {formData.role === 'STUDENT' && (
                <>
                  <div>Enrollment No:</div><div className="text-white font-bold">{formData.enrollmentNo}</div>
                  <div>Department:</div><div className="text-white font-bold">{formData.department}</div>
                  <div>Batch:</div><div className="text-white font-bold">{formData.batch}</div>
                </>
              )}
              {formData.role === 'OFFICER' && (
                <>
                  <div>Department:</div><div className="text-white font-bold">{formData.department}</div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
          {!isFirst && (
            <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={prev}>
              Back
            </Button>
          )}
          
          {!isLast ? (
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button variant="primary" onClick={handleRegister} disabled={loading}>
              {loading ? 'Creating Account...' : 'Complete Register'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  GraduationCap,
  Hash,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [course, setCourse] = useState('Accounting');
  const [batch, setBatch] = useState('Kalkaji');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!name || !email || !password) {
      setError('Name, email, and password are required');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          studentId,
          course,
          batch,
          role: 'STUDENT',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || 'Registration failed');
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push('/dashboard');
    } catch {
      setError('An error occurred during registration. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white relative overflow-hidden py-12 px-4">
      {/* Background Glow */}
      <div className="absolute w-[800px] h-[800px] bg-gradient-to-r from-blue-600/20 via-cyan-400/20 to-blue-400/20 blur-[150px] rounded-full" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg z-10"
      >
        {/* Glow Border */}
        <div className="absolute -inset-[1px] rounded-[30px] bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-400 blur opacity-60" />

        <div className="relative p-8 rounded-[30px] bg-black/60 backdrop-blur-xl border border-white/10">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-400 shadow-lg overflow-hidden">
              <Image
                src="/images/logo/ifda-logo.jfif"
                alt="Logo"
                width={60}
                height={35}
                className="object-contain"
              />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center">Create Student Account</h1>
          <p className="text-center text-slate-400 mt-1 text-sm">Register to build your resume and apply to placements</p>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-2xl text-center text-sm text-red-300 font-semibold">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            {/* Grid for Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium">Full Name</label>
                <div className="mt-1.5 flex items-center h-12 px-3 rounded-2xl bg-white/5 border border-white/10 focus-within:border-blue-500">
                  <User size={16} className="text-blue-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="ml-2.5 w-full bg-transparent outline-none text-white text-sm placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium">College Email</label>
                <div className="mt-1.5 flex items-center h-12 px-3 rounded-2xl bg-white/5 border border-white/10 focus-within:border-blue-500">
                  <Mail size={16} className="text-blue-400" />
                  <input
                    type="email"
                    placeholder="you@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ml-2.5 w-full bg-transparent outline-none text-white text-sm placeholder-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-slate-300 font-medium">Password</label>
              <div className="mt-1.5 flex items-center h-12 px-3 rounded-2xl bg-white/5 border border-white/10 focus-within:border-cyan-400">
                <Lock size={16} className="text-cyan-400" />
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ml-2.5 w-full bg-transparent outline-none text-white text-sm placeholder-slate-500"
                />
              </div>
            </div>

            {/* Student ID */}
            <div>
              <label className="text-xs text-slate-300 font-medium">Student ID / Enrollment No (Optional)</label>
              <div className="mt-1.5 flex items-center h-12 px-3 rounded-2xl bg-white/5 border border-white/10 focus-within:border-blue-500">
                <Hash size={16} className="text-blue-400" />
                <input
                  type="text"
                  placeholder="e.g. IFDA-2026-99"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="ml-2.5 w-full bg-transparent outline-none text-white text-sm placeholder-slate-500"
                />
              </div>
            </div>

            {/* Grid for Academic Course & Batch/Branch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium">Branch / Batch</label>
                <div className="mt-1.5 flex items-center h-12 px-3 rounded-2xl bg-[#090d22] border border-white/10 focus-within:border-blue-500">
                  <GraduationCap size={16} className="text-blue-400 shrink-0" />
                  <select
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="ml-2.5 w-full bg-transparent outline-none text-white text-sm appearance-none select-custom text-slate-200"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="Kalkaji">Kalkaji</option>
                    <option value="Badarpur">Badarpur</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium">Course</label>
                <div className="mt-1.5 flex items-center h-12 px-3 rounded-2xl bg-[#090d22] border border-white/10 focus-within:border-blue-500">
                  <BookOpen size={16} className="text-blue-400 shrink-0" />
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="ml-2.5 w-full bg-transparent outline-none text-white text-sm appearance-none select-custom text-slate-200"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="Accounting">Accounting</option>
                    <option value="SAP">SAP</option>
                    <option value="HR Executive">HR Executive</option>
                    <option value="Data Analytics & Business Intelligence">Data Analytics</option>
                    <option value="Stock Market & Forex">Stock Market & Forex</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Programming & Software Development">Software Development</option>
                    <option value="Cyber Security & Ethical Hacking">Cyber Security</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Web Design & Development">Web Design</option>
                    <option value="Mobile App Development">Mobile App Dev</option>
                    <option value="Multimedia, Design & Animation">Multimedia & Design</option>
                    <option value="Computer Hardware & Networking">Hardware & Networking</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegister}
              disabled={loading}
              className="w-full h-12 mt-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 font-semibold flex items-center justify-center gap-2 text-white disabled:opacity-50 text-sm shadow-lg shadow-cyan-500/10"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Register & Sign In <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </div>

          {/* Footer Navigation Link */}
          <div className="text-center text-xs text-slate-400 mt-5">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-cyan-400 hover:underline hover:text-cyan-300 font-bold"
            >
              Sign In
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

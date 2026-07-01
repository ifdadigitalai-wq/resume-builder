'use client';

import { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';

export default function PlacementLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      const { user } = await res.json();
      setLoading(false);

      if (user.role === 'OFFICER' || user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[700px] h-[700px] bg-gradient-to-r from-blue-600/20 via-cyan-400/20 to-blue-400/20 blur-[140px] rounded-full" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Glow Border */}
        <div className="absolute -inset-[1px] rounded-[30px] bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-400 blur opacity-60" />

        <div className="relative p-8 rounded-[30px] bg-black/60 backdrop-blur-xl border border-white/10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-400 shadow-lg overflow-hidden">
              <Image
                src="/images/logo/ifda-logo.jfif"
                alt="Logo"
                width={70}
                height={40}
                className="object-contain"
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center">Placement Portal</h1>
          <p className="text-center text-slate-400 mt-2">Login to view placement opportunities</p>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-2xl text-center text-sm text-red-300 font-semibold">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm text-slate-300">College Email</label>
              <div className="mt-2 flex items-center h-14 px-4 rounded-2xl bg-white/5 border border-white/10 focus-within:border-blue-500">
                <Mail className="text-blue-400" />
                <input
                  type="email"
                  placeholder="you@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ml-3 w-full bg-transparent outline-none text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-slate-300">Password</label>
              <div className="mt-2 flex items-center h-14 px-4 rounded-2xl bg-white/5 border border-white/10 focus-within:border-cyan-400">
                <Lock className="text-cyan-400" />
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="ml-3 w-full bg-transparent outline-none text-white placeholder-slate-500"
                />
                <button type="button" onClick={() => setShow(!show)} className="text-slate-400 hover:text-white transition">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex justify-between text-sm text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="rounded bg-white/5 border-white/10 text-blue-600 focus:ring-0 focus:ring-offset-0" />
                Remember me
              </label>
              <button type="button" className="text-blue-400 hover:underline">Forgot password?</button>
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 font-semibold flex items-center justify-center gap-2 text-white disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Login <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500 mt-6">© 2026 Placement Cell • Secure Login</p>
        </div>
      </motion.div>
    </div>
  );
}
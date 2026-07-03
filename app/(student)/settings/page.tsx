'use client'

import { useState, useEffect } from 'react'
import { GraduationCap, Save, Shield, User } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useUIStore } from '@/store/uiStore'

export default function SettingsPage() {
  const { showToast } = useUIStore()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'CSE',
    batch: '3rd',
  })

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setProfile({
            name: data.user.name ?? '',
            email: data.user.email ?? '',
            phone: data.user.phone ?? '',
            department: data.user.department ?? 'CSE',
            batch: data.user.batch ?? '3rd',
          })
        }
      })
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/user/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          department: profile.department,
          batch: profile.batch,
        })
      })
      if (!res.ok) throw new Error('Save settings failed')
      showToast('Settings saved successfully!', 'success')
    } catch {
      showToast('Failed to save settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      {/* HEADER */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-blue-50 to-indigo-100 p-6 shadow-lg backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white text-xl font-bold shadow-lg">
              {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'US'}
            </div>
            <div>
              <Badge variant="blue" className="mb-1">Student profile</Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
                {profile.name || 'Student Name'}
              </h1>
              <p className="text-sm text-gray-600">
                {profile.email}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white/70 backdrop-blur-md px-5 py-3 shadow-inner">
            <p className="text-xs uppercase text-gray-500 font-bold">Profile Status</p>
            <p className="text-2xl font-bold text-green-600">Good</p>
          </div>
        </div>
      </section>

      {/* GRID */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* PROFILE */}
        <section className="card">
          <Header icon={<User />} title="Profile details" subtitle="Account" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input 
              label="Full name" 
              value={profile.name} 
              onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
            />
            <Input 
              label="Email" 
              value={profile.email} 
              disabled 
              placeholder="Read-only college email"
            />
            <Input 
              label="Phone" 
              value={profile.phone} 
              onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
              placeholder="+91..."
            />
          </div>
        </section>

        {/* ACADEMICS */}
        <section className="card">
          <Header icon={<GraduationCap />} title="Institute details" subtitle="Academics" />
          <div className="space-y-4">
            <Select
              label="Branch"
              value={profile.department}
              onChange={(e) => setProfile(p => ({ ...p, department: e.target.value }))}
              options={[
                { value: 'Kalkaji', label: 'Kalkaji' },
                { value: 'Badarpur', label: 'Badarpur' },
              ]}
            />
            <Select
              label="Year"
              value={profile.batch}
              onChange={(e) => setProfile(p => ({ ...p, batch: e.target.value }))}
              options={[
                { value: '1st', label: '1st Year' },
                { value: '2nd', label: '2nd Year' },
                { value: '3rd', label: '3rd Year' },
                { value: '4th', label: '4th Year' },
              ]}
            />
          </div>
        </section>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-bold shadow-lg transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-50"
        >
          <span className="flex items-center gap-2">
            {loading ? 'Saving...' : 'Save Settings'}
            <Save size={16} />
          </span>
        </button>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .card {
          border-radius: 16px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid #e5e7eb;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          transition: 0.3s;
        }
        .card:hover {
          transform: translateY(-4px);
        }
        .iconBox {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 36px;
          width: 36px;
          border-radius: 10px;
          background: #e0ecff;
          color: #2563eb;
        }
      `}</style>
    </div>
  )
}

function Header({ icon, title, subtitle }: any) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="iconBox">{icon}</div>
      <div>
        <p className="text-xs uppercase text-gray-500 font-bold">{subtitle}</p>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
      <style jsx>{`
        .iconBox {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 36px;
          width: 36px;
          border-radius: 10px;
          background: #e0ecff;
          color: #2563eb;
        }
      `}</style>
    </div>
  )
}
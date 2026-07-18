'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, LogOut, LogIn, Sparkles, Briefcase, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/uiStore'
import { useResumeSync } from '@/hooks/useResumeSync'
import { useNotificationStore } from '@/store/notificationStore'
import { useAIStore } from '@/store/aiStore'
import { useResumeStore } from '@/store/resumeStore'
import { useATSStore } from '@/store/atsStore'
import { useNotificationWebSocket } from '@/hooks/useNotificationWebSocket'

interface TopBarProps {
  title?: string
  resumeId?: string
  className?: string
}

export function TopBar({ title, resumeId, className }: TopBarProps) {
  const router = useRouter()
  const { toggleSidebar } = useUIStore()
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [userName, setUserName] = useState('')
  const [openMenu, setOpenMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const sync = useResumeSync(resumeId)
  const { isDownloading, setIsDownloading, showToast } = useUIStore()

  const { notifications, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore()
  
  // Connect WebSocket notifications listener
  useNotificationWebSocket()

  const aiIsOpen = useAIStore(s => s.isOpen)
  const aiOpen = useAIStore(s => s.open)
  const aiClose = useAIStore(s => s.close)

  // Resume switcher state
  const [resumesList, setResumesList] = useState<{ id: string; title: string }[]>([])
  const [showResumeDropdown, setShowResumeDropdown] = useState(false)
  const resumeDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => {
        if (data?.user) {
          setUserName(data.user.name || '')
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!resumeId) return
    fetch('/api/resume')
      .then(res => res.json())
      .then(data => {
        if (data?.resumes) {
          setResumesList(data.resumes)
        }
      })
      .catch(() => {})
  }, [resumeId])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (resumeDropdownRef.current && !resumeDropdownRef.current.contains(event.target as Node)) {
        setShowResumeDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSwitchResume = (targetId: string) => {
    setShowResumeDropdown(false)
    if (targetId === resumeId) return
    
    const pathname = window.location.pathname
    const newPath = pathname.replace(`/resume/${resumeId}`, `/resume/${targetId}`)
    router.push(newPath)
  }

  const resumeStateTitle = useResumeStore(s => s.resume.title)
  const activeResumeTitle = resumeStateTitle || resumesList.find(r => r.id === resumeId)?.title || 'My Resume'

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const html2pdf = (await import('html2pdf.js')).default
      const element = document.getElementById('resume-preview-content')
      if (!element) throw new Error('Preview not found')
      
      // Clone the element and reset the scale transform so it renders at 100% size for A4 conversion
      const clonedElement = element.cloneNode(true) as HTMLElement
      clonedElement.style.transform = 'none'
      clonedElement.style.position = 'relative'
      clonedElement.style.left = '0'
      clonedElement.style.top = '0'

      const worker = document.createElement('div')
      worker.style.position = 'absolute'
      worker.style.left = '-9999px'
      worker.style.top = '-9999px'
      worker.appendChild(clonedElement)
      document.body.appendChild(worker)

      const fileName = `resume-${Date.now()}.pdf`
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
        const resumeState = useResumeStore.getState().resume
        const sectionsData = {
          personal: resumeState.personal || {},
          summary: resumeState.summary || '',
          experience: resumeState.experience || [],
          education: resumeState.education || [],
          skills: resumeState.skills || [],
          projects: resumeState.projects || [],
          certifications: resumeState.certifications || [],
        }
        pdf.setProperties({
          title: resumeState.title || 'Resume',
          subject: JSON.stringify(sectionsData),
          keywords: 'resume-builder-data-v1',
          creator: 'AI Resume Builder'
        })
        pdf.save(fileName)
      })

      document.body.removeChild(worker)

      await fetch(`/api/resume/${resumeId}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName }),
      })
      showToast('PDF downloaded!', 'success')
      fetchNotifications() // Refresh notifications list
    } catch (err) {
      showToast('Download failed', 'error')
    } finally {
      setIsDownloading(false)
    }
  }

  if (resumeId) {
    return (
      <header className={cn("h-14 border-b bg-white flex items-center justify-between px-4 shrink-0", className)}>
        <div className="flex items-center gap-4">
          {/* Resume Switcher Dropdown */}
          <div className="relative" ref={resumeDropdownRef}>
            <button
              onClick={() => setShowResumeDropdown(!showResumeDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm"
            >
              <Briefcase className="h-4 w-4 text-blue-600" />
              <span>{activeResumeTitle}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
            {showResumeDropdown && (
              <div className="absolute left-0 mt-1.5 w-60 rounded-xl bg-white shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                  Switch Resume
                </div>
                {resumesList.length === 0 ? (
                  <div className="px-3 py-3 text-xs text-slate-400 italic">No resumes found.</div>
                ) : (
                  resumesList.map((resItem) => {
                    const isCurrent = resItem.id === resumeId;
                    return (
                      <button
                        key={resItem.id}
                        onClick={() => handleSwitchResume(resItem.id)}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          isCurrent ? 'bg-blue-50/50 text-blue-700 font-semibold' : 'text-slate-700'
                        }`}
                      >
                        <span className="truncate">{resItem.title}</span>
                        {isCurrent && <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <span className="text-xs text-slate-400 font-medium">
            {sync.isSaving ? 'Saving...' : sync.isDirty ? 'Unsaved changes' : 'All changes saved'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Modern CV Redirect Button */}
          <button
            onClick={() => router.push('/resume/multi-course')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F1E36] hover:bg-[#15294A] border border-blue-950 text-white rounded-lg text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Modern CV</span>
          </button>

          {/* Notifications Bell for Editor Mode */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                if (!showNotifications) fetchNotifications()
              }}
              className="relative p-2 rounded-lg transition-all hover:bg-blue-50 hover:scale-105"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <span className="text-xs font-bold text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] font-semibold text-primary-DEFAULT hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (!n.isRead) markAsRead(n.id)
                        }}
                        className={cn(
                          "p-3.5 flex items-start gap-2.5 transition cursor-pointer text-left",
                          n.isRead ? "bg-white hover:bg-slate-50" : "bg-blue-50/40 hover:bg-blue-50/70"
                        )}
                      >
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-1.5 shrink-0",
                          n.isRead ? "bg-slate-200" : "bg-primary-DEFAULT"
                        )} />
                        <div className="min-w-0 flex-1">
                          <p className={cn("text-xs leading-snug text-slate-800", !n.isRead && "font-bold")}>
                            {n.type ? n.type.toUpperCase() : 'NOTIFICATION'}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                            {n.message}
                          </p>
                          <span className="text-[9px] text-slate-400 mt-1 block">
                            {formatTimeAgo(n.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs italic">
                      No notifications yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <button 
            onClick={() => {
              if (aiIsOpen) {
                aiClose()
              } else {
                aiOpen('', 'General Chat')
              }
            }} 
            className={cn(
              "px-4 py-2 flex items-center gap-1.5 border rounded-lg hover:bg-slate-50 transition text-sm font-semibold",
              aiIsOpen ? "bg-blue-50 border-blue-200 text-primary-DEFAULT" : "border-slate-200 text-slate-700"
            )}
          >
            <Sparkles className="h-4 w-4 text-primary-DEFAULT" />
            AI Assistant
          </button>

          <button 
            onClick={sync.save} 
            disabled={sync.isSaving || !sync.isDirty} 
            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition text-sm font-semibold disabled:opacity-50"
          >
            Save
          </button>
          <button 
            onClick={handleDownload} 
            disabled={isDownloading} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold disabled:opacity-50"
          >
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>
      </header>
    )
  }

  return (
    <header
      className={cn(
        'sticky top-0 left-4 z-50 h-16 px-5 flex items-center justify-between',
        'bg-white/70 backdrop-blur-xl border-b border-white/50',
        'shadow-[0_4px_20px_rgba(0,0,0,0.05)]',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-gray-800 tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications Bell for Regular Pages */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              if (!showNotifications) fetchNotifications()
            }}
            className="relative p-2 rounded-lg transition-all hover:bg-blue-50 hover:scale-105"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-semibold text-primary-DEFAULT hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (!n.isRead) markAsRead(n.id)
                      }}
                      className={cn(
                        "p-3.5 flex items-start gap-2.5 transition cursor-pointer text-left",
                        n.isRead ? "bg-white hover:bg-slate-50" : "bg-blue-50/40 hover:bg-blue-50/70"
                      )}
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                        n.isRead ? "bg-slate-200" : "bg-primary-DEFAULT"
                      )} />
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-xs leading-snug text-slate-800", !n.isRead && "font-bold")}>
                          {n.type ? n.type.toUpperCase() : 'NOTIFICATION'}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                          {n.message}
                        </p>
                        <span className="text-[9px] text-slate-400 mt-1 block">
                          {formatTimeAgo(n.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs italic">
                    No notifications yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {!isLoggedIn ? (
          <button
            onClick={() => setIsLoggedIn(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md hover:scale-105 transition"
          >
            <LogIn size={16} />
            Login
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-blue-50 transition"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                {userName ? userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'U'}
              </div>
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-3 w-44 rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95">
                <button
                  onClick={async () => {
                    try {
                      await fetch('/api/auth/logout', { method: 'POST' })
                    } catch {}
                    
                    // Reset stores and clear localStorage to prevent cross-user data leakage
                    useResumeStore.getState().reset()
                    useATSStore.getState().reset()
                    localStorage.clear()

                    setIsLoggedIn(false)
                    setOpenMenu(false)
                    router.push('/login')
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

function formatTimeAgo(dateStr: string) {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  } catch {
    return ''
  }
}
'use client';

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/notificationStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
    Briefcase,
    Bell,
    Sparkles,
    Loader2,
    CheckCircle2
} from "lucide-react";

export default function Message() {
    const router = useRouter();
    const { notifications, fetchNotifications, markAsRead, isLoading } = useNotificationStore();
    const [latestResumeId, setLatestResumeId] = useState<string | null>(null);
    const [loadingResumeModule, setLoadingResumeModule] = useState(true);

    // Fetch notifications and latest resume info on mount
    useEffect(() => {
        fetchNotifications();
        
        fetch('/api/resume')
            .then(res => res.json())
            .then(data => {
                if (data.resumes && data.resumes.length > 0) {
                    // resumes are returned sorted by updatedAt desc
                    setLatestResumeId(data.resumes[0].id);
                }
            })
            .catch(err => console.error("Failed to load resumes", err))
            .finally(() => setLoadingResumeModule(false));
    }, [fetchNotifications]);

    const handleAtsClick = (jobId: string | null) => {
        if (latestResumeId) {
            const url = jobId 
                ? `/resume/${latestResumeId}/ats?jobId=${jobId}&triggerAudit=true`
                : `/resume/${latestResumeId}/ats`;
            router.push(url);
        } else {
            router.push('/resume/create');
        }
    };

    // Helper to extract and format links inside notification body
    const formatMessageWithLinks = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);
        return parts.map((part, index) => {
            if (urlRegex.test(part)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 hover:underline font-bold break-all inline-flex items-center gap-0.5"
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    return (
        <div className="relative mx-auto max-w-4xl px-4 py-8 space-y-6">
            {/* Background glow styling matching design system */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/50 blur-3xl opacity-60 pointer-events-none" />

            <div>
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                    Admin Announcements
                    <Bell className="h-5 w-5 text-blue-600 animate-pulse shrink-0" />
                </h1>
                <p className="text-sm font-medium text-slate-500 mt-1">
                    Stay updated with job matches, alerts, and other announcements from your placement officers.
                </p>
            </div>

            {isLoading || loadingResumeModule ? (
                <div className="min-h-[250px] flex items-center justify-center bg-white/50 border border-slate-100 rounded-2xl shadow-sm">
                    <div className="flex items-center text-slate-500 font-semibold gap-2">
                        <Loader2 size={20} className="animate-spin text-blue-600" />
                        <span>Loading announcements...</span>
                    </div>
                </div>
            ) : notifications.length === 0 ? (
                <div className="min-h-[250px] flex flex-col items-center justify-center bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
                    <CheckCircle2 className="h-12 w-12 text-slate-300 mb-3" />
                    <h3 className="text-base font-bold text-slate-800">All caught up!</h3>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                        You have no announcements or job alerts at the moment. Keep building your profile!
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => {
                        const isJobAlert = notification.type === 'JOB_ALERT';
                        
                        // Extract jobId and clean notification message
                        const match = notification.message.match(/\[jobId:([^\]]+)\]/);
                        const jobId = match ? match[1] : null;
                        const cleanMessage = notification.message.replace(/\s*\[jobId:[^\]]+\]/, "");

                        return (
                            <div
                                key={notification.id}
                                className={cn(
                                    "p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group",
                                    notification.isRead
                                        ? 'bg-white border-slate-100 text-slate-700 shadow-sm'
                                        : 'bg-gradient-to-br from-blue-50/40 via-white to-cyan-50/30 border-blue-100/60 shadow-[0_2px_8px_rgba(59,73,223,0.03)] text-slate-800 hover:shadow-[0_8px_30px_rgba(59,73,223,0.06)]'
                                )}
                            >
                                {/* Decorative background gradient for unread items */}
                                {!notification.isRead && (
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-400/5 to-transparent rounded-bl-full pointer-events-none" />
                                )}

                                <div className="flex items-start gap-4">
                                    {/* Icon Badge */}
                                    <div className={cn(
                                        "p-3 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-105",
                                        notification.isRead
                                            ? "bg-slate-100 text-slate-400"
                                            : "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                    )}>
                                        {isJobAlert ? <Briefcase size={18} /> : <Bell size={18} />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-4">
                                            <span className={cn(
                                                "text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider",
                                                notification.isRead
                                                    ? "bg-slate-100 text-slate-500"
                                                    : "bg-blue-100 text-blue-700"
                                            )}>
                                                {isJobAlert ? 'Job Match Alert' : 'System Alert'}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-semibold">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Announcement Message with working applying link */}
                                        <div className="mt-3 text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                                            {formatMessageWithLinks(cleanMessage)}
                                        </div>

                                        {/* Actions footer */}
                                        <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                                            <div>
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        Mark as Read
                                                    </button>
                                                )}
                                            </div>

                                            {isJobAlert && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAtsClick(jobId)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all shrink-0"
                                                >
                                                    <Sparkles size={14} className="animate-pulse text-cyan-300" />
                                                    Run Full ATS Audit
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
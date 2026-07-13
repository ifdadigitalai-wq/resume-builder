'use client';
import { useMemo, useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
    Briefcase,
    Users,
    ArrowRight,
    Sparkles,
    TrendingUp,
    Loader2,
    Plus,
    Bell,
    Check,
    X,
    ChevronRight,
    Search,
    Filter,
    Star,
    Calendar,
} from 'lucide-react';

type Course = {
    id: number;
    name: string;
}

const courses : Course[]= [
    { id: 1, name: 'Accounting' },
    { id: 2, name: 'SAP' },
    { id: 3, name: 'HR Executive' },
    { id: 4, name: 'Data Analytics & Business Intelligence' },
    { id: 5, name: 'Stock Market & Forex' },
    { id: 6, name: 'Artificial Intelligence' },
    { id: 7, name: 'Programming & Software Development' },
    { id: 8, name: 'Cyber Security & Ethical Hacking' },
    { id: 9, name: 'Digital Marketing' },
    { id: 10, name: 'Web Design & Development' },
    { id: 11, name: 'Mobile App Development' },
    { id: 12, name: 'Multimedia, Design & Animation' },
    { id: 13, name: 'Computer Hardware & Networking' },
    { id: 14, name: 'NIELIT Certified Courses' },
    { id: 15, name: 'Short Term Courses' },
    { id: 16, name: 'Long Term Courses' }
];

export default function AllocateJobPage() {
    const [resumes, setResumes] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    
    // Tab switching
    const [activeTab, setActiveTab] = useState<'resumes' | 'scraped'>('resumes');

    // Scraped jobs states
    const [scrapedJobs, setScrapedJobs] = useState<any[]>([]);
    const [scrapedLoading, setScrapedLoading] = useState(false);
    const [scrapedError, setScrapedError] = useState<string | null>(null);
    const [customJobQuery, setCustomJobQuery] = useState("");
    const [jobSearchPage, setJobSearchPage] = useState(1);
    const [jobSearchTotalPages, setJobSearchTotalPages] = useState(1);

    // Notification modal states
    const [showNotifyModal, setShowNotifyModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationError, setNotificationError] = useState<string | null>(null);
    const [notificationSuccess, setNotificationSuccess] = useState(false);
    const [notifyLoading, setNotifyLoading] = useState(false);

    const categories = [
        "All",
        ...new Set(courses.map((c) => c.name)),
    ];

    const filteredResumes = useMemo(() => {
        if (selectedCategory === "All") return resumes;
        return resumes.filter((r) => r.course === selectedCategory);
    }, [resumes, selectedCategory]);

    const notificationTargets = useMemo(() => {
        return students.filter(s => selectedCategory === "All" || s.course === selectedCategory);
    }, [students, selectedCategory]);

    useEffect(() => {
        // Fetch resumes
        fetch('/api/officer/resumes')
            .then((r) => r.json())
            .then((res) => {
                if (res.data) setResumes(res.data);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));

        // Fetch students
        fetch('/api/officer/students')
            .then((r) => r.json())
            .then((res) => {
                if (res.students) setStudents(res.students);
            })
            .catch((err) => console.error(err));
    }, []);

    const fetchScrapedJobs = useCallback(async (queryParam?: string) => {
        setScrapedLoading(true);
        setScrapedError(null);
        try {
            const query = queryParam !== undefined ? queryParam : (selectedCategory === "All" ? "" : selectedCategory);
            const searchParams = new URLSearchParams({
                page: jobSearchPage.toString(),
                limit: '6',
            });
            if (query) {
                searchParams.append('query', query);
            }
            
            const res = await fetch(`/api/jobs/search?${searchParams.toString()}`);
            if (!res.ok) {
                throw new Error("Failed to fetch scraped jobs.");
            }
            const data = await res.json();
            setScrapedJobs(data.jobs || []);
            setJobSearchTotalPages(data.totalPages || 1);
        } catch (err: any) {
            console.error(err);
            setScrapedError(err.message || "Failed to load scraped jobs.");
        } finally {
            setScrapedLoading(false);
        }
    }, [selectedCategory, jobSearchPage]);

    useEffect(() => {
        if (activeTab === 'scraped') {
            fetchScrapedJobs();
        }
    }, [activeTab, selectedCategory, jobSearchPage, fetchScrapedJobs]);

    const handleJobSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setJobSearchPage(1);
        fetchScrapedJobs(customJobQuery);
    };

    const handleSendNotification = async () => {
        if (notificationTargets.length === 0) return;
        setNotifyLoading(true);
        setNotificationError(null);
        setNotificationSuccess(false);
        try {
            const studentIds = notificationTargets.map(s => s.id);
            const res = await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentIds,
                    message: notificationMessage,
                    type: 'JOB_ALERT'
                })
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to send notifications.");
            }
            setNotificationSuccess(true);
            setTimeout(() => {
                setShowNotifyModal(false);
                setSelectedJob(null);
                setNotificationMessage("");
                setNotificationSuccess(false);
            }, 1500);
        } catch (err: any) {
            console.error(err);
            setNotificationError(err.message || "An unexpected error occurred.");
        } finally {
            setNotifyLoading(false);
        }
    };

    return (
        <div className="flex-1 p-6 h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold">Job Allocation</h1>
                    <p className="text-gray-500 mt-1">Allocate jobs to students and notify groups of students about matching listings</p>
                </div>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors"
                >
                    <Plus size={18} /> Allocate Job
                </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6 gap-6">
                <button
                    className={cn(
                        "pb-3 text-sm font-semibold border-b-2 transition-all duration-200",
                        activeTab === 'resumes'
                            ? "border-blue-600 text-blue-600 font-bold"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                    onClick={() => {
                        setActiveTab('resumes');
                        setSelectedCategory('All');
                    }}
                >
                    Student Resumes
                </button>
                <button
                    className={cn(
                        "pb-3 text-sm font-semibold border-b-2 transition-all duration-200",
                        activeTab === 'scraped'
                            ? "border-blue-600 text-blue-600 font-bold"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                    onClick={() => {
                        setActiveTab('scraped');
                        setSelectedCategory('All');
                        setJobSearchPage(1);
                    }}
                >
                    Scraped Jobs Finder
                </button>
            </div>

            {/* Shared Course Category Filters */}
            <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Filter by Course Category</h3>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
                    {categories.map((category) => {
                        const isActive = selectedCategory === category;
                        return (
                            <button
                                key={category}
                                onClick={() => {
                                    setSelectedCategory(category);
                                    setJobSearchPage(1);
                                }}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap border active:scale-95",
                                    isActive
                                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                {category}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Contents */}
            {activeTab === 'resumes' ? (
                <>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={24} className="animate-spin text-blue-600" />
                            <span className="ml-2 text-gray-600">Loading resumes...</span>
                        </div>
                    ) : filteredResumes.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
                            <Users className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No resumes found matching the selected course category.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredResumes.map((resume) => (
                                <div key={resume.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_12px_24px_rgba(59,73,223,0.04)] flex flex-col justify-between hover:shadow-[0_1px_3px_rgba(15,23,42,0.08),0_18px_36px_rgba(59,73,223,0.08)] transition-all duration-300">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 tracking-wider">
                                                {resume.course || 'Unassigned'}
                                            </span>
                                            {resume.status && (
                                                <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-gray-50 text-gray-500">
                                                    {resume.status}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-slate-800 leading-tight mb-1 text-base">{resume.title}</h3>
                                        <p className="text-sm font-semibold text-slate-500">
                                            👤 {resume.personal?.fullName || 'Anonymous'}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            ✉️ {resume.personal?.email || 'No email provided'}
                                        </p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-50 flex items-center justify-end mt-4">
                                        <Button
                                            size="sm"
                                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 font-bold text-xs"
                                        >
                                            <ArrowRight size={14} /> Allocate Job
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <>
                    {/* Search bar inside Scraped Jobs finder */}
                    <form onSubmit={handleJobSearchSubmit} className="flex gap-2 mb-6 max-w-lg">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search roles, keywords, or skills..."
                                value={customJobQuery}
                                onChange={(e) => setCustomJobQuery(e.target.value)}
                                className="pl-9 w-full"
                            />
                        </div>
                        <Button type="submit" variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors">
                            Search
                        </Button>
                    </form>

                    {scrapedLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={24} className="animate-spin text-blue-600" />
                            <span className="ml-2 text-gray-600">Scraping & fetching jobs...</span>
                        </div>
                    ) : scrapedError ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
                            <p className="text-red-500 font-medium mb-3">{scrapedError}</p>
                            <Button onClick={() => fetchScrapedJobs()} variant="secondary" size="sm">Retry</Button>
                        </div>
                    ) : scrapedJobs.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 p-8 shadow-sm">
                            <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-gray-500 font-medium">No scraped jobs found for the selected filter query.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {scrapedJobs.map((job) => (
                                    <div key={job.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_12px_24px_rgba(59,73,223,0.04)] flex flex-col justify-between hover:shadow-[0_1px_3px_rgba(15,23,42,0.08),0_18px_36px_rgba(59,73,223,0.08)] transition-all duration-300">
                                        <div>
                                            <div className="flex justify-between items-start gap-2 mb-2">
                                                <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 tracking-wider">
                                                    {job.provider}
                                                </span>
                                                {job.postedAt && (
                                                    <span className="text-[10px] text-gray-400 font-semibold">
                                                        {new Date(job.postedAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-slate-800 leading-tight mb-1 text-base">{job.title}</h3>
                                            <p className="text-sm font-bold text-slate-500 mb-2">{job.company}</p>
                                            
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {job.location && (
                                                    <span className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                                                        📍 {job.location}
                                                    </span>
                                                )}
                                                {job.experience && (
                                                    <span className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                                                        💼 {job.experience}
                                                    </span>
                                                )}
                                                {job.workMode && (
                                                    <span className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                                                        🏠 {job.workMode}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-xs text-gray-500 line-clamp-3 mb-4 leading-relaxed">
                                                {job.description}
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t border-slate-50 flex items-center justify-between mt-4">
                                            {job.applyUrl ? (
                                                <a
                                                    href={job.applyUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                                                >
                                                    View Original
                                                </a>
                                            ) : (
                                                <span className="text-xs font-semibold text-gray-400">Public Listing</span>
                                            )}
                                            <Button
                                                size="sm"
                                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1 font-bold text-xs"
                                                onClick={() => {
                                                    setSelectedJob(job);
                                                    setNotificationMessage(`A new job opportunity for "${job.title}" at "${job.company}" matches your course domain.\n\nApply here: ${job.applyUrl || '#'}\n\n[jobId:${job.id}]`);
                                                    setShowNotifyModal(true);
                                                }}
                                            >
                                                Notify Students
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Job Search Pagination */}
                            {jobSearchTotalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 pt-6">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={jobSearchPage === 1}
                                        onClick={() => setJobSearchPage(prev => Math.max(1, prev - 1))}
                                        className="text-xs"
                                    >
                                        Prev
                                    </Button>
                                    <span className="text-xs font-bold text-gray-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                                        Page {jobSearchPage} of {jobSearchTotalPages}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={jobSearchPage === jobSearchTotalPages}
                                        onClick={() => setJobSearchPage(prev => Math.min(jobSearchTotalPages, prev + 1))}
                                        className="text-xs"
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Notification Modal */}
            {showNotifyModal && selectedJob && (
                <Modal
                    open={showNotifyModal}
                    onClose={() => {
                        setShowNotifyModal(false);
                        setSelectedJob(null);
                        setNotificationMessage("");
                        setNotificationError(null);
                        setNotificationSuccess(false);
                    }}
                    title="Notify Students about Job Opportunity"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Target Course Category</label>
                            <p className="text-sm font-bold text-gray-800 mt-0.5">
                                {selectedCategory === "All" ? "All Course Categories" : selectedCategory}
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Job Details</label>
                            <p className="text-sm font-bold text-blue-600 mt-0.5">{selectedJob.title}</p>
                            <p className="text-xs text-gray-500">{selectedJob.company} • {selectedJob.location || 'Remote'}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Target Students Count</label>
                            <p className="text-sm font-semibold text-slate-700">
                                {notificationTargets.length > 0 ? (
                                    <span className="flex items-center gap-1.5">
                                        <Bell size={16} className="text-blue-500 animate-bounce" />
                                        Found <strong>{notificationTargets.length}</strong> student(s) to notify.
                                    </span>
                                ) : (
                                    <span className="text-red-500 font-bold flex items-center gap-1.5">
                                        ⚠️ No students currently registered under this course.
                                    </span>
                                )}
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Custom Message</label>
                            <Textarea
                                rows={4}
                                value={notificationMessage}
                                onChange={(e) => setNotificationMessage(e.target.value)}
                                className="w-full text-sm rounded-lg"
                                placeholder="Enter custom message to send..."
                            />
                        </div>
                        {notificationError && (
                            <p className="text-sm text-red-500 bg-red-50 border border-red-200 p-2.5 rounded-lg font-medium">{notificationError}</p>
                        )}
                        {notificationSuccess && (
                            <p className="text-sm text-green-600 bg-green-50 border border-green-200 p-2.5 rounded-lg font-medium">🎉 Notifications sent successfully!</p>
                        )}
                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setShowNotifyModal(false);
                                    setSelectedJob(null);
                                    setNotificationMessage("");
                                    setNotificationError(null);
                                    setNotificationSuccess(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                disabled={notificationTargets.length === 0 || notifyLoading || notificationSuccess}
                                loading={notifyLoading}
                                onClick={handleSendNotification}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors"
                            >
                                Send Notification
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
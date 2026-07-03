'use client';

import { useMemo, useState, useEffect } from 'react';
import { Search, Users, UserPlus } from 'lucide-react';
import { FilterBar, type OfficerFilters } from '@/components/officer/FilterBar';
import { OfficerStatCards } from '@/components/officer/OfficerStatCards';
import { StudentTable } from '@/components/officer/StudentTable';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { getInitials, formatDate } from '@/lib/resumeUtils';
import type { OfficerStudent } from '@/types/officer';

export default function OfficerDashboardPage() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<OfficerFilters>({ branch: 'All', year: 'All', score: 'All', status: 'All' });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [students, setStudents] = useState<OfficerStudent[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    resumesCreated: 0,
    avgAtsScore: 0,
    readyForPlacement: 0,
  });

  // Modal and Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentDept, setStudentDept] = useState('Kalkaji');
  const [studentEnrollment, setStudentEnrollment] = useState('');
  const [studentBatch, setStudentBatch] = useState('Accounting');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    // 1. Fetch Students
    fetch('/api/officer/students')
      .then(res => res.json())
      .then(data => {
        if (data.students) {
          const mapped: OfficerStudent[] = data.students.map((student: any) => {
            const hasResumes = student.resumeCount > 0;
            const atsScore = student.latestAtsScore ?? 0;
            const isReady = student.placementStatus === 'Ready';

            return {
              id: student.id,
              initials: getInitials(student.name),
              name: student.name,
              branch: student.batch ?? 'N/A',
              year: student.course ?? 'N/A',
              resumeStatus: hasResumes ? (student.latestAtsScore !== null ? 'Submitted' : 'Draft') : 'Not Started',
              atsScore: atsScore,
              placementReady: isReady,
              lastUpdated: student.lastActive ? new Date(student.lastActive).toLocaleDateString('en-IN') : 'N/A',
            };
          });
          setStudents(mapped);
        }
      });

    // 2. Fetch Stats
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setStats({
            totalStudents: data.totalStudents ?? 0,
            resumesCreated: data.resumesCreated ?? 0,
            avgAtsScore: data.avgAtsScore ?? 0,
            readyForPlacement: data.readyForPlacement ?? 0,
          });
        }
      });
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!studentName || !studentEmail || !studentPassword) {
      setFormError('Name, email, and password are required');
      return;
    }
    setFormLoading(true);

    try {
      const res = await fetch('/api/officer/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: studentName,
          email: studentEmail,
          password: studentPassword,
          course: studentBatch,
          studentId: studentEnrollment || undefined,
          batch: studentDept,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create student');
      }

      // Reset form and close modal
      setStudentName('');
      setStudentEmail('');
      setStudentPassword('');
      setStudentEnrollment('');
      setShowAddModal(false);

      // Refresh student list
      const fetchRes = await fetch('/api/officer/students');
      const fetchResult = await fetchRes.json();
      if (fetchResult.students) {
        const mapped = fetchResult.students.map((student: any) => {
          const hasResumes = student.resumeCount > 0;
          return {
            id: student.id,
            initials: getInitials(student.name),
            name: student.name,
            branch: student.batch ?? 'N/A',
            year: student.course ?? 'N/A',
            resumeStatus: hasResumes ? (student.latestAtsScore !== null ? 'Submitted' : 'Draft') : 'Not Started',
            atsScore: student.latestAtsScore ?? 0,
            placementReady: student.placementStatus === 'Ready',
            lastUpdated: student.lastActive ? new Date(student.lastActive).toLocaleDateString('en-IN') : 'N/A',
          };
        });
        setStudents(mapped);
      }
    } catch (err: any) {
      setFormError(err.message || 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredStudents = useMemo(() => students.filter((student) => {
    const matchesQuery = [student.name, student.branch, student.year].join(' ').toLowerCase().includes(query.toLowerCase());
    const matchesBranch = filters.branch === 'All' || student.branch === filters.branch;
    const matchesYear = filters.year === 'All' || student.year === filters.year;
    const matchesStatus = filters.status === 'All' || student.resumeStatus === filters.status;
    const matchesScore =
      filters.score === 'All' ||
      (filters.score === 'Below 50' && student.atsScore < 50) ||
      (filters.score === '50-70' && student.atsScore >= 50 && student.atsScore <= 70) ||
      (filters.score === 'Above 70' && student.atsScore > 70);
    return matchesQuery && matchesBranch && matchesYear && matchesStatus && matchesScore;
  }), [students, filters, query]);

  // Compute placement ready count dynamically from student roles list if stats readyForPlacement is 0
  const placementReadyCount = useMemo(() => {
    return students.filter(s => s.placementReady).length;
  }, [students]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const paginatedStudents = filteredStudents.slice((page - 1) * pageSize, page * pageSize);

  const updateFilters = (nextFilters: OfficerFilters) => {
    setFilters(nextFilters);
    setPage(1);
  };

  return (
    <div className="space-y-5">
      <section className="relative isolate overflow-hidden rounded-[16px] border border-[#BFD7FF] bg-[#EAF3FF] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_18px_42px_rgba(59,73,223,0.12)]">
        <div className="absolute right-8 top-6 -z-10 h-32 w-32 rounded-full bg-primary-DEFAULT/15 blur-2xl" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#647A9A]">Officer workspace</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.04em] text-[#10233F]">Student resume overview</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-[#45607F]">
              Search, filter, and monitor ATS readiness across submitted campus resumes.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="h-5 w-5" /> Add Student
            </button>
            <div className="flex items-center gap-3 rounded-[14px] border border-white/70 bg-white/75 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.70),0_14px_32px_rgba(59,73,223,0.10)]">
              <Users className="h-5 w-5 text-primary-DEFAULT" />
              <div>
                <p className="text-xs font-bold text-[#647A9A]">Visible students</p>
                <p className="text-xl font-extrabold text-[#10233F]">{filteredStudents.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <OfficerStatCards 
        totalStudents={stats.totalStudents}
        resumesCreated={stats.resumesCreated}
        avgAtsScore={stats.avgAtsScore}
        readyForPlacement={placementReadyCount || stats.readyForPlacement}
      />

      <div className="relative rounded-[14px] border border-[#CFE0F7] bg-[#F7FAFF] p-2 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_16px_38px_rgba(59,73,223,0.08)]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted animate-pulse" />
        <Input 
          value={query} 
          onChange={(event) => { setQuery(event.target.value); setPage(1); }} 
          placeholder="Search by name, branch..." 
          className="border-transparent bg-transparent pl-10 shadow-none" 
        />
      </div>

      <FilterBar filters={filters} onChange={updateFilters} />

      <StudentTable students={paginatedStudents} />

      <div className="flex flex-col gap-3 rounded-[14px] border border-[#CFE0F7] bg-[#F7FAFF] p-4 text-sm font-bold text-[#45607F] shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <span>Showing {paginatedStudents.length} of {filteredStudents.length} students - Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            className="rounded-lg bg-[#DDEBFF] px-4 py-2 text-[#07111F] transition hover:bg-primary-DEFAULT hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            className="rounded-lg bg-[#DDEBFF] px-4 py-2 text-[#07111F] transition hover:bg-primary-DEFAULT hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            Next
          </button>
        </div>
      </div>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Create New Student Account">
        <form onSubmit={handleAddStudent} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-semibold border border-red-200">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
            <Input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Arjun Sharma"
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">College Email</label>
            <Input
              type="email"
              required
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="e.g. arjun@college.edu"
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Temporary Password</label>
            <Input
              type="password"
              required
              minLength={6}
              value={studentPassword}
              onChange={(e) => setStudentPassword(e.target.value)}
              placeholder="e.g. password123 (min 6 chars)"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Branch / Dept</label>
              <select
                value={studentDept}
                onChange={(e) => setStudentDept(e.target.value)}
                className="mt-1 block w-full h-[40px] px-3 py-2 bg-white border border-slate-300 rounded-[8px] text-sm focus:outline-none focus:ring-1 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"
              >
                <option value="Kalkaji">Kalkaji</option>
                <option value="Badarpur">Badarpur</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Course Name</label>
              <select
                value={studentBatch}
                onChange={(e) => setStudentBatch(e.target.value)}
                className="mt-1 block w-full h-[40px] px-3 py-2 bg-white border border-slate-300 rounded-[8px] text-sm focus:outline-none focus:ring-1 focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"
              >
                <option value="Accounting">Accounting</option>
                <option value="SAP">SAP</option>
                <option value="HR Executive">HR Executive</option>
                <option value="Data Analytics & Business Intelligence">Data Analytics & Business Intelligence</option>
                <option value="Stock Market & Forex">Stock Market & Forex</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Programming & Software Development">Programming & Software Development</option>
                <option value="Cyber Security & Ethical Hacking">Cyber Security & Ethical Hacking</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Web Design & Development">Web Design & Development</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="Multimedia, Design & Animation">Multimedia, Design & Animation</option>
                <option value="Computer Hardware & Networking">Computer Hardware & Networking</option>
                <option value="NIELIT Certified Courses">NIELIT Certified Courses</option>
                <option value="Short Term Courses">Short Term Courses</option>
                <option value="Long Term Courses">Long Term Courses</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Enrollment Number</label>
            <Input
              type="text"
              value={studentEnrollment}
              onChange={(e) => setStudentEnrollment(e.target.value)}
              placeholder="e.g. IITD2022CSE01"
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={formLoading}>
              Create Student
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

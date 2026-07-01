'use client';

import { Badge } from '@/components/ui/Badge';
import type { OfficerStudent } from '@/types/officer';

interface StudentTableProps {
  students: OfficerStudent[];
}

function scoreClass(score: number) {
  if (score > 70) return 'text-success';
  if (score >= 50) return 'text-warning';
  return 'text-danger';
}

export function StudentTable({ students }: StudentTableProps) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-[#CFE0F7] bg-[#F7FAFF] shadow-[0_1px_2px_rgba(15,23,42,0.06),0_18px_42px_rgba(59,73,223,0.10)]">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#EAF3FF] text-xs uppercase tracking-[0.12em] text-[#647A9A]">
            <tr>
              {['Student Name', 'Branch', 'Year', 'Resume Status', 'ATS Score', 'Placement Ready', 'Last Updated', 'Actions'].map((head) => (
                <th key={head} className="px-4 py-3 font-extrabold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D7E4F7] bg-white/65">
            {students.map((student) => (
              <tr key={student.id} className="border-l-2 border-transparent transition-all duration-150 hover:border-primary-DEFAULT hover:bg-[#EFF6FF]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DDEBFF] text-xs font-extrabold text-primary-DEFAULT">{student.initials}</span>
                    <span className="font-extrabold text-[#10233F]">{student.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-bold text-[#45607F]">{student.branch}</td>
                <td className="px-4 py-3 font-bold text-[#45607F]">{student.year}</td>
                <td className="px-4 py-3">
                  <Badge variant={student.resumeStatus === 'Submitted' ? 'green' : student.resumeStatus === 'Draft' ? 'amber' : 'gray'}>{student.resumeStatus}</Badge>
                </td>
                <td className={`px-4 py-3 font-extrabold ${scoreClass(student.atsScore)}`}>{student.atsScore || '-'}</td>
                <td className="px-4 py-3">
                  <Badge variant={student.placementReady ? 'green' : 'red'}>{student.placementReady ? 'Yes' : 'No'}</Badge>
                </td>
                <td className="px-4 py-3 font-semibold text-[#647A9A]">{student.lastUpdated}</td>
                <td className="px-4 py-3">
                  <button className="rounded-md bg-[#DDEBFF] px-3 py-1.5 text-xs font-extrabold text-[#07111F] transition hover:bg-primary-DEFAULT hover:text-white">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-[#D7E4F7] md:hidden">
        {students.map((student) => (
          <div key={student.id} className="bg-white/65 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-extrabold text-[#10233F]">{student.name}</p>
                <p className="text-xs font-semibold text-[#647A9A]">{student.branch} - {student.year} Year</p>
              </div>
              <span className={`font-extrabold ${scoreClass(student.atsScore)}`}>{student.atsScore || '-'}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{student.resumeStatus}</Badge>
              <Badge variant={student.placementReady ? 'green' : 'red'}>{student.placementReady ? 'Ready' : 'Not Ready'}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

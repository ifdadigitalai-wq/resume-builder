'use client';

import { useState, useEffect } from 'react';
import { Eye, Search, X, Loader } from 'lucide-react';

export default function StudentsTablePage() {
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [atsFilter, setAtsFilter] = useState('All');
  const [profileFilter, setProfileFilter] = useState('All');

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;

  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/officer/students');
        if (!res.ok) throw new Error('Failed to fetch students');
        const data = await res.json();
        setStudents(data.students || []);
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // FILTER LOGIC
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase()) ||
      (student.studentId && student.studentId.toLowerCase().includes(search.toLowerCase()));

    const ats = student.latestAtsScore ?? 0;
    const matchesATS =
      atsFilter === 'All' ||
      (atsFilter === 'High' && ats >= 70) ||
      (atsFilter === 'Medium' && ats >= 40 && ats < 70) ||
      (atsFilter === 'Low' && ats < 40);

    const profileComplete = student.resumeCount > 0;
    const matchesProfile =
      profileFilter === 'All' ||
      (profileFilter === 'Completed' && profileComplete) ||
      (profileFilter === 'Incomplete' && !profileComplete);

    return matchesSearch && matchesATS && matchesProfile;
  });

  // PAGINATION
  const totalPages = Math.ceil(filteredStudents.length / perPage);
  const start = (currentPage - 1) * perPage;
  const paginatedStudents = filteredStudents.slice(
    start,
    start + perPage
  );

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">

      <h1 className="text-2xl font-bold mb-6">🎓 Students List</h1>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 mb-6">

        {/* SEARCH */}
        <div className="flex items-center bg-white px-4 py-2 rounded-xl shadow w-full md:w-1/4">
          <Search className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, ID..."
            className="outline-none w-full"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* ATS FILTER */}
        <select
          className="px-4 py-2 rounded-xl bg-white shadow"
          value={atsFilter}
          onChange={(e) => {
            setAtsFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option>All ATS</option>
          <option value="High">High (70%+)</option>
          <option value="Medium">Medium (40-70)</option>
          <option value="Low">Low (&lt;40)</option>
        </select>

        {/* PROFILE FILTER */}
        <select
          className="px-4 py-2 rounded-xl bg-white shadow"
          value={profileFilter}
          onChange={(e) => {
            setProfileFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option>All Profiles</option>
          <option value="Completed">Completed</option>
          <option value="Incomplete">Incomplete</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {loading ? (
          <div className="p-8 flex items-center justify-center gap-2">
            <Loader size={20} className="animate-spin text-blue-600" />
            <span className="text-gray-600">Loading students...</span>
          </div>
        ) : (
          <>
            <table className="w-full text-left text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-4">Name</th>
                  <th>Student ID</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>ATS %</th>
                  <th>Profile</th>
                  <th>Last Active</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedStudents.map((student) => {
                  const ats = student.latestAtsScore ?? 0;
                  const profileComplete = student.resumeCount > 0;
                  const lastActiveDate = new Date(student.lastActive).toLocaleDateString();

                  return (
                    <tr key={student.id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-medium">{student.name}</td>
                      <td className="text-gray-600 text-xs">{student.studentId || 'N/A'}</td>
                      <td className="text-gray-600">{student.email}</td>
                      <td>{student.course || 'N/A'}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            ats >= 70
                              ? 'bg-green-100 text-green-600'
                              : ats >= 40
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {ats}%
                        </span>
                      </td>
                      <td>
                        {profileComplete ? (
                          <span className="text-green-600 font-semibold">✅ Complete</span>
                        ) : (
                          <span className="text-red-600 font-semibold">❌ Incomplete</span>
                        )}
                      </td>
                      <td className="text-gray-600 text-xs">{lastActiveDate}</td>
                      <td>
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="text-blue-600 flex items-center gap-1 hover:text-blue-800"
                        >
                          <Eye size={16} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {paginatedStudents.length === 0 && (
              <p className="p-4 text-center text-gray-400">
                No students found
              </p>
            )}
          </>
        )}
      </div>

      {/* PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[400px] relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute right-3 top-3 hover:bg-gray-100 p-1 rounded"
            >
              <X />
            </button>

            <h2 className="text-lg font-semibold mb-4">
              Student Details
            </h2>

            <div className="space-y-3 text-sm">
              <p><b>Name:</b> {selectedStudent.name}</p>
              <p><b>Email:</b> {selectedStudent.email}</p>
              <p><b>Student ID:</b> {selectedStudent.studentId || 'N/A'}</p>
              <p><b>Course:</b> {selectedStudent.course || 'N/A'}</p>
              <p><b>Batch:</b> {selectedStudent.batch || 'N/A'}</p>
              <p><b>ATS Score:</b> {selectedStudent.latestAtsScore ?? 'Not available'}%</p>
              <p><b>Resume Count:</b> {selectedStudent.resumeCount}</p>
              <p><b>Profile Status:</b> {selectedStudent.resumeCount > 0 ? 'Complete' : 'Incomplete'}</p>
              <p><b>Placement Status:</b> {selectedStudent.placementStatus}</p>
              <p><b>Last Active:</b> {new Date(selectedStudent.lastActive).toLocaleDateString()}</p>
              {selectedStudent.skills && selectedStudent.skills.length > 0 && (
                <p><b>Skills:</b> {selectedStudent.skills.join(', ')}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
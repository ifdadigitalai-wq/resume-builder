'use client';

import { useState } from 'react';
import { Eye, Search, X } from 'lucide-react';

const studentsData = Array.from({ length: 55 }, (_, i) => ({
  id: i + 1,
  name: `Student ${i + 1}`,
  reg: `IFDA/K/25-26/${1000 + i}`,
  email: `student${i + 1}@gmail.com`,
  course: ['B.Tech', 'BBA', 'BCA'][i % 3],
  year: `${(i % 4) + 1} Year`,
  phone: '9876543210',
  address: 'Delhi, India',
  ats: Math.floor(Math.random() * 100), // ATS %
  profileComplete: Math.random() > 0.5, // true/false
  updatedAt: new Date(
    Date.now() - Math.random() * 10000000000
  ).toLocaleDateString(),
}));

export default function StudentsTablePage() {
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const [atsFilter, setAtsFilter] = useState('All');
  const [profileFilter, setProfileFilter] = useState('All');

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 20;

  // FILTER LOGIC
  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesATS =
      atsFilter === 'All' ||
      (atsFilter === 'High' && student.ats >= 70) ||
      (atsFilter === 'Medium' && student.ats >= 40 && student.ats < 70) ||
      (atsFilter === 'Low' && student.ats < 40);

    const matchesProfile =
      profileFilter === 'All' ||
      (profileFilter === 'Completed' && student.profileComplete) ||
      (profileFilter === 'Incomplete' && !student.profileComplete);

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
            placeholder="Search..."
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
        <table className="w-full text-left text-sm">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-4">Name</th>
              <th>Reg</th>
              <th>Email</th>
              <th>Course</th>
              <th>ATS %</th>
              <th>Profile</th>
              <th>Updated</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedStudents.map((student) => (
              <tr key={student.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{student.name}</td>
                <td>{student.reg}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      student.ats >= 70
                        ? 'bg-green-100 text-green-600'
                        : student.ats >= 40
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {student.ats}%
                  </span>
                </td>
                <td>
                  {student.profileComplete ? '✅' : '❌'}
                </td>
                <td>{student.updatedAt}</td>
                <td>
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="text-blue-600 flex items-center gap-1"
                  >
                    <Eye size={16} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedStudents.length === 0 && (
          <p className="p-4 text-center text-gray-400">
            No data found
          </p>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[350px] relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute right-3 top-3"
            >
              <X />
            </button>

            <h2 className="text-lg font-semibold mb-4">
              Student Details
            </h2>

            <div className="space-y-2 text-sm">
              <p><b>Name:</b> {selectedStudent.name}</p>
              <p><b>Email:</b> {selectedStudent.email}</p>
              <p><b>Course:</b> {selectedStudent.course}</p>
              <p><b>ATS:</b> {selectedStudent.ats}%</p>
              <p><b>Profile:</b> {selectedStudent.profileComplete ? 'Complete' : 'Incomplete'}</p>
              <p><b>Phone:</b> {selectedStudent.phone}</p>
              <p><b>Address:</b> {selectedStudent.address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
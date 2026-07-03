import type { PersonalInfo, Education, Project, WorkExperience, Certification } from '@/types/resume';
import type { ATSSuggestion } from '@/types/ats';
import type { OfficerStudent } from '@/types/officer';

export const samplePersonal: PersonalInfo = {
  fullName: 'Arjun Sharma',
  email: 'arjun.sharma@iitd.ac.in',
  phone: '+91 98765 43210',
  location: 'New Delhi',
  socials: {
    linkedIn: 'https://linkedin.com/in/arjunsharma',
    github: 'https://github.com/arjunsharma',
  },
  // Flat properties for backward compatibility
  linkedIn: 'https://linkedin.com/in/arjunsharma',
  github: 'https://github.com/arjunsharma',
} as any;

export const sampleEducation: Education[] = [
  {
    id: 'edu-1',
    institution: 'Indian Institute of Technology Delhi',
    degree: 'B.Tech',
    field: 'Computer Science Engineering',
    startDate: '2022',
    endDate: '2026',
    cgpa: '8.4',
  },
  {
    id: 'edu-2',
    institution: 'Delhi Public School, R.K. Puram',
    degree: 'Class XII (CBSE)',
    field: 'Science (PCM + CS)',
    startDate: '2020',
    endDate: '2022',
    cgpa: '9.4',
  },
];

export const sampleSkills: string[] = [
  'C++', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'HTML/CSS',
  'React', 'Next.js', 'Node.js', 'Express', 'TailwindCSS', 'Jest',
  'Git', 'Docker', 'PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'Figma'
];

export const sampleProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'StudySync — AI-Powered Study Planner',
    description: 'Built a full-stack study planning platform using Next.js and OpenAI API that generates personalized study schedules. Implemented smart reminders, progress tracking, and adaptive difficulty adjustment. Used by 500+ students across IIT Delhi.',
    techStack: ['Next.js', 'TypeScript', 'OpenAI API', 'PostgreSQL', 'Prisma', 'TailwindCSS'],
    link: 'https://github.com/arjunsharma/studysync',
  },
  {
    id: 'proj-2',
    name: 'CampusCart — Campus Marketplace',
    description: 'Developed a peer-to-peer marketplace for college students to buy and sell items. Features real-time chat, image uploads, and geolocation-based search. Achieved 98% uptime with Redis caching and optimized database queries.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Redis', 'AWS S3'],
    link: 'https://github.com/arjunsharma/campuscart',
  },
  {
    id: 'proj-3',
    name: 'CodeCollab — Real-time Code Editor',
    description: 'Created a collaborative code editor with real-time synchronization using WebSockets. Supports 10+ programming languages with syntax highlighting and live code execution via Docker sandboxing. Handles 50+ concurrent users.',
    techStack: ['React', 'TypeScript', 'WebSocket', 'Python', 'Docker', 'Monaco Editor'],
    link: 'https://github.com/arjunsharma/codecollab',
  },
];

export const sampleExperience: WorkExperience[] = [
  {
    id: 'exp-1',
    company: 'Razorpay',
    role: 'Software Engineering Intern',
    startDate: 'May 2024',
    endDate: 'Jul 2024',
    current: false,
    bullets: [
      'Developed and shipped 3 major features for the Razorpay Dashboard using React and TypeScript, directly impacting 2M+ merchant accounts.',
      'Optimized API response times by 40% through query optimization and Redis caching strategies.',
      'Wrote comprehensive unit and integration tests achieving 92% code coverage using Jest and React Testing Library.',
      'Collaborated with senior engineers in Agile sprints, participating in code reviews and technical design discussions.',
    ],
  },
];

export const sampleCertifications: Certification[] = [
  {
    id: 'cert-1',
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: 'March 2024',
    credentialUrl: 'https://aws.amazon.com/certification/verify',
  },
  {
    id: 'cert-2',
    name: 'Meta React Developer Certificate',
    issuer: 'Meta (Coursera)',
    date: 'January 2024',
    credentialUrl: 'https://coursera.org/verify/meta-react',
  },
];

export const sampleSummary =
  'Passionate Computer Science undergraduate at IIT Delhi with hands-on experience in full-stack development and cloud technologies. Proven track record of building scalable applications used by thousands of users. Seeking to leverage strong problem-solving skills and modern web development expertise in a high-growth engineering environment.';

export const sampleATSSuggestions: ATSSuggestion[] = [
  {
    section: 'skills',
    issue: 'Missing Docker keyword in skills list',
    fix: 'Add Docker to your skills section since it is listed in 78% of target SWE roles.',
    priority: 'high',
  },
  {
    section: 'experience',
    issue: 'Missing Kubernetes keyword',
    fix: 'Add Kubernetes keyword to your Razorpay internship description if applicable.',
    priority: 'high',
  },
  {
    section: 'projects',
    issue: 'Lack of metrics in StudySync description',
    fix: 'Quantify impact (e.g. "reduced study time by 30%").',
    priority: 'medium',
  },
  {
    section: 'personal',
    issue: 'Incomplete LinkedIn URL structure',
    fix: 'Provide full URL starting with https:// for better parsing.',
    priority: 'low',
  },
];

export const sampleOfficerStudents: OfficerStudent[] = [
  { id: 'st-1', name: 'Arjun Sharma', initials: 'AS', branch: 'Kalkaji', year: '3rd', resumeStatus: 'Submitted', atsScore: 74, placementReady: true, lastUpdated: '2 days ago' },
  { id: 'st-2', name: 'Priya Nair', initials: 'PN', branch: 'Badarpur', year: '4th', resumeStatus: 'Submitted', atsScore: 88, placementReady: true, lastUpdated: '1 day ago' },
  { id: 'st-3', name: 'Rohit Verma', initials: 'RV', branch: 'Kalkaji', year: '3rd', resumeStatus: 'Draft', atsScore: 55, placementReady: false, lastUpdated: '5 days ago' },
  { id: 'st-4', name: 'Sneha Gupta', initials: 'SG', branch: 'Badarpur', year: '4th', resumeStatus: 'Submitted', atsScore: 92, placementReady: true, lastUpdated: '3 hours ago' },
  { id: 'st-5', name: 'Karan Mehta', initials: 'KM', branch: 'Kalkaji', year: '2nd', resumeStatus: 'Not Started', atsScore: 0, placementReady: false, lastUpdated: 'Never' },
  { id: 'st-6', name: 'Ananya Krishnan', initials: 'AK', branch: 'Badarpur', year: '3rd', resumeStatus: 'Draft', atsScore: 61, placementReady: false, lastUpdated: '1 week ago' },
  { id: 'st-7', name: 'Vikram Yadav', initials: 'VY', branch: 'Kalkaji', year: '4th', resumeStatus: 'Submitted', atsScore: 79, placementReady: true, lastUpdated: '4 days ago' },
  { id: 'st-8', name: 'Meera Iyer', initials: 'MI', branch: 'Kalkaji', year: '2nd', resumeStatus: 'Draft', atsScore: 48, placementReady: false, lastUpdated: '2 weeks ago' },
  { id: 'st-9', name: 'Aditya Bansal', initials: 'AB', branch: 'Kalkaji', year: '4th', resumeStatus: 'Submitted', atsScore: 83, placementReady: true, lastUpdated: '6 hours ago' },
  { id: 'st-10', name: 'Deepika Rao', initials: 'DR', branch: 'Kalkaji', year: '3rd', resumeStatus: 'Not Started', atsScore: 0, placementReady: false, lastUpdated: 'Never' },
  { id: 'st-11', name: 'Nikhil Joshi', initials: 'NJ', branch: 'Kalkaji', year: '4th', resumeStatus: 'Submitted', atsScore: 70, placementReady: true, lastUpdated: '1 day ago' },
  { id: 'st-12', name: 'Pooja Tiwari', initials: 'PT', branch: 'Badarpur', year: '3rd', resumeStatus: 'Draft', atsScore: 42, placementReady: false, lastUpdated: '3 weeks ago' },
];

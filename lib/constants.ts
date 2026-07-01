export const COOKIE_NAME = 'session_token';
export const JWT_EXPIRY_SECONDS = 60 * 60 * 24 * 7;
export const ATS_WEIGHTS = { keywords: 0.35, completeness: 0.40, formatting: 0.25 };
export const ROUTES = { LOGIN: '/login', STUDENT: '/dashboard', OFFICER: '/admin/dashboard' };

export const SAMPLE_RESUME_ID = 'resume-001';

export const RESUME_SECTIONS = [
  { key: 'personal', label: 'Personal Info', icon: 'User' },
  { key: 'summary', label: 'Summary', icon: 'FileText' },
  { key: 'education', label: 'Education', icon: 'GraduationCap' },
  { key: 'skills', label: 'Skills', icon: 'Zap' },
  { key: 'projects', label: 'Projects', icon: 'FolderGit2' },
  { key: 'experience', label: 'Experience', icon: 'Briefcase' },
  { key: 'certifications', label: 'Certifications', icon: 'Award' },
] as const;

export const SUGGESTED_SKILLS = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Python',
  'Java', 'C++', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Git',
  'REST API', 'GraphQL', 'Figma', 'TailwindCSS', 'Express.js',
  'FastAPI', 'Django', 'Machine Learning', 'Data Structures', 'Algorithms',
  'System Design', 'CI/CD', 'Agile', 'Scrum', 'Linux',
];

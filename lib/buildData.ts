import { themes } from "./themes";

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  points: string[];
}

export interface EducationItem {
  degree: string;
  institute: string;
  period: string;
}

export interface LanguageItem {
  name: string;
  level: number;
  note: string;
}

export interface TechnicalSkillItem {
  name: string;
  level: number;
}

export interface ProjectItem {
  name: string;
  description: string;
  tags: string[];
}

export interface AchievementItem {
  value: string;
  label: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface ThemeColors {
  bg: string;
  card: string;
  panel: string;
  accent: string;
  accent2: string;
  green: string;
}

export interface ThemeIcons {
  header: string;
  skills: string;
  stack: string;
  experience: string;
  projects: string;
  stats: string;
}

export interface ThemeLabels {
  title: string;
  stack: string;
  projects: string;
  stats: string;
}

export interface ResumeThemeMetadata {
  colors: ThemeColors;
  icons: ThemeIcons;
  labels: ThemeLabels;
  stackTitle: string;
}

export interface SpecialtyResumeData {
  themeKey: string;
  name: string;
  role: string;
  title: string;
  available: boolean;
  photo: string;
  summary: string;
  contact: ContactInfo;
  about: string;
  technicalSkills: TechnicalSkillItem[];
  techStack: string[];
  tools: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: string[];
  achievements: AchievementItem[];
  languages: LanguageItem[];
  interests: string[];
  githubStats: StatItem[];
  _theme: ResumeThemeMetadata;
}

export function buildDataFromTheme(themeKey: string, overrides: Partial<SpecialtyResumeData> = {}): SpecialtyResumeData {
  const t = themes[themeKey] || themes.programming;
  const s = t.sample;
  return {
    themeKey,
    name: overrides.name || "Your Name",
    role: s.role,
    title: s.title,
    available: overrides.available !== undefined ? overrides.available : true,
    photo: overrides.photo || "",
    summary: s.summary,
    contact: overrides.contact || {
      email: "yourname@email.com",
      phone: "+91 98765 43210",
      location: "New Delhi, India",
      website: "yourname.dev",
      github: "github.com/yourname",
      linkedin: "linkedin.com/in/yourname",
    },
    about: s.about,
    technicalSkills: s.skills,
    techStack: s.stack,
    tools: s.tools,
    experience: [
      {
        title: `${t.label} Trainee / Intern`,
        company: "Company Name",
        period: "Jan 2025 – Present",
        points: [
          "Worked on real projects applying core skills.",
          "Improved processes and delivered measurable results.",
          "Collaborated with the team and mentors.",
        ],
      },
      {
        title: "Freelance / Project Work",
        company: "Self Employed",
        period: "2023 – 2024",
        points: [
          "Delivered projects for clients with high satisfaction.",
          "Handled work end to end, from brief to delivery.",
        ],
      },
    ],
    projects: s.projects,
    education: [
      { degree: `${t.label} Professional`, institute: "IFDA Institute", period: "2024 – 2025" },
    ],
    certifications: s.certs,
    achievements: s.achievements,
    languages: [
      { name: "Hindi", level: 100, note: "Native" },
      { name: "English", level: 85, note: "Professional" },
    ],
    interests: s.interests,
    githubStats: s.stats,
    _theme: {
      colors: t.colors,
      icons: t.icons,
      labels: t.labels,
      stackTitle: s.stackTitle,
    },
    ...overrides,
  };
}

import { themes } from "./themes";

// Builds a full resume-data object for a given course theme.
// Keeps a shared shape (like defaultData) but fills profession-specific content.
export function buildDataFromTheme(themeKey, overrides = {}) {
  const t = themes[themeKey];
  const s = t.sample;
  return {
    themeKey,
    name: overrides.name || "Your Name",
    role: s.role,
    title: s.title,
    available: true,
    photo: "",
    summary: s.summary,
    contact: {
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

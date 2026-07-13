require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
console.log('DATABASE_URL in seed.js:', process.env.DATABASE_URL);
const { PrismaClient } = require('@prisma/client');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
const ws = require('ws');
const bcrypt = require('bcryptjs');

neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = false;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const mockStudentData = [
  {
    name: 'Alice Smith',
    email: 'alice.accounting@college.edu',
    course: 'Accounting',
    resumeTitle: 'Professional Accountant & Financial Analyst Resume',
    skills: ["Financial Reporting", "Tax Compliance", "Tally ERP 9", "Auditing", "Excel VBA", "Balance Sheets"],
    summary: 'Detail-oriented Accountant with 3+ years of experience in financial auditing, ledger reconciliation, and tax filing. Proven track record in optimizing enterprise tax liabilities.'
  },
  {
    name: 'Bob Johnson',
    email: 'bob.sap@college.edu',
    course: 'SAP',
    resumeTitle: 'Certified SAP Consultant Resume',
    skills: ["SAP ABAP", "SAP FICO", "SAP HANA", "Business Process Optimization", "ERP Implementation"],
    summary: 'SAP Technical Consultant specializing in FICO and ABAP integrations. Experienced in full-cycle enterprise ERP implementations and database optimizations.'
  },
  {
    name: 'Charlie Brown',
    email: 'charlie.hr@college.edu',
    course: 'HR Executive',
    resumeTitle: 'Talent Acquisition & HR Operations Specialist',
    skills: ["HR Policies", "Recruitment", "Onboarding", "Conflict Resolution", "Performance Management"],
    summary: 'Empathetic HR Executive with strong interpersonal skills and expertise in managing talent acquisition pipelines, performance reviews, and employee relations.'
  },
  {
    name: 'Diana Prince',
    email: 'diana.data@college.edu',
    course: 'Data Analytics & Business Intelligence',
    resumeTitle: 'Data Analyst & PowerBI Specialist',
    skills: ["PowerBI", "Tableau", "SQL Server", "Python (Pandas/NumPy)", "Data Warehousing", "Statistical Analysis"],
    summary: 'Data Analyst passionate about transforming complex datasets into actionable business intelligence insights. Expert in PowerBI, SQL queries, and predictive dashboard development.'
  },
  {
    name: 'Ethan Hunt',
    email: 'ethan.stock@college.edu',
    course: 'Stock Market & Forex',
    resumeTitle: 'Financial Markets Trader & Technical Analyst',
    skills: ["Technical Analysis", "Risk Management", "Forex Trading", "Equity Valuation", "Portfolio Optimization"],
    summary: 'Capital markets trader focused on technical chart analysis, macro indicators, and algorithmic risk mitigation strategies to maximize investment returns.'
  },
  {
    name: 'Fiona Gallagher',
    email: 'fiona.ai@college.edu',
    course: 'Artificial Intelligence',
    resumeTitle: 'Machine Learning & Natural Language Processing Engineer',
    skills: ["Python", "PyTorch", "TensorFlow", "NLP", "Computer Vision", "LLMs", "Scikit-Learn"],
    summary: 'AI Research Engineer specializing in natural language processing and transformer models. Passionate about deploying deep learning systems into distributed cloud production.'
  },
  {
    name: 'George Clark',
    email: 'george.dev@college.edu',
    course: 'Programming & Software Development',
    resumeTitle: 'Full Stack Software Engineer',
    skills: ["React", "Node.js", "Express", "TypeScript", "PostgreSQL", "System Design", "Docker", "Git"],
    summary: 'Software Engineer specializing in robust backend microservices and interactive single-page web applications. Proficient in TypeScript, Next.js, and cloud systems.'
  },
  {
    name: 'Hannah Abbott',
    email: 'hannah.cyber@college.edu',
    course: 'Cyber Security & Ethical Hacking',
    resumeTitle: 'Penetration Tester & Cybersecurity Incident Responder',
    skills: ["Penetration Testing", "Metasploit", "Wireshark", "Network Security", "Vulnerability Assessment", "Linux System Administration"],
    summary: 'Certified ethical hacker dedicated to securing networks, analyzing application code vulnerabilities, and executing standard penetration testing compliance protocols.'
  },
  {
    name: 'Ian Malcolm',
    email: 'ian.marketing@college.edu',
    course: 'Digital Marketing',
    resumeTitle: 'SEO Specialist & Performance Marketer',
    skills: ["SEO Optimization", "Google Analytics", "PPC Campaigns", "Content Strategy", "Email Marketing", "Social Media Ads"],
    summary: 'Data-driven Marketer specialized in scaling organic search traffic, managing high-ROI PPC campaigns, and running performance analytics across advertising networks.'
  },
  {
    name: 'Julia Roberts',
    email: 'julia.web@college.edu',
    course: 'Web Design & Development',
    resumeTitle: 'Creative UI Designer & Web Developer',
    skills: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "Figma", "UI/UX Design", "Responsive Layouts"],
    summary: 'Frontend Web Developer blending creative graphics with semantic markup. Skilled in responsive layouts, Figma wireframing, and custom interactive assets.'
  },
  {
    name: 'Kevin Bacon',
    email: 'kevin.mobile@college.edu',
    course: 'Mobile App Development',
    resumeTitle: 'Cross-Platform React Native & Flutter Developer',
    skills: ["React Native", "Flutter", "iOS Development (Swift)", "Android SDK", "Mobile UI Design", "API Integration"],
    summary: 'Mobile App Developer focused on fluid cross-platform app animations, native module bridges, and offline database synchronization schemas.'
  },
  {
    name: 'Laura Croft',
    email: 'laura.design@college.edu',
    course: 'Multimedia, Design & Animation',
    resumeTitle: '3D Animator & Visual Design Lead',
    skills: ["Adobe After Effects", "Photoshop", "Blender 3D", "Maya", "Video Editing", "Vector Illustration"],
    summary: 'Visual storyteller producing high-impact video animations, vector graphics, and 3D environment assets for advertising campaigns and digital media.'
  },
  {
    name: 'Marcus Aurelius',
    email: 'marcus.hardware@college.edu',
    course: 'Computer Hardware & Networking',
    resumeTitle: 'IT Network Infrastructure Administrator',
    skills: ["Cisco Routing", "Network Architecture", "System Troubleshooting", "Windows Server Active Directory", "Linux Admin"],
    summary: 'Systems Administrator maintaining infrastructure uptime. Expert in configuring Cisco routers, managed firewalls, and server virtualization.'
  },
  {
    name: 'Nancy Wheeler',
    email: 'nancy.nielit@college.edu',
    course: 'NIELIT Certified Courses',
    resumeTitle: 'Information Technology Analyst (NIELIT O/A Level)',
    skills: ["Office Automation", "Python", "Data Structures", "Database Management Systems", "PC Maintenance"],
    summary: 'NIELIT accredited IT expert proficient in database queries, business data operations, office software automation, and scripting.'
  },
  {
    name: 'Oliver Queen',
    email: 'oliver.short@college.edu',
    course: 'Short Term Courses',
    resumeTitle: 'Advanced Excel & Business Operations Assistant',
    skills: ["Advanced Excel", "Pivot Tables", "Word Processing", "Data Entry", "Business Communication"],
    summary: 'Support Operations Specialist certified in advanced business tools. Focused on administrative workflow efficiency and scheduling.'
  },
  {
    name: 'Peggy Carter',
    email: 'peggy.long@college.edu',
    course: 'Long Term Courses',
    resumeTitle: 'Executive Diploma in Business Administration & Management',
    skills: ["Project Management", "Business Strategy", "Operations Auditing", "Organizational Leadership"],
    summary: 'Management professional possessing deep knowledge of supply-chain operations, strategic market planning, and team leadership methodologies.'
  }
];

async function main() {
  console.log('Clearing existing database...');
  await prisma.activity.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.resume.deleteMany({});
  await prisma.jobRequirement.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 12);

  console.log('Seeding admin credentials...');
  // Admin account
  await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@college.edu',
      passwordHash,
      role: 'OFFICER',
    }
  });
  console.log('Seeded Admin account: admin@college.edu / password123');

  console.log('Seeding student accounts with 90%+ completed resumes...');

  for (let i = 0; i < mockStudentData.length; i++) {
    const data = mockStudentData[i];
    
    // Create Student User
    const student = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: 'STUDENT',
        course: data.course,
        batch: '2026',
        phone: '+91 9999988888',
        linkedIn: `https://linkedin.com/in/${data.name.toLowerCase().replace(/ /g, '')}`,
        github: `https://github.com/${data.name.toLowerCase().replace(/ /g, '')}`,
      }
    });

    // Generate Resume Sections to ensure 90%+ completion score
    const sections = {
      personal: {
        fullName: data.name,
        email: data.email,
        phone: '+91 9999988888',
        location: 'Delhi, India',
        socials: {
          linkedin: `https://linkedin.com/in/${data.name.toLowerCase().replace(/ /g, '')}`,
          github: `https://github.com/${data.name.toLowerCase().replace(/ /g, '')}`
        }
      },
      summary: data.summary,
      education: [
        {
          institution: 'College of Vocational Studies, DU',
          degree: 'Bachelor of Vocation',
          fieldOfStudy: data.course,
          startDate: '2023-07-15',
          endDate: '2026-06-30',
          description: 'Acquired foundational and advanced expertise matching global standards. Maintained 8.9 CGPA average.'
        }
      ],
      experience: [
        {
          company: 'Industry Tech Solutions',
          position: `${data.course} Intern`,
          location: 'New Delhi, India',
          startDate: '2025-06-01',
          endDate: '2025-08-31',
          description: `Worked as a junior specialist contributing to production pipelines. Accelerated project deployment workflows by 20% and resolved active team tickets.`
        }
      ],
      projects: [
        {
          name: `${data.course} Integration Platform`,
          techStack: data.skills.slice(0, 3),
          description: `Developed an automation system mapping to the core objectives of ${data.course}. Achieved significant pipeline enhancements.`
        }
      ],
      skills: data.skills,
      certifications: [
        {
          name: `National Professional Certificate in ${data.course}`,
          issuer: 'Skill Development Council',
          issueDate: '2026-02-10'
        }
      ]
    };

    // Create completed Resume for Student
    await prisma.resume.create({
      data: {
        userId: student.id,
        title: data.resumeTitle,
        status: 'COMPLETE',
        completionScore: 96,
        atsScore: 85 + (i % 10), // Varies from 85 to 94
        sections: sections,
      }
    });

    console.log(`Seeded student [${data.course}]: ${data.email} / password123`);
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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

async function main() {
  console.log('Clearing existing database...');
  await prisma.activity.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.resume.deleteMany({});
  await prisma.jobRequirement.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding default users...');
  
  // Shared password hash for simplicity in seeding
  const passwordHash = await bcrypt.hash('password123', 12);

  // 1. Admin (Mapped to role OFFICER since ADMIN is not in the schema enum, and login page redirects to admin page for OFFICER/ADMIN roles)
  await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@college.edu',
      passwordHash,
      role: 'OFFICER',
    }
  });
  console.log('Seeded Admin account: admin@college.edu / password123');

  // 2. Placement Officer
  const officerUser = await prisma.user.create({
    data: {
      name: 'Placement Officer',
      email: 'officer@college.edu',
      passwordHash,
      role: 'OFFICER',
    }
  });
  console.log('Seeded Officer account: officer@college.edu / password123');

  // 3. Officer Jobs
  await prisma.jobRequirement.create({
    data: {
      officerId: officerUser.id,
      title: 'Associate Software Engineer',
      company: 'Razorpay',
      description: 'We are looking for a passionate Associate Software Engineer to join our core checkout team. Skills required: React, Node.js, SQL.',
      requiredSkills: ['React', 'Node.js', 'SQL'],
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    }
  });
  console.log('Seeded a sample job posting');

  // 4. Students
  // Student 1: Arjun Sharma (Placement Ready, High Score)
  const student1 = await prisma.user.create({
    data: {
      name: 'Arjun Sharma',
      email: 'arjun@college.edu',
      passwordHash,
      role: 'STUDENT',
      studentId: 'IITD2022CSE01',
      course: 'CSE',
      batch: '2026',
    }
  });

  const resume1 = await prisma.resume.create({
    data: {
      userId: student1.id,
      title: 'Arjun_Sharma_CSE_Resume',
      status: 'COMPLETE',
      completionScore: 95,
      atsScore: 88,
      sections: {
        personal: {
          fullName: 'Arjun Sharma',
          email: 'arjun@college.edu',
          phone: '+91 98765 43210',
          location: 'New Delhi',
          socials: {
            linkedIn: 'https://linkedin.com/in/arjunsharma',
            github: 'https://github.com/arjunsharma',
          }
        },
        summary: 'Passionate Computer Science undergraduate at IIT Delhi with hands-on experience in full-stack development and cloud technologies. Seeking to leverage strong problem-solving skills in a high-growth software engineering environment.',
        education: [
          {
            id: 'edu-1',
            institution: 'IIT Delhi',
            degree: 'B.Tech',
            field: 'Computer Science',
            startDate: '2022',
            endDate: '2026',
            cgpa: '8.4',
          }
        ],
        skills: ['C++', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'React', 'Next.js', 'Node.js', 'Express', 'TailwindCSS'],
        projects: [
          {
            id: 'proj-1',
            name: 'StudySync — AI Study Planner',
            description: 'Built a study planning platform using Next.js and OpenAI API that generates personalized study schedules. Used by 500+ students.',
            techStack: ['Next.js', 'TypeScript', 'OpenAI API', 'PostgreSQL'],
            link: 'https://github.com/arjunsharma/studysync',
          }
        ],
        experience: [
          {
            id: 'exp-1',
            company: 'Razorpay',
            role: 'Software Engineering Intern',
            startDate: 'May 2024',
            endDate: 'Jul 2024',
            current: false,
            bullets: [
              'Developed features for Razorpay Dashboard using React/TypeScript.',
              'Optimized API response times by 40% using Redis caching.',
              'Wrote unit tests achieving 92% coverage using Jest.'
            ]
          }
        ],
        certifications: []
      }
    }
  });

  await prisma.notification.create({
    data: {
      userId: student1.id,
      message: 'Your resume scored 88% compatibility for the role "Associate Software Engineer".',
      type: 'ats',
    }
  });

  await prisma.activity.create({
    data: {
      userId: student1.id,
      type: 'ATS_RUN',
      description: 'Ran ATS analysis for "Associate Software Engineer"',
      metadata: { resumeId: resume1.id, score: 88 }
    }
  });

  // Student 2: Priya Nair (In Progress, Draft)
  const student2 = await prisma.user.create({
    data: {
      name: 'Priya Nair',
      email: 'priya@college.edu',
      passwordHash,
      role: 'STUDENT',
      studentId: 'IITD2022ECE02',
      course: 'ECE',
      batch: '2026',
    }
  });

  await prisma.resume.create({
    data: {
      userId: student2.id,
      title: 'Priya_Nair_ECE_Draft',
      status: 'DRAFT',
      completionScore: 60,
      atsScore: 65,
      sections: {
        personal: {
          fullName: 'Priya Nair',
          email: 'priya@college.edu',
          phone: '+91 99999 88888',
          location: 'Kochi',
          socials: {}
        },
        summary: '',
        education: [],
        skills: ['Verilog', 'VHDL', 'Arduino', 'Microcontrollers'],
        projects: [],
        experience: [],
        certifications: []
      }
    }
  });

  // Student 3: Rohit Verma (Not Started)
  await prisma.user.create({
    data: {
      name: 'Rohit Verma',
      email: 'rohit@college.edu',
      passwordHash,
      role: 'STUDENT',
      studentId: 'IITD2022ME03',
      course: 'ME',
      batch: '2026',
    }
  });

  console.log('Seeded 3 students (Arjun: Placement Ready, Priya: Draft, Rohit: Not Started)');
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

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

  console.log('Seeding admin credentials...');
  
  // Shared password hash for simplicity in seeding
  const passwordHash = await bcrypt.hash('password123', 12);

  // Admin (Mapped to role OFFICER since ADMIN is not in the schema enum, and login page redirects to admin page for OFFICER/ADMIN roles)
  await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@college.edu',
      passwordHash,
      role: 'OFFICER',
    }
  });
  console.log('Seeded Admin account: admin@college.edu / password123');

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

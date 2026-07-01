const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const resumes = await prisma.resume.findMany({
    orderBy: { updatedAt: 'desc' }
  });
  console.log('RESUMES IN DB:');
  console.log(JSON.stringify(resumes, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

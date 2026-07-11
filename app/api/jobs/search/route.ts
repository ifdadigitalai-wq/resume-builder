import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authGuard';
import { db } from '@/lib/db';
import { jobRegistry } from '@/lib/jobs/registry';

export async function GET(req: NextRequest) {
  const { session, error: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || undefined;
    const location = searchParams.get('location') || undefined;
    const experience = searchParams.get('experience') || undefined;
    const workmode = searchParams.get('workmode') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Fetch the student's latest resume to extract skills
    const latestResume = await db.resume.findFirst({
      where: {
        userId: session.id,
        deletedAt: null,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        sections: true,
      },
    });

    let studentSkills: string[] = [];
    if (latestResume && latestResume.sections) {
      const sections = latestResume.sections as any;
      if (Array.isArray(sections.skills)) {
        studentSkills = sections.skills.map((s: string) => s.toLowerCase().trim());
      }
    }

    // Perform search using the registry
    const searchResult = await jobRegistry.searchAll({
      query,
      location,
      experience,
      workmode,
      page,
      limit,
    });

    // Calculate match percentages for each job dynamically
    const jobsWithMatch = searchResult.jobs.map((job) => {
      let matchScore = 0;

      if (studentSkills.length > 0) {
        const jobSkills = job.skills.map((s) => s.toLowerCase().trim());
        
        if (jobSkills.length > 0) {
          const overlap = jobSkills.filter((js) => 
            studentSkills.some((ss) => ss === js || ss.includes(js) || js.includes(ss))
          );
          
          const directScore = Math.round((overlap.length / jobSkills.length) * 100);
          matchScore = directScore;

          // If direct overlap is low, check for keyword occurrence in description
          if (matchScore < 40) {
            let keywordMatches = 0;
            const descLower = job.description.toLowerCase();
            
            studentSkills.forEach((ss) => {
              if (descLower.includes(ss)) {
                keywordMatches++;
              }
            });

            if (keywordMatches > 0) {
              matchScore = Math.min(85, matchScore + keywordMatches * 12);
            }
          }
        } else {
          // If no specific skills defined on job, search for student skills in description
          const descLower = job.description.toLowerCase();
          let keywordMatches = 0;
          
          studentSkills.forEach((ss) => {
            if (descLower.includes(ss)) {
              keywordMatches++;
            }
          });
          
          matchScore = Math.min(90, Math.max(15, keywordMatches * 15));
        }
      }

      // Add a baseline match (e.g. 10%) if they have a resume but low overlap
      if (studentSkills.length > 0 && matchScore < 10) {
        matchScore = 12;
      }

      return {
        ...job,
        matchScore: studentSkills.length > 0 ? Math.min(100, matchScore) : null,
      };
    });

    return NextResponse.json({
      jobs: jobsWithMatch,
      total: searchResult.total,
      page: searchResult.page,
      totalPages: searchResult.totalPages,
      hasResume: studentSkills.length > 0,
    });
  } catch (err: any) {
    console.error('Job search API error:', err);
    return NextResponse.json({ error: err.message || 'Failed to search jobs' }, { status: 500 });
  }
}

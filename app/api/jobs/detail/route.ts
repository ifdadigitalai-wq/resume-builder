import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/authGuard';
import { jobRegistry } from '@/lib/jobs/registry';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { error: authError } = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const job = await jobRegistry.getJobById(id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (err: any) {
    console.error('Job detail API error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch job details' }, { status: 500 });
  }
}

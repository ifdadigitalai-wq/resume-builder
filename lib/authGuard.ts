import { NextResponse } from 'next/server'
import { getSession } from './getSession'
import type { JWTPayload } from './jwt'

type GuardResult =
  | { session: JWTPayload; error: null }
  | { session: null; error: NextResponse }

export async function requireAuth(role?: 'OFFICER' | 'STUDENT'): Promise<GuardResult> {
  const session = await getSession()
  if (!session) {
    return { session: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  // Map sub as id for auth compatibility
  const sessionCompat = { ...session, id: session.sub };
  if (role && session.role !== role) {
    return { session: null, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { session: sessionCompat as any, error: null }
}

export async function requireRole(expectedRole: 'STUDENT' | 'OFFICER'): Promise<GuardResult> {
  const session = await getSession()
  if (!session) {
    return { session: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  const sessionCompat = { ...session, id: session.sub };
  if (session.role !== expectedRole) {
    return { session: null, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { session: sessionCompat as any, error: null }
}
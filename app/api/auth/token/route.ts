import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value || cookieStore.get('session_token')?.value
    return NextResponse.json({ token: token || null })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to retrieve auth token' }, { status: 500 })
  }
}

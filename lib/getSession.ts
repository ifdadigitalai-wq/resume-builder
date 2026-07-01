import { cookies } from 'next/headers'
import { verifyToken, type JWTPayload } from './jwt'

export async function getSession(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value || cookieStore.get('session_token')?.value
    if (!token) return null
    return await verifyToken(token)
  } catch (e) {
    console.error('getSession exception:', e)
    return null
  }
}
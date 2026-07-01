const SECRET = process.env.JWT_SECRET;

export interface JWTPayload {
  sub: string; // userId
  id: string;  // userId alias for older/compatibility routes
  role: 'STUDENT' | 'OFFICER';
  iat: number;
  exp: number;
  email?: string;
  name?: string;
}

function enforceSecret() {
  if (!SECRET || SECRET.length < 32) {
    throw new Error('JWT_SECRET must be defined and at least 32 characters long');
  }
}

function base64urlEncode(str: string): string {
  return btoa(str)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) {
    base64 += '='
  }
  try {
    return atob(base64)
  } catch {
    throw new Error('Invalid base64 string')
  }
}

async function getCryptoKey(): Promise<CryptoKey> {
  enforceSecret();
  const enc = new TextEncoder()
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export async function signToken(payload: { id: string; role: 'STUDENT' | 'OFFICER'; name: string; email: string }): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + (7 * 24 * 60 * 60) // 7 days
  
  const fullPayload: JWTPayload = {
    sub: payload.id,
    id: payload.id,
    role: payload.role,
    iat,
    exp,
    name: payload.name,
    email: payload.email,
  }

  const headerStr = base64urlEncode(JSON.stringify(header))
  const payloadStr = base64urlEncode(JSON.stringify(fullPayload))

  const key = await getCryptoKey()
  const enc = new TextEncoder()
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    enc.encode(`${headerStr}.${payloadStr}`)
  )

  const signatureArray = Array.from(new Uint8Array(signatureBuffer))
  const signatureStr = btoa(String.fromCharCode(...signatureArray))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return `${headerStr}.${payloadStr}.${signatureStr}`
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [headerStr, payloadStr, signatureStr] = parts

    const key = await getCryptoKey()
    const enc = new TextEncoder()

    const verified = await crypto.subtle.verify(
      'HMAC',
      key,
      new Uint8Array(
        atob(signatureStr.replace(/-/g, '+').replace(/_/g, '/'))
          .split('')
          .map((c) => c.charCodeAt(0))
      ),
      enc.encode(`${headerStr}.${payloadStr}`)
    )

    if (!verified) {
      console.error('JWT signature verification failed')
      return null
    }

    const payload = JSON.parse(base64urlDecode(payloadStr))
    if (!payload.id && payload.sub) {
      payload.id = payload.sub
    }
    if (!payload.exp || Date.now() / 1000 > payload.exp) {
      console.error('JWT token expired')
      return null
    }

    return payload as JWTPayload
  } catch (err: any) {
    console.error('verifyToken failed:', err.message || err)
    return null
  }
}
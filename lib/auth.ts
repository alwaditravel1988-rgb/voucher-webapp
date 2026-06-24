import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'voucher_session';

function secret() {
  return process.env.SESSION_SECRET || 'dev-secret-change-me';
}

export function createSessionToken() {
  const payload = JSON.stringify({ role: 'admin', ts: Date.now() });
  const encoded = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', secret()).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token?: string) {
  if (!token || !token.includes('.')) return false;
  const [encoded, signature] = token.split('.');
  const expected = crypto.createHmac('sha256', secret()).update(encoded).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    const maxAgeMs = 1000 * 60 * 60 * 12;
    return payload.role === 'admin' && Date.now() - payload.ts < maxAgeMs;
  } catch {
    return false;
  }
}

export async function isLoggedIn() {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE_NAME)?.value);
}

export async function setLoginCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12
  });
}

export async function clearLoginCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

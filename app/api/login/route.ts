import { NextResponse } from 'next/server';
import { createSessionToken, setLoginCookie } from '@/lib/auth';

export async function POST(req: Request) {
  const { password } = await req.json();
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }
  await setLoginCookie(createSessionToken());
  return NextResponse.json({ ok: true });
}

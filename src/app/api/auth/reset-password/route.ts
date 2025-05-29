import { prisma } from '../../../../lib/db';
import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

async function verifyAndResetPassword(token: string, password: string) {
  // 1. Find the verification token using findFirst
  const verification = await prisma.verificationToken.findFirst({ where: { token } });
  if (!verification) {
    return false;
  }
  if (verification.expires < new Date()) {
    return false;
  }
  // 2. Find the user by email (identifier)
  const user = await prisma.user.findUnique({ where: { email: verification.identifier } });
  if (!user) {
    return false;
  }
  // 3. Hash new password and update user
  const hashedPassword = await hash(password, 10);
  await prisma.user.update({
    where: { email: verification.identifier },
    data: { hashedPassword },
  });
  // 4. Invalidate token
  await prisma.verificationToken.delete({ where: { identifier_token: { identifier: verification.identifier, token } } });
  return true;
}

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();
  if (!token || typeof token !== 'string' || !password || typeof password !== 'string') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const ok = await verifyAndResetPassword(token, password);
  if (ok) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }
}

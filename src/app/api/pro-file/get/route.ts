import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { studyProfile: true },
  });

  if (!user || !user.studyProfile) {
    return NextResponse.json({ error: 'Study profile not found' }, { status: 404 });
  }

  return NextResponse.json(user.studyProfile);
}


import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    const where = {
      NOT: userEmail ? { user: { email: userEmail } } : undefined,
    };

    const count = await prisma.studyProfile.count({ where });

    if (count === 0) {
      return NextResponse.json({ error: 'No profiles found' }, { status: 404 });
    }

    const now = new Date();
    const skip = now.getSeconds() % count;

    const [randomProfile] = await prisma.studyProfile.findMany({
      where,
      include: { user: true },
      take: 1,
      skip,
    });

    if (!randomProfile) {
      return NextResponse.json({ error: 'No profiles found' }, { status: 404 });
    }

    return NextResponse.json({
      name: randomProfile.user.name,
      goal: randomProfile.goal,
      studyTopics: randomProfile.studyTopics,
      hoursAvailable: randomProfile.hoursAvailable,
      phoneNumber: randomProfile.phoneNumber,
      profileImage: randomProfile.profileImage,
    });
  } catch (err) {
    console.error('[ERROR]', err);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

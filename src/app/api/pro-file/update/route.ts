import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma'; 

export async function POST(req: Request) {
   try {
    const body = await req.json();
    const {
      email,
      goal,
      studyTopics,
      hoursAvailable,
      phoneNumber,
      profileImage,
    } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedProfile = await prisma.studyProfile.upsert({
      where: { userId: user.id },
      update: {
        goal,
        studyTopics,
        hoursAvailable,
        phoneNumber,
        profileImage,
      },
      create: {
        userId: user.id,
        goal,
        studyTopics,
        hoursAvailable,
        phoneNumber,
        profileImage,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('[Profile is not updating]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
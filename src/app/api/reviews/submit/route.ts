import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const { rating, comment, anonymous } = await req.json();
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }
    const name = anonymous ? 'Anonymous' : session.user.name || 'Anonymous';
    const userId = session.user.id;
    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment || null,
        name,
        userId,
      },
    });
    return NextResponse.json({ success: true, review });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

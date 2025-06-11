import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '../../../lib/db';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return NextResponse.json(
      reviews.map(r => ({
        pills: r.rating,
        date: r.createdAt instanceof Date ? r.createdAt.toLocaleString() : r.createdAt,
        comment: r.comment,
        name: r.name || 'Anonymous',
        userId: r.userId, 
        id: r.id, //review ID for deleting
      }))
    );
  } catch (e) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    await prisma.review.deleteMany({ where: { userId } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId, rating, comment, name } = await req.json();
    if (!userId || !rating) return NextResponse.json({ error: 'Missing userId or rating' }, { status: 400 });
    const updated = await prisma.review.updateMany({
      where: { userId },
      data: {
        rating,
        comment,
        name,
      },
    });
    return NextResponse.json({ success: true, updated });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// FIX: Add this line!
const prisma = new PrismaClient();

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        include: { options: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!quiz) {
    return NextResponse.json({ message: "Quiz not found" }, { status: 404 });
  }

  return NextResponse.json(quiz);
}

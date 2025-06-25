import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db'; // Adjust path if needed

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const quizAttemptId = searchParams.get('quizAttemptId');
  if (!quizAttemptId) {
    return NextResponse.json({ error: 'Missing quizAttemptId' }, { status: 400 });
  }

  const quizAttempt = await prisma.quizAttempt.findUnique({
    where: { id: quizAttemptId },
    include: {
      questions: {
        include: {
          question: {
            include: { options: true, quiz: true },
          },
          option: true,
        },
      },
    },
  });

  if (!quizAttempt) {
    return NextResponse.json({ error: 'Quiz attempt not found' }, { status: 404 });
  }

  const quizTitle = quizAttempt.questions[0]?.question.quiz.title || 'Quiz Results';
  const questions = quizAttempt.questions.map((qa) => ({
    id: qa.question.id,
    text: qa.question.text,
    userOptionText: qa.option?.text || '',
    correctOptionText: qa.question.options.find((opt) => opt.isCorrect)?.text || '',
    isCorrect: qa.isCorrect,
  }));
  const correctCount = questions.filter(q => q.isCorrect).length;
  const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  return NextResponse.json({
    quizTitle,
    questions,
    correctCount,
    percentage,
  });
}

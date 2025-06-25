import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db';

export async function POST(req: NextRequest) {
    try {
        const session = await getAuthSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { quizId, answers } = await req.json();
        // Create QuizAttempt
        const quizAttempt = await prisma.quizAttempt.create({
            data: {
                userId: session.user.id,
                quizId: quizId,
            },
        });

        // Fetch correct options for all questions in this quiz
        const questionIds = answers.map((a: any) => a.questionId);
        const correctOptions = await prisma.option.findMany({
            where: {
                questionId: { in: questionIds },
                isCorrect: true,
            },
            select: {
                id: true,
                questionId: true,
            },
        });
        const correctOptionMap = new Map(correctOptions.map(opt => [opt.questionId, opt.id]));

        // Build QuestionAttempts with calculated isCorrect
        const questionAttemptsData = answers.map((a: any) => {
            const correctOptionId = correctOptionMap.get(a.questionId);
            return {
                quizAttemptId: quizAttempt.id,
                questionId: a.questionId,
                optionId: a.userAnswer,
                isCorrect: a.userAnswer === correctOptionId,
            };
        });

        await prisma.questionAttempt.createMany({
            data: questionAttemptsData,
        });

        return NextResponse.json({ quizAttemptId: quizAttempt.id });
    } catch (error) {
        console.error('Quiz submit error:', error);
        return NextResponse.json({ error: 'Failed to submit quiz.' }, { status: 500 });
    }
}
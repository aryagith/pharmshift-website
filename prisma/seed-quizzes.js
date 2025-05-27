const { PrismaClient } = require("@prisma/client");
const { allQuizzes } = require("../src/lib/quiz-data.js");

const prisma = new PrismaClient();

async function main() {
  for (const quizObjRaw of Object.values(allQuizzes)) {
    const quizObj = quizObjRaw;
    const quizTitle = quizObj.title || "Quiz";
    await prisma.quiz.create({
      data: {
        title: quizTitle,
        description: quizObj.description || quizTitle,
        timeLimitMinutes: quizObj.timeLimitMinutes || 20,
        questions: {
          create: (quizObj.questions || []).map((q, idx) => ({
            text: q.question,
            order: idx + 1,
            options: {
              create: (q.options || []).map((opt) => ({
                text: opt,
                isCorrect: opt === q.answer,
              })),
            },
          })),
        },
      },
    });
    console.log(`Created quiz: ${quizTitle}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

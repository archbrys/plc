import bcrypt from 'bcrypt'
import {
  PrismaClient,
  QuestionSetStatus,
  QuestionType,
  Role,
} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.studentAnswer.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.choice.deleteMany()
  await prisma.question.deleteMany()
  await prisma.questionSet.deleteMany()
  await prisma.user.deleteMany()

  const adminPasswordHash = await bcrypt.hash('admin123', 10)
  const studentPinOneHash = await bcrypt.hash('1234', 10)
  const studentPinTwoHash = await bcrypt.hash('5678', 10)

  await prisma.user.create({
    data: {
      role: Role.ADMIN,
      username: 'admin',
      fullName: 'System Admin',
      passwordHash: adminPasswordHash,
    },
  })

  const student1 = await prisma.user.create({
    data: {
      role: Role.STUDENT,
      studentId: 'S1001',
      fullName: 'Ava Student',
      passwordHash: studentPinOneHash,
    },
  })

  await prisma.user.create({
    data: {
      role: Role.STUDENT,
      studentId: 'S1002',
      fullName: 'Noah Learner',
      passwordHash: studentPinTwoHash,
    },
  })

  const mathSet = await prisma.questionSet.create({
    data: {
      title: 'Math Basics',
      description: 'Quick arithmetic and logic warm-up.',
      status: QuestionSetStatus.PUBLISHED,
      questions: {
        create: [
          {
            questionText: 'What is 2 + 2?',
            questionType: QuestionType.MULTIPLE_CHOICE,
            orderNumber: 1,
            points: 2,
            required: true,
            choices: {
              create: [
                { choiceText: '3', isCorrect: false, orderNumber: 1 },
                { choiceText: '4', isCorrect: true, orderNumber: 2 },
              ],
            },
          },
          {
            questionText: 'True or False: 9 is an odd number.',
            questionType: QuestionType.TRUE_FALSE,
            orderNumber: 2,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'True', isCorrect: true, orderNumber: 1 },
                { choiceText: 'False', isCorrect: false, orderNumber: 2 },
              ],
            },
          },
          {
            questionText: 'Write a number greater than 10.',
            questionType: QuestionType.SHORT_ANSWER,
            orderNumber: 3,
            points: 2,
            required: true,
          },
        ],
      },
    },
    include: {
      questions: { include: { choices: true } },
    },
  })

  await prisma.questionSet.create({
    data: {
      title: 'Science Draft Quiz',
      description: 'Draft set for future publishing.',
      status: QuestionSetStatus.DRAFT,
      questions: {
        create: [
          {
            questionText: 'Water boils at 100°C at sea level. True or False?',
            questionType: QuestionType.TRUE_FALSE,
            orderNumber: 1,
            points: 1,
            required: true,
            choices: {
              create: [
                { choiceText: 'True', isCorrect: true, orderNumber: 1 },
                { choiceText: 'False', isCorrect: false, orderNumber: 2 },
              ],
            },
          },
        ],
      },
    },
  })

  await prisma.submission.create({
    data: {
      studentId: student1.id,
      questionSetId: mathSet.id,
      totalPoints: 5,
      earnedPoints: 3,
      answers: {
        create: [
          {
            questionId: mathSet.questions[0].id,
            selectedChoiceId: mathSet.questions[0].choices[1].id,
            awardedPoints: 2,
          },
          {
            questionId: mathSet.questions[1].id,
            selectedBoolean: true,
            awardedPoints: 1,
          },
          {
            questionId: mathSet.questions[2].id,
            answerText: '11',
            awardedPoints: 0,
          },
        ],
      },
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })

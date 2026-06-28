import bcrypt from 'bcrypt';
import { PrismaClient, QuestionSetStatus, QuestionType, Role, } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    await prisma.studentAnswer.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.choice.deleteMany();
    await prisma.question.deleteMany();
    await prisma.questionSet.deleteMany();
    await prisma.user.deleteMany();
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const studentPinOneHash = await bcrypt.hash('1234', 10);
    const studentPinTwoHash = await bcrypt.hash('5678', 10);
    await prisma.user.create({
        data: {
            role: Role.ADMIN,
            username: 'admin',
            fullName: 'System Admin',
            passwordHash: adminPasswordHash,
        },
    });
    const student1 = await prisma.user.create({
        data: {
            role: Role.STUDENT,
            studentId: 'S1001',
            fullName: 'Ava Student',
            passwordHash: studentPinOneHash,
        },
    });
    await prisma.user.create({
        data: {
            role: Role.STUDENT,
            studentId: 'S1002',
            fullName: 'Noah Learner',
            passwordHash: studentPinTwoHash,
        },
    });
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
    });
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map
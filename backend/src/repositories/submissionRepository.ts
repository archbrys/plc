import type { Prisma, PrismaClient } from '@prisma/client'

export class SubmissionRepository {
  constructor(private readonly db: PrismaClient) {}

  listAll() {
    return this.db.submission.findMany({
      orderBy: { submittedAt: 'desc' },
      include: {
        student: true,
        questionSet: true,
        answers: {
          include: { question: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    })
  }

  listByStudent(studentId: string) {
    return this.db.submission.findMany({
      where: { studentId },
      orderBy: { submittedAt: 'desc' },
      include: {
        student: true,
        questionSet: true,
        answers: {
          include: { question: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    })
  }

  create(payload: Prisma.SubmissionCreateInput) {
    return this.db.submission.create({
      data: payload,
      include: {
        student: true,
        questionSet: true,
        answers: {
          include: { question: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    })
  }

  findById(id: string) {
    return this.db.submission.findUnique({ where: { id } })
  }

  delete(id: string) {
    return this.db.submission.delete({ where: { id } })
  }
}

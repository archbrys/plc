import {
  QuestionSetStatus,
  type Prisma,
  type PrismaClient,
} from '@prisma/client'

export class QuestionSetRepository {
  constructor(private readonly db: PrismaClient) {}

  list(status?: QuestionSetStatus) {
    const where = status ? { status } : {}

    return this.db.questionSet.findMany({
      where,
      orderBy: { title: 'asc' },
      include: {
        questions: {
          orderBy: { orderNumber: 'asc' },
          include: { choices: { orderBy: { orderNumber: 'asc' } }, answers: true },
        },
      },
    })
  }

  getById(id: string) {
    return this.db.questionSet.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { orderNumber: 'asc' },
          include: { choices: { orderBy: { orderNumber: 'asc' } }, answers: true },
        },
      },
    })
  }

  async create(payload: Prisma.QuestionSetCreateInput) {
    return this.db.questionSet.create({
      data: payload,
      include: {
        questions: {
          orderBy: { orderNumber: 'asc' },
          include: { choices: { orderBy: { orderNumber: 'asc' } }, answers: true },
        },
      },
    })
  }

  async update(id: string, payload: Prisma.QuestionSetUpdateInput) {
    await this.db.questionSet.update({ where: { id }, data: payload })
    return this.getById(id)
  }

  delete(id: string) {
    return this.db.questionSet.delete({ where: { id } })
  }
}

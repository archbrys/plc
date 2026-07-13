import { Role, type Prisma, type PrismaClient, type User } from '@prisma/client'

export class UserRepository {
  constructor(private readonly db: PrismaClient) {}

  findByAdminUsername(username: string): Promise<User | null> {
    return this.db.user.findFirst({
      where: { role: Role.ADMIN, username },
    })
  }

  findByStudentId(studentId: string): Promise<User | null> {
    return this.db.user.findFirst({
      where: { role: Role.STUDENT, studentId },
    })
  }

  findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } })
  }

  list(): Promise<User[]> {
    return this.db.user.findMany({ orderBy: { createdAt: 'desc' } })
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.db.user.create({ data })
  }

  update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.db.user.update({ where: { id }, data })
  }

  delete(id: string): Promise<User> {
    return this.db.user.delete({ where: { id } })
  }
}

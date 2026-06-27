import { Role, type PrismaClient, type User } from '@prisma/client'

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
}

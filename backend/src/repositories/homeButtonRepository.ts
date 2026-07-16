import type { PrismaClient } from '@prisma/client'

export class HomeButtonRepository {
  constructor(private readonly db: PrismaClient) {}

  getAll() {
    return this.db.homeButton.findMany({ orderBy: { orderNumber: 'asc' } })
  }

  getActive() {
    return this.db.homeButton.findMany({ where: { isActive: true }, orderBy: { orderNumber: 'asc' } })
  }

  getById(id: number) {
    return this.db.homeButton.findUnique({ where: { id } })
  }

  async getMaxOrderNumber(): Promise<number> {
    const result = await this.db.homeButton.aggregate({ _max: { orderNumber: true } })
    return result._max.orderNumber ?? 0
  }

  findByChapterId(chapterId: number) {
    return this.db.homeButton.findMany({ where: { chapterId } })
  }

  create(data: {
    label: string
    orderNumber: number
    targetType: string
    chapterId: number | null
    route: string | null
    isActive: boolean
  }) {
    return this.db.homeButton.create({ data })
  }

  update(
    id: number,
    data: {
      label?: string
      orderNumber?: number
      targetType?: string
      chapterId?: number | null
      route?: string | null
      isActive?: boolean
    },
  ) {
    return this.db.homeButton.update({ where: { id }, data })
  }

  delete(id: number) {
    return this.db.homeButton.delete({ where: { id } })
  }

  async reorder(orderedIds: number[]) {
    await this.db.$transaction(
      orderedIds.map((id, index) => this.db.homeButton.update({ where: { id }, data: { orderNumber: index + 1 } })),
    )
  }
}

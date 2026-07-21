import type { PrismaClient } from '@prisma/client'

export class CourseRepository {
  constructor(private readonly db: PrismaClient) {}

  getCourseWithChapters() {
    return this.db.course.findFirst({
      include: {
        chapters: {
          orderBy: { orderNumber: 'asc' },
          include: { pages: { orderBy: { orderNumber: 'asc' } } },
        },
      },
    })
  }

  getChapterById(id: number) {
    return this.db.courseChapter.findUnique({
      where: { id },
      include: { pages: { orderBy: { orderNumber: 'asc' } } },
    })
  }

  createChapter(courseId: string, data: { title: string; orderNumber: number; group?: string | null }) {
    return this.db.courseChapter.create({
      data: { courseId, title: data.title, orderNumber: data.orderNumber, group: data.group ?? null },
      include: { pages: { orderBy: { orderNumber: 'asc' } } },
    })
  }

  updateChapter(id: number, data: { title?: string; orderNumber?: number; group?: string | null }) {
    return this.db.courseChapter.update({
      where: { id },
      data,
      include: { pages: { orderBy: { orderNumber: 'asc' } } },
    })
  }

  deleteChapter(id: number) {
    return this.db.courseChapter.delete({ where: { id } })
  }

  async reorderChapters(orderedIds: number[]) {
    await this.db.$transaction(
      orderedIds.map((id, index) =>
        this.db.courseChapter.update({ where: { id }, data: { orderNumber: index + 1 } }),
      ),
    )
  }

  getPageById(id: number) {
    return this.db.chapterPage.findUnique({ where: { id } })
  }

  createPage(chapterId: number, data: { type: string; orderNumber: number; config: string }) {
    return this.db.chapterPage.create({ data: { chapterId, ...data } })
  }

  updatePage(id: number, data: { type?: string; orderNumber?: number; config?: string }) {
    return this.db.chapterPage.update({ where: { id }, data })
  }

  deletePage(id: number) {
    return this.db.chapterPage.delete({ where: { id } })
  }

  async reorderPages(orderedIds: number[]) {
    await this.db.$transaction(
      orderedIds.map((id, index) =>
        this.db.chapterPage.update({ where: { id }, data: { orderNumber: index + 1 } }),
      ),
    )
  }
}

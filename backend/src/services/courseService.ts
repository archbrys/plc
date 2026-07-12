import { prisma } from '../config/prisma.js'

export interface ChapterPageResponse {
  id: number
  type: string
  orderNumber: number
  config: unknown
}

export interface CourseChapterResponse {
  id: number
  title: string
  sections: [] // Legacy field, kept for compatibility
  pages: ChapterPageResponse[]
}

export interface CourseResponse {
  chapters: CourseChapterResponse[]
}

export const courseService = {
  async getCourse(): Promise<CourseResponse> {
    // For now, we'll get the first course. In the future, you might want to support multiple courses.
    const course = await prisma.course.findFirst({
      include: {
        chapters: {
          include: {
            pages: {
              orderBy: {
                orderNumber: 'asc',
              },
            },
          },
          orderBy: {
            orderNumber: 'asc',
          },
        },
      },
    })

    if (!course) {
      throw new Error('No course found')
    }

    return {
      chapters: course.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        sections: [], // Legacy field for backward compatibility
        pages: chapter.pages.map((page) => ({
          id: page.id,
          type: page.type,
          orderNumber: page.orderNumber,
          config: JSON.parse(page.config),
        })),
      })),
    }
  },

  async getChapterById(chapterId: number): Promise<CourseChapterResponse | null> {
    const chapter = await prisma.courseChapter.findUnique({
      where: { id: chapterId },
      include: {
        pages: {
          orderBy: {
            orderNumber: 'asc',
          },
        },
      },
    })

    if (!chapter) {
      return null
    }

    return {
      id: chapter.id,
      title: chapter.title,
      sections: [],
      pages: chapter.pages.map((page) => ({
        id: page.id,
        type: page.type,
        orderNumber: page.orderNumber,
        config: JSON.parse(page.config),
      })),
    }
  },
}

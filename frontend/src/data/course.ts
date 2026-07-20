import type { Course } from '../types/course'
import { courseApiService } from '../services/courseApiService'

export async function getCourse(): Promise<Course> {
  try {
    return await courseApiService.getCourse()
  } catch (error) {
    console.error('Failed to fetch course from backend:', error)
    throw new Error('Unable to load course content')
  }
}

export async function getChapterById(chapterId: number) {
  const course = await getCourse()
  return course.chapters.find((chapter) => chapter.id === chapterId)
}

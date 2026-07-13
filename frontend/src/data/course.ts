import type { Course } from '../types/course'
import { courseApiService } from '../services/courseApiService'

let courseCache: Course | null = null

export async function getCourse(): Promise<Course> {
  // Return in-memory cache if available
  if (courseCache) {
    return courseCache
  }

  try {
    const course = await courseApiService.getCourse()
    courseCache = course
    return course
  } catch (error) {
    console.error('Failed to fetch course from backend:', error)
    throw new Error('Unable to load course content')
  }
}

export function invalidateCourseCache() {
  courseCache = null
}

export async function getChapterById(chapterId: number) {
  const course = await getCourse()
  return course.chapters.find((chapter) => chapter.id === chapterId)
}

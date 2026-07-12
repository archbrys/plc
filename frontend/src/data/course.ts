import type { Course } from '../types/course'
import { courseApiService } from '../services/courseApiService'
import { safeStorage } from '../utils/storage'

const COURSE_STORAGE_KEY = 'plc-course-content'

let courseCache: Course | null = null

export async function getCourse(): Promise<Course> {
  // Return cache if available
  if (courseCache) {
    return courseCache
  }

  // Try to get from localStorage first
  const storedCourse = safeStorage.get<Course | null>(COURSE_STORAGE_KEY, null)
  if (storedCourse && Array.isArray(storedCourse.chapters)) {
    courseCache = storedCourse
    return storedCourse
  }

  // Fetch from backend if not in storage
  try {
    const course = await courseApiService.getCourse()
    courseCache = course
    safeStorage.set(COURSE_STORAGE_KEY, course)
    return course
  } catch (error) {
    console.error('Failed to fetch course from backend:', error)
    throw new Error('Unable to load course content')
  }
}

export function invalidateCourseCache() {
  courseCache = null
  safeStorage.remove(COURSE_STORAGE_KEY)
}

export async function getChapterById(chapterId: number) {
  const course = await getCourse()
  return course.chapters.find((chapter) => chapter.id === chapterId)
}

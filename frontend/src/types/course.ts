export interface CourseContentItem {
  id: number
  title: string
  text: string
  image: string
}

export interface CourseSection {
  id: number
  title: string
  contents: CourseContentItem[]
}

// Page types for rich chapter flows
export type ChapterPageType = 'slideshow' | 'narration' | 'content_section' | 'interactive_practice' | 'quiz'

// Page config interfaces
export interface SlideshowPageConfig {
  images: string[]
  autoAdvanceMs: number
}

export interface NarrationPageConfig {
  character: string
  text: string
  backgroundImage?: string
}

export interface ContentSectionPageConfig {
  sectionNumber: number
  sectionTitle: string
  chapterTitle: string
  contents: string[]
  sideImage?: string
}

export interface InteractivePracticePageConfig {
  // Uses PLCSimulator component - no additional config needed
}

export interface QuizPageConfig {
  questionSetTitle: string
}

export type ChapterPageConfig =
  | SlideshowPageConfig
  | NarrationPageConfig
  | ContentSectionPageConfig
  | InteractivePracticePageConfig
  | QuizPageConfig

export interface ChapterPage {
  id: number
  type: ChapterPageType
  orderNumber: number
  config: ChapterPageConfig
}

export interface CourseChapter {
  id: number
  title: string
  sections: CourseSection[]
  pages?: ChapterPage[] // Optional: for rich chapter flows
}

export interface Course {
  chapters: CourseChapter[]
}

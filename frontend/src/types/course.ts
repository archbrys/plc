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

// Uses PLCSimulator component - no additional config needed
export type InteractivePracticePageConfig = Record<string, never>

export interface QuizPageConfig {
  questionSetId: string
}

export type ChapterPageConfig =
  | SlideshowPageConfig
  | NarrationPageConfig
  | ContentSectionPageConfig
  | InteractivePracticePageConfig
  | QuizPageConfig

export type ChapterPage =
  | { id: number; type: 'slideshow'; orderNumber: number; config: SlideshowPageConfig }
  | { id: number; type: 'narration'; orderNumber: number; config: NarrationPageConfig }
  | { id: number; type: 'content_section'; orderNumber: number; config: ContentSectionPageConfig }
  | { id: number; type: 'interactive_practice'; orderNumber: number; config: InteractivePracticePageConfig }
  | { id: number; type: 'quiz'; orderNumber: number; config: QuizPageConfig }

export interface CourseChapter {
  id: number
  title: string
  orderNumber: number
  pages: ChapterPage[]
}

export interface Course {
  chapters: CourseChapter[]
}

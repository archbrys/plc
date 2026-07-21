// Page types for rich chapter flows
export type ChapterPageType = 'slideshow' | 'narration' | 'content_section' | 'interactive_practice' | 'quiz' | 'media'

// Page config interfaces
export interface SlideshowPageConfig {
  images: string[]
  autoAdvanceMs: number
}

export interface NarrationPageConfig {
  character: string
  text: string
  backgroundImage?: string
  image?: string
}

export type ImagePosition = 'left' | 'right' | 'top' | 'bottom'

export interface ContentBlock {
  text: string
  image?: string
  imagePosition?: ImagePosition
  textPercent?: number
}

export interface ContentSectionPageConfig {
  sectionNumber: number
  sectionTitle: string
  chapterTitle: string
  contents: ContentBlock[]
}

// Uses PLCSimulator component - no additional config needed
export type InteractivePracticePageConfig = Record<string, never>

export interface QuizPageConfig {
  questionSetId: string
}

export interface MediaPageConfig {
  mediaType: 'video' | 'file'
  url: string
  description?: string
}

export type ChapterPageConfig =
  | SlideshowPageConfig
  | NarrationPageConfig
  | ContentSectionPageConfig
  | InteractivePracticePageConfig
  | QuizPageConfig
  | MediaPageConfig

export type ChapterPage =
  | { id: number; type: 'slideshow'; orderNumber: number; config: SlideshowPageConfig }
  | { id: number; type: 'narration'; orderNumber: number; config: NarrationPageConfig }
  | { id: number; type: 'content_section'; orderNumber: number; config: ContentSectionPageConfig }
  | { id: number; type: 'interactive_practice'; orderNumber: number; config: InteractivePracticePageConfig }
  | { id: number; type: 'quiz'; orderNumber: number; config: QuizPageConfig }
  | { id: number; type: 'media'; orderNumber: number; config: MediaPageConfig }

export interface CourseChapter {
  id: number
  title: string
  orderNumber: number
  group: string | null
  pages: ChapterPage[]
}

export interface Course {
  chapters: CourseChapter[]
}

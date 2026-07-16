import type { ReactNode } from 'react'
import type { ChapterPage } from '../../types/course'
import { ChapterHeader } from './ChapterHeader'
import { SlideshowPage } from './SlideshowPage'
import { NarrationPage } from './NarrationPage'
import { ContentSectionPage } from './ContentSectionPage'
import { InteractivePracticePage } from './InteractivePracticePage'
import { QuizPage } from './QuizPage'
import { MediaPage } from './MediaPage'
import './ChapterFlowRenderer.css'

interface ChapterFlowRendererProps {
  chapterTitle: string
  page: ChapterPage
  onComplete?: () => void
  onNext?: () => void
}

function MisconfiguredPage({ type }: { type: string }) {
  return (
    <main className="chapter-flow-fallback">
      <p className="error-message">This page ({type}) is misconfigured.</p>
    </main>
  )
}

function getSectionTitle(page: ChapterPage): string | undefined {
  switch (page.type) {
    case 'content_section':
      return `Section ${page.config.sectionNumber}: ${page.config.sectionTitle}`
    case 'narration':
      return 'Introduction'
    case 'interactive_practice':
      return 'Interactive Practice'
    case 'quiz':
      return 'Assessment'
    case 'slideshow':
    default:
      return undefined
  }
}

export function ChapterFlowRenderer({ chapterTitle, page, onComplete, onNext }: ChapterFlowRendererProps) {
  let body: ReactNode

  switch (page.type) {
    case 'slideshow':
      body =
        !Array.isArray(page.config.images) || page.config.images.length === 0 ? (
          <MisconfiguredPage type={page.type} />
        ) : (
          <SlideshowPage key={page.id} config={page.config} onComplete={onComplete} />
        )
      break

    case 'narration':
      body =
        !page.config.character || !page.config.text ? (
          <MisconfiguredPage type={page.type} />
        ) : (
          <NarrationPage key={page.id} config={page.config} onNext={onNext} />
        )
      break

    case 'content_section':
      body =
        !page.config.sectionTitle ||
        !Array.isArray(page.config.contents) ||
        page.config.contents.length === 0 ||
        page.config.contents.some((block) => !block.text?.trim() && !block.image) ? (
          <MisconfiguredPage type={page.type} />
        ) : (
          <ContentSectionPage key={page.id} config={page.config} onNext={onNext} />
        )
      break

    case 'interactive_practice':
      body = <InteractivePracticePage key={page.id} config={page.config} onNext={onNext} />
      break

    case 'quiz':
      body = !page.config.questionSetId ? (
        <MisconfiguredPage type={page.type} />
      ) : (
        <QuizPage key={page.id} config={page.config} />
      )
      break

    case 'media':
      body =
        !page.config.title || !page.config.url ? (
          <MisconfiguredPage type={page.type} />
        ) : (
          <MediaPage key={page.id} config={page.config} onNext={onNext} />
        )
      break

    default:
      body = <p className="error-message">Unknown page type: {(page as ChapterPage).type}</p>
  }

  return (
    <div className="chapter-flow-shell">
      <ChapterHeader chapterTitle={chapterTitle} sectionTitle={getSectionTitle(page)} />
      {body}
    </div>
  )
}

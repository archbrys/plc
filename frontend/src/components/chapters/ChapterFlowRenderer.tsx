import type { ChapterPage } from '../../types/course'
import { SlideshowPage } from './SlideshowPage'
import { NarrationPage } from './NarrationPage'
import { ContentSectionPage } from './ContentSectionPage'
import { InteractivePracticePage } from './InteractivePracticePage'
import { QuizPage } from './QuizPage'

interface ChapterFlowRendererProps {
  page: ChapterPage
  onComplete?: () => void
  onNext?: () => void
  onBack?: () => void
}

function MisconfiguredPage({ type }: { type: string }) {
  return (
    <div className="landing-page">
      <main className="plc-intro-content">
        <p className="error-message">This page ({type}) is misconfigured.</p>
      </main>
    </div>
  )
}

export function ChapterFlowRenderer({ page, onComplete, onNext, onBack }: ChapterFlowRendererProps) {
  switch (page.type) {
    case 'slideshow':
      if (!Array.isArray(page.config.images) || page.config.images.length === 0) {
        return <MisconfiguredPage type={page.type} />
      }
      return <SlideshowPage key={page.id} config={page.config} onComplete={onComplete} onBack={onBack} />

    case 'narration':
      if (!page.config.character || !page.config.text) {
        return <MisconfiguredPage type={page.type} />
      }
      return <NarrationPage key={page.id} config={page.config} onNext={onNext} onBack={onBack} />

    case 'content_section':
      if (
        !page.config.sectionTitle ||
        !Array.isArray(page.config.contents) ||
        page.config.contents.length === 0 ||
        page.config.contents.some((block) => !block.text?.trim() && !block.image)
      ) {
        return <MisconfiguredPage type={page.type} />
      }
      return <ContentSectionPage key={page.id} config={page.config} onNext={onNext} onBack={onBack} />

    case 'interactive_practice':
      return <InteractivePracticePage key={page.id} config={page.config} onNext={onNext} onBack={onBack} />

    case 'quiz':
      if (!page.config.questionSetId) {
        return <MisconfiguredPage type={page.type} />
      }
      return <QuizPage key={page.id} config={page.config} onBack={onBack} />

    default:
      return (
        <div className="landing-page">
          <main className="plc-intro-content">
            <p className="error-message">Unknown page type: {(page as ChapterPage).type}</p>
          </main>
        </div>
      )
  }
}

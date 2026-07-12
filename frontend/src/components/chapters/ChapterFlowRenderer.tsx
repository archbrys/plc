import type { ChapterPage } from '../../types/course'
import { SlideshowPage } from './SlideshowPage'
import { NarrationPage } from './NarrationPage'
import { ContentSectionPage } from './ContentSectionPage'
import { InteractivePracticePage } from './InteractivePracticePage'
import { QuizPage } from './QuizPage'
import type {
  SlideshowPageConfig,
  NarrationPageConfig,
  ContentSectionPageConfig,
  InteractivePracticePageConfig,
  QuizPageConfig,
} from '../../types/course'

interface ChapterFlowRendererProps {
  page: ChapterPage
  onComplete?: () => void
  onNext?: () => void
  onBack?: () => void
}

export function ChapterFlowRenderer({ page, onComplete, onNext, onBack }: ChapterFlowRendererProps) {
  switch (page.type) {
    case 'slideshow':
      return (
        <SlideshowPage
          config={page.config as SlideshowPageConfig}
          onComplete={onComplete}
          onBack={onBack}
        />
      )

    case 'narration':
      return <NarrationPage config={page.config as NarrationPageConfig} onNext={onNext} onBack={onBack} />

    case 'content_section':
      return (
        <ContentSectionPage
          config={page.config as ContentSectionPageConfig}
          onNext={onNext}
          onBack={onBack}
        />
      )

    case 'interactive_practice':
      return (
        <InteractivePracticePage
          config={page.config as InteractivePracticePageConfig}
          onNext={onNext}
          onBack={onBack}
        />
      )

    case 'quiz':
      return <QuizPage config={page.config as QuizPageConfig} onBack={onBack} />

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

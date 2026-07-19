import type { ContentBlock } from '../../types/course'
import { resolveAssetSrc } from '../../utils/assets'
import { getContentBlockLayoutStyle } from '../chapters/contentBlockLayout'
import { ChapterHeader } from '../chapters/ChapterHeader'
import '../chapters/ChapterFlowRenderer.css'
import '../chapters/ChapterHeader.css'
import '../chapters/ContentSectionPage.css'

interface ContentBlockPreviewModalProps {
  block: ContentBlock
  chapterTitle: string
  sectionTitle: string
  onClose: () => void
}

export function ContentBlockPreviewModal({ block, chapterTitle, sectionTitle, onClose }: ContentBlockPreviewModalProps) {
  const hasText = Boolean(block.text?.trim())
  const hasImage = Boolean(block.image)

  return (
    <div className="chapter-flow-shell">
      <ChapterHeader
        chapterTitle={chapterTitle}
        sectionTitle={sectionTitle}
        actions={
          <button type="button" className="btn secondary small" onClick={onClose}>
            Close
          </button>
        }
      />
      <main className="chapter-section2-main">
        <div className="chapter-section2-content">
          <div className="chapter-section2-card">
            <div
              className={`chapter-section2-body-wrapper${
                !hasImage
                  ? ' chapter-section2-body-wrapper--text-only'
                  : !hasText
                    ? ' chapter-section2-body-wrapper--image-only'
                    : ''
              }`}
              style={hasImage && hasText ? getContentBlockLayoutStyle(block) : undefined}
            >
              <div
                className={`chapter-section2-text-column${hasText ? '' : ' chapter-section2-text-column--hidden'}`}
              >
                {block.text.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>

              {hasImage && (
                <div className="chapter-section2-image-column">
                  <img src={resolveAssetSrc(block.image!)} alt="Section Illustration" className="chapter-section2-image" />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

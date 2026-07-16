import type { ContentBlock } from '../../types/course'
import { resolveAssetSrc } from '../../utils/assets'
import { getContentBlockLayoutStyle } from '../chapters/contentBlockLayout'
import '../chapters/ContentSectionPage.css'
import './ContentBlockPreviewModal.css'

interface ContentBlockPreviewModalProps {
  block: ContentBlock
  onClose: () => void
}

export function ContentBlockPreviewModal({ block, onClose }: ContentBlockPreviewModalProps) {
  const hasText = Boolean(block.text?.trim())
  const hasImage = Boolean(block.image)

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="preview-modal-header">
          <h2 className="preview-modal-title">Student View Preview</h2>
          <button type="button" className="btn secondary small" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="preview-modal-frame">
          <main className="chapter-section2-main preview-modal-main">
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
      </div>
    </div>
  )
}

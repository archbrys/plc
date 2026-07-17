import type { MediaPageConfig } from '../../types/course'
import { resolveAssetSrc } from '../../utils/assets'
import './MediaPage.css'

interface MediaPageProps {
  config: MediaPageConfig
  onNext?: () => void
}

export function MediaPage({ config, onNext }: MediaPageProps) {
  const { mediaType, url, description } = config
  const src = resolveAssetSrc(url)

  return (
    <main className="media-page-content">
      <div className="media-page-container">
        {description ? <p className="muted">{description}</p> : null}

        {mediaType === 'video' ? (
          <video className="media-page-video" src={src} controls />
        ) : (
          <>
            <iframe className="media-page-file" src={src} title="Media file" />
            <a className="media-page-file-link" href={src} target="_blank" rel="noreferrer">
              Download / open in new tab
            </a>
          </>
        )}
      </div>

      <div className="media-page-actions">
        <button className="btn small ready-btn" type="button" onClick={onNext}>
          Next
        </button>
      </div>
    </main>
  )
}

import type { MediaPageConfig } from '../../types/course'
import { resolveAssetSrc } from '../../utils/assets'
import './MediaPage.css'

interface MediaPageProps {
  config: MediaPageConfig
  onNext?: () => void
}

export function MediaPage({ config, onNext }: MediaPageProps) {
  const { title, mediaType, url, description } = config
  const src = resolveAssetSrc(url)

  return (
    <main className="media-page-content">
      <div className="media-page-container">
        <h2 className="media-page-title">{title}</h2>
        {description ? <p className="muted">{description}</p> : null}

        {mediaType === 'video' ? (
          <video className="media-page-video" src={src} controls />
        ) : (
          <a className="btn large" href={src} target="_blank" rel="noreferrer">
            Open File
          </a>
        )}
      </div>

      <div className="media-page-actions">
        <button className="btn large ready-btn" type="button" onClick={onNext}>
          Next
        </button>
      </div>
    </main>
  )
}

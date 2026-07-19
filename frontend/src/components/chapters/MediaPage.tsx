import type { MediaPageConfig } from '../../types/course'
import { resolveAssetSrc, resolveVideoEmbed } from '../../utils/assets'
import './MediaPage.css'

interface MediaPageProps {
  config: MediaPageConfig
  onNext?: () => void
  onPrevious?: () => void
}

export function MediaPage({ config, onNext, onPrevious }: MediaPageProps) {
  const { mediaType, url, description } = config
  const src = resolveAssetSrc(url)
  const videoEmbed = mediaType === 'video' ? resolveVideoEmbed(url) : null

  return (
    <main className="media-page-content">
      <div className="media-page-container">
        {description ? <p className="muted">{description}</p> : null}

        {videoEmbed ? (
          videoEmbed.kind === 'iframe' ? (
            <iframe
              className="media-page-video-frame"
              src={videoEmbed.src}
              title="Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video className="media-page-video" src={videoEmbed.src} controls />
          )
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
        <button className="btn-nav btn-previous" type="button" onClick={onPrevious}>
          Previous
        </button>
        <button className="btn large ready-btn" type="button" onClick={onNext}>
          Next
        </button>
      </div>
    </main>
  )
}

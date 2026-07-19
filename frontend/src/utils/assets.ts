export function resolveAssetSrc(path: string): string {
  if (/^https?:\/\//.test(path) || path.startsWith('/')) return path
  return `/assets/${path}`
}

export interface VideoEmbedInfo {
  kind: 'iframe' | 'video'
  src: string
}

// Recognizes common video hosting links (YouTube, Vimeo) and converts them to
// embeddable player URLs; anything else is treated as a direct media file/URL.
export function resolveVideoEmbed(url: string): VideoEmbedInfo {
  const trimmed = url.trim()

  const youtubeMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/,
  )
  if (youtubeMatch) {
    return { kind: 'iframe', src: `https://www.youtube.com/embed/${youtubeMatch[1]}` }
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) {
    return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeoMatch[1]}` }
  }

  return { kind: 'video', src: resolveAssetSrc(trimmed) }
}

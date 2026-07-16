import type { CSSProperties } from 'react'
import type { ContentBlock, ImagePosition } from '../../types/course'

const DIRECTION_BY_POSITION: Record<ImagePosition, string> = {
  right: 'row',
  left: 'row-reverse',
  bottom: 'column',
  top: 'column-reverse',
}

export function getContentBlockLayoutStyle(block: Pick<ContentBlock, 'imagePosition' | 'textPercent'>): CSSProperties {
  const imagePosition = block.imagePosition ?? 'right'
  const textPercent = block.textPercent ?? 65

  return {
    '--section-direction': DIRECTION_BY_POSITION[imagePosition],
    '--section-text-basis': `${textPercent}%`,
    '--section-image-basis': `${100 - textPercent}%`,
  } as CSSProperties
}

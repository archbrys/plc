import type { ReactNode } from 'react'
import { StudentMenu } from '../student/StudentMenu'
import './ChapterHeader.css'

interface ChapterHeaderProps {
  chapterTitle: string
  sectionTitle?: string
  actions?: ReactNode
}

export function ChapterHeader({ chapterTitle, sectionTitle, actions }: ChapterHeaderProps) {
  return (
    <header className="chapter-flow-header">
      <div className="chapter-flow-header-start">
        <img src="/assets/book.jpg" alt="" className="chapter-flow-header-logo" />
        <div className="chapter-flow-header-titles">
          <h1 className="chapter-flow-header-chapter">{chapterTitle}</h1>
          {sectionTitle && <p className="chapter-flow-header-section">{sectionTitle}</p>}
        </div>
      </div>
      <div className="chapter-flow-header-end">
        {actions}
        <StudentMenu />
      </div>
    </header>
  )
}

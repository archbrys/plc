import { useAuth } from '../../hooks/useAuth'
import './ChapterHeader.css'

interface ChapterHeaderProps {
  chapterTitle: string
  sectionTitle?: string
}

export function ChapterHeader({ chapterTitle, sectionTitle }: ChapterHeaderProps) {
  const { logout } = useAuth()

  return (
    <header className="chapter-flow-header">
      <div className="chapter-flow-header-titles">
        <h1 className="chapter-flow-header-chapter">{chapterTitle}</h1>
        {sectionTitle && <p className="chapter-flow-header-section">{sectionTitle}</p>}
      </div>
      <button className="btn secondary chapter-flow-header-logout" type="button" onClick={logout}>
        Logout
      </button>
    </header>
  )
}

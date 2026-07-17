import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getCourse } from '../../data/course'
import type { CourseChapter } from '../../types/course'
import { ChapterFlowRenderer } from '../../components/chapters/ChapterFlowRenderer'

export function DynamicChapterPage() {
  const { logout } = useAuth()
  const { chapterId } = useParams()
  const navigate = useNavigate()

  const parsedChapterId = Number(chapterId)
  const [chapter, setChapter] = useState<CourseChapter | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  useEffect(() => {
    getCourse()
      .then((loadedCourse) => {
        const foundChapter = Number.isInteger(parsedChapterId)
          ? loadedCourse.chapters.find((ch) => ch.id === parsedChapterId)
          : undefined
        setChapter(foundChapter)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [parsedChapterId])

  if (isLoading) {
    return <div className="landing-page">Loading chapter...</div>
  }

  if (!chapter || chapter.pages.length === 0) {
    return (
      <div className="landing-page">
        <header className="landing-header">
          <div className="header-actions">
            <button className="btn small" type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </header>
        <main className="plc-intro-content">
          <p className="error-message">
            {chapter ? 'This chapter has no content yet.' : 'Chapter not found.'}
          </p>
        </main>
      </div>
    )
  }

  const pages = [...chapter.pages].sort((a, b) => a.orderNumber - b.orderNumber)
  const currentPage = pages[currentPageIndex]

  const handleNext = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
    } else {
      navigate('/student/chapters')
    }
  }

  const handleComplete = () => {
    // For auto-complete pages like slideshows
    handleNext()
  }

  if (!currentPage) {
    return (
      <div className="landing-page">
        <header className="landing-header">
          <div className="header-actions">
            <button className="btn small" type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </header>
        <main className="plc-intro-content">
          <p className="error-message">Page not found</p>
        </main>
      </div>
    )
  }

  return (
    <ChapterFlowRenderer
      chapterTitle={chapter.title}
      page={currentPage}
      onComplete={handleComplete}
      onNext={handleNext}
    />
  )
}

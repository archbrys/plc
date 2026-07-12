import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getCourse } from '../../data/course'
import type { CourseChapter } from '../../types/course'
import { ChapterFlowRenderer } from '../../components/chapters/ChapterFlowRenderer'

export function DynamicChapterPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { chapterId } = useParams()

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

  // Redirect to simple chapter view if no pages array
  if (!chapter || !chapter.pages || chapter.pages.length === 0) {
    return <Navigate to={`/student/chapters/${chapterId}`} replace />
  }

  const pages = [...chapter.pages].sort((a, b) => a.orderNumber - b.orderNumber)
  const currentPage = pages[currentPageIndex]

  const handleNext = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
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
            <button className="btn secondary" type="button" onClick={() => navigate('/student/chapters')}>
              Back to Chapters
            </button>
            <button className="btn" type="button" onClick={logout}>
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
      page={currentPage}
      onComplete={handleComplete}
      onNext={handleNext}
      onBack={currentPageIndex > 0 ? handleBack : undefined}
    />
  )
}

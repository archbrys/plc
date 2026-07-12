import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getCourse } from '../../data/course'
import type { Course, CourseChapter } from '../../types/course'
import './CourseContentPage.css'

export function CourseChapterPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { chapterId } = useParams()

  const parsedChapterId = Number(chapterId)
  const [course, setCourse] = useState<Course | null>(null)
  const [chapter, setChapter] = useState<CourseChapter | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getCourse()
      .then((loadedCourse) => {
        setCourse(loadedCourse)
        const foundChapter = Number.isInteger(parsedChapterId)
          ? loadedCourse.chapters.find((courseChapter) => courseChapter.id === parsedChapterId)
          : undefined
        setChapter(foundChapter)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [parsedChapterId])

  if (isLoading) {
    return <div className="course-page">Loading chapter...</div>
  }

  // Redirect to flow page if chapter has pages
  if (chapter?.pages && chapter.pages.length > 0) {
    return <Navigate to={`/student/chapters/${parsedChapterId}/flow`} replace />
  }

  if (!chapter) {
    return (
      <div className="course-page">
        <header className="course-header">
          <div className="header-actions">
            <button className="btn secondary" type="button" onClick={() => navigate('/student/chapters')}>
              Back
            </button>
            <button className="btn" type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        <main className="course-main">
          <div className="course-card">
            <h1 className="course-title">Chapter not found</h1>
            <p className="course-subtitle">The chapter you selected does not exist.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="course-page">
      <header className="course-header">
        <div className="header-actions">
          <button className="btn secondary" type="button" onClick={() => navigate('/student/chapters')}>
            Back
          </button>
          <button className="btn" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="course-main">
        <div className="course-card">
          <p className="course-kicker">Chapter {chapter.id}</p>
          <h1 className="course-title">{chapter.title}</h1>
          <p className="course-subtitle">Select a section to begin learning.</p>

          <div className="course-grid">
            {chapter.sections.map((section) => (
              <button
                key={section.id}
                className="chapter-btn"
                type="button"
                onClick={() => navigate(`/student/chapters/${chapter.id}/sections/${section.id}`)}
              >
                Section {section.id}: {section.title}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
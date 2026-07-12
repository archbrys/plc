import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getCourse } from '../../data/course'
import type { Course, CourseChapter, CourseSection } from '../../types/course'
import './CourseContentPage.css'

export function CourseSectionPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { chapterId, sectionId } = useParams()

  const parsedChapterId = Number(chapterId)
  const parsedSectionId = Number(sectionId)

  const [course, setCourse] = useState<Course | null>(null)
  const [chapter, setChapter] = useState<CourseChapter | undefined>(undefined)
  const [section, setSection] = useState<CourseSection | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getCourse()
      .then((loadedCourse) => {
        setCourse(loadedCourse)
        const foundChapter = Number.isInteger(parsedChapterId)
          ? loadedCourse.chapters.find((courseChapter) => courseChapter.id === parsedChapterId)
          : undefined
        setChapter(foundChapter)
        const foundSection =
          foundChapter && Number.isInteger(parsedSectionId)
            ? foundChapter.sections.find((chapterSection) => chapterSection.id === parsedSectionId)
            : undefined
        setSection(foundSection)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [parsedChapterId, parsedSectionId])

  if (isLoading || !course) {
    return <div className="course-page">Loading section...</div>
  }

  const currentChapterIndex = chapter
    ? course.chapters.findIndex((courseChapter) => courseChapter.id === chapter.id)
    : -1
  const currentSectionIndex = chapter && section
    ? chapter.sections.findIndex((chapterSection) => chapterSection.id === section.id)
    : -1

  const nextSection =
    chapter && currentSectionIndex >= 0 ? chapter.sections[currentSectionIndex + 1] : undefined
  const nextChapter =
    currentChapterIndex >= 0 ? course.chapters[currentChapterIndex + 1] : undefined

  const handleNext = () => {
    if (chapter && nextSection) {
      navigate(`/student/chapters/${chapter.id}/sections/${nextSection.id}`)
      return
    }

    if (nextChapter) {
      navigate(`/student/chapters/${nextChapter.id}`)
      return
    }

    navigate('/student/chapters')
  }

  if (!chapter || !section) {
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
            <h1 className="course-title">Section not found</h1>
            <p className="course-subtitle">The chapter or section you selected does not exist.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="course-page">
      <header className="course-header">
        <div className="header-actions">
          <button className="btn secondary" type="button" onClick={() => navigate(`/student/chapters/${chapter.id}`)}>
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
          <p className="course-subtitle">
            Section {section.id}: {section.title}
          </p>

          <div className="content-stack">
            {section.contents.map((contentItem) => (
              <article key={contentItem.id} className="content-card">
                <h2>{contentItem.title}</h2>
                <p>{contentItem.text}</p>
                {contentItem.image ? (
                  <img
                    className="content-image"
                    src={contentItem.image}
                    alt={contentItem.title}
                    loading="lazy"
                  />
                ) : null}
              </article>
            ))}
          </div>

          <div className="course-actions">
            <button className="btn large ready-btn" type="button" onClick={handleNext}>
              {nextSection ? 'Next Section' : nextChapter ? 'Next Chapter' : 'Back to Chapters'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
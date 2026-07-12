import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../../components/common/AppShell'
import { courseApiService } from '../../services/courseApiService'
import { invalidateCourseCache } from '../../data/course'
import type { Course } from '../../types/course'

export function AdminCourseContentPage() {
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newChapterTitle, setNewChapterTitle] = useState('')
  const [error, setError] = useState('')

  const load = () => {
    courseApiService
      .getCourse()
      .then(setCourse)
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load course.'))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const chapters = course ? [...course.chapters].sort((a, b) => a.orderNumber - b.orderNumber) : []

  const handleAddChapter = async () => {
    const title = newChapterTitle.trim()
    if (!title) return

    try {
      await courseApiService.createChapter(title)
      invalidateCourseCache()
      setNewChapterTitle('')
      setError('')
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create chapter.')
    }
  }

  const handleDeleteChapter = async (chapterId: number) => {
    if (!window.confirm('Delete this chapter and all its pages?')) return

    try {
      await courseApiService.deleteChapter(chapterId)
      invalidateCourseCache()
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete chapter.')
    }
  }

  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= chapters.length) return

    const reordered = [...chapters]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(targetIndex, 0, moved)

    try {
      await courseApiService.reorderChapters(reordered.map((chapter) => chapter.id))
      invalidateCourseCache()
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reorder chapters.')
    }
  }

  return (
    <AppShell
      title="Course Content"
      subtitle="Create chapters and manage their pages."
      links={[
        { label: 'Dashboard', to: '/admin/dashboard' },
        { label: 'Question Sets', to: '/admin/question-sets' },
      ]}
    >
      <div className="stack">
        {error ? <p className="error-text">{error}</p> : null}

        <article className="card stack">
          <h2>Create New Chapter</h2>
          <div className="grid-two">
            <label className="field">
              <span>Chapter Title</span>
              <input
                value={newChapterTitle}
                onChange={(event) => setNewChapterTitle(event.target.value)}
                placeholder="Enter chapter title"
              />
            </label>
          </div>

          <div className="header-actions wrap">
            <button className="btn" type="button" onClick={handleAddChapter}>
              Add Chapter
            </button>
          </div>
        </article>

        {isLoading ? (
          <p className="muted">Loading...</p>
        ) : (
          chapters.map((chapter, index) => (
            <article className="card" key={chapter.id}>
              <div className="row-between" style={{ alignItems: 'center' }}>
                <div>
                  <p className="muted">Chapter {chapter.orderNumber}</p>
                  <h2>{chapter.title}</h2>
                  <p className="muted">{chapter.pages.length} pages</p>
                </div>

                <div className="header-actions wrap">
                  <button
                    className="btn secondary small"
                    type="button"
                    onClick={() => handleMove(index, -1)}
                    disabled={index === 0}
                  >
                    Move Up
                  </button>
                  <button
                    className="btn secondary small"
                    type="button"
                    onClick={() => handleMove(index, 1)}
                    disabled={index === chapters.length - 1}
                  >
                    Move Down
                  </button>
                  <Link className="btn secondary" to={`/admin/course-content/${chapter.id}`}>
                    Edit Pages
                  </Link>
                  <button className="btn danger" type="button" onClick={() => handleDeleteChapter(chapter.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </AppShell>
  )
}

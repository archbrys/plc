import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { courseApiService } from '../../services/courseApiService'
import { homeButtonApiService } from '../../services/homeButtonApiService'
import { invalidateCourseCache } from '../../data/course'
import type { Course, CourseChapter } from '../../types/course'

export function AdminCourseContentPage() {
  const [course, setCourse] = useState<Course | null>(null)
  const [linkedChapterIds, setLinkedChapterIds] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [newChapterTitle, setNewChapterTitle] = useState('')
  const [error, setError] = useState('')
  const [pendingDeleteChapter, setPendingDeleteChapter] = useState<CourseChapter | null>(null)

  const load = () => {
    Promise.all([courseApiService.getCourse(), homeButtonApiService.getHomeButtons()])
      .then(([courseData, homeButtons]) => {
        setCourse(courseData)
        setLinkedChapterIds(
          new Set(
            homeButtons
              .filter((button) => button.targetType === 'CHAPTER' && button.chapterId !== null)
              .map((button) => button.chapterId as number),
          ),
        )
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load course.'))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const chapters = course ? [...course.chapters].sort((a, b) => a.orderNumber - b.orderNumber) : []

  let trueChapterCount = 0
  const chapterDisplayNumbers = new Map<number, number>()
  for (const chapter of chapters) {
    if (linkedChapterIds.has(chapter.id)) continue
    trueChapterCount += 1
    chapterDisplayNumbers.set(chapter.id, trueChapterCount)
  }

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

  const handleConfirmDeleteChapter = async () => {
    if (!pendingDeleteChapter) return

    try {
      await courseApiService.deleteChapter(pendingDeleteChapter.id)
      invalidateCourseCache()
      setError('')
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete chapter.')
    } finally {
      setPendingDeleteChapter(null)
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
    <AdminLayout title="Course Content" subtitle="Create chapters and manage their pages.">
      {error ? <p className="error-text">{error}</p> : null}

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Create New Chapter</h2>
        </div>
        <div className="admin-panel-body">
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

          <div className="header-actions wrap" style={{ marginTop: '1rem' }}>
            <button className="btn small" type="button" onClick={handleAddChapter}>
              Add Chapter
            </button>
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th className="col-numeric">Pages</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((chapter, index) => (
                <tr key={chapter.id}>
                  <td>
                    <span className="admin-cell-index">{chapterDisplayNumbers.get(chapter.id) ?? ''}</span>
                  </td>
                  <td>
                    <div className="admin-table-title">{chapter.title}</div>
                  </td>
                  <td className="col-numeric">{chapter.pages.length}</td>
                  <td className="col-actions">
                    <div className="admin-table-actions">
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
                      <Link className="btn secondary small" to={`/admin/course-content/${chapter.id}`}>
                        Edit Pages
                      </Link>
                      <button
                        className="btn danger small"
                        type="button"
                        onClick={() => setPendingDeleteChapter(chapter)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading ? (
            <p className="admin-empty-state">Loading...</p>
          ) : chapters.length === 0 ? (
            <p className="admin-empty-state">No chapters yet.</p>
          ) : null}
        </div>
      </div>

      {pendingDeleteChapter ? (
        <ConfirmModal
          title="Delete chapter"
          message={`Delete "${pendingDeleteChapter.title}" and all its pages? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDeleteChapter}
          onCancel={() => setPendingDeleteChapter(null)}
        />
      ) : null}
    </AdminLayout>
  )
}

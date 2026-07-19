import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { courseApiService } from '../../services/courseApiService'
import { homeButtonApiService, type UpsertHomeButtonPayload } from '../../services/homeButtonApiService'
import { useToast } from '../../hooks/useToast'
import type { CourseChapter } from '../../types/course'
import type { HomeButton, HomeButtonTargetType } from '../../types/homeButton'

interface FormState {
  label: string
  targetType: HomeButtonTargetType
  chapterId: string
  route: string
  isActive: boolean
}

const EMPTY_FORM: FormState = {
  label: '',
  targetType: 'CHAPTER',
  chapterId: '',
  route: '',
  isActive: true,
}

function targetLabel(button: HomeButton, chapters: CourseChapter[]): string {
  if (button.targetType === 'CHAPTER') {
    const chapter = chapters.find((ch) => ch.id === button.chapterId)
    return chapter ? `Chapter: ${chapter.title}` : `Chapter #${button.chapterId} (missing)`
  }
  return `Route: ${button.route}`
}

export function AdminHomeButtonsPage() {
  const { showToast } = useToast()
  const [buttons, setButtons] = useState<HomeButton[]>([])
  const [chapters, setChapters] = useState<CourseChapter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [pendingDeleteButton, setPendingDeleteButton] = useState<HomeButton | null>(null)

  const load = () => {
    Promise.all([homeButtonApiService.getHomeButtons(), courseApiService.getCourse()])
      .then(([loadedButtons, course]) => {
        setButtons([...loadedButtons].sort((a, b) => a.orderNumber - b.orderNumber))
        setChapters([...course.chapters].sort((a, b) => a.orderNumber - b.orderNumber))
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load home buttons.'))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
  }

  const handleEdit = (button: HomeButton) => {
    setEditingId(button.id)
    setForm({
      label: button.label,
      targetType: button.targetType,
      chapterId: button.chapterId !== null ? String(button.chapterId) : '',
      route: button.route ?? '',
      isActive: button.isActive,
    })
  }

  const buildPayload = (): UpsertHomeButtonPayload | null => {
    const label = form.label.trim()
    if (!label) return null

    if (form.targetType === 'CHAPTER') {
      const chapterId = Number.parseInt(form.chapterId, 10)
      if (!Number.isInteger(chapterId)) return null
      return { label, targetType: 'CHAPTER', chapterId, isActive: form.isActive }
    }

    const route = form.route.trim()
    if (!route) return null
    return { label, targetType: 'ROUTE', route, isActive: form.isActive }
  }

  const handleSubmit = async () => {
    const payload = buildPayload()
    if (!payload) {
      setError('Select a chapter or enter a route before saving.')
      return
    }

    const wasEditing = editingId !== null

    try {
      if (wasEditing) {
        await homeButtonApiService.updateHomeButton(editingId as number, payload)
      } else {
        await homeButtonApiService.createHomeButton(payload)
      }
      setError('')
      resetForm()
      load()
      showToast(wasEditing ? 'Home button saved.' : 'Home button added.', 'success')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to save home button.'
      setError(message)
      showToast(message, 'error')
    }
  }

  const handleConfirmDelete = async () => {
    if (!pendingDeleteButton) return

    try {
      await homeButtonApiService.deleteHomeButton(pendingDeleteButton.id)
      setError('')
      if (editingId === pendingDeleteButton.id) resetForm()
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete home button.')
    } finally {
      setPendingDeleteButton(null)
    }
  }

  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= buttons.length) return

    const reordered = [...buttons]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(targetIndex, 0, moved)

    try {
      await homeButtonApiService.reorderHomeButtons(reordered.map((button) => button.id))
      setError('')
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reorder home buttons.')
    }
  }

  return (
    <AdminLayout title="Home Buttons" subtitle="Manage the buttons students see after logging in.">
      {error ? <p className="error-text">{error}</p> : null}

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>{editingId !== null ? 'Edit Home Button' : 'Create Home Button'}</h2>
        </div>
        <div className="admin-panel-body stack">
          <div className="grid-two">
            <label className="field">
              <span>Label</span>
              <input value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} />
            </label>
            <label className="field">
              <span>Target Type</span>
              <select
                value={form.targetType}
                onChange={(event) => setForm({ ...form, targetType: event.target.value as HomeButtonTargetType })}
              >
                <option value="CHAPTER">Chapter</option>
                <option value="ROUTE">Route</option>
              </select>
            </label>
          </div>

          {form.targetType === 'CHAPTER' ? (
            <label className="field">
              <span>Chapter</span>
              <select value={form.chapterId} onChange={(event) => setForm({ ...form, chapterId: event.target.value })}>
                <option value="">Select a chapter...</option>
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="field">
              <span>Route (must start with /)</span>
              <input
                value={form.route}
                placeholder="/student/plc-intro"
                onChange={(event) => setForm({ ...form, route: event.target.value })}
              />
            </label>
          )}

          <label className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
            />
            <span>Active (visible to students)</span>
          </label>

          <div className="header-actions wrap">
            <button className="btn" type="button" onClick={handleSubmit}>
              {editingId !== null ? 'Save Changes' : 'Add Home Button'}
            </button>
            {editingId !== null ? (
              <button className="btn secondary" type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Label</th>
                <th>Target</th>
                <th>Active</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buttons.map((button, index) => (
                <tr key={button.id}>
                  <td>
                    <span className="admin-cell-index">{button.orderNumber}</span>
                  </td>
                  <td>
                    <div className="admin-table-title">{button.label}</div>
                  </td>
                  <td>{targetLabel(button, chapters)}</td>
                  <td>{button.isActive ? 'Yes' : 'No'}</td>
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
                        disabled={index === buttons.length - 1}
                      >
                        Move Down
                      </button>
                      <button className="btn secondary small" type="button" onClick={() => handleEdit(button)}>
                        Edit
                      </button>
                      <button
                        className="btn danger small"
                        type="button"
                        onClick={() => setPendingDeleteButton(button)}
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
          ) : buttons.length === 0 ? (
            <p className="admin-empty-state">No home buttons yet.</p>
          ) : null}
        </div>
      </div>

      {pendingDeleteButton ? (
        <ConfirmModal
          title="Delete home button"
          message={`Delete "${pendingDeleteButton.label}"? This does not delete any linked chapter.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDeleteButton(null)}
        />
      ) : null}
    </AdminLayout>
  )
}

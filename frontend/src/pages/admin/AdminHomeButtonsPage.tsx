import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { courseApiService } from '../../services/courseApiService'
import { homeButtonApiService, type UpsertHomeButtonPayload } from '../../services/homeButtonApiService'
import { questionSetService } from '../../services/questionSetService'
import { useToast } from '../../hooks/useToast'
import type { CourseChapter } from '../../types/course'
import type { HomeButton, HomeButtonTargetType } from '../../types/homeButton'
import type { QuestionSet } from '../../types/quiz'
import { CHAPTER_GROUPS, chapterGroupLabel } from '../../constants/chapterGroups'

interface FormState {
  label: string
  targetType: HomeButtonTargetType
  chapterId: string
  route: string
  isGroupSelection: boolean
  chapterGroup: string
  isActive: boolean
  requiredQuestionSetIds: string[]
}

const EMPTY_FORM: FormState = {
  label: '',
  targetType: 'CHAPTER',
  chapterId: '',
  route: '',
  isGroupSelection: false,
  chapterGroup: '',
  isActive: true,
  requiredQuestionSetIds: [],
}

function targetLabel(button: HomeButton, chapters: CourseChapter[]): string {
  if (button.targetType === 'CHAPTER') {
    const chapter = chapters.find((ch) => ch.id === button.chapterId)
    return chapter ? `Chapter: ${chapter.title}` : `Chapter #${button.chapterId} (missing)`
  }
  if (button.targetType === 'GROUP') {
    return `Group: ${chapterGroupLabel(button.chapterGroup ?? '')}`
  }
  return `Route: ${button.route}`
}

export function AdminHomeButtonsPage() {
  const { showToast } = useToast()
  const [buttons, setButtons] = useState<HomeButton[]>([])
  const [chapters, setChapters] = useState<CourseChapter[]>([])
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [pendingDeleteButton, setPendingDeleteButton] = useState<HomeButton | null>(null)

  const load = () => {
    Promise.all([homeButtonApiService.getHomeButtons(), courseApiService.getCourse(), questionSetService.listAll()])
      .then(([loadedButtons, course, loadedQuestionSets]) => {
        setButtons([...loadedButtons].sort((a, b) => a.orderNumber - b.orderNumber))
        setChapters([...course.chapters].sort((a, b) => a.orderNumber - b.orderNumber))
        setQuestionSets([...loadedQuestionSets].sort((a, b) => a.title.localeCompare(b.title)))
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
      targetType: button.targetType === 'GROUP' ? 'CHAPTER' : button.targetType,
      chapterId: button.chapterId !== null ? String(button.chapterId) : '',
      route: button.route ?? '',
      isGroupSelection: button.targetType === 'GROUP',
      chapterGroup: button.chapterGroup ?? '',
      isActive: button.isActive,
      requiredQuestionSetIds: button.requiredQuestionSetIds,
    })
  }

  const toggleRequiredQuestionSet = (questionSetId: string) => {
    setForm((prev) => ({
      ...prev,
      requiredQuestionSetIds: prev.requiredQuestionSetIds.includes(questionSetId)
        ? prev.requiredQuestionSetIds.filter((id) => id !== questionSetId)
        : [...prev.requiredQuestionSetIds, questionSetId],
    }))
  }

  const selectAllRequiredQuestionSets = () => {
    setForm((prev) => ({ ...prev, requiredQuestionSetIds: questionSets.map((qs) => qs.id) }))
  }

  const clearRequiredQuestionSets = () => {
    setForm((prev) => ({ ...prev, requiredQuestionSetIds: [] }))
  }

  const buildPayload = (): UpsertHomeButtonPayload | null => {
    const label = form.label.trim()
    if (!label) return null

    if (form.isGroupSelection) {
      if (!form.chapterGroup) return null
      return {
        label,
        targetType: 'GROUP',
        chapterGroup: form.chapterGroup,
        isActive: form.isActive,
        requiredQuestionSetIds: form.requiredQuestionSetIds,
      }
    }

    if (form.targetType === 'CHAPTER') {
      const chapterId = Number.parseInt(form.chapterId, 10)
      if (!Number.isInteger(chapterId)) return null
      return {
        label,
        targetType: 'CHAPTER',
        chapterId,
        isActive: form.isActive,
        requiredQuestionSetIds: form.requiredQuestionSetIds,
      }
    }

    const route = form.route.trim()
    if (!route) return null
    return {
      label,
      targetType: 'ROUTE',
      route,
      isActive: form.isActive,
      requiredQuestionSetIds: form.requiredQuestionSetIds,
    }
  }

  const handleSubmit = async () => {
    const payload = buildPayload()
    if (!payload) {
      setError('Select a chapter, enter a route, or choose a chapter group before saving.')
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
                disabled={form.isGroupSelection}
                onChange={(event) => setForm({ ...form, targetType: event.target.value as HomeButtonTargetType })}
              >
                <option value="CHAPTER">Chapter</option>
                <option value="ROUTE">Route</option>
              </select>
            </label>
          </div>

          <label className={`admin-checkbox-item standalone${form.isGroupSelection ? ' checked' : ''}`}>
            <input
              type="checkbox"
              checked={form.isGroupSelection}
              onChange={(event) => setForm({ ...form, isGroupSelection: event.target.checked })}
            />
            <span>Show a selection list by chapter group (instead of one chapter or route)</span>
          </label>

          {form.isGroupSelection ? (
            <label className="field">
              <span>Chapter Group</span>
              <select
                value={form.chapterGroup}
                onChange={(event) => setForm({ ...form, chapterGroup: event.target.value })}
              >
                <option value="">Select a group...</option>
                {CHAPTER_GROUPS.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
            </label>
          ) : form.targetType === 'CHAPTER' ? (
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

          <label className={`admin-checkbox-item standalone${form.isActive ? ' checked' : ''}`}>
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
            />
            <span>Active (visible to students)</span>
          </label>

          <div className="field">
            <div className="admin-checkbox-group-header">
              <span>Require these quizzes completed before this button is enabled</span>
              {questionSets.length > 0 ? (
                <span className="admin-checkbox-count">
                  {form.requiredQuestionSetIds.length} of {questionSets.length} selected ·{' '}
                  <button
                    className="btn-link"
                    type="button"
                    onClick={selectAllRequiredQuestionSets}
                    disabled={form.requiredQuestionSetIds.length === questionSets.length}
                  >
                    Select all
                  </button>{' '}
                  ·{' '}
                  <button
                    className="btn-link"
                    type="button"
                    onClick={clearRequiredQuestionSets}
                    disabled={form.requiredQuestionSetIds.length === 0}
                  >
                    Clear
                  </button>
                </span>
              ) : null}
            </div>
            {questionSets.length === 0 ? (
              <p className="admin-empty-state">No question sets yet.</p>
            ) : (
              <div className="admin-checkbox-list">
                {questionSets.map((questionSet) => {
                  const checked = form.requiredQuestionSetIds.includes(questionSet.id)
                  return (
                    <label key={questionSet.id} className={`admin-checkbox-item${checked ? ' checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRequiredQuestionSet(questionSet.id)}
                      />
                      <span>{questionSet.title}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>

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
                <th>Requires</th>
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
                  <td>
                    {button.requiredQuestionSetIds.length > 0
                      ? `${button.requiredQuestionSetIds.length} quiz${button.requiredQuestionSetIds.length === 1 ? '' : 'zes'}`
                      : '—'}
                  </td>
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

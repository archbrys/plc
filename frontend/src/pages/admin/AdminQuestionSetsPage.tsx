import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { questionSetService } from '../../services/questionSetService'
import type { QuestionSet, QuestionSetStatus } from '../../types/quiz'

export function AdminQuestionSetsPage() {
  const [sets, setSets] = useState<QuestionSet[]>([])
  const [error, setError] = useState('')
  const [pendingDelete, setPendingDelete] = useState<QuestionSet | null>(null)

  const load = () => {
    questionSetService.listAll().then(setSets)
  }

  useEffect(() => {
    load()
  }, [])

  const handleStatus = async (id: string, status: QuestionSetStatus) => {
    const response = await questionSetService.setStatus(id, status)
    if (!response.ok) {
      setError((response.errors ?? ['Unable to update status.']).join(' '))
      return
    }
    setError('')
    load()
  }

  const handleArchive = async (id: string) => {
    await questionSetService.archive(id)
    load()
  }

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return

    try {
      await questionSetService.remove(pendingDelete.id)
      setError('')
      load()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete question set.')
    } finally {
      setPendingDelete(null)
    }
  }

  return (
    <AdminLayout
      title="Question Sets"
      subtitle="Create, publish, and manage quiz question sets."
      actions={
        <Link className="btn" to="/admin/question-sets/create">
          Create Question Set
        </Link>
      }
    >
      {error ? <p className="error-text">{error}</p> : null}

      <div className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th className="col-numeric">Questions</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sets.map((set) => (
                <tr key={set.id}>
                  <td>
                    <div className="admin-table-title">{set.title}</div>
                    {set.description ? <div className="admin-table-desc">{set.description}</div> : null}
                  </td>
                  <td>
                    <span className={`admin-badge status-${set.status}`}>{set.status}</span>
                  </td>
                  <td className="col-numeric">{set.questions.length}</td>
                  <td className="col-actions">
                    <div className="admin-table-actions">
                      <Link className="btn secondary small" to={`/admin/question-sets/${set.id}/edit`}>
                        Edit
                      </Link>
                      <button className="btn secondary small" type="button" onClick={() => handleStatus(set.id, 'draft')}>
                        Draft
                      </button>
                      <button
                        className="btn secondary small"
                        type="button"
                        onClick={() => handleStatus(set.id, 'published')}
                      >
                        Publish
                      </button>
                      <button className="btn secondary small" type="button" onClick={() => handleArchive(set.id)}>
                        Archive
                      </button>
                      <button className="btn danger small" type="button" onClick={() => setPendingDelete(set)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sets.length === 0 ? <p className="admin-empty-state">No question sets yet.</p> : null}
        </div>
      </div>

      {pendingDelete ? (
        <ConfirmModal
          title="Delete question set"
          message={`Delete "${pendingDelete.title}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      ) : null}
    </AdminLayout>
  )
}

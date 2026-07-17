import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { resultService } from '../../services/resultService'
import type { QuizResult } from '../../types/quiz'

export function AdminResultsPage() {
  const [results, setResults] = useState<QuizResult[]>([])
  const [error, setError] = useState('')
  const [pendingDelete, setPendingDelete] = useState<QuizResult | null>(null)

  const load = () => {
    resultService.listAll().then(setResults)
  }

  useEffect(() => {
    load()
  }, [])

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return

    try {
      await resultService.remove(pendingDelete.id)
      setError('')
      load()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete result.')
    } finally {
      setPendingDelete(null)
    }
  }

  return (
    <AdminLayout title="Student Results" subtitle="Scores submitted by students across all question sets.">
      {error ? <p className="error-text">{error}</p> : null}

      <div className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Question Set</th>
                <th className="col-numeric">Score</th>
                <th>Submitted</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id}>
                  <td>
                    <div className="admin-table-title">{result.studentName}</div>
                    <div className="admin-table-desc">{result.studentId}</div>
                  </td>
                  <td>{result.questionSetTitle}</td>
                  <td className="col-numeric">
                    {result.earnedPoints}/{result.totalPoints}
                  </td>
                  <td>{new Date(result.submittedAt).toLocaleString()}</td>
                  <td className="col-actions">
                    <div className="admin-table-actions">
                      <button className="btn danger small" type="button" onClick={() => setPendingDelete(result)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {results.length === 0 ? <p className="admin-empty-state">No results submitted yet.</p> : null}
        </div>
      </div>

      {pendingDelete ? (
        <ConfirmModal
          title="Delete result"
          message={`Delete ${pendingDelete.studentName}'s submission for "${pendingDelete.questionSetTitle}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      ) : null}
    </AdminLayout>
  )
}

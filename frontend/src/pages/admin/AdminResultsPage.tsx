import { useEffect, useMemo, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { resultService } from '../../services/resultService'
import type { QuizResult } from '../../types/quiz'

interface StudentSummary {
  studentId: string
  studentName: string
  submissionCount: number
  totalEarned: number
  totalPossible: number
  lastSubmittedAt: string
}

export function AdminResultsPage() {
  const [results, setResults] = useState<QuizResult[]>([])
  const [error, setError] = useState('')
  const [pendingDelete, setPendingDelete] = useState<QuizResult | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)

  const load = () => {
    resultService.listAll().then(setResults)
  }

  useEffect(() => {
    load()
  }, [])

  const students = useMemo(() => {
    const byStudent = new Map<string, StudentSummary>()
    for (const result of results) {
      const existing = byStudent.get(result.studentId)
      if (existing) {
        existing.submissionCount += 1
        existing.totalEarned += result.earnedPoints
        existing.totalPossible += result.totalPoints
        if (result.submittedAt > existing.lastSubmittedAt) {
          existing.lastSubmittedAt = result.submittedAt
        }
      } else {
        byStudent.set(result.studentId, {
          studentId: result.studentId,
          studentName: result.studentName,
          submissionCount: 1,
          totalEarned: result.earnedPoints,
          totalPossible: result.totalPoints,
          lastSubmittedAt: result.submittedAt,
        })
      }
    }
    return [...byStudent.values()].sort((a, b) => a.studentName.localeCompare(b.studentName))
  }, [results])

  const selectedStudent = students.find((student) => student.studentId === selectedStudentId) ?? null
  const studentResults = selectedStudentId
    ? results
        .filter((result) => result.studentId === selectedStudentId)
        .sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1))
    : []

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

  if (selectedStudent) {
    return (
      <AdminLayout
        title={selectedStudent.studentName}
        subtitle={`Student ID: ${selectedStudent.studentId}`}
      >
        {error ? <p className="error-text">{error}</p> : null}

        <div className="header-actions wrap" style={{ marginBottom: '1rem' }}>
          <button className="btn secondary" type="button" onClick={() => setSelectedStudentId(null)}>
            Back to All Students
          </button>
        </div>

        <div className="admin-panel">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Question Set</th>
                  <th className="col-numeric">Score</th>
                  <th>Submitted</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentResults.map((result) => (
                  <tr key={result.id}>
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
            {studentResults.length === 0 ? <p className="admin-empty-state">No results submitted yet.</p> : null}
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

  return (
    <AdminLayout title="Student Results" subtitle="Scores submitted by students across all question sets.">
      {error ? <p className="error-text">{error}</p> : null}

      <div className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th className="col-numeric">Quizzes Taken</th>
                <th className="col-numeric">Total Score</th>
                <th>Last Submitted</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.studentId}>
                  <td>
                    <div className="admin-table-title">{student.studentName}</div>
                    <div className="admin-table-desc">{student.studentId}</div>
                  </td>
                  <td className="col-numeric">{student.submissionCount}</td>
                  <td className="col-numeric">
                    {student.totalEarned}/{student.totalPossible}
                  </td>
                  <td>{new Date(student.lastSubmittedAt).toLocaleString()}</td>
                  <td className="col-actions">
                    <div className="admin-table-actions">
                      <button
                        className="btn secondary small"
                        type="button"
                        onClick={() => setSelectedStudentId(student.studentId)}
                      >
                        View Results
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 ? <p className="admin-empty-state">No results submitted yet.</p> : null}
        </div>
      </div>
    </AdminLayout>
  )
}

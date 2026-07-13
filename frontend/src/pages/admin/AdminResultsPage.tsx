import { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { resultService } from '../../services/resultService'
import type { QuizResult } from '../../types/quiz'

export function AdminResultsPage() {
  const [results, setResults] = useState<QuizResult[]>([])

  useEffect(() => {
    resultService.listAll().then(setResults)
  }, [])

  return (
    <AdminLayout title="Student Results" subtitle="Scores submitted by students across all question sets.">
      <div className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Question Set</th>
                <th className="col-numeric">Score</th>
                <th>Submitted</th>
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
                </tr>
              ))}
            </tbody>
          </table>
          {results.length === 0 ? <p className="admin-empty-state">No results submitted yet.</p> : null}
        </div>
      </div>
    </AdminLayout>
  )
}

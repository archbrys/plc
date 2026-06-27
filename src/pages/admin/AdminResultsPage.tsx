import { useEffect, useState } from 'react'
import { AppShell } from '../../components/common/AppShell'
import { resultService } from '../../services/resultService'
import type { QuizResult } from '../../types/quiz'

export function AdminResultsPage() {
  const [results, setResults] = useState<QuizResult[]>([])

  useEffect(() => {
    resultService.listAll().then(setResults)
  }, [])

  return (
    <AppShell
      title="Student Results"
      links={[
        { label: 'Dashboard', to: '/admin/dashboard' },
        { label: 'Question Sets', to: '/admin/question-sets' },
      ]}
    >
      <div className="stack">
        {results.length === 0 ? (
          <p className="muted">No results submitted yet.</p>
        ) : (
          results.map((result) => (
            <article className="card" key={result.id}>
              <h2>{result.questionSetTitle}</h2>
              <p>
                {result.studentName} ({result.studentId})
              </p>
              <p>
                Score: {result.earnedPoints}/{result.totalPoints}
              </p>
              <p className="muted">Submitted: {new Date(result.submittedAt).toLocaleString()}</p>
            </article>
          ))
        )}
      </div>
    </AppShell>
  )
}

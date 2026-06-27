import { useEffect, useState } from 'react'
import { AppShell } from '../../components/common/AppShell'
import { useAuth } from '../../hooks/useAuth'
import { resultService } from '../../services/resultService'
import type { QuizResult } from '../../types/quiz'

export function StudentResultPage() {
  const { user } = useAuth()
  const [latest, setLatest] = useState<QuizResult | null>(null)
  const [history, setHistory] = useState<QuizResult[]>([])

  useEffect(() => {
    if (!user || user.role !== 'student') {
      return
    }

    resultService.listByStudent(user.id).then((results) => {
      setHistory(results)

      const latestId = sessionStorage.getItem('quiz_last_result_id')
      if (latestId) {
        const found = results.find((result) => result.id === latestId)
        setLatest(found ?? results[0] ?? null)
      } else {
        setLatest(results[0] ?? null)
      }
    })
  }, [user])

  return (
    <AppShell title="My Results" links={[{ label: 'Back to Sets', to: '/student/question-sets' }]}>
      <div className="stack">
        {latest ? (
          <section className="card">
            <h2>Latest Submission</h2>
            <p>
              <strong>{latest.questionSetTitle}</strong>
            </p>
            <p>
              Score: {latest.earnedPoints} / {latest.totalPoints}
            </p>
            <p className="muted">Submitted: {new Date(latest.submittedAt).toLocaleString()}</p>
          </section>
        ) : (
          <p className="muted">No submissions yet.</p>
        )}

        {history.length > 0 ? (
          <section className="card">
            <h3>Submission History</h3>
            <div className="stack">
              {history.map((result) => (
                <div key={result.id} className="row-between">
                  <span>{result.questionSetTitle}</span>
                  <span>
                    {result.earnedPoints}/{result.totalPoints}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </AppShell>
  )
}

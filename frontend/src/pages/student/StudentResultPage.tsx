import { useEffect, useState } from 'react'
import { AppShell } from '../../components/common/AppShell'
import { useAuth } from '../../hooks/useAuth'
import { resultService } from '../../services/resultService'
import type { QuizResult } from '../../types/quiz'

type ScoreBand = 'good' | 'mid' | 'low'

function getPercentage(result: QuizResult): number {
  if (result.totalPoints <= 0) {
    return 0
  }
  return Math.round((result.earnedPoints / result.totalPoints) * 100)
}

function getScoreBand(percentage: number): ScoreBand {
  if (percentage >= 80) {
    return 'good'
  }
  if (percentage >= 50) {
    return 'mid'
  }
  return 'low'
}

const BAND_MESSAGE: Record<ScoreBand, string> = {
  good: 'Great job!',
  mid: 'Good effort!',
  low: 'Keep practicing!',
}

const BAND_ICON: Record<ScoreBand, string> = {
  good: '🏆',
  mid: '👍',
  low: '📘',
}

export function StudentResultPage() {
  const { user } = useAuth()
  const [latest, setLatest] = useState<QuizResult | null>(null)
  const [history, setHistory] = useState<QuizResult[]>([])

  useEffect(() => {
    if (!user || user.role !== 'student') {
      return
    }

    resultService.listByStudent(user.id).then((results) => {
      const sorted = [...results].sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
      )
      setHistory(sorted)

      const latestId = sessionStorage.getItem('quiz_last_result_id')
      if (latestId) {
        const found = sorted.find((result) => result.id === latestId)
        setLatest(found ?? sorted[0] ?? null)
      } else {
        setLatest(sorted[0] ?? null)
      }
    })
  }, [user])

  return (
    <AppShell title="My Results" links={[{ label: 'Back to Chapters', to: '/student/chapters' }]}>
      <div className="stack">
        {latest ? (
          (() => {
            const percentage = getPercentage(latest)
            const band = getScoreBand(percentage)
            return (
              <section className={`result-hero band-${band}`}>
                <div className="result-hero-top">
                  <div className={`result-hero-icon band-${band}`}>{BAND_ICON[band]}</div>
                  <div>
                    <p className="result-hero-label muted">Latest Submission</p>
                    <h2 className="result-hero-title">{latest.questionSetTitle}</h2>
                  </div>
                </div>
                <div className="result-hero-score">
                  <span className="result-hero-score-value">
                    {latest.earnedPoints} / {latest.totalPoints}
                  </span>
                  <span className={`score-pill band-${band}`}>{percentage}%</span>
                </div>
                <p className="result-hero-message">{BAND_MESSAGE[band]}</p>
                <p className="muted result-hero-date">
                  Submitted: {new Date(latest.submittedAt).toLocaleString()}
                </p>
              </section>
            )
          })()
        ) : (
          <p className="muted">No submissions yet.</p>
        )}

        {history.length > 0 ? (
          <section className="card">
            <h3>Submission History</h3>
            <div className="stack">
              {history.map((result) => {
                const percentage = getPercentage(result)
                const band = getScoreBand(percentage)
                return (
                  <div key={result.id} className="history-row">
                    <div className={`history-row-icon band-${band}`}>{BAND_ICON[band]}</div>
                    <div className="history-row-info">
                      <span className="history-row-title">{result.questionSetTitle}</span>
                      <span className="muted history-row-date">
                        {new Date(result.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="history-row-score">
                      <span className="muted">
                        {result.earnedPoints}/{result.totalPoints}
                      </span>
                      <span className={`score-pill band-${band}`}>{percentage}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ) : null}
      </div>
    </AppShell>
  )
}

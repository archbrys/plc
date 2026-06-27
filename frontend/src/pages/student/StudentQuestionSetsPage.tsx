import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../../components/common/AppShell'
import { questionSetService } from '../../services/questionSetService'
import type { QuestionSet } from '../../types/quiz'

export function StudentQuestionSetsPage() {
  const [sets, setSets] = useState<QuestionSet[]>([])

  useEffect(() => {
    questionSetService.listPublished().then(setSets)
  }, [])

  return (
    <AppShell title="Available Question Sets" subtitle="Published quizzes only." links={[{ label: 'My Result', to: '/student/result' }]}>
      <div className="stack">
        {sets.length === 0 ? (
          <p className="muted">No published question sets available.</p>
        ) : (
          sets.map((set) => (
            <article key={set.id} className="card">
              <h2>{set.title}</h2>
              <p className="muted">{set.description}</p>
              <p className="muted">{set.questions.length} questions</p>
              <Link className="btn large" to={`/student/question-sets/${set.id}`}>
                Start
              </Link>
            </article>
          ))
        )}
      </div>
    </AppShell>
  )
}

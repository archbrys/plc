import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../../components/common/AppShell'
import { questionSetService } from '../../services/questionSetService'
import type { QuestionSet, QuestionSetStatus } from '../../types/quiz'

export function AdminQuestionSetsPage() {
  const [sets, setSets] = useState<QuestionSet[]>([])
  const [error, setError] = useState('')

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

  const handleDelete = async (id: string) => {
    await questionSetService.remove(id)
    load()
  }

  return (
    <AppShell
      title="Question Sets"
      links={[
        { label: 'Dashboard', to: '/admin/dashboard' },
        { label: 'Course Content', to: '/admin/course-content' },
        { label: 'Create', to: '/admin/question-sets/create' },
      ]}
    >
      <div className="stack">
        {error ? <p className="error-text">{error}</p> : null}

        {sets.map((set) => (
          <article className="card" key={set.id}>
            <div className="row-between">
              <div>
                <h2>{set.title}</h2>
                <p className="muted">{set.description}</p>
                <p className="muted">
                  Status: <strong>{set.status}</strong> • Questions: {set.questions.length}
                </p>
              </div>
              <div className="header-actions wrap">
                <Link className="btn secondary" to={`/admin/question-sets/${set.id}/edit`}>
                  Edit
                </Link>
                <button className="btn secondary" type="button" onClick={() => handleStatus(set.id, 'draft')}>
                  Draft
                </button>
                <button
                  className="btn secondary"
                  type="button"
                  onClick={() => handleStatus(set.id, 'published')}
                >
                  Publish
                </button>
                <button className="btn secondary" type="button" onClick={() => handleArchive(set.id)}>
                  Archive
                </button>
                <button className="btn danger" type="button" onClick={() => handleDelete(set.id)}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  )
}

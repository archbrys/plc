import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../../components/common/AppShell'
import { questionSetService } from '../../services/questionSetService'
import { resultService } from '../../services/resultService'

export function AdminDashboardPage() {
  const [publishedCount, setPublishedCount] = useState(0)
  const [draftCount, setDraftCount] = useState(0)
  const [resultCount, setResultCount] = useState(0)

  useEffect(() => {
    questionSetService.listAll().then((sets) => {
      setPublishedCount(sets.filter((set) => set.status === 'published').length)
      setDraftCount(sets.filter((set) => set.status === 'draft').length)
    })
    resultService.listAll().then((results) => setResultCount(results.length))
  }, [])

  return (
    <AppShell
      title="Admin Dashboard"
      links={[
        { label: 'Question Sets', to: '/admin/question-sets' },
        { label: 'Course Content', to: '/admin/course-content' },
        { label: 'Results', to: '/admin/results' },
      ]}
    >
      <div className="grid-two">
        <section className="card">
          <h2>Published Sets</h2>
          <p className="stat">{publishedCount}</p>
        </section>
        <section className="card">
          <h2>Draft Sets</h2>
          <p className="stat">{draftCount}</p>
        </section>
        <section className="card">
          <h2>Total Results</h2>
          <p className="stat">{resultCount}</p>
        </section>
        <section className="card">
          <h2>Quick Action</h2>
          <Link className="btn large" to="/admin/question-sets/create">
            Create Question Set
          </Link>
        </section>
        <section className="card">
          <h2>Course Content</h2>
          <Link className="btn large" to="/admin/course-content">
            View Chapters & Sections
          </Link>
        </section>
      </div>
    </AppShell>
  )
}

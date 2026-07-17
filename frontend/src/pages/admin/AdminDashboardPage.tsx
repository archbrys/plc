import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
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
    <AdminLayout title="Dashboard" subtitle="Overview of question sets, course content, and student activity.">
      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-icon green" aria-hidden="true">
            ✓
          </span>
          <div className="admin-stat-body">
            <p className="admin-stat-value">{publishedCount}</p>
            <p className="admin-stat-label">Published Sets</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon amber" aria-hidden="true">
            ✎
          </span>
          <div className="admin-stat-body">
            <p className="admin-stat-value">{draftCount}</p>
            <p className="admin-stat-label">Draft Sets</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-icon" aria-hidden="true">
            ◫
          </span>
          <div className="admin-stat-body">
            <p className="admin-stat-value">{resultCount}</p>
            <p className="admin-stat-label">Total Results</p>
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="admin-panel-body">
          <div className="header-actions wrap">
            <Link className="btn" to="/admin/question-sets/create">
              Create Question Set
            </Link>
            <Link className="btn secondary" to="/admin/course-content">
              View Chapters &amp; Sections
            </Link>
            <Link className="btn secondary" to="/admin/results">
              View Student Results
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

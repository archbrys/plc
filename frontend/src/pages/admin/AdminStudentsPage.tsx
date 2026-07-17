import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { userService } from '../../services/userService'
import type { ManagedUser } from '../../types/user'

export function AdminStudentsPage() {
  const [students, setStudents] = useState<ManagedUser[]>([])
  const [error, setError] = useState('')
  const [pendingDelete, setPendingDelete] = useState<ManagedUser | null>(null)

  const load = () => {
    userService.listAll().then((users) => {
      setStudents(users.filter((user) => user.role === 'student'))
    })
  }

  useEffect(() => {
    load()
  }, [])

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return

    try {
      await userService.remove(pendingDelete.id)
      setError('')
      load()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete student.')
    } finally {
      setPendingDelete(null)
    }
  }

  return (
    <AdminLayout
      title="Students"
      subtitle="Create, update, and remove student accounts."
      actions={
        <Link className="btn small" to="/admin/students/create">
          Add Student
        </Link>
      }
    >
      {error ? <p className="error-text">{error}</p> : null}

      <div className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Student ID</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="admin-table-title">{student.fullName}</div>
                  </td>
                  <td>{student.studentId}</td>
                  <td className="col-actions">
                    <div className="admin-table-actions">
                      <Link className="btn secondary small" to={`/admin/students/${student.id}/edit`}>
                        Edit
                      </Link>
                      <button
                        className="btn danger small"
                        type="button"
                        onClick={() => setPendingDelete(student)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 ? <p className="admin-empty-state">No students yet.</p> : null}
        </div>
      </div>

      {pendingDelete ? (
        <ConfirmModal
          title="Delete student"
          message={`Delete ${pendingDelete.fullName} (${pendingDelete.studentId})? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      ) : null}
    </AdminLayout>
  )
}

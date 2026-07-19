import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { StudentForm, type StudentFormValue } from '../../components/students/StudentForm'
import { useToast } from '../../hooks/useToast'
import { userService } from '../../services/userService'
import type { ManagedUser } from '../../types/user'

export function AdminStudentEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [student, setStudent] = useState<ManagedUser | null>(null)

  useEffect(() => {
    if (!id) {
      return
    }

    userService.listAll().then((users) => {
      setStudent(users.find((candidate) => candidate.id === id && candidate.role === 'student') ?? null)
    })
  }, [id])

  const handleSave = async (value: StudentFormValue) => {
    if (!id) return

    const response = await userService.update(id, {
      fullName: value.fullName,
      studentId: value.studentId,
      ...(value.pin ? { pin: value.pin } : {}),
    })

    if (!response.ok) {
      const message = (response.errors ?? ['Unable to update student.']).join(' ')
      showToast(message, 'error')
      throw new Error(message)
    }

    showToast('Student updated.', 'success')
    navigate('/admin/students')
  }

  const backAction = (
    <button className="btn-outline" type="button" onClick={() => navigate('/admin/students')}>
      Back
    </button>
  )

  if (!student) {
    return (
      <AdminLayout title="Edit Student" actions={backAction}>
        <p className="muted">Student not found.</p>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Edit Student" actions={backAction}>
      <div className="admin-panel">
        <div className="admin-panel-body">
          <StudentForm
            initialValue={student}
            onSave={handleSave}
            onCancel={() => navigate('/admin/students')}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </AdminLayout>
  )
}

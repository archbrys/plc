import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { StudentForm, type StudentFormValue } from '../../components/students/StudentForm'
import { userService } from '../../services/userService'

export function AdminStudentCreatePage() {
  const navigate = useNavigate()

  const handleSave = async (value: StudentFormValue) => {
    const response = await userService.create({
      role: 'student',
      fullName: value.fullName,
      studentId: value.studentId,
      pin: value.pin,
    })

    if (!response.ok) {
      throw new Error((response.errors ?? ['Unable to create student.']).join(' '))
    }

    navigate('/admin/students')
  }

  return (
    <AdminLayout
      title="Add Student"
      actions={
        <button className="btn-outline small" type="button" onClick={() => navigate('/admin/students')}>
          Back
        </button>
      }
    >
      <div className="admin-panel">
        <div className="admin-panel-body">
          <StudentForm onSave={handleSave} onCancel={() => navigate('/admin/students')} submitLabel="Create" />
        </div>
      </div>
    </AdminLayout>
  )
}

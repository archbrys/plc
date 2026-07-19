import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { QuestionSetEditor } from '../../components/questions/QuestionSetEditor'
import { useToast } from '../../hooks/useToast'
import { questionSetService } from '../../services/questionSetService'
import type { QuestionSet } from '../../types/quiz'

const initialQuestionSet: QuestionSet = {
  id: '',
  title: '',
  description: '',
  status: 'draft',
  questions: [],
}

export function AdminQuestionSetCreatePage() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleSave = async (payload: QuestionSet) => {
    const response = await questionSetService.upsert(payload)
    if (!response.ok) {
      const message = (response.errors ?? ['Unable to create question set.']).join(' ')
      showToast(message, 'error')
      throw new Error(message)
    }

    showToast('Question set created.', 'success')
    navigate('/admin/question-sets')
  }

  return (
    <AdminLayout
      title="Create Question Set"
      actions={
        <button className="btn-outline" type="button" onClick={() => navigate('/admin/question-sets')}>
          Back
        </button>
      }
    >
      <div className="admin-panel">
        <div className="admin-panel-body">
          <QuestionSetEditor
            initialValue={initialQuestionSet}
            onSave={handleSave}
            onCancel={() => navigate('/admin/question-sets')}
            submitLabel="Create"
          />
        </div>
      </div>
    </AdminLayout>
  )
}

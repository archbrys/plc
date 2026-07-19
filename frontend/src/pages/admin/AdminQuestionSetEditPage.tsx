import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { QuestionSetEditor } from '../../components/questions/QuestionSetEditor'
import { useToast } from '../../hooks/useToast'
import { questionSetService } from '../../services/questionSetService'
import type { QuestionSet } from '../../types/quiz'

export function AdminQuestionSetEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null)

  useEffect(() => {
    if (!id) {
      return
    }

    questionSetService.getById(id).then(setQuestionSet)
  }, [id])

  const handleSave = async (payload: QuestionSet) => {
    const response = await questionSetService.upsert(payload)
    if (!response.ok) {
      const message = (response.errors ?? ['Unable to update question set.']).join(' ')
      showToast(message, 'error')
      throw new Error(message)
    }

    showToast('Question set saved.', 'success')
    navigate('/admin/question-sets')
  }

  const backAction = (
    <button className="btn-outline" type="button" onClick={() => navigate('/admin/question-sets')}>
      Back
    </button>
  )

  if (!questionSet) {
    return (
      <AdminLayout title="Edit Question Set" actions={backAction}>
        <p className="muted">Question set not found.</p>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Edit Question Set" actions={backAction}>
      <div className="admin-panel">
        <div className="admin-panel-body">
          <QuestionSetEditor
            initialValue={questionSet}
            onSave={handleSave}
            onCancel={() => navigate('/admin/question-sets')}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </AdminLayout>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '../../components/common/AppShell'
import { QuestionSetEditor } from '../../components/questions/QuestionSetEditor'
import { questionSetService } from '../../services/questionSetService'
import type { QuestionSet } from '../../types/quiz'

export function AdminQuestionSetEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
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
      throw new Error((response.errors ?? ['Unable to update question set.']).join(' '))
    }

    navigate('/admin/question-sets')
  }

  if (!questionSet) {
    return (
      <AppShell title="Edit Question Set" links={[{ label: 'Back', to: '/admin/question-sets' }]}>
        <p className="muted">Question set not found.</p>
      </AppShell>
    )
  }

  return (
    <AppShell title="Edit Question Set" links={[{ label: 'Back', to: '/admin/question-sets' }]}>
      <QuestionSetEditor
        initialValue={questionSet}
        onSave={handleSave}
        onCancel={() => navigate('/admin/question-sets')}
        submitLabel="Save Changes"
      />
    </AppShell>
  )
}

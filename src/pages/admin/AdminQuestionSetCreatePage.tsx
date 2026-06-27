import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../components/common/AppShell'
import { QuestionSetEditor } from '../../components/questions/QuestionSetEditor'
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

  const handleSave = async (payload: QuestionSet) => {
    const response = await questionSetService.upsert(payload)
    if (!response.ok) {
      throw new Error((response.errors ?? ['Unable to create question set.']).join(' '))
    }

    navigate('/admin/question-sets')
  }

  return (
    <AppShell title="Create Question Set" links={[{ label: 'Back', to: '/admin/question-sets' }]}>
      <QuestionSetEditor
        initialValue={initialQuestionSet}
        onSave={handleSave}
        onCancel={() => navigate('/admin/question-sets')}
        submitLabel="Create"
      />
    </AppShell>
  )
}

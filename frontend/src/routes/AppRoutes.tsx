import { Navigate, Route, Routes } from 'react-router-dom'
import { RoleGuard } from '../components/auth/RoleGuard'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminQuestionSetCreatePage } from '../pages/admin/AdminQuestionSetCreatePage'
import { AdminQuestionSetEditPage } from '../pages/admin/AdminQuestionSetEditPage'
import { AdminQuestionSetsPage } from '../pages/admin/AdminQuestionSetsPage'
import { AdminResultsPage } from '../pages/admin/AdminResultsPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { PLCIntroPage } from '../pages/student/PLCIntroPage'
import { StudentQuestionSetDetailPage } from '../pages/student/StudentQuestionSetDetailPage'
import { StudentQuestionSetsPage } from '../pages/student/StudentQuestionSetsPage'
import { StudentQuizCompletionPage } from '../pages/student/StudentQuizCompletionPage'
import { StudentResultPage } from '../pages/student/StudentResultPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Keep old routes as aliases for backwards compatibility */}
      <Route path="/student/login" element={<Navigate to="/login" replace />} />
      <Route path="/admin/login" element={<Navigate to="/login" replace />} />

      <Route element={<RoleGuard allowedRole="student" />}>
        <Route path="/student/question-sets" element={<StudentQuestionSetsPage />} />
        <Route path="/student/plc-intro" element={<PLCIntroPage />} />
        <Route path="/student/question-sets/:id" element={<StudentQuestionSetDetailPage />} />
        <Route path="/student/completion" element={<StudentQuizCompletionPage />} />
        <Route path="/student/result" element={<StudentResultPage />} />
      </Route>

      <Route element={<RoleGuard allowedRole="admin" />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/question-sets" element={<AdminQuestionSetsPage />} />
        <Route path="/admin/question-sets/create" element={<AdminQuestionSetCreatePage />} />
        <Route path="/admin/question-sets/:id/edit" element={<AdminQuestionSetEditPage />} />
        <Route path="/admin/results" element={<AdminResultsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

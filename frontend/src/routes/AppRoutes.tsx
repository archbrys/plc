import { Navigate, Route, Routes } from 'react-router-dom'
import { RoleGuard } from '../components/auth/RoleGuard'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminQuestionSetCreatePage } from '../pages/admin/AdminQuestionSetCreatePage'
import { AdminQuestionSetEditPage } from '../pages/admin/AdminQuestionSetEditPage'
import { AdminQuestionSetsPage } from '../pages/admin/AdminQuestionSetsPage'
import { AdminResultsPage } from '../pages/admin/AdminResultsPage'
import { AdminCourseContentPage } from '../pages/admin/AdminCourseContentPage'
import { AdminChapterEditorPage } from '../pages/admin/AdminChapterEditorPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { PLCIntroPage } from '../pages/student/PLCIntroPage'
import { PLCWelcomePage } from '../pages/student/PLCWelcomePage'
import { PLCChapterSelectPage } from '../pages/student/PLCChapterSelectPage'
import { ChaptersPage } from '../pages/student/ChaptersPage'
import { StudentCharactersPage } from '../pages/student/StudentCharactersPage'
import { StudentQuestionSetDetailPage } from '../pages/student/StudentQuestionSetDetailPage'
import { StudentQuestionSetsPage } from '../pages/student/StudentQuestionSetsPage'
import { StudentQuizCompletionPage } from '../pages/student/StudentQuizCompletionPage'
import { StudentResultPage } from '../pages/student/StudentResultPage'
import { DynamicChapterPage } from '../pages/student/DynamicChapterPage'

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
        <Route path="/student/characters" element={<StudentCharactersPage />} />
        <Route path="/student/plc-welcome" element={<PLCWelcomePage />} />
        <Route path="/student/plc-chapter-select" element={<PLCChapterSelectPage />} />
        <Route path="/student/chapters" element={<ChaptersPage />} />
        <Route path="/student/chapters/:chapterId/flow" element={<DynamicChapterPage />} />
        <Route path="/student/question-sets/:id" element={<StudentQuestionSetDetailPage />} />
        <Route path="/student/completion" element={<StudentQuizCompletionPage />} />
        <Route path="/student/result" element={<StudentResultPage />} />
      </Route>

      <Route element={<RoleGuard allowedRole="admin" />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/question-sets" element={<AdminQuestionSetsPage />} />
        <Route path="/admin/course-content" element={<AdminCourseContentPage />} />
        <Route path="/admin/course-content/:chapterId" element={<AdminChapterEditorPage />} />
        <Route path="/admin/question-sets/create" element={<AdminQuestionSetCreatePage />} />
        <Route path="/admin/question-sets/:id/edit" element={<AdminQuestionSetEditPage />} />
        <Route path="/admin/results" element={<AdminResultsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

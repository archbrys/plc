import { Navigate, Route, Routes } from 'react-router-dom'
import { RoleGuard } from '../components/auth/RoleGuard'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminQuestionSetCreatePage } from '../pages/admin/AdminQuestionSetCreatePage'
import { AdminQuestionSetEditPage } from '../pages/admin/AdminQuestionSetEditPage'
import { AdminQuestionSetsPage } from '../pages/admin/AdminQuestionSetsPage'
import { AdminResultsPage } from '../pages/admin/AdminResultsPage'
import { AdminCourseContentPage } from '../pages/admin/AdminCourseContentPage'
import { AdminChapterEditorPage } from '../pages/admin/AdminChapterEditorPage'
import { AdminHomeButtonsPage } from '../pages/admin/AdminHomeButtonsPage'
import { AdminStudentsPage } from '../pages/admin/AdminStudentsPage'
import { AdminStudentCreatePage } from '../pages/admin/AdminStudentCreatePage'
import { AdminStudentEditPage } from '../pages/admin/AdminStudentEditPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { PLCIntroPage } from '../pages/student/PLCIntroPage'
import { PLCFundamentalsPage } from '../pages/student/PLCFundamentalsPage'
import { PLCWelcomePage } from '../pages/student/PLCWelcomePage'
import { PLCChapterSelectPage } from '../pages/student/PLCChapterSelectPage'
import { ChaptersPage } from '../pages/student/ChaptersPage'
import { StudentCharactersPage } from '../pages/student/StudentCharactersPage'
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
        <Route path="/student/plc" element={<StudentQuestionSetsPage />} />
        <Route path="/student/plc-intro" element={<PLCIntroPage />} />
        <Route path="/student/plc-fundamentals" element={<PLCFundamentalsPage />} />
        <Route path="/student/characters" element={<StudentCharactersPage />} />
        <Route path="/student/plc-welcome" element={<PLCWelcomePage />} />
        <Route path="/student/plc-chapter-select" element={<PLCChapterSelectPage />} />
        <Route path="/student/chapters" element={<ChaptersPage />} />
        <Route path="/student/chapters/:chapterId/flow" element={<DynamicChapterPage />} />
        <Route path="/student/completion" element={<StudentQuizCompletionPage />} />
        <Route path="/student/result" element={<StudentResultPage />} />
      </Route>

      <Route element={<RoleGuard allowedRole="admin" />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/question-sets" element={<AdminQuestionSetsPage />} />
        <Route path="/admin/course-content" element={<AdminCourseContentPage />} />
        <Route path="/admin/course-content/:chapterId" element={<AdminChapterEditorPage />} />
        <Route path="/admin/home-buttons" element={<AdminHomeButtonsPage />} />
        <Route path="/admin/question-sets/create" element={<AdminQuestionSetCreatePage />} />
        <Route path="/admin/question-sets/:id/edit" element={<AdminQuestionSetEditPage />} />
        <Route path="/admin/results" element={<AdminResultsPage />} />
        <Route path="/admin/students" element={<AdminStudentsPage />} />
        <Route path="/admin/students/create" element={<AdminStudentCreatePage />} />
        <Route path="/admin/students/:id/edit" element={<AdminStudentEditPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

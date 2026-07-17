# Graph Report - frontend  (2026-07-18)

## Corpus Check
- 65 files · ~16,402 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 223 nodes · 582 edges · 10 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `436ae03e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- quiz.ts
- AdminChapterEditorPage.tsx
- course.ts
- AppRoutes.tsx
- ChapterFlowRenderer.tsx
- AuthContext.tsx
- AdminLayout.tsx
- storage.ts
- validation.ts

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 22 edges
2. `AdminLayout()` - 13 edges
3. `QuestionSet` - 13 edges
4. `resolveAssetSrc()` - 11 edges
5. `StudentMenu()` - 10 edges
6. `questionSetService` - 9 edges
7. `apiClient` - 8 edges
8. `ConfirmModal()` - 7 edges
9. `resultService` - 7 edges
10. `StudentAnswer` - 7 edges

## Surprising Connections (you probably didn't know these)
- `AdminLayout()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/admin/AdminLayout.tsx → src/hooks/useAuth.ts
- `ContentBlockPreviewModalProps` --references--> `ContentBlock`  [EXTRACTED]
  src/components/admin/ContentBlockPreviewModal.tsx → src/types/course.ts
- `RoleGuardProps` --references--> `UserRole`  [EXTRACTED]
  src/components/auth/RoleGuard.tsx → src/types/quiz.ts
- `ChapterFlowRendererProps` --references--> `ChapterPage`  [EXTRACTED]
  src/components/chapters/ChapterFlowRenderer.tsx → src/types/course.ts
- `QuizPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/chapters/QuizPage.tsx → src/hooks/useAuth.ts

## Import Cycles
- None detected.

## Communities (10 total, 0 thin omitted)

### Community 0 - "quiz.ts"
Cohesion: 0.13
Nodes (22): QuizPage(), QuizPageProps, QuestionInputProps, QuestionSetEditor(), QuestionSetEditorProps, AdminDashboardPage(), AdminQuestionSetCreatePage(), initialQuestionSet (+14 more)

### Community 1 - "AdminChapterEditorPage.tsx"
Cohesion: 0.11
Nodes (21): ContentBlockPreviewModal(), ContentBlockPreviewModalProps, DIRECTION_BY_POSITION, getContentBlockLayoutStyle(), ContentSectionPage(), ContentSectionPageProps, MediaPage(), MediaPageProps (+13 more)

### Community 2 - "course.ts"
Cohesion: 0.15
Nodes (22): ConfirmModal(), ConfirmModalProps, getChapterById(), getCourse(), invalidateCourseCache(), AdminCourseContentPage(), AdminHomeButtonsPage(), EMPTY_FORM (+14 more)

### Community 3 - "AppRoutes.tsx"
Cohesion: 0.14
Nodes (20): RoleGuard(), AppShell(), AppShellProps, StudentMenu(), useAuthContext(), useAuth(), LoginMode, LoginPage() (+12 more)

### Community 4 - "ChapterFlowRenderer.tsx"
Cohesion: 0.13
Nodes (16): ChapterFlowRenderer(), ChapterFlowRendererProps, getSectionTitle(), ChapterHeader(), ChapterHeaderProps, InteractivePracticePage(), InteractivePracticePageProps, NarrationPage() (+8 more)

### Community 5 - "AuthContext.tsx"
Cohesion: 0.12
Nodes (12): SplashScreen(), SplashScreenProps, AuthContext, AuthContextValue, AuthProvider(), AuthProviderProps, AppRoutes(), apiClient (+4 more)

### Community 6 - "AdminLayout.tsx"
Cohesion: 0.20
Nodes (15): AdminLayout(), AdminLayoutProps, NAV_ITEMS, RoleGuardProps, StudentForm(), StudentFormProps, StudentFormValue, AdminStudentCreatePage() (+7 more)

### Community 7 - "storage.ts"
Cohesion: 0.23
Nodes (13): getAdmins(), getQuestionSets(), getResults(), getStudents(), loadFromStorage(), saveToStorage(), setAdmins(), setQuestionSets() (+5 more)

### Community 8 - "validation.ts"
Cohesion: 0.53
Nodes (4): validateQuestion(), validateQuestionSetForPublish(), validateRequiredText(), ValidationResult

## Knowledge Gaps
- **22 isolated node(s):** `NAV_ITEMS`, `AdminLayoutProps`, `ConfirmModalProps`, `ChapterHeaderProps`, `DIRECTION_BY_POSITION` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `QuestionSet` connect `quiz.ts` to `validation.ts`, `AdminChapterEditorPage.tsx`, `AppRoutes.tsx`, `storage.ts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `AppRoutes.tsx` to `quiz.ts`, `AdminLayout.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `AdminLayout()` connect `AdminLayout.tsx` to `quiz.ts`, `AdminChapterEditorPage.tsx`, `course.ts`, `AppRoutes.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `NAV_ITEMS`, `AdminLayoutProps`, `ConfirmModalProps` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `quiz.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13174603174603175 - nodes in this community are weakly interconnected._
- **Should `AdminChapterEditorPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1051693404634581 - nodes in this community are weakly interconnected._
- **Should `course.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14717741935483872 - nodes in this community are weakly interconnected._
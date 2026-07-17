# Graph Report - frontend  (2026-07-17)

## Corpus Check
- 65 files · ~16,215 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 222 nodes · 579 edges · 10 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6f023aed`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- course.ts
- useAuth
- AdminChapterEditorPage.tsx
- AppRoutes.tsx
- AuthContext.tsx
- AdminLayout.tsx
- AdminHomeButtonsPage.tsx
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
8. `resultService` - 7 edges
9. `StudentAnswer` - 7 edges
10. `QuizResult` - 7 edges

## Surprising Connections (you probably didn't know these)
- `AdminLayout()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/admin/AdminLayout.tsx → src/hooks/useAuth.ts
- `ContentBlockPreviewModalProps` --references--> `ContentBlock`  [EXTRACTED]
  src/components/admin/ContentBlockPreviewModal.tsx → src/types/course.ts
- `RoleGuardProps` --references--> `UserRole`  [EXTRACTED]
  src/components/auth/RoleGuard.tsx → src/types/quiz.ts
- `RoleGuard()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/auth/RoleGuard.tsx → src/hooks/useAuth.ts
- `ChapterFlowRendererProps` --references--> `ChapterPage`  [EXTRACTED]
  src/components/chapters/ChapterFlowRenderer.tsx → src/types/course.ts

## Import Cycles
- None detected.

## Communities (10 total, 0 thin omitted)

### Community 0 - "course.ts"
Cohesion: 0.10
Nodes (29): ChapterFlowRenderer(), ChapterFlowRendererProps, getSectionTitle(), ChapterHeader(), ChapterHeaderProps, InteractivePracticePage(), InteractivePracticePageProps, NarrationPage() (+21 more)

### Community 1 - "useAuth"
Cohesion: 0.13
Nodes (22): QuizPage(), QuizPageProps, AppShell(), AppShellProps, StudentMenu(), useAuthContext(), useAuth(), AdminResultsPage() (+14 more)

### Community 2 - "AdminChapterEditorPage.tsx"
Cohesion: 0.11
Nodes (20): ContentBlockPreviewModal(), ContentBlockPreviewModalProps, DIRECTION_BY_POSITION, getContentBlockLayoutStyle(), ContentSectionPage(), ContentSectionPageProps, MediaPage(), MediaPageProps (+12 more)

### Community 3 - "AppRoutes.tsx"
Cohesion: 0.16
Nodes (18): RoleGuard(), RoleGuardProps, QuestionSetEditor(), QuestionSetEditorProps, AdminDashboardPage(), AdminQuestionSetCreatePage(), initialQuestionSet, AdminQuestionSetEditPage() (+10 more)

### Community 4 - "AuthContext.tsx"
Cohesion: 0.12
Nodes (12): SplashScreen(), SplashScreenProps, AuthContext, AuthContextValue, AuthProvider(), AuthProviderProps, AppRoutes(), apiClient (+4 more)

### Community 5 - "AdminLayout.tsx"
Cohesion: 0.22
Nodes (13): AdminLayout(), AdminLayoutProps, NAV_ITEMS, StudentForm(), StudentFormProps, StudentFormValue, AdminStudentCreatePage(), AdminStudentEditPage() (+5 more)

### Community 6 - "AdminHomeButtonsPage.tsx"
Cohesion: 0.23
Nodes (11): ConfirmModal(), ConfirmModalProps, AdminHomeButtonsPage(), EMPTY_FORM, FormState, targetLabel(), StudentQuestionSetsPage(), homeButtonApiService (+3 more)

### Community 7 - "storage.ts"
Cohesion: 0.23
Nodes (13): getAdmins(), getQuestionSets(), getResults(), getStudents(), loadFromStorage(), saveToStorage(), setAdmins(), setQuestionSets() (+5 more)

### Community 8 - "validation.ts"
Cohesion: 0.29
Nodes (7): QuestionInputProps, Question, StudentAnswer, validateQuestion(), validateQuestionSetForPublish(), validateRequiredText(), ValidationResult

## Knowledge Gaps
- **22 isolated node(s):** `NAV_ITEMS`, `AdminLayoutProps`, `ConfirmModalProps`, `ChapterHeaderProps`, `DIRECTION_BY_POSITION` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `QuestionSet` connect `AppRoutes.tsx` to `validation.ts`, `useAuth`, `AdminChapterEditorPage.tsx`, `storage.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `useAuth` to `course.ts`, `AppRoutes.tsx`, `AdminLayout.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `AdminLayout()` connect `AdminLayout.tsx` to `course.ts`, `useAuth`, `AdminChapterEditorPage.tsx`, `AppRoutes.tsx`, `AdminHomeButtonsPage.tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `NAV_ITEMS`, `AdminLayoutProps`, `ConfirmModalProps` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `course.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09988385598141696 - nodes in this community are weakly interconnected._
- **Should `useAuth` be split into smaller, more focused modules?**
  _Cohesion score 0.1265597147950089 - nodes in this community are weakly interconnected._
- **Should `AdminChapterEditorPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11491935483870967 - nodes in this community are weakly interconnected._
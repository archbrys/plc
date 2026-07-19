# Graph Report - frontend  (2026-07-19)

## Corpus Check
- 68 files · ~17,053 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 232 nodes · 623 edges · 9 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `388f477a`
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

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 22 edges
2. `useToast()` - 15 edges
3. `QuestionSet` - 14 edges
4. `AdminLayout()` - 13 edges
5. `resolveAssetSrc()` - 11 edges
6. `StudentMenu()` - 10 edges
7. `questionSetService` - 10 edges
8. `apiClient` - 8 edges
9. `ConfirmModal()` - 7 edges
10. `resultService` - 7 edges

## Surprising Connections (you probably didn't know these)
- `RoleGuardProps` --references--> `UserRole`  [EXTRACTED]
  src/components/auth/RoleGuard.tsx → src/types/quiz.ts
- `AdminLayout()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/admin/AdminLayout.tsx → src/hooks/useAuth.ts
- `ContentBlockPreviewModalProps` --references--> `ContentBlock`  [EXTRACTED]
  src/components/admin/ContentBlockPreviewModal.tsx → src/types/course.ts
- `ChapterFlowRendererProps` --references--> `ChapterPage`  [EXTRACTED]
  src/components/chapters/ChapterFlowRenderer.tsx → src/types/course.ts
- `QuizPage()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/chapters/QuizPage.tsx → src/hooks/useAuth.ts

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "quiz.ts"
Cohesion: 0.13
Nodes (22): AdminLayout(), AdminLayoutProps, NAV_ITEMS, QuizPage(), QuizPageProps, QuestionInputProps, QuestionSetEditor(), QuestionSetEditorProps (+14 more)

### Community 1 - "AdminChapterEditorPage.tsx"
Cohesion: 0.09
Nodes (24): ContentBlockPreviewModal(), ContentBlockPreviewModalProps, ChapterHeader(), ChapterHeaderProps, DIRECTION_BY_POSITION, getContentBlockLayoutStyle(), ContentSectionPage(), ContentSectionPageProps (+16 more)

### Community 2 - "course.ts"
Cohesion: 0.23
Nodes (11): ConfirmModal(), ConfirmModalProps, AdminHomeButtonsPage(), EMPTY_FORM, FormState, targetLabel(), StudentQuestionSetsPage(), homeButtonApiService (+3 more)

### Community 3 - "AppRoutes.tsx"
Cohesion: 0.12
Nodes (26): RoleGuard(), RoleGuardProps, AppShell(), AppShellProps, StudentMenu(), useAuthContext(), useAuth(), AdminDashboardPage() (+18 more)

### Community 4 - "ChapterFlowRenderer.tsx"
Cohesion: 0.12
Nodes (26): ChapterFlowRenderer(), ChapterFlowRendererProps, getSectionTitle(), InteractivePracticePage(), InteractivePracticePageProps, NarrationPage(), NarrationPageProps, SlideshowPage() (+18 more)

### Community 5 - "AuthContext.tsx"
Cohesion: 0.10
Nodes (16): SplashScreen(), SplashScreenProps, AuthContext, AuthContextValue, AuthProvider(), AuthProviderProps, Toast, ToastProvider() (+8 more)

### Community 6 - "AdminLayout.tsx"
Cohesion: 0.23
Nodes (13): StudentForm(), StudentFormProps, StudentFormValue, useToast(), AdminQuestionSetEditPage(), AdminStudentCreatePage(), AdminStudentEditPage(), AdminStudentsPage() (+5 more)

### Community 7 - "storage.ts"
Cohesion: 0.23
Nodes (13): getAdmins(), getQuestionSets(), getResults(), getStudents(), loadFromStorage(), saveToStorage(), setAdmins(), setQuestionSets() (+5 more)

## Knowledge Gaps
- **23 isolated node(s):** `NAV_ITEMS`, `AdminLayoutProps`, `ConfirmModalProps`, `ChapterHeaderProps`, `DIRECTION_BY_POSITION` (+18 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `QuestionSet` connect `quiz.ts` to `AdminChapterEditorPage.tsx`, `course.ts`, `AppRoutes.tsx`, `storage.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `AppRoutes.tsx` to `quiz.ts`, `ChapterFlowRenderer.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `useToast()` connect `AdminLayout.tsx` to `quiz.ts`, `AdminChapterEditorPage.tsx`, `course.ts`, `AppRoutes.tsx`, `ChapterFlowRenderer.tsx`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `NAV_ITEMS`, `AdminLayoutProps`, `ConfirmModalProps` to the rest of the system?**
  _23 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `quiz.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12698412698412698 - nodes in this community are weakly interconnected._
- **Should `AdminChapterEditorPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08906882591093117 - nodes in this community are weakly interconnected._
- **Should `AppRoutes.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11538461538461539 - nodes in this community are weakly interconnected._
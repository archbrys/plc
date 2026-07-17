# Graph Report - plc-mc  (2026-07-16)

## Corpus Check
- 115 files · ~25,587 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 429 nodes · 945 edges · 27 communities (18 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a4d382b7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Frontend Quiz & Student Pages
- Backend Auth & User Services
- Frontend Course Content Renderer
- Backend API Routes & Validation
- Backend Quiz Grading & Results
- Frontend Admin & User Management
- Backend Server Bootstrap
- Frontend App Bootstrap & Auth Context
- Frontend Local Storage Service
- Backend Modules Placeholder Docs
- Prisma Content Blocks Migration
- Prisma Seed Script (JS)
- Prisma Seed Script (TS)
- Express Session Type Augmentation
- Shared API Envelope Type
- Hero Image Asset
- React Logo Asset
- Vite Logo Asset
- validation.ts
- README.md

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 22 edges
2. `UserRepository` - 15 edges
3. `CourseRepository` - 14 edges
4. `createApiResponse()` - 14 edges
5. `QuestionSetRepository` - 13 edges
6. `QuestionSet` - 13 edges
7. `AdminLayout()` - 12 edges
8. `HttpError` - 10 edges
9. `StudentMenu()` - 10 edges
10. `QuestionSetService` - 9 edges

## Surprising Connections (you probably didn't know these)
- `AdminLayout()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/components/admin/AdminLayout.tsx → frontend/src/hooks/useAuth.ts
- `RoleGuardProps` --references--> `UserRole`  [EXTRACTED]
  frontend/src/components/auth/RoleGuard.tsx → frontend/src/types/quiz.ts
- `ChapterFlowRendererProps` --references--> `ChapterPage`  [EXTRACTED]
  frontend/src/components/chapters/ChapterFlowRenderer.tsx → frontend/src/types/course.ts
- `QuestionSetEditorProps` --references--> `QuestionSet`  [EXTRACTED]
  frontend/src/components/questions/QuestionSetEditor.tsx → frontend/src/types/quiz.ts
- `StudentFormProps` --references--> `ManagedUser`  [EXTRACTED]
  frontend/src/components/students/StudentForm.tsx → frontend/src/types/user.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Future domain module folders under backend/src/modules** — backend_src_modules_readme_authmodule, backend_src_modules_readme_usersmodule, backend_src_modules_readme_questionsetsmodule, backend_src_modules_readme_questionsmodule, backend_src_modules_readme_answersmodule, backend_src_modules_readme_resultsmodule [EXTRACTED 1.00]

## Communities (27 total, 9 thin omitted)

### Community 0 - "Frontend Quiz & Student Pages"
Cohesion: 0.08
Nodes (40): RoleGuard(), QuizPage(), AppShell(), AppShellProps, QuestionInputProps, QuestionSetEditor(), QuestionSetEditorProps, StudentMenu() (+32 more)

### Community 1 - "Backend Auth & User Services"
Cohesion: 0.10
Nodes (19): authService, userService, UserRepository, AuthService, toApiUser(), toRole(), CreateUserInput, toRole() (+11 more)

### Community 2 - "Frontend Course Content Renderer"
Cohesion: 0.06
Nodes (43): ChapterFlowRenderer(), ChapterFlowRendererProps, getSectionTitle(), ChapterHeader(), ChapterHeaderProps, ContentSectionPage(), ContentSectionPageProps, InteractivePracticePage() (+35 more)

### Community 3 - "Backend API Routes & Validation"
Cohesion: 0.05
Nodes (52): app, frontendDistPath, __dirname, env, envSchema, authController, questionSetController, resultController (+44 more)

### Community 4 - "Backend Quiz Grading & Results"
Cohesion: 0.10
Nodes (19): prisma, questionSetService, resultService, QuestionSetRepository, SubmissionRepository, mapQuestionSet(), mapQuestionType(), mapStatus() (+11 more)

### Community 5 - "Frontend Admin & User Management"
Cohesion: 0.16
Nodes (18): AdminLayout(), AdminLayoutProps, NAV_ITEMS, ConfirmModal(), ConfirmModalProps, RoleGuardProps, StudentForm(), StudentFormProps (+10 more)

### Community 6 - "Backend Server Bootstrap"
Cohesion: 0.08
Nodes (12): courseController, uploadController, CourseRepository, ChapterPageResponse, CourseChapterResponse, CourseResponse, courseService, mapChapter() (+4 more)

### Community 7 - "Frontend App Bootstrap & Auth Context"
Cohesion: 0.13
Nodes (10): SplashScreen(), SplashScreenProps, AuthContext, AuthContextValue, AuthProvider(), AuthProviderProps, AppRoutes(), ApiEnvelope (+2 more)

### Community 8 - "Frontend Local Storage Service"
Cohesion: 0.23
Nodes (13): getAdmins(), getQuestionSets(), getResults(), getStudents(), loadFromStorage(), saveToStorage(), setAdmins(), setQuestionSets() (+5 more)

### Community 9 - "Backend Modules Placeholder Docs"
Cohesion: 0.25
Nodes (8): answers/ module (answer processing and grading), auth/ module (login/session workflows), Backend Modules (future extension placeholders), Current layered implementation (routes/controllers/services/repositories/validation), questionSets/ module (quiz set management), questions/ module (question-level operations), results/ module (submission history and reports), users/ module (user lifecycle and profile features)

### Community 25 - "validation.ts"
Cohesion: 0.53
Nodes (4): validateQuestion(), validateQuestionSetForPublish(), validateRequiredText(), ValidationResult

## Knowledge Gaps
- **69 isolated node(s):** `prisma`, `prisma`, `prisma`, `frontendDistPath`, `__dirname` (+64 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createApiResponse()` connect `Backend API Routes & Validation` to `Backend Auth & User Services`, `Backend Quiz Grading & Results`, `Backend Server Bootstrap`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `prisma`, `prisma`, `prisma` to the rest of the system?**
  _69 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Quiz & Student Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.08365384615384615 - nodes in this community are weakly interconnected._
- **Should `Backend Auth & User Services` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Frontend Course Content Renderer` be split into smaller, more focused modules?**
  _Cohesion score 0.06201923076923077 - nodes in this community are weakly interconnected._
- **Should `Backend API Routes & Validation` be split into smaller, more focused modules?**
  _Cohesion score 0.05228070175438596 - nodes in this community are weakly interconnected._
- **Should `Backend Quiz Grading & Results` be split into smaller, more focused modules?**
  _Cohesion score 0.09620721554116558 - nodes in this community are weakly interconnected._
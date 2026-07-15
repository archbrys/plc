# Graph Report - .  (2026-07-16)

## Corpus Check
- Corpus is ~25,463 words - fits in a single context window. You may not need a graph.

## Summary
- 427 nodes · 944 edges · 25 communities (17 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 101,473 input · 0 output

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
- `RoleGuardProps` --references--> `UserRole`  [EXTRACTED]
  frontend/src/components/auth/RoleGuard.tsx → frontend/src/types/quiz.ts
- `errorHandler()` --calls--> `createApiResponse()`  [EXTRACTED]
  backend/src/middleware/errorHandler.ts → backend/src/utils/apiResponse.ts
- `AdminLayout()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/components/admin/AdminLayout.tsx → frontend/src/hooks/useAuth.ts
- `ChapterFlowRendererProps` --references--> `ChapterPage`  [EXTRACTED]
  frontend/src/components/chapters/ChapterFlowRenderer.tsx → frontend/src/types/course.ts
- `QuizPage()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/components/chapters/QuizPage.tsx → frontend/src/hooks/useAuth.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Future domain module folders under backend/src/modules** — backend_src_modules_readme_authmodule, backend_src_modules_readme_usersmodule, backend_src_modules_readme_questionsetsmodule, backend_src_modules_readme_questionsmodule, backend_src_modules_readme_answersmodule, backend_src_modules_readme_resultsmodule [EXTRACTED 1.00]

## Communities (25 total, 8 thin omitted)

### Community 0 - "Frontend Quiz & Student Pages"
Cohesion: 0.06
Nodes (50): RoleGuard(), RoleGuardProps, ChapterHeaderProps, QuizPageProps, AppShell(), AppShellProps, QuestionInputProps, QuestionSetEditor() (+42 more)

### Community 1 - "Backend Auth & User Services"
Cohesion: 0.05
Nodes (29): prisma, authService, userService, CourseRepository, UserRepository, AuthService, toApiUser(), toRole() (+21 more)

### Community 2 - "Frontend Course Content Renderer"
Cohesion: 0.07
Nodes (42): ConfirmModal(), ConfirmModalProps, ChapterFlowRenderer(), ChapterFlowRendererProps, getSectionTitle(), ChapterHeader(), ContentSectionPage(), ContentSectionPageProps (+34 more)

### Community 3 - "Backend API Routes & Validation"
Cohesion: 0.07
Nodes (42): authController, courseController, questionSetController, questionSetService, resultController, uploadController, userController, authMiddleware() (+34 more)

### Community 4 - "Backend Quiz Grading & Results"
Cohesion: 0.10
Nodes (17): resultService, QuestionSetRepository, SubmissionRepository, mapQuestionSet(), mapQuestionType(), mapStatus(), parseStatus(), parseType() (+9 more)

### Community 5 - "Frontend Admin & User Management"
Cohesion: 0.18
Nodes (14): AdminLayout(), AdminLayoutProps, NAV_ITEMS, StudentForm(), StudentFormProps, StudentFormValue, apiClient, ApiEnvelope (+6 more)

### Community 6 - "Backend Server Bootstrap"
Cohesion: 0.13
Nodes (14): app, frontendDistPath, __dirname, env, envSchema, errorHandler(), loggingMiddleware, ALLOWED_MIME_TYPES (+6 more)

### Community 7 - "Frontend App Bootstrap & Auth Context"
Cohesion: 0.17
Nodes (9): SplashScreen(), SplashScreenProps, AuthContext, AuthContextValue, AuthProvider(), AuthProviderProps, AppRoutes(), authService (+1 more)

### Community 8 - "Frontend Local Storage Service"
Cohesion: 0.23
Nodes (13): getAdmins(), getQuestionSets(), getResults(), getStudents(), loadFromStorage(), saveToStorage(), setAdmins(), setQuestionSets() (+5 more)

### Community 9 - "Backend Modules Placeholder Docs"
Cohesion: 0.25
Nodes (8): answers/ module (answer processing and grading), auth/ module (login/session workflows), Backend Modules (future extension placeholders), Current layered implementation (routes/controllers/services/repositories/validation), questionSets/ module (quiz set management), questions/ module (question-level operations), results/ module (submission history and reports), users/ module (user lifecycle and profile features)

## Knowledge Gaps
- **68 isolated node(s):** `prisma`, `prisma`, `prisma`, `frontendDistPath`, `__dirname` (+63 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createApiResponse()` connect `Backend API Routes & Validation` to `Backend Auth & User Services`, `Backend Quiz Grading & Results`, `Backend Server Bootstrap`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `prisma`, `prisma`, `prisma` to the rest of the system?**
  _68 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Quiz & Student Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.06491398896462187 - nodes in this community are weakly interconnected._
- **Should `Backend Auth & User Services` be split into smaller, more focused modules?**
  _Cohesion score 0.05134575569358178 - nodes in this community are weakly interconnected._
- **Should `Frontend Course Content Renderer` be split into smaller, more focused modules?**
  _Cohesion score 0.06696428571428571 - nodes in this community are weakly interconnected._
- **Should `Backend API Routes & Validation` be split into smaller, more focused modules?**
  _Cohesion score 0.06663141195134849 - nodes in this community are weakly interconnected._
- **Should `Backend Quiz Grading & Results` be split into smaller, more focused modules?**
  _Cohesion score 0.09966777408637874 - nodes in this community are weakly interconnected._
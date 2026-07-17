# Graph Report - plc-mc  (2026-07-18)

## Corpus Check
- 126 files · ~28,793 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 490 nodes · 1090 edges · 35 communities (26 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a091c55b`
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
- app.ts
- course.ts
- ChapterFlowRenderer.tsx
- ContentSectionPage.tsx
- courseService.ts
- HomeButtonRepository
- HttpError
- uploadRoutes.ts

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 22 edges
2. `CourseRepository` - 15 edges
3. `UserRepository` - 15 edges
4. `createApiResponse()` - 15 edges
5. `HomeButtonRepository` - 13 edges
6. `QuestionSetRepository` - 13 edges
7. `AdminLayout()` - 13 edges
8. `QuestionSet` - 13 edges
9. `HttpError` - 12 edges
10. `resolveAssetSrc()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `errorHandler()` --calls--> `createApiResponse()`  [EXTRACTED]
  backend/src/middleware/errorHandler.ts → backend/src/utils/apiResponse.ts
- `ContentBlockPreviewModalProps` --references--> `ContentBlock`  [EXTRACTED]
  frontend/src/components/admin/ContentBlockPreviewModal.tsx → frontend/src/types/course.ts
- `RoleGuardProps` --references--> `UserRole`  [EXTRACTED]
  frontend/src/components/auth/RoleGuard.tsx → frontend/src/types/quiz.ts
- `ChapterFlowRendererProps` --references--> `ChapterPage`  [EXTRACTED]
  frontend/src/components/chapters/ChapterFlowRenderer.tsx → frontend/src/types/course.ts
- `QuizPage()` --calls--> `useAuth()`  [EXTRACTED]
  frontend/src/components/chapters/QuizPage.tsx → frontend/src/hooks/useAuth.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Future domain module folders under backend/src/modules** — backend_src_modules_readme_authmodule, backend_src_modules_readme_usersmodule, backend_src_modules_readme_questionsetsmodule, backend_src_modules_readme_questionsmodule, backend_src_modules_readme_answersmodule, backend_src_modules_readme_resultsmodule [EXTRACTED 1.00]

## Communities (35 total, 9 thin omitted)

### Community 0 - "Frontend Quiz & Student Pages"
Cohesion: 0.06
Nodes (57): AdminLayout(), AdminLayoutProps, NAV_ITEMS, ConfirmModal(), ConfirmModalProps, RoleGuard(), RoleGuardProps, AppShell() (+49 more)

### Community 1 - "Backend Auth & User Services"
Cohesion: 0.10
Nodes (19): userController, userService, UserRepository, AuthService, toApiUser(), toRole(), CreateUserInput, toRole() (+11 more)

### Community 2 - "Frontend Course Content Renderer"
Cohesion: 0.06
Nodes (53): ContentBlockPreviewModal(), ContentBlockPreviewModalProps, ChapterFlowRenderer(), ChapterFlowRendererProps, getSectionTitle(), ChapterHeader(), ChapterHeaderProps, DIRECTION_BY_POSITION (+45 more)

### Community 3 - "Backend API Routes & Validation"
Cohesion: 0.20
Nodes (12): chapterIdParamSchema, contentBlockSchema, contentSectionConfigSchema, interactivePracticeConfigSchema, mediaConfigSchema, narrationConfigSchema, pageIdParamSchema, quizConfigSchema (+4 more)

### Community 4 - "Backend Quiz Grading & Results"
Cohesion: 0.09
Nodes (19): prisma, questionSetService, resultService, QuestionSetRepository, SubmissionRepository, mapQuestionSet(), mapQuestionType(), mapStatus() (+11 more)

### Community 5 - "Frontend Admin & User Management"
Cohesion: 0.29
Nodes (9): AdminHomeButtonsPage(), EMPTY_FORM, FormState, targetLabel(), StudentQuestionSetsPage(), homeButtonApiService, UpsertHomeButtonPayload, HomeButton (+1 more)

### Community 6 - "Backend Server Bootstrap"
Cohesion: 0.06
Nodes (14): CourseRepository, HomeButtonRepository, ChapterPageResponse, CourseChapterResponse, CourseResponse, homeButtonRepository, mapChapter(), mapPage() (+6 more)

### Community 7 - "Frontend App Bootstrap & Auth Context"
Cohesion: 0.17
Nodes (9): SplashScreen(), SplashScreenProps, AuthContext, AuthContextValue, AuthProvider(), AuthProviderProps, AppRoutes(), authService (+1 more)

### Community 8 - "Frontend Local Storage Service"
Cohesion: 0.23
Nodes (13): getAdmins(), getQuestionSets(), getResults(), getStudents(), loadFromStorage(), saveToStorage(), setAdmins(), setQuestionSets() (+5 more)

### Community 9 - "Backend Modules Placeholder Docs"
Cohesion: 0.25
Nodes (8): answers/ module (answer processing and grading), auth/ module (login/session workflows), Backend Modules (future extension placeholders), Current layered implementation (routes/controllers/services/repositories/validation), questionSets/ module (quiz set management), questions/ module (question-level operations), results/ module (submission history and reports), users/ module (user lifecycle and profile features)

### Community 25 - "validation.ts"
Cohesion: 0.53
Nodes (4): validateQuestion(), validateQuestionSetForPublish(), validateRequiredText(), ValidationResult

### Community 27 - "app.ts"
Cohesion: 0.17
Nodes (11): app, frontendDistPath, __dirname, env, envSchema, errorHandler(), loggingMiddleware, UPLOADS_DIR (+3 more)

### Community 28 - "course.ts"
Cohesion: 0.24
Nodes (8): authController, authService, authMiddleware(), roleMiddleware(), authRoutes, ApiResponse, createApiResponse(), loginSchema

### Community 29 - "ChapterFlowRenderer.tsx"
Cohesion: 0.31
Nodes (7): questionSetController, questionSetRoutes, choiceSchema, questionSchema, questionSetIdParamSchema, updateStatusSchema, upsertQuestionSetSchema

### Community 30 - "ContentSectionPage.tsx"
Cohesion: 0.36
Nodes (6): validateBody(), validateParams(), userRoutes, createUserSchema, updateUserSchema, userIdParamSchema

### Community 31 - "courseService.ts"
Cohesion: 0.28
Nodes (4): courseController, uploadController, courseService, HttpError

### Community 32 - "HomeButtonRepository"
Cohesion: 0.32
Nodes (5): resultController, courseRoutes, resultRoutes, answerSchema, submitResultSchema

### Community 33 - "HttpError"
Cohesion: 0.24
Nodes (7): homeButtonController, homeButtonRoutes, homeButtonService, chapterTargetSchema, homeButtonIdParamSchema, routeTargetSchema, upsertHomeButtonSchema

### Community 34 - "uploadRoutes.ts"
Cohesion: 0.32
Nodes (6): ALLOWED_MEDIA_MIME_TYPES, ALLOWED_MIME_TYPES, storage, uploadImage, uploadMedia, uploadRoutes

## Knowledge Gaps
- **80 isolated node(s):** `prisma`, `prisma`, `prisma`, `frontendDistPath`, `__dirname` (+75 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `HttpError` connect `courseService.ts` to `HttpError`, `Backend Auth & User Services`, `Backend Quiz Grading & Results`, `Backend Server Bootstrap`, `app.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `prisma`, `prisma`, `prisma` to the rest of the system?**
  _80 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Quiz & Student Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.061872909698996656 - nodes in this community are weakly interconnected._
- **Should `Backend Auth & User Services` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Frontend Course Content Renderer` be split into smaller, more focused modules?**
  _Cohesion score 0.055379746835443035 - nodes in this community are weakly interconnected._
- **Should `Backend Quiz Grading & Results` be split into smaller, more focused modules?**
  _Cohesion score 0.08897959183673469 - nodes in this community are weakly interconnected._
- **Should `Backend Server Bootstrap` be split into smaller, more focused modules?**
  _Cohesion score 0.05574912891986063 - nodes in this community are weakly interconnected._
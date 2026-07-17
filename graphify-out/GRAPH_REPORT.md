# Graph Report - plc-mc  (2026-07-17)

## Corpus Check
- 126 files · ~28,603 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 486 nodes · 1082 edges · 36 communities (25 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1820f735`
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
- homeButtonService.ts
- InteractivePracticePage.tsx

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
- `ContentBlockPreviewModal()` --calls--> `resolveAssetSrc()`  [EXTRACTED]
  frontend/src/components/admin/ContentBlockPreviewModal.tsx → frontend/src/utils/assets.ts
- `RoleGuardProps` --references--> `UserRole`  [EXTRACTED]
  frontend/src/components/auth/RoleGuard.tsx → frontend/src/types/quiz.ts
- `ChapterFlowRendererProps` --references--> `ChapterPage`  [EXTRACTED]
  frontend/src/components/chapters/ChapterFlowRenderer.tsx → frontend/src/types/course.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Future domain module folders under backend/src/modules** — backend_src_modules_readme_authmodule, backend_src_modules_readme_usersmodule, backend_src_modules_readme_questionsetsmodule, backend_src_modules_readme_questionsmodule, backend_src_modules_readme_answersmodule, backend_src_modules_readme_resultsmodule [EXTRACTED 1.00]

## Communities (36 total, 11 thin omitted)

### Community 0 - "Frontend Quiz & Student Pages"
Cohesion: 0.06
Nodes (55): AdminLayout(), AdminLayoutProps, NAV_ITEMS, RoleGuard(), RoleGuardProps, ChapterHeaderProps, AppShell(), AppShellProps (+47 more)

### Community 1 - "Backend Auth & User Services"
Cohesion: 0.09
Nodes (20): authService, userController, userService, UserRepository, AuthService, toApiUser(), toRole(), CreateUserInput (+12 more)

### Community 2 - "Frontend Course Content Renderer"
Cohesion: 0.13
Nodes (13): MediaPage(), MediaPageProps, QuizPageProps, AdminChapterEditorPage(), ContentBlockListEditor(), defaultConfigFor(), MediaForm(), NarrationForm() (+5 more)

### Community 3 - "Backend API Routes & Validation"
Cohesion: 0.06
Nodes (49): authController, questionSetController, resultController, uploadController, authMiddleware(), roleMiddleware(), ALLOWED_MEDIA_MIME_TYPES, ALLOWED_MIME_TYPES (+41 more)

### Community 4 - "Backend Quiz Grading & Results"
Cohesion: 0.10
Nodes (19): prisma, questionSetService, resultService, QuestionSetRepository, SubmissionRepository, mapQuestionSet(), mapQuestionType(), mapStatus() (+11 more)

### Community 5 - "Frontend Admin & User Management"
Cohesion: 0.18
Nodes (12): ConfirmModal(), ConfirmModalProps, AdminHomeButtonsPage(), EMPTY_FORM, FormState, targetLabel(), StudentQuestionSetsPage(), ApiEnvelope (+4 more)

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
Cohesion: 0.27
Nodes (12): getChapterById(), getCourse(), invalidateCourseCache(), AdminCourseContentPage(), ChaptersPage(), DynamicChapterPage(), courseApiService, UpsertPagePayload (+4 more)

### Community 29 - "ChapterFlowRenderer.tsx"
Cohesion: 0.17
Nodes (12): ChapterFlowRenderer(), ChapterFlowRendererProps, getSectionTitle(), ChapterHeader(), NarrationPage(), NarrationPageProps, QuizPage(), SlideshowPage() (+4 more)

### Community 30 - "ContentSectionPage.tsx"
Cohesion: 0.21
Nodes (11): ContentBlockPreviewModal(), ContentBlockPreviewModalProps, DIRECTION_BY_POSITION, getContentBlockLayoutStyle(), ContentSectionPage(), ContentSectionPageProps, TypingAnimation(), TypingAnimationProps (+3 more)

### Community 31 - "courseService.ts"
Cohesion: 0.18
Nodes (10): courseController, ChapterPageResponse, CourseChapterResponse, CourseResponse, courseService, homeButtonRepository, mapChapter(), mapPage() (+2 more)

### Community 33 - "HttpError"
Cohesion: 0.32
Nodes (3): homeButtonController, homeButtonService, HttpError

### Community 34 - "homeButtonService.ts"
Cohesion: 0.25
Nodes (4): courseRepository, HomeButtonResponse, repository, UpsertHomeButtonInput

### Community 35 - "InteractivePracticePage.tsx"
Cohesion: 0.47
Nodes (4): InteractivePracticePage(), InteractivePracticePageProps, PLCSimulator(), InteractivePracticePageConfig

## Knowledge Gaps
- **80 isolated node(s):** `prisma`, `prisma`, `prisma`, `frontendDistPath`, `__dirname` (+75 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CourseRepository` connect `Backend Server Bootstrap` to `homeButtonService.ts`, `courseService.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `HttpError` connect `HttpError` to `Backend Auth & User Services`, `homeButtonService.ts`, `Backend Quiz Grading & Results`, `app.ts`, `courseService.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `HomeButtonRepository` connect `HomeButtonRepository` to `homeButtonService.ts`, `courseService.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `prisma`, `prisma`, `prisma` to the rest of the system?**
  _80 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Quiz & Student Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.06478578892371996 - nodes in this community are weakly interconnected._
- **Should `Backend Auth & User Services` be split into smaller, more focused modules?**
  _Cohesion score 0.0919661733615222 - nodes in this community are weakly interconnected._
- **Should `Frontend Course Content Renderer` be split into smaller, more focused modules?**
  _Cohesion score 0.1341991341991342 - nodes in this community are weakly interconnected._
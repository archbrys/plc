# Graph Report - backend  (2026-07-21)

## Corpus Check
- 63 files · ~527,636 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 261 nodes · 511 edges · 22 communities (15 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cdb8dac1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- homeButtonRoutes.ts
- domain.ts
- questionSetService.ts
- app.ts
- resultService.ts
- courseRoutes.ts
- CourseRepository
- homeButtonService.ts
- HomeButtonRepository
- courseService.ts
- HttpError
- migrate-content-blocks.ts
- seed.js
- seed.ts
- express-session.d.ts
- README.md

## God Nodes (most connected - your core abstractions)
1. `CourseRepository` - 15 edges
2. `UserRepository` - 15 edges
3. `createApiResponse()` - 15 edges
4. `HomeButtonRepository` - 13 edges
5. `QuestionSetRepository` - 13 edges
6. `SubmissionRepository` - 12 edges
7. `HttpError` - 12 edges
8. `prisma` - 9 edges
9. `authMiddleware()` - 9 edges
10. `QuestionSetService` - 9 edges

## Surprising Connections (you probably didn't know these)
- `errorHandler()` --calls--> `createApiResponse()`  [EXTRACTED]
  src/middleware/errorHandler.ts → src/utils/apiResponse.ts
- `authMiddleware()` --calls--> `createApiResponse()`  [EXTRACTED]
  src/middleware/authMiddleware.ts → src/utils/apiResponse.ts
- `roleMiddleware()` --calls--> `createApiResponse()`  [EXTRACTED]
  src/middleware/roleMiddleware.ts → src/utils/apiResponse.ts

## Import Cycles
- None detected.

## Communities (22 total, 7 thin omitted)

### Community 0 - "homeButtonRoutes.ts"
Cohesion: 0.09
Nodes (31): authController, uploadController, authMiddleware(), roleMiddleware(), validateBody(), validateParams(), authRoutes, courseRoutes (+23 more)

### Community 1 - "domain.ts"
Cohesion: 0.09
Nodes (20): authService, userController, userService, UserRepository, AuthService, toApiUser(), toRole(), CreateUserInput (+12 more)

### Community 2 - "questionSetService.ts"
Cohesion: 0.15
Nodes (12): questionSetController, questionSetService, QuestionSetRepository, mapQuestionSet(), mapQuestionType(), mapStatus(), parseStatus(), parseType() (+4 more)

### Community 3 - "app.ts"
Cohesion: 0.11
Nodes (18): app, frontendDistPath, __dirname, env, envSchema, errorHandler(), loggingMiddleware, ALLOWED_MEDIA_MIME_TYPES (+10 more)

### Community 4 - "resultService.ts"
Cohesion: 0.13
Nodes (9): prisma, resultController, resultService, SubmissionRepository, gradeQuestion(), mapResult(), ResultService, QuizResultDTO (+1 more)

### Community 5 - "courseRoutes.ts"
Cohesion: 0.19
Nodes (13): chapterIdParamSchema, contentBlockSchema, contentSectionConfigSchema, interactivePracticeConfigSchema, mediaConfigSchema, narrationConfigSchema, pageIdParamSchema, quizConfigSchema (+5 more)

### Community 7 - "homeButtonService.ts"
Cohesion: 0.18
Nodes (7): homeButtonController, courseRepository, HomeButtonResponse, homeButtonService, repository, submissionRepository, UpsertHomeButtonInput

### Community 9 - "courseService.ts"
Cohesion: 0.22
Nodes (8): ChapterPageResponse, CourseChapterResponse, CourseResponse, homeButtonRepository, mapChapter(), mapPage(), repository, UpsertPageInput

### Community 10 - "HttpError"
Cohesion: 0.33
Nodes (3): courseController, courseService, HttpError

## Knowledge Gaps
- **50 isolated node(s):** `prisma`, `prisma`, `prisma`, `frontendDistPath`, `__dirname` (+45 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CourseRepository` connect `CourseRepository` to `courseService.ts`, `homeButtonService.ts`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `HttpError` connect `HttpError` to `homeButtonRoutes.ts`, `domain.ts`, `questionSetService.ts`, `app.ts`, `resultService.ts`, `homeButtonService.ts`, `courseService.ts`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `HomeButtonRepository` connect `HomeButtonRepository` to `courseService.ts`, `homeButtonService.ts`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **What connects `prisma`, `prisma`, `prisma` to the rest of the system?**
  _50 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `homeButtonRoutes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09131205673758866 - nodes in this community are weakly interconnected._
- **Should `domain.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0919661733615222 - nodes in this community are weakly interconnected._
- **Should `app.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
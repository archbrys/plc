# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

PLC-MC: a single-server, offline-first quiz/course app for teaching PLC (Programmable Logic Controller) concepts, designed to be deployed on a Raspberry Pi and served on the LAN (`raspberrypi.local`). Express serves both the REST API and the built React frontend from one process — no cloud dependency.

## Commands

Run from the repo root (npm workspaces: `frontend`, `backend`).

- `npm run dev` — run backend (`tsx watch`) and frontend (`vite`) concurrently
- `npm run dev:backend` / `npm run dev:frontend` — run one side only
- `npm run build` — build frontend then backend (`prisma generate && tsc`)
- `npm start` — start the production server (`backend/dist/server.js`), which serves `frontend/dist` as static files
- `npm run lint` — lint frontend then backend (each uses flat-config eslint, no test runner is configured)
- `npm run prisma:migrate` — `prisma migrate dev` against `backend/prisma/schema.prisma`
- `npm run prisma:seed` — seed via `backend/prisma/seed.ts` (creates 1 admin + 2 students + sample quizzes)

Backend dev server runs at `http://localhost:3000`; Vite dev server proxies `/api` to it. There is no test suite in this repo — do not invent test commands.

## Architecture

**Single-server model**: in production, Express (`backend/src/app.ts`) serves `/api/*` routes, then falls back to serving `frontend/dist` as static files with an SPA catch-all (`index.html`) for React Router. Session cookies (`express-session`, cookie name `plc_mc_sid`) gate access; CORS only matters in dev (`FRONTEND_DEV_ORIGIN`).

**Backend layering** (`backend/src/`): `routes/` → `controllers/` → `services/` → `repositories/` (Prisma). Controllers only do input/output orchestration; business logic lives in services; data access goes through repositories. Request bodies are validated with Zod schemas in `validation/` via the `validate` middleware. `authMiddleware`/`roleMiddleware` protect routes; roles are `ADMIN` and `STUDENT`. All responses use the `ApiEnvelope<T>` shape (`{ success, message, data }`) defined in `shared/types/api.ts` and built with `utils/apiResponse.ts`. The `modules/` folders are placeholders for future feature growth, not the active implementation.

**Data model** (`backend/prisma/schema.prisma`, SQLite): two largely independent domains share one DB:
- **Quiz domain**: `QuestionSet` → `Question` → `Choice`, plus `Submission`/`StudentAnswer` for grading. Question types: `MULTIPLE_CHOICE`, `TRUE_FALSE`, `SHORT_ANSWER`. Question sets have a `DRAFT`/`PUBLISHED`/`ARCHIVED` lifecycle.
- **Course domain**: `Course` → `CourseChapter` → `ChapterPage`. Each `ChapterPage` has a `type` (`slideshow` | `narration` | `content_section` | `interactive_practice` | `quiz`) and a `config` column holding a JSON string whose shape depends on `type`. This is a generic, DB-driven content pipeline that replaced the old hardcoded `Chapter1*`/`Chapter2*` page components (now deleted) — new chapter content should be authored as `ChapterPage` rows/config, not new React page files per chapter.

**Frontend course rendering** (`frontend/src/`): `services/courseApiService.ts` fetches the course tree from `/api/course`; `data/course.ts` caches it (memory + `localStorage`) and exposes `getCourse`/`getChapterById`/`getSectionById`. `components/chapters/ChapterFlowRenderer.tsx` is the generic dispatcher: given a `ChapterPage`, it switches on `page.type` and renders the matching component (`SlideshowPage`, `NarrationPage`, `ContentSectionPage`, `InteractivePracticePage`, `QuizPage`), casting `page.config` to that page type's config interface (`types/course.ts`). `pages/student/DynamicChapterPage.tsx` (route `/student/chapters/:chapterId/flow`) drives a chapter by walking its pages through this renderer. Older per-chapter routes (`CourseChapterPage`, `CourseSectionPage`) are kept as aliases alongside the new dynamic flow.

**Auth**: session-based; `AuthContext`/`useAuth` on the frontend, `RoleGuard` wraps route trees by role (`allowedRole="student"|"admin"`) in `routes/AppRoutes.tsx`. Passwords/PINs are bcrypt-hashed. Students log in with `studentId`+PIN, admins with `username`+password.

**Environment**: root `.env` (see `.env.example`) — `PORT`, `NODE_ENV`, `SESSION_SECRET`, `FRONTEND_DEV_ORIGIN`.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

`graphify-out/graph.json` exists in this repo, which makes the rules below MANDATORY, not optional — this has been missed before by defaulting to grep/Explore/Read out of habit. Before any codebase exploration (a "where is X", "how does Y work", "what calls Z" question, or orienting yourself before an edit), you MUST run graphify first:

- `graphify query "<question>"` for general codebase questions
- `graphify path "<A>" "<B>"` for relationships between two things
- `graphify explain "<concept>"` for a focused concept
- These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep/Read/Explore output. Only fall back to grep, Explore, or reading raw source once graphify has oriented you and you need specific line-level detail, or if graphify's output genuinely doesn't surface enough.
- This rule applies to subagents too — when delegating codebase exploration to a subagent (Explore, general-purpose, etc.), include this graphify requirement in the subagent's prompt, since a fresh subagent has no memory of this file.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

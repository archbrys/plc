# Configurable Home Screen Buttons — Design

## Problem

After login, students land on `/student/plc`, which currently renders a single hardcoded hero button ("PROGRAMMABLE LOGIC CONTROLLER") that kicks off a fixed React page sequence (`PLCIntroPage` → `PLCFundamentalsPage` → `StudentCharactersPage` → `PLCWelcomePage` → `PLCChapterSelectPage` → `ChaptersPage`), ending in the DB-driven chapter flow (`DynamicChapterPage`).

We want admins to be able to add more entry points from this home screen (e.g. "Learnings" with uploaded videos/files, and other future buttons) without a code change per button, while leaving the existing PLC flow untouched.

## Goals

- Admin-managed, ordered list of home screen buttons (add / edit / delete / reorder).
- Each button targets either an existing course chapter (dynamic flow) or a fixed internal route.
- The current PLC button becomes a row in this same list (route-targeted), so its position/label can be managed alongside new buttons, but its underlying flow is not touched.
- Support a new "media" chapter page type so admins can build a chapter (e.g. "Learnings") containing uploaded videos or downloadable files, using the existing chapter-authoring UI and page-flow renderer.

## Non-goals

- No multi-course support (the app still has exactly one global `Course`).
- No arbitrary icon/image upload for buttons — buttons keep the existing hero-box text-button style.
- No change to the existing PLC intro sequence's own pages/components.

## Data model

New Prisma model:

```prisma
model HomeButton {
  id          Int            @id @default(autoincrement())
  label       String
  orderNumber Int
  targetType  String         // 'CHAPTER' | 'ROUTE'
  chapterId   Int?
  chapter     CourseChapter? @relation(fields: [chapterId], references: [id], onDelete: Restrict)
  route       String?
  isActive    Boolean        @default(true)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@index([chapterId])
}
```

- `targetType: 'CHAPTER'` → `chapterId` set, `route` null. Button navigates to `/student/chapters/:chapterId/flow`.
- `targetType: 'ROUTE'` → `route` set (must start with `/`), `chapterId` null. Button navigates directly to that route. Used for the PLC row (`/student/plc-intro`); available to any admin-created button too.
- `onDelete: Restrict` on `chapterId` — SQLite rejects deleting a `CourseChapter` still referenced by a `HomeButton`; the service layer catches the FK error and returns a descriptive conflict message.

**Migration & seed data**: the migration includes a raw-SQL backfill inserting the PLC row (`label: 'Programmable Logic Controller'`, `targetType: 'ROUTE'`, `route: '/student/plc-intro'`, `orderNumber: 1`, `isActive: true`) so existing Pi deployments get it without re-running the (destructive, dev-only) seed script. `backend/prisma/seed.ts` is updated to create the same row for fresh dev databases.

New chapter page type, extending the existing `ChapterPageType` union (`slideshow | narration | content_section | interactive_practice | quiz | media`):

```ts
interface MediaPageConfig {
  title: string
  mediaType: 'video' | 'file'
  url: string
  description?: string
}
```

One media item per page (matches the `narration` pattern) — a chapter with several videos/files is authored as several `media` pages.

## Backend

**Routes** (new `homeButtonRoutes.ts`, following the existing routes → controllers → services → repositories layering):

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/home-buttons` | any authenticated user | active buttons, ordered, for the student home screen |
| POST | `/api/home-buttons` | admin | create |
| PUT | `/api/home-buttons/:id` | admin | edit label/target/active |
| DELETE | `/api/home-buttons/:id` | admin | remove (does not touch the linked chapter) |
| POST | `/api/home-buttons/reorder` | admin | persist new `orderNumber` sequence, mirrors `courseRoutes` chapter reorder |

Zod validation (`validation/homeButtonSchemas.ts`): label required; `targetType === 'CHAPTER'` ⇒ `chapterId` required, `route` must be absent; `targetType === 'ROUTE'` ⇒ `route` required and must start with `/`, `chapterId` must be absent.

Chapter deletion (`courseService`) is updated to catch the FK-restrict error from Prisma and re-throw as an `HttpError` (409) with a message naming the blocking button(s), surfaced through `AdminCourseContentPage`'s existing error banner.

**Uploads**: `uploadMiddleware.ts` gets a second multer instance for media (`video/mp4`, `video/webm`, `application/pdf`), 200MB size limit (Pi-local disk), same disk-storage/UUID-filename approach as the existing image uploader. New route `POST /api/uploads/media`, admin-only, same auth pattern as `/uploads/image`. Files are served statically from `/uploads/...` exactly like images today — no new serving logic needed.

## Frontend

- **`types/course.ts`**: add `MediaPageConfig` and the `media` variant to `ChapterPageConfig`/`ChapterPage`. New `types/homeButton.ts` for the `HomeButton` type.
- **`services/homeButtonApiService.ts`**: `getHomeButtons`, `createHomeButton`, `updateHomeButton`, `deleteHomeButton`, `reorderHomeButtons` — same shape as `courseApiService`.
- **`services/uploadService.ts`**: add `uploadMedia(file, mediaType)` hitting `/api/uploads/media`.
- **`pages/student/StudentQuestionSetsPage.tsx`**: fetch `getHomeButtons()` on mount; render each active button (ordered) as a `.hero-box.hero-box-btn`, stacked vertically in place of the single hardcoded button. Click handler: `targetType === 'CHAPTER'` → `navigate(/student/chapters/${chapterId}/flow)`; `'ROUTE'` → `navigate(route)`.
- **`components/chapters/ChapterFlowRenderer.tsx`**: add a `case 'media':` branch (with a `MisconfiguredPage` guard when `url` is missing) rendering the new `MediaPage.tsx` (video tag for `mediaType: 'video'`, download link for `'file'`).
- **`components/admin/AdminLayout.tsx`**: add a `Home Buttons` nav entry → `/admin/home-buttons`.
- **`pages/admin/AdminHomeButtonsPage.tsx`** (new): table of buttons (label, resolved target, active, move up/down, edit, delete) mirroring `AdminCourseContentPage`'s table + `ConfirmModal` pattern; create/edit form with label, target-type radio (chapter dropdown sourced from `courseApiService.getCourse()`, or route text input), active checkbox.
- **`pages/admin/AdminChapterEditorPage.tsx`**: add a `MediaForm` (title, video/file radio, file input wired to `uploadService.uploadMedia`, description, preview) alongside the existing per-type forms.
- **`routes/AppRoutes.tsx`**: add `/admin/home-buttons` route under the existing admin `RoleGuard`.

## Edge cases

- Deleting a chapter referenced by a `HomeButton` → blocked with a descriptive error (see Backend section).
- Deleting a `HomeButton` never affects the chapter it pointed at.
- A `HomeButton` with `isActive: false` is excluded from `GET /api/home-buttons` (soft-hide without deleting), still editable in the admin list.
- `route` values are validated server-side to start with `/`, preventing garbage input from breaking client-side `navigate()`.
- Home screen with zero active buttons renders an empty state (should not happen in practice since the PLC row is seeded, but the migration/seed guarantees at least one row exists).

## Testing / verification

No test suite exists in this repo. Verification is manual, per the project's `run`/`verify` workflow: run `npm run prisma:migrate`, confirm the PLC row is backfilled, start `npm run dev`, and walk through:

1. Student login → home screen shows the PLC button, clicking it still reaches the existing intro flow unchanged.
2. Admin creates a chapter with a `media` page (upload a small video and a PDF), creates a new "Learnings" home button targeting that chapter, reorders it above/below PLC, confirms it appears correctly on the student home screen and plays/downloads the media.
3. Admin attempts to delete the "Learnings" chapter while the button still references it → sees the blocking error; deletes the button first, then the chapter delete succeeds.

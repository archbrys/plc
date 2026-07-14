# Student Page Layout UI Improvement

## Problem

Student-facing pages currently rely on document/body scroll (`.landing-page`, `.chapters-page`, `.characters-page`, `.app-shell` all use `min-height: 100vh`). Primary "Next"/"Continue"/"Ready" action buttons scroll with page content instead of staying reachable. The `/flow` chapter route (`ChapterHeader`) and `DynamicChapterPage`'s fallback states show a raw Logout button instead of the app's existing name/menu dropdown (`StudentMenu`).

## Scope

All student-facing pages in `frontend/src/pages/student/` and `frontend/src/components/chapters/`:

- `ChaptersPage`, `PLCChapterSelectPage`, `PLCFundamentalsPage`, `PLCIntroPage`, `PLCWelcomePage`, `StudentCharactersPage`, `StudentQuestionSetsPage`, `StudentQuizCompletionPage`, `StudentResultPage` (via `AppShell`), `DynamicChapterPage`
- `ChapterFlowRenderer` and its sub-pages: `SlideshowPage`, `NarrationPage`, `ContentSectionPage`, `InteractivePracticePage`, `QuizPage`

Out of scope: admin pages, non-student routes, StudentMenu's own internal behavior.

`StudentCharactersPage` and `StudentQuizCompletionPage` currently render no header at all — this stays as-is; only `/flow` (`ChapterHeader` + `DynamicChapterPage` fallback states) gets the StudentMenu swap, since every other page already uses `StudentMenu`.

## Design

### 1. Fixed viewport shell, internal scroll containers (no body scroll)

`ChapterFlowRenderer.css` already establishes the target pattern:
```css
.chapter-flow-shell { position: fixed; inset: 0; display: flex; flex-direction: column; overflow: hidden; }
```
with each page body as the scrollable region (e.g. `.narration-page-content { flex: 1 1 auto; min-height: 0; overflow: auto; }`).

Generalize this app-wide:

- `index.css`: add `html, body, #root { height: 100%; overflow: hidden; }` as the global scroll-lock.
- Convert `.landing-page`, `.chapters-page`, `.characters-page`, and `.app-shell` (in `index.css` / their component CSS) from `min-height: 100vh` to `height: 100%; display: flex; flex-direction: column; overflow: hidden;`.
- Each page's `<main>` / primary content region becomes the scroll container: `flex: 1 1 auto; min-height: 0; overflow-y: auto;`.
- Headers (`.landing-header`, `.chapters-header`, `.app-header`, `ChapterHeader`) remain non-scrolling flex children above the scroll container — unchanged in position, just no longer able to scroll off-screen.
- `StudentCharactersPage` already uses `overflow: hidden` on its root with an internal `.characters-content`; verify/align it to the same convention (`flex: 1 1 auto; min-height: 0; overflow-y: auto` if it needs internal scroll, otherwise leave as-is since it's already non-scrolling).

### 2. Shared fixed bottom-right action button

New shared CSS, added to `index.css`:
```css
.page-action-bar {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  display: flex;
  gap: 0.75rem;
  z-index: 20;
}
```

- Wraps the primary action button(s) — positioning/grouping only, existing button classes (`.ready-btn`, `.btn-next`, `.btn-continue-learning`, `.btn-nav`, etc.) keep their current visual styling (color, label, size).
- Applied on: `PLCChapterSelectPage`, `PLCIntroPage`, `PLCWelcomePage`, `StudentQuizCompletionPage` (single action), `PLCFundamentalsPage` and flow `QuizPage` (Previous + Next/Submit grouped together in one bar, Previous left of Next), and `NarrationPage`, `ContentSectionPage`, `InteractivePracticePage` (single "ready"/"continue" action).
- `StudentCharactersPage`'s `.btn-next-characters` is already absolutely positioned bottom-right; reconcile it to use `.page-action-bar` for consistency (adjusting from `position: absolute` scoped to its overlay, to the shared fixed pattern, unless its containing stacking context requires `absolute` — implementer should verify visually).
- Since the action bar floats over content, each affected scroll container adds `padding-bottom: 5rem` (approx button height + margin) so trailing content isn't hidden behind it.
- Pages with no primary action button (`ChaptersPage`, `StudentQuestionSetsPage`, `StudentResultPage`) are unaffected by this section.

### 3. `/flow` header: StudentMenu instead of Logout button

- `ChapterHeader.tsx`: replace `<button className="btn secondary chapter-flow-header-logout" onClick={logout}>Logout</button>` with `<StudentMenu />`. Remove the now-unused `logout` destructure (if `useAuth()` isn't needed for anything else in the component) and the `.chapter-flow-header-logout` CSS rule.
- `DynamicChapterPage.tsx`: both fallback/error-state renders (currently ad-hoc `.landing-header` with a raw Logout button) switch to `<StudentMenu />`, matching every other student page.

## Testing

No test suite exists in this repo (per `CLAUDE.md`). Verification is manual: `npm run dev`, walk through each affected page in a browser confirming (a) no body scroll / page fills viewport with internal scrolling where content overflows, (b) primary action button(s) stay fixed at bottom-right while scrolling, (c) `/flow` header and `DynamicChapterPage` fallback states show the StudentMenu dropdown instead of a Logout button.

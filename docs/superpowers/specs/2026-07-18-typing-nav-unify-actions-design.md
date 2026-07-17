# Unify Typing-Animation Nav into chapter-section2-actions — Design

## Problem

Today `ContentSectionPage` has two separate navigation rows:

1. `TypingAnimation`'s own `.typing-animation-nav` — Previous/Next buttons that step between content blocks, rendered directly under the typing text.
2. `ContentSectionPage`'s `.chapter-section2-actions` — a single page-level "Next" button that only appears after `TypingAnimation` calls `onComplete()` on the last block.

This means leaving the last block takes two clicks (Next inside `TypingAnimation` to complete it, then Next again in `chapter-section2-actions` to actually advance the page), and there are two visually distinct nav rows doing conceptually the same job.

## Goal

One Previous/Next row, in `chapter-section2-actions`, that drives both block-to-block navigation within the typing animation and the page-level "go to next section" action — a single click on the last block's Next goes straight to the next section.

## Non-goals

- No change to tap-to-skip behavior (clicking the typing text mid-type still jumps to full text).
- No change to `ContentSectionPage`'s `onNext` prop or how it's invoked by its own parent.
- No change to `typingSpeed`, layout (`getContentBlockLayoutStyle`), or image-column rendering.
- No persistence of navigation position — resets on remount, same as today.

## Behavior

**Previous** — disabled when `currentIndex === 0`. Otherwise decrements the index; `TypingAnimation` re-types that block's text from scratch.

**Next** — hidden while the current block is still typing; appears once it's complete (naturally, or via tap-to-skip):
- If not on the last block: increments the index, `TypingAnimation` re-types the next block.
- If on the last block: calls `onNext` directly. No intermediate reveal step.

Both buttons live in `chapter-section2-actions`, visible from first render (Previous starts disabled rather than the whole row being hidden until the first block completes).

## Architecture: lift state out of TypingAnimation

Today `currentContentIndex` is duplicated — `TypingAnimation` owns it internally and separately reports it up via `onIndexChange` for `ContentSectionPage` to read (for the image column / layout). To have one nav row drive both concerns, `ContentSectionPage` becomes the single owner of the index; `TypingAnimation` becomes a controlled display component.

### `TypingAnimation.tsx`

Props change from `{ contents, typingSpeed?, onComplete?, onIndexChange? }` to:

```ts
interface TypingAnimationProps {
  contents: string[]
  currentIndex: number
  typingSpeed?: number
  onTypingStateChange?: (isTyping: boolean) => void
}
```

- `currentIndex` is now a controlled prop. A `useEffect` keyed on `currentIndex` resets `displayedText` to `''` (replaces today's internal `goToIndex`).
- The typing-progress `useEffect` (incrementing `displayedText` on a timeout) is unchanged.
- A new `useEffect` calls `onTypingStateChange?.(isTyping)` whenever `isTyping` changes, so the parent knows when to reveal Next.
- Tap-to-skip (`handleSkip`, wired to the container's `onClick`) is unchanged.
- `onComplete`, `onIndexChange`, `handlePrevious`, `handleNext`, `isFirstContent`, `isLastContent`, and the `.typing-animation-nav` markup are all removed — the parent owns first/last-block logic now.

### `ContentSectionPage.tsx`

- Adds `isTyping` state, set via `onTypingStateChange` passed to `TypingAnimation`.
- Removes `showNextButton` state (superseded by `isTyping`-driven visibility).
- Adds `handlePrevious`/`handleNext`:
  - `handlePrevious`: no-op if `currentIndex === 0`, else `setCurrentIndex(i => i - 1)`.
  - `handleNext`: if `currentIndex < contents.length - 1`, `setCurrentIndex(i => i + 1)`; else calls `onNext?.()`.
- `chapter-section2-actions` always renders (not gated on a boolean), containing:
  - Previous button: `disabled={currentIndex === 0}`, onClick `handlePrevious`.
  - Next button: rendered only when `!isTyping`, onClick `handleNext`.

## CSS

- `.chapter-section2-actions` changes `justify-content` from `flex-end` to `space-between` (Previous left, Next right).
- Previous reuses the small button styling that `.typing-nav-btn` used today (`.btn small`), moved into `ContentSectionPage.css` since `TypingAnimation.css` no longer needs it.
- Next keeps the existing `.btn large ready-btn` styling (unchanged from today's page-level Next).
- `.typing-animation-nav` rule is deleted from `TypingAnimation.css`.

## Error handling

- `contents` with a single block: `currentIndex` is simultaneously first and last. Previous stays disabled; Next (once typing completes) calls `onNext` directly — same as the multi-block last-block case, no special-casing needed.
- Switching blocks mid-type (rapid Previous/Next clicks) is safe: the reset-on-`currentIndex`-change effect and the typing-timeout effect both clean up via React's standard effect cleanup, same as today's `goToIndex` behavior.

## Testing / verification

No test suite exists in this repo. Verification is manual, via the `run` skill in a browser:

1. Open a `content_section` chapter page with multiple content blocks as a student.
2. Confirm Previous is visible but disabled on the first block, and Next is hidden while it types.
3. Tap the text mid-typing — confirm it completes instantly and Next appears.
4. Click Next — confirm it advances to the next block and re-types it (single row, no second button appearing below).
5. Click Previous — confirm it steps back and re-types that block.
6. On the last block, once it's done typing, click Next — confirm it goes straight to the next chapter page (no intermediate click needed).
7. Confirm a `content_section` page with only one block: Previous disabled, Next (after typing completes) goes straight to the next page.

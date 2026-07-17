# Typing Animation Skip & Manual Navigation — Design

## Problem

`TypingAnimation` (`frontend/src/components/common/TypingAnimation.tsx`) types out each content block's text one character at a time, then auto-advances to the next block after a fixed `displayDuration` wait. Students have no way to skip ahead — they must sit through the full type + wait cycle for every block, and can't go back to re-read an earlier block.

## Goals

- Let a student tap/click the typing text to instantly complete the current block's text (skip the typewriter effect).
- Let a student navigate manually between content blocks with Previous / Next buttons.
- Remove the timer-based auto-advance entirely — the only way to move forward is tapping Next.

## Non-goals

- No change to which pages/consumers use `TypingAnimation` (only `ContentSectionPage.tsx` does today).
- No change to `ContentSectionPage`'s own page-level "Next" button or `showNextButton` logic — it still appears via `onComplete`.
- No change to how `contents` (the array of block texts) is produced or supplied.
- No persistence of "furthest block reached" — navigating is just in-memory state, reset on remount.

## Behavior

**Tap-to-skip:** clicking/tapping the typing text area while the current block is still typing immediately sets the displayed text to the full content string and stops the typewriter effect. Tapping again while already complete does nothing (no-op).

**Manual navigation (component-owned Previous/Next buttons):**
- **Previous** — disabled on the first content block (`currentContentIndex === 0`). Otherwise decrements the index and re-types that block's text from scratch (tap-to-skip works the same way).
- **Next** — hidden while the current block is still typing; appears once it's complete (naturally, or via tap-to-skip). Clicking it:
  - If not on the last block: increments the index and re-types the next block's text from scratch.
  - If on the last block: calls `onComplete()` instead of advancing (this is the existing signal `ContentSectionPage` uses to reveal its own page-level Next button).

Revisiting a block (via Previous, or Next back after Previous) always re-types it — there is no "already seen, show instantly" memory, keeping the behavior simple and consistent with a single tap-to-skip rule.

**Tap target:** the tap-to-skip listener is on the typing text/container area only, not the whole viewport, so it doesn't intercept clicks meant for the image column or the page-level Next button.

## Component API changes (`TypingAnimation.tsx`)

Props removed: `displayDuration`, `loop`, `clearSpeed`. All three exist only to support the auto-advance/auto-clear timer being removed; `loop` is always passed `false` by the only consumer, and `clearSpeed`/the internal `isClearing` state are already dead code today (nothing ever sets `isClearing` to `true`).

Props kept: `contents`, `typingSpeed`, `onComplete`, `onIndexChange`.

New rendered markup: a small nav row below the typing text with Previous/Next `<button>`s, reusing the existing global `.btn` class (same family as `ContentSectionPage`'s `ready-btn`) at a smaller size, styled in `TypingAnimation.css`.

## `ContentSectionPage.tsx` changes

Drop the now-removed props (`displayDuration`, `clearSpeed`, `loop`) from its `<TypingAnimation>` call site. `onComplete` and `onIndexChange` wiring is unchanged.

## Error handling

- `contents` with a single block: Previous stays disabled, Next (once typing completes) calls `onComplete` directly since that block is simultaneously first and last — no dead navigation state.
- Rapid double-clicks on Next/Previous during the re-type of the newly-selected block are safe: the tap-to-skip and index-change logic both key off React state, so an in-flight timeout from the previous block is cleared before the new one starts (existing `useEffect` cleanup behavior, unchanged).

## Testing / verification

No test suite exists in this repo. Verification is manual, via the `run` skill in a browser:

1. Open a `content_section` chapter page as a student. Confirm the block types out as before.
2. Tap the text mid-typing — confirm it jumps to the full text instantly and the cursor stops.
3. Confirm Next is hidden while typing, appears once complete, and advances to the next block (re-typing it) when clicked.
4. Confirm Previous is disabled on the first block, and steps back (re-typing) on later blocks.
5. Confirm clicking Next on the last block reveals the page's own "Next" button (via `onComplete`) instead of advancing further.
6. Confirm no auto-advance happens if the student simply waits without tapping anything.

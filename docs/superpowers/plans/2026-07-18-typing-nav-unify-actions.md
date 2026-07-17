# Unify Typing-Animation Nav into chapter-section2-actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the two separate Previous/Next nav rows in `ContentSectionPage` (one inside `TypingAnimation`, one page-level) with a single Previous/Next row in `chapter-section2-actions` that drives both block-to-block typing navigation and the page-level "go to next section" action.

**Architecture:** Lift `currentIndex` (currently duplicated between `TypingAnimation`'s internal state and `ContentSectionPage`'s copy synced via `onIndexChange`) so `ContentSectionPage` is the single owner. `TypingAnimation` becomes a controlled display component: it receives `currentIndex` as a prop and reports `isTyping` up via a new `onTypingStateChange` callback. It no longer renders any nav buttons or knows about first/last-block logic.

**Tech Stack:** React 18 + TypeScript, plain CSS (no CSS modules/Tailwind in these files), Vite dev server. No test runner is configured in this repo — verification is manual (browser) plus `npm run lint` / `tsc` type-checking.

## Global Constraints

- No test suite exists in this repo — do not invent test commands (per repo `CLAUDE.md`). Use `npm run lint` (frontend workspace) and manual browser verification instead of automated tests.
- Only `ContentSectionPage.tsx` consumes `TypingAnimation` today — the prop-signature change has exactly one call site to update (per spec's non-goals).
- Reuse existing global button classes from `frontend/src/index.css`: `.btn` (base), `.btn.large` (min-height 3rem, larger padding/font), `.btn.small` (compact padding/font, `border-radius: 8px`). Do not invent new button size variants.
- Spec source of truth: `docs/superpowers/specs/2026-07-18-typing-nav-unify-actions-design.md`.

---

### Task 1: Unify typing-animation nav into chapter-section2-actions

**Files:**
- Modify: `frontend/src/components/common/TypingAnimation.tsx` (full rewrite of props/state — currently 95 lines)
- Modify: `frontend/src/components/common/TypingAnimation.css` (delete `.typing-animation-nav` rule)
- Modify: `frontend/src/components/chapters/ContentSectionPage.tsx` (currently 70 lines)
- Modify: `frontend/src/components/chapters/ContentSectionPage.css` (`.chapter-section2-actions` rule, add small-button rule)

**Interfaces:**
- Produces: `TypingAnimation` prop signature `{ contents: string[]; currentIndex: number; typingSpeed?: number; onTypingStateChange?: (isTyping: boolean) => void }` — no other file in the repo imports `TypingAnimation`, so this is a closed change.

This is a single task because `TypingAnimation`'s prop-signature change and `ContentSectionPage`'s call-site update are two halves of one contract — committing them separately would leave the build broken in between.

- [ ] **Step 1: Rewrite `TypingAnimation.tsx` as a controlled component**

Replace the full contents of `frontend/src/components/common/TypingAnimation.tsx` with:

```tsx
import { useState, useEffect } from 'react'
import './TypingAnimation.css'

interface TypingAnimationProps {
  contents: string[]
  currentIndex: number
  typingSpeed?: number
  onTypingStateChange?: (isTyping: boolean) => void
}

export function TypingAnimation({
  contents,
  currentIndex,
  typingSpeed = 30,
  onTypingStateChange
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('')

  const currentContent = contents[currentIndex]
  const isTyping = displayedText.length < currentContent.length

  useEffect(() => {
    setDisplayedText('')
  }, [currentIndex])

  useEffect(() => {
    if (displayedText.length < currentContent.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentContent.slice(0, displayedText.length + 1))
      }, typingSpeed)
      return () => clearTimeout(timeout)
    }
  }, [displayedText, currentContent, typingSpeed])

  useEffect(() => {
    onTypingStateChange?.(isTyping)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping])

  const handleSkip = () => {
    if (isTyping) {
      setDisplayedText(currentContent)
    }
  }

  return (
    <div className="typing-animation-wrapper">
      <div className="typing-animation-container" onClick={handleSkip}>
        <div className="typing-animation-text">
          {displayedText.split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < displayedText.split('\n').length - 1 && <br />}
            </span>
          ))}
          {isTyping && <span className="typing-cursor">|</span>}
        </div>
      </div>
    </div>
  )
}
```

Note: `currentContent` can be `undefined` if `currentIndex` is out of range, but `ContentSectionPage` (Step 3) always derives `currentIndex` from `0` up to `contents.length - 1`, so this can't happen in practice — matching the existing non-goal of not adding defensive handling for impossible states.

- [ ] **Step 2: Remove the now-dead `.typing-animation-nav` rule from `TypingAnimation.css`**

In `frontend/src/components/common/TypingAnimation.css`, delete this rule (currently lines 48-52):

```css
.typing-animation-nav {
  flex: 0 0 auto;
  display: flex;
  gap: 0.75rem;
}
```

- [ ] **Step 3: Rewrite `ContentSectionPage.tsx` to own navigation state**

Replace the full contents of `frontend/src/components/chapters/ContentSectionPage.tsx` with:

```tsx
import { useState } from 'react'
import { TypingAnimation } from '../common/TypingAnimation'
import type { ContentSectionPageConfig } from '../../types/course'
import { resolveAssetSrc } from '../../utils/assets'
import { getContentBlockLayoutStyle } from './contentBlockLayout'
import './ContentSectionPage.css'

interface ContentSectionPageProps {
  config: ContentSectionPageConfig
  onNext?: () => void
}

export function ContentSectionPage({ config, onNext }: ContentSectionPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const { contents } = config
  const currentBlock = contents[currentIndex] ?? contents[0]
  const hasText = Boolean(currentBlock?.text?.trim())
  const hasImage = Boolean(currentBlock?.image)
  const isFirstBlock = currentIndex === 0
  const isLastBlock = currentIndex === contents.length - 1

  const handlePrevious = () => {
    if (!isFirstBlock) {
      setCurrentIndex((index) => index - 1)
    }
  }

  const handleNext = () => {
    if (isLastBlock) {
      onNext?.()
      return
    }
    setCurrentIndex((index) => index + 1)
  }

  return (
    <main className="chapter-section2-main">
      <div className="chapter-section2-content">
        <div className="chapter-section2-card">
          <div
            className={`chapter-section2-body-wrapper${
              !hasImage
                ? ' chapter-section2-body-wrapper--text-only'
                : !hasText
                  ? ' chapter-section2-body-wrapper--image-only'
                  : ''
            }`}
            style={hasImage && hasText ? getContentBlockLayoutStyle(currentBlock) : undefined}
          >
            <div
              className={`chapter-section2-text-column${
                hasText ? '' : ' chapter-section2-text-column--hidden'
              }`}
            >
              <TypingAnimation
                contents={contents.map((block) => block.text)}
                currentIndex={currentIndex}
                typingSpeed={30}
                onTypingStateChange={setIsTyping}
              />
            </div>

            {hasImage && (
              <div className="chapter-section2-image-column">
                <img
                  src={resolveAssetSrc(currentBlock.image!)}
                  alt="Section Illustration"
                  className="chapter-section2-image"
                />
              </div>
            )}
          </div>
        </div>

        <div className="chapter-section2-actions">
          <button
            className="btn small"
            type="button"
            onClick={handlePrevious}
            disabled={isFirstBlock}
          >
            Previous
          </button>
          {!isTyping && (
            <button className="btn large ready-btn" type="button" onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Update `chapter-section2-actions` CSS for the two-button layout**

In `frontend/src/components/chapters/ContentSectionPage.css`, change the `.chapter-section2-actions` rule (currently lines 120-125) from:

```css
.chapter-section2-actions {
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
```

to:

```css
.chapter-section2-actions {
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

- [ ] **Step 5: Type-check and lint**

Run:
```bash
cd /Users/archbrys/Workspace/plc-mc && npm run lint --workspace=frontend
```
Expected: no errors. If TypeScript reports an unused-import or type error, re-check Step 1/3 against this plan's code blocks exactly.

- [ ] **Step 6: Manual browser verification**

Use the `run` skill to start the dev server, log in as a student, and open a `content_section` chapter page with multiple content blocks. Verify:
1. Previous is visible but disabled on the first block; Next is hidden while the block is typing.
2. Tapping the typing text mid-type completes it instantly and Next appears.
3. Clicking Next advances to the next block and re-types it — only one nav row is visible, positioned at the bottom of the page (Previous left, Next right).
4. Clicking Previous steps back and re-types that block.
5. On the last block, once typing completes, clicking Next goes straight to the next chapter page (no second click / no intermediate reveal).
6. If any `content_section` page in the seeded course data has only one content block, confirm Previous is disabled throughout and Next (once typing completes) goes straight to the next page.

- [ ] **Step 7: Commit**

```bash
cd /Users/archbrys/Workspace/plc-mc && git add frontend/src/components/common/TypingAnimation.tsx frontend/src/components/common/TypingAnimation.css frontend/src/components/chapters/ContentSectionPage.tsx frontend/src/components/chapters/ContentSectionPage.css && git commit -m "$(cat <<'EOF'
Unify typing-animation nav into chapter-section2-actions

EOF
)"
```

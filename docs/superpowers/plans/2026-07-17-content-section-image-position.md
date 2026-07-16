# Content Section Image Position & Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let admins pick, per content block in a `content_section` chapter page, where the image renders relative to its text (left/right/top/bottom) and what percentage split it gets, with a preview modal to verify the student view before saving.

**Architecture:** Add two optional fields (`imagePosition`, `textPercent`) to the existing `ContentBlock` type/schema. Student rendering (`ContentSectionPage.tsx`) switches from CSS Grid to flexbox, driven by a small shared helper that maps `imagePosition` to a `flex-direction` (via a CSS custom property, so the existing mobile breakpoint can still force stacking) and `textPercent` to a `flex-basis` split. The admin editor gains per-block Image Position/Split controls and a Preview button that opens a modal reusing the same CSS classes and layout helper, statically (no typing animation).

**Tech Stack:** React 19 + TypeScript (frontend), Express + Zod + Prisma (backend). No test runner is configured in this repo — verification is `tsc`/`vite build` type-checking plus manual browser checks, not automated tests.

## Global Constraints

- No test suite exists in this repo; do not invent test commands. Use `npm run build --workspace=frontend` and `npm run build --workspace=backend` (from repo root) for type-safety verification, and manual dev-server checks for behavior.
- Preserve default rendering for every existing block with no stored `imagePosition`/`textPercent`: text left 65% / image right 35%.
- `imagePosition` is the only stored field; text always renders on the opposite side (no separate text-position field, no way to configure a contradictory pairing).
- Follow existing code conventions in the touched files (plain CSS classes, no CSS modules; inline `style` used sparingly and only for genuinely dynamic values).

---

### Task 1: Extend `ContentBlock` type and backend validation

**Files:**
- Modify: `frontend/src/types/course.ts:16-19`
- Modify: `backend/src/validation/courseSchemas.ts:14-22`

**Interfaces:**
- Produces: `ContentBlock.imagePosition?: 'left' | 'right' | 'top' | 'bottom'`, `ContentBlock.textPercent?: number` — consumed by Tasks 2 and 3.

- [ ] **Step 1: Add the new fields to `ContentBlock`**

In `frontend/src/types/course.ts`, replace:

```ts
export interface ContentBlock {
  text: string
  image?: string
}
```

with:

```ts
export type ImagePosition = 'left' | 'right' | 'top' | 'bottom'

export interface ContentBlock {
  text: string
  image?: string
  imagePosition?: ImagePosition
  textPercent?: number
}
```

- [ ] **Step 2: Add matching backend validation**

In `backend/src/validation/courseSchemas.ts`, replace:

```ts
const contentBlockSchema = z
  .object({
    text: z.string().default(''),
    image: z.string().optional(),
  })
  .refine((block) => block.text.trim().length > 0 || Boolean(block.image), {
    message: 'Provide text or an image for this content block',
    path: ['text'],
  })
```

with:

```ts
const contentBlockSchema = z
  .object({
    text: z.string().default(''),
    image: z.string().optional(),
    imagePosition: z.enum(['left', 'right', 'top', 'bottom']).optional(),
    textPercent: z.number().min(0).max(100).optional(),
  })
  .refine((block) => block.text.trim().length > 0 || Boolean(block.image), {
    message: 'Provide text or an image for this content block',
    path: ['text'],
  })
```

- [ ] **Step 3: Verify both packages type-check**

Run: `npm run build --workspace=backend` from the repo root.
Expected: completes with no TypeScript errors (Prisma generate + `tsc` succeed).

Run: `npm run build --workspace=frontend` from the repo root.
Expected: completes with no TypeScript errors (`tsc -b` + `vite build` succeed) — the new optional fields don't break any existing usage since nothing constructs a `ContentBlock` with excess/missing required properties.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/types/course.ts backend/src/validation/courseSchemas.ts
git commit -m "feat: add imagePosition/textPercent fields to ContentBlock"
```

---

### Task 2: Shared layout helper + student-facing rendering

**Files:**
- Create: `frontend/src/components/chapters/contentBlockLayout.ts`
- Modify: `frontend/src/components/chapters/ContentSectionPage.tsx`
- Modify: `frontend/src/components/chapters/ContentSectionPage.css`

**Interfaces:**
- Consumes: `ContentBlock` type from Task 1 (`imagePosition?`, `textPercent?`).
- Produces: `getContentBlockLayoutStyle(block): CSSProperties` — consumed by Task 3's preview modal.

- [ ] **Step 1: Create the shared layout helper**

Create `frontend/src/components/chapters/contentBlockLayout.ts`:

```ts
import type { CSSProperties } from 'react'
import type { ContentBlock, ImagePosition } from '../../types/course'

const DIRECTION_BY_POSITION: Record<ImagePosition, string> = {
  right: 'row',
  left: 'row-reverse',
  bottom: 'column',
  top: 'column-reverse',
}

export function getContentBlockLayoutStyle(block: Pick<ContentBlock, 'imagePosition' | 'textPercent'>): CSSProperties {
  const imagePosition = block.imagePosition ?? 'right'
  const textPercent = block.textPercent ?? 65

  return {
    '--section-direction': DIRECTION_BY_POSITION[imagePosition],
    '--section-text-basis': `${textPercent}%`,
    '--section-image-basis': `${100 - textPercent}%`,
  } as CSSProperties
}
```

- [ ] **Step 2: Wire the helper into `ContentSectionPage.tsx`**

In `frontend/src/components/chapters/ContentSectionPage.tsx`, add the import alongside the existing ones:

```ts
import { getContentBlockLayoutStyle } from './contentBlockLayout'
```

Then update the wrapper `div` (currently):

```tsx
<div
  className={`chapter-section2-body-wrapper${
    !hasImage
      ? ' chapter-section2-body-wrapper--text-only'
      : !hasText
        ? ' chapter-section2-body-wrapper--image-only'
        : ''
  }`}
>
```

to:

```tsx
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
```

- [ ] **Step 3: Replace the CSS Grid layout with flexbox driven by CSS variables**

In `frontend/src/components/chapters/ContentSectionPage.css`, replace:

```css
/* Two-column layout: content 65% / image 35% */
.chapter-section2-body-wrapper {
  display: grid;
  grid-template-columns: 65% 35%;
  gap: clamp(1rem, 2.5vw, 3rem);
  align-items: center;
  width: 100%;
  min-height: 0;
}
```

with:

```css
/* Layout driven by --section-direction / --section-text-basis / --section-image-basis,
   set inline per block via getContentBlockLayoutStyle(). Defaults match the old
   fixed 65/35 text-left/image-right layout for blocks with no stored position. */
.chapter-section2-body-wrapper {
  display: flex;
  flex-direction: var(--section-direction, row);
  gap: clamp(1rem, 2.5vw, 3rem);
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 0;
}
```

Then replace:

```css
.chapter-section2-text-column {
  font-size: clamp(0.85rem, 2vh, 1.15rem);
  line-height: 1.6;
  max-height: 100%;
  overflow: hidden;
}
```

with:

```css
.chapter-section2-text-column {
  flex: 0 0 var(--section-text-basis, 65%);
  min-width: 0;
  font-size: clamp(0.85rem, 2vh, 1.15rem);
  line-height: 1.6;
  max-height: 100%;
  overflow: hidden;
}
```

Then replace:

```css
.chapter-section2-image-column {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(0.5rem, 1.5vh, 1.5rem);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  height: 100%;
  max-height: 45vh;
}
```

with:

```css
.chapter-section2-image-column {
  flex: 0 0 var(--section-image-basis, 35%);
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(0.5rem, 1.5vh, 1.5rem);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  height: 100%;
  max-height: 45vh;
}
```

Finally, in the `@media (max-width: 1024px)` block, replace:

```css
@media (max-width: 1024px) {
  .chapter-section2-body-wrapper {
    grid-template-columns: 1fr;
    gap: clamp(0.5rem, 1.5vh, 1.5rem);
    overflow: hidden;
  }

  .chapter-section2-image-column {
    order: 2;
    max-height: 30vh;
  }

  .chapter-section2-text-column {
    order: 1;
  }
}
```

with:

```css
@media (max-width: 1024px) {
  .chapter-section2-body-wrapper {
    flex-direction: column;
    gap: clamp(0.5rem, 1.5vh, 1.5rem);
    overflow: hidden;
  }

  .chapter-section2-image-column {
    order: 2;
    flex-basis: auto;
    max-height: 30vh;
  }

  .chapter-section2-text-column {
    order: 1;
    flex-basis: auto;
  }
}
```

This keeps the narrow-screen behavior identical regardless of the admin's chosen position: text always above image below 1024px, because this rule appears after the base rule in the stylesheet and sets `flex-direction`/`order`/`flex-basis` directly rather than through the CSS variables.

- [ ] **Step 4: Verify frontend builds**

Run: `npm run build --workspace=frontend` from the repo root.
Expected: completes with no TypeScript or build errors.

- [ ] **Step 5: Manual check in the dev server**

Run: `npm run dev` from the repo root.
In a browser, open any existing chapter with a `content_section` page as a student (`/student/chapters/:chapterId/flow`). Confirm it still looks exactly as before (text left ~65%, image right ~35%) — this block has no `imagePosition`/`textPercent` yet, so it must fall through to the CSS defaults.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/chapters/contentBlockLayout.ts frontend/src/components/chapters/ContentSectionPage.tsx frontend/src/components/chapters/ContentSectionPage.css
git commit -m "feat: drive content section image layout from per-block position/split"
```

---

### Task 3: Admin editor controls (Image Position + Split) and preview modal

**Files:**
- Create: `frontend/src/components/admin/ContentBlockPreviewModal.tsx`
- Create: `frontend/src/components/admin/ContentBlockPreviewModal.css`
- Modify: `frontend/src/pages/admin/AdminChapterEditorPage.tsx` (`ContentBlockListEditor`, currently lines 183-243)

**Interfaces:**
- Consumes: `ContentBlock` type from Task 1, `getContentBlockLayoutStyle` from Task 2 (`frontend/src/components/chapters/contentBlockLayout.ts`), `resolveAssetSrc` from `frontend/src/utils/assets.ts`.

- [ ] **Step 1: Create the preview modal component**

Create `frontend/src/components/admin/ContentBlockPreviewModal.tsx`:

```tsx
import type { ContentBlock } from '../../types/course'
import { resolveAssetSrc } from '../../utils/assets'
import { getContentBlockLayoutStyle } from '../chapters/contentBlockLayout'
import '../chapters/ContentSectionPage.css'
import './ContentBlockPreviewModal.css'

interface ContentBlockPreviewModalProps {
  block: ContentBlock
  onClose: () => void
}

export function ContentBlockPreviewModal({ block, onClose }: ContentBlockPreviewModalProps) {
  const hasText = Boolean(block.text?.trim())
  const hasImage = Boolean(block.image)

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="preview-modal-header">
          <h2 className="preview-modal-title">Student View Preview</h2>
          <button type="button" className="btn secondary small" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="preview-modal-frame">
          <main className="chapter-section2-main preview-modal-main">
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
                  style={hasImage && hasText ? getContentBlockLayoutStyle(block) : undefined}
                >
                  <div
                    className={`chapter-section2-text-column${hasText ? '' : ' chapter-section2-text-column--hidden'}`}
                  >
                    {block.text.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>

                  {hasImage && (
                    <div className="chapter-section2-image-column">
                      <img src={resolveAssetSrc(block.image!)} alt="Section Illustration" className="chapter-section2-image" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create the preview modal's CSS**

Create `frontend/src/components/admin/ContentBlockPreviewModal.css`:

```css
.preview-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.preview-modal {
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem;
  width: min(90vw, 900px);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.2);
}

.preview-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.preview-modal-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
}

.preview-modal-frame {
  height: min(70vh, 520px);
  border-radius: 12px;
  overflow: hidden;
}

.preview-modal-main {
  height: 100%;
  padding: 1rem;
}
```

- [ ] **Step 3: Add the `ContentBlockPreviewModal` import and `previewIndex` state to `ContentBlockListEditor`**

In `frontend/src/pages/admin/AdminChapterEditorPage.tsx`, add the import alongside the existing ones:

```ts
import { ContentBlockPreviewModal } from '../../components/admin/ContentBlockPreviewModal'
```

Then update the top of `ContentBlockListEditor` — replace:

```tsx
function ContentBlockListEditor({
  blocks,
  onChange,
}: {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
}) {
  const updateBlock = (index: number, patch: Partial<ContentBlock>) => {
```

with:

```tsx
function ContentBlockListEditor({
  blocks,
  onChange,
}: {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
}) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  const updateBlock = (index: number, patch: Partial<ContentBlock>) => {
```

- [ ] **Step 4: Add the Image Position select, Split range input, and Preview button to each block card**

Still in `ContentBlockListEditor`, the block card currently ends its `grid-two` div right after the Image field's closing `</label>`, then closes the card and the `.map(...)` call:

```tsx
            <label className="field">
              <span>Image (filename under /assets/ or full URL)</span>
              <input
                value={block.image ?? ''}
                onChange={(event) => updateBlock(index, { image: event.target.value || undefined })}
              />
              {block.image && (
                <img
                  src={resolveAssetSrc(block.image)}
                  alt={`Block ${index + 1} preview`}
                  style={{ maxWidth: '100%', marginTop: '0.5rem', borderRadius: '8px' }}
                />
              )}
            </label>
          </div>
        </div>
      ))}
```

Replace it with (adding a second row of controls plus the Preview button before the closing `</div>` of the block card):

```tsx
            <label className="field">
              <span>Image (filename under /assets/ or full URL)</span>
              <input
                value={block.image ?? ''}
                onChange={(event) => updateBlock(index, { image: event.target.value || undefined })}
              />
              {block.image && (
                <img
                  src={resolveAssetSrc(block.image)}
                  alt={`Block ${index + 1} preview`}
                  style={{ maxWidth: '100%', marginTop: '0.5rem', borderRadius: '8px' }}
                />
              )}
            </label>
          </div>
          <div className="grid-two" style={{ gridTemplateColumns: '65% 35%', alignItems: 'start' }}>
            <label className="field">
              <span>Image Position</span>
              <select
                value={block.imagePosition ?? 'right'}
                disabled={!block.image}
                onChange={(event) =>
                  updateBlock(index, { imagePosition: event.target.value as ContentBlock['imagePosition'] })
                }
              >
                <option value="right">Right</option>
                <option value="left">Left</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </label>
            <label className="field">
              <span>
                Split ({block.textPercent ?? 65}% text / {100 - (block.textPercent ?? 65)}% image)
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={block.textPercent ?? 65}
                disabled={!block.image}
                onChange={(event) => updateBlock(index, { textPercent: Number(event.target.value) })}
              />
            </label>
          </div>
          <button className="btn secondary small" type="button" onClick={() => setPreviewIndex(index)}>
            Preview
          </button>
        </div>
      ))}
```

- [ ] **Step 5: Render the preview modal**

Still in `ContentBlockListEditor`, replace the end of the returned JSX:

```tsx
      <button className="btn secondary small" type="button" onClick={() => onChange([...blocks, { text: '' }])}>
        Add Block
      </button>
    </div>
  )
}
```

with:

```tsx
      <button className="btn secondary small" type="button" onClick={() => onChange([...blocks, { text: '' }])}>
        Add Block
      </button>
      {previewIndex !== null && (
        <ContentBlockPreviewModal block={blocks[previewIndex]} onClose={() => setPreviewIndex(null)} />
      )}
    </div>
  )
}
```

- [ ] **Step 6: Verify frontend builds**

Run: `npm run build --workspace=frontend` from the repo root.
Expected: completes with no TypeScript errors.

- [ ] **Step 7: Manual check in the dev server**

Run: `npm run dev` from the repo root. Log in as admin, open a chapter's content section page in the editor. Confirm each block shows an "Image Position" dropdown and a "Split" slider (both disabled when the block has no image). Click "Preview" on a block with both text and an image — confirm the modal opens showing the block's text (fully visible, no typing animation) and image in the default right/65-35 layout. Change Image Position to each of Left/Top/Bottom and Split to a non-default value (e.g. 40), re-open Preview each time, and confirm the modal reflects the change. Confirm "Close" and clicking the overlay both dismiss the modal.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/components/admin/ContentBlockPreviewModal.tsx frontend/src/components/admin/ContentBlockPreviewModal.css frontend/src/pages/admin/AdminChapterEditorPage.tsx
git commit -m "feat: add image position/split controls and preview modal to content block editor"
```

---

### Task 4: End-to-end verification

**Files:** none (verification only).

- [ ] **Step 1: Full build check**

Run: `npm run build` from the repo root.
Expected: frontend and backend both build with no errors.

- [ ] **Step 2: Save a block with each image position and confirm student view matches preview**

Run: `npm run dev` from the repo root. In the admin editor, on a `content_section` page with a block that has both text and an image:

- Set Image Position to Right, Split to 65, save. Open the chapter as a student (`/student/chapters/:chapterId/flow`) and confirm the image is on the right, roughly 35% width.
- Repeat for Left, Top, and Bottom, each time comparing the admin Preview modal to the actual student page after saving. They should match (aside from the student page's typing animation).

- [ ] **Step 3: Confirm unaffected cases**

- A block with only text (no image): confirm it renders full-width as before, and the Image Position/Split controls are disabled.
- A block with only an image (no text): confirm it renders centered as before.
- A pre-existing block never edited under this feature (no `imagePosition`/`textPercent` in its saved config): confirm it still renders text-left 65% / image-right 35%.

- [ ] **Step 4: Confirm mobile breakpoint**

In the browser, resize (or use device toolbar) to a width under 1024px while viewing a `content_section` page as a student, for a block set to Left or Top. Confirm it still stacks text-above-image, matching the pre-existing narrow-screen behavior.

- [ ] **Step 5: Lint check**

Run: `npm run lint` from the repo root.
Expected: no new lint errors introduced by these changes.

# Content Section Image Position & Split — Design

## Problem

`content_section` chapter pages render a list of `ContentBlock`s (`{ text, image? }`). Today the layout is hardcoded in `ContentSectionPage.tsx`/`.css`: text always occupies the left 65% and the image always occupies the right 35% (falling back to a single stacked column on narrow screens). Admins have no way to vary this per block — e.g. put the image on top, or give it more width.

## Goals

- Per content block, let the admin choose where the image renders relative to its text: `left`, `right`, `top`, or `bottom`.
- Text always renders on the side opposite the image (enforced by construction, not by separate fields): image `right` ⇒ text `left`; image `left` ⇒ text `right`; image `top` ⇒ text `bottom`; image `bottom` ⇒ text `top`.
- Per block, let the admin choose the split percentage (e.g. 60% text / 40% image), applying to width when left/right and to height when top/bottom.
- Give the admin a "Preview" action per block that opens a modal showing a static rendering of that block as a student would see it (real styling, full text visible, no typing animation), so they can verify the layout before saving.
- Student-facing rendering (`ContentSectionPage`) honors the same position/split.
- Existing blocks with no stored position/split render exactly as they do today (text-left 65% / image-right 35%).

## Non-goals

- No section-wide layout setting — this is strictly per block, since each block already carries its own independent text/image pair.
- No new image position values beyond the four cardinal sides.
- No change to the typing-animation behavior on the real student page (only the preview modal is static).
- No change to how blocks are added/removed/reordered.

## Data model

Extend `ContentBlock` (`frontend/src/types/course.ts`) with two optional fields:

```ts
export interface ContentBlock {
  text: string
  image?: string
  imagePosition?: 'left' | 'right' | 'top' | 'bottom' // default: 'right'
  textPercent?: number // 0-100, default: 65 (image gets 100 - textPercent)
}
```

Only `imagePosition` is stored — there is no separate "text position" field, so the opposite-side rule can't be violated by bad data. `config` is a loosely-typed JSON string column (`ChapterPage.config` in Prisma), so no DB migration is required; missing fields simply fall back to the defaults above at render/edit time, preserving the current visual for every existing block.

Backend validation (`backend/src/validation/courseSchemas.ts`, `contentBlockSchema`) gains the matching optional fields:

```ts
imagePosition: z.enum(['left', 'right', 'top', 'bottom']).optional(),
textPercent: z.number().min(0).max(100).optional(),
```

## Student-facing rendering (`ContentSectionPage.tsx` / `.css`)

Replace the current CSS Grid (`grid-template-columns: 65% 35%`) with a flexbox layout. DOM order is always text-element-then-image-element; the visual position comes entirely from `flex-direction`, derived from `imagePosition`:

| `imagePosition` | `flex-direction` | Visual result |
|---|---|---|
| `right` (default) | `row` | text left, image right |
| `left` | `row-reverse` | image left, text right |
| `bottom` | `column` | text top, image bottom |
| `top` | `column-reverse` | image top, text bottom |

Split: the text element gets `flex-basis: {textPercent}%`, the image element gets `flex-basis: {100 - textPercent}%` (with `flex-grow: 0; flex-shrink: 0` so the basis is respected), for both the row and column cases.

Text-only and image-only blocks (`hasImage`/`hasText` false) keep today's special-case full-width/centered rendering, ignoring `imagePosition`/`textPercent` entirely — there's nothing to position relative to.

The existing `@media (max-width: 1024px)` breakpoint continues to force a stacked `column` layout (image below text) regardless of the configured position, matching current mobile behavior and keeping this change low-risk on small screens.

## Admin editor (`AdminChapterEditorPage.tsx`, `ContentBlockListEditor`)

Each block card gains, alongside the existing Text/Image fields:

- **Image Position** — a `<select>` with Right / Left / Top / Bottom, defaulting to Right. Disabled (or visually inert) when the block has no image.
- **Text/Image Split** — a range input 0–100 (step 5), defaulting to 65, labeled live as e.g. "65% text / 35% image". Disabled when the block has no image.
- **Preview** — a button that opens a modal (new small component, e.g. `ContentBlockPreviewModal.tsx`) rendering that single block using the real `chapter-section2-*` CSS classes (background, card, text column, image column) at a contained modal size, with the block's full text shown immediately (no `TypingAnimation`) and the image in the chosen position/split. This gives an accurate but simplified (non-animated) look at the student view.

## Error handling

- `textPercent` is clamped client-side to [0, 100] by the range input itself; server-side Zod enforces the same bound as defense in depth.
- Unknown/legacy `imagePosition` values (shouldn't occur, but e.g. hand-edited JSON) fall back to `right` at render time rather than throwing.

## Testing / verification

No test suite exists in this repo. Verification is manual:

1. In the admin chapter editor, set a block's image position through all four options with a non-default split, save, and confirm the preview modal matches expectations for each.
2. Open the real chapter as a student (`/student/chapters/:chapterId/flow`) and confirm the live page matches the preview.
3. Confirm an untouched, pre-existing block (no `imagePosition`/`textPercent` in its stored config) still renders text-left 65% / image-right 35%.
4. Confirm text-only and image-only blocks are unaffected by the new controls.

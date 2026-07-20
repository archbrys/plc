import { useEffect, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { ContentBlockPreviewModal } from '../../components/admin/ContentBlockPreviewModal'
import { courseApiService, type UpsertPagePayload } from '../../services/courseApiService'
import { questionSetService } from '../../services/questionSetService'
import { uploadService } from '../../services/uploadService'
import { useToast } from '../../hooks/useToast'
import { resolveAssetSrc, resolveVideoEmbed } from '../../utils/assets'
import type {
  ChapterPage,
  ChapterPageType,
  ContentBlock,
  ContentSectionPageConfig,
  CourseChapter,
  MediaPageConfig,
  NarrationPageConfig,
  QuizPageConfig,
  SlideshowPageConfig,
} from '../../types/course'
import type { QuestionSet } from '../../types/quiz'

const PAGE_TYPE_LABELS: Record<ChapterPageType, string> = {
  slideshow: 'Slideshow',
  narration: 'Narration',
  content_section: 'Content Section',
  interactive_practice: 'Interactive Practice',
  quiz: 'Quiz',
  media: 'Video/File',
}

function defaultConfigFor(type: ChapterPageType, chapterTitle: string): UpsertPagePayload {
  switch (type) {
    case 'slideshow':
      return { type, config: { images: [''], autoAdvanceMs: 3000 } }
    case 'narration':
      return { type, config: { character: '', text: '' } }
    case 'content_section':
      return { type, config: { sectionNumber: 1, sectionTitle: '', chapterTitle, contents: [{ text: '' }] } }
    case 'interactive_practice':
      return { type, config: {} }
    case 'quiz':
      return { type, config: { questionSetId: '' } }
    case 'media':
      return { type, config: { mediaType: 'video', url: '' } }
  }
}

function StringListEditor({
  values,
  onChange,
  placeholder,
  rows,
  minItems = 1,
}: {
  values: string[]
  onChange: (values: string[]) => void
  placeholder: string
  rows?: number
  minItems?: number
}) {
  return (
    <div className="stack">
      {values.map((value, index) => (
        <div key={index} className="row-between" style={{ alignItems: 'flex-start', gap: '0.5rem' }}>
          {rows ? (
            <textarea
              style={{ flex: 1 }}
              rows={rows}
              value={value}
              placeholder={placeholder}
              onChange={(event) => {
                const next = [...values]
                next[index] = event.target.value
                onChange(next)
              }}
            />
          ) : (
            <input
              style={{ flex: 1 }}
              value={value}
              placeholder={placeholder}
              onChange={(event) => {
                const next = [...values]
                next[index] = event.target.value
                onChange(next)
              }}
            />
          )}
          <button
            className="btn secondary small"
            type="button"
            onClick={() => onChange(values.filter((_, i) => i !== index))}
            disabled={values.length <= minItems}
          >
            Remove
          </button>
        </div>
      ))}
      <button className="btn secondary small" type="button" onClick={() => onChange([...values, ''])}>
        Add
      </button>
    </div>
  )
}

function SlideshowForm({ config, onChange }: { config: SlideshowPageConfig; onChange: (config: SlideshowPageConfig) => void }) {
  return (
    <div className="stack">
      <label className="field">
        <span>Images (filenames under /assets/)</span>
        <StringListEditor
          values={config.images}
          placeholder="25.png"
          onChange={(images) => onChange({ ...config, images })}
        />
      </label>
      <label className="field">
        <span>Auto-advance (ms)</span>
        <input
          type="number"
          value={config.autoAdvanceMs}
          onChange={(event) => onChange({ ...config, autoAdvanceMs: Number(event.target.value) })}
        />
      </label>
    </div>
  )
}

function NarrationForm({ config, onChange }: { config: NarrationPageConfig; onChange: (config: NarrationPageConfig) => void }) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setIsUploading(true)
    setUploadError(null)
    try {
      const url = await uploadService.uploadImage(file)
      onChange({ ...config, backgroundImage: url })
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="stack">
      <label className="field">
        <span>Character</span>
        <input value={config.character} onChange={(event) => onChange({ ...config, character: event.target.value })} />
      </label>
      <label className="field">
        <span>Text</span>
        <textarea rows={4} value={config.text} onChange={(event) => onChange({ ...config, text: event.target.value })} />
      </label>
      <label className="field">
        <span>Narrator Image</span>
        <input
          value={config.backgroundImage ?? ''}
          placeholder="Filename under /assets/, full URL, or upload below"
          onChange={(event) => onChange({ ...config, backgroundImage: event.target.value || undefined })}
        />
        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleFileSelected} disabled={isUploading} />
        {isUploading && <span className="muted">Uploading...</span>}
        {uploadError && <span className="error-message">{uploadError}</span>}
        {config.backgroundImage && (
          <img
            src={resolveAssetSrc(config.backgroundImage)}
            alt="Narrator preview"
            style={{ maxWidth: '200px', marginTop: '0.5rem', borderRadius: '8px' }}
          />
        )}
      </label>
    </div>
  )
}

function ContentBlockRow({
  block,
  index,
  onChange,
  onRemove,
  onPreview,
  removeDisabled,
}: {
  block: ContentBlock
  index: number
  onChange: (patch: Partial<ContentBlock>) => void
  onRemove: () => void
  onPreview: () => void
  removeDisabled: boolean
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setIsUploading(true)
    setUploadError(null)
    try {
      const url = await uploadService.uploadImage(file)
      onChange({ image: url })
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="card stack" style={{ padding: '1rem' }}>
      <div className="row-between" style={{ alignItems: 'center' }}>
        <strong>Block {index + 1}</strong>
        <button className="btn secondary small" type="button" onClick={onRemove} disabled={removeDisabled}>
          Remove Block
        </button>
      </div>
      <div className="grid-two" style={{ gridTemplateColumns: '65% 35%', alignItems: 'start' }}>
        <label className="field">
          <span>Text</span>
          <textarea
            rows={4}
            value={block.text}
            placeholder="Content block text"
            onChange={(event) => onChange({ text: event.target.value })}
          />
        </label>
        <label className="field">
          <span>Image (filename under /assets/ or full URL)</span>
          <input
            value={block.image ?? ''}
            onChange={(event) => onChange({ image: event.target.value || undefined })}
          />
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleFileSelected}
            disabled={isUploading}
          />
          {isUploading && <span className="muted">Uploading...</span>}
          {uploadError && <span className="error-message">{uploadError}</span>}
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
            onChange={(event) => onChange({ imagePosition: event.target.value as ContentBlock['imagePosition'] })}
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
            onChange={(event) => onChange({ textPercent: Number(event.target.value) })}
          />
        </label>
      </div>
      <button className="btn secondary small" type="button" onClick={onPreview}>
        Preview
      </button>
    </div>
  )
}

function ContentBlockListEditor({
  blocks,
  onChange,
  chapterTitle,
  sectionTitle,
}: {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
  chapterTitle: string
  sectionTitle: string
}) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  const updateBlock = (index: number, patch: Partial<ContentBlock>) => {
    const next = [...blocks]
    next[index] = { ...next[index], ...patch }
    onChange(next)
  }

  return (
    <div className="stack">
      {blocks.map((block, index) => (
        <ContentBlockRow
          key={index}
          block={block}
          index={index}
          onChange={(patch) => updateBlock(index, patch)}
          onRemove={() => onChange(blocks.filter((_, i) => i !== index))}
          onPreview={() => setPreviewIndex(index)}
          removeDisabled={blocks.length <= 1}
        />
      ))}
      <button className="btn secondary small" type="button" onClick={() => onChange([...blocks, { text: '' }])}>
        Add Block
      </button>
      {previewIndex !== null && (
        <ContentBlockPreviewModal
          block={blocks[previewIndex]}
          chapterTitle={chapterTitle}
          sectionTitle={sectionTitle}
          onClose={() => setPreviewIndex(null)}
        />
      )}
    </div>
  )
}

function ContentSectionForm({
  config,
  onChange,
}: {
  config: ContentSectionPageConfig
  onChange: (config: ContentSectionPageConfig) => void
}) {
  return (
    <div className="stack">
      <label className="field">
        <span>Section Number</span>
        <input
          type="number"
          value={config.sectionNumber}
          onChange={(event) => onChange({ ...config, sectionNumber: Number(event.target.value) })}
        />
      </label>
      <label className="field">
        <span>Section Title</span>
        <input value={config.sectionTitle} onChange={(event) => onChange({ ...config, sectionTitle: event.target.value })} />
      </label>
      <label className="field">
        <span>Chapter Title (shown as page header)</span>
        <input value={config.chapterTitle} onChange={(event) => onChange({ ...config, chapterTitle: event.target.value })} />
      </label>
      <label className="field">
        <span>Content Blocks</span>
        <ContentBlockListEditor
          blocks={config.contents}
          onChange={(contents) => onChange({ ...config, contents })}
          chapterTitle={config.chapterTitle}
          sectionTitle={`Section ${config.sectionNumber}: ${config.sectionTitle}`}
        />
      </label>
      <p className="muted">
        Each block types out its text and shows its own image beside it (65% text / 35% image). Leave a block's text
        empty to show only its centered image; leave its image empty to show only text. A block needs text, an image,
        or both.
      </p>
    </div>
  )
}

function QuizForm({
  config,
  onChange,
  questionSets,
}: {
  config: QuizPageConfig
  onChange: (config: QuizPageConfig) => void
  questionSets: QuestionSet[]
}) {
  return (
    <label className="field">
      <span>Question Set</span>
      <select value={config.questionSetId} onChange={(event) => onChange({ questionSetId: event.target.value })}>
        <option value="">Select a question set...</option>
        {questionSets.map((set) => (
          <option key={set.id} value={set.id}>
            {set.title} ({set.status})
          </option>
        ))}
      </select>
    </label>
  )
}

function MediaForm({ config, onChange }: { config: MediaPageConfig; onChange: (config: MediaPageConfig) => void }) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setIsUploading(true)
    setUploadError(null)
    try {
      const url = await uploadService.uploadMedia(file)
      onChange({ ...config, url })
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="stack">
      <label className="field">
        <span>Media Type</span>
        <select
          value={config.mediaType}
          onChange={(event) => onChange({ ...config, mediaType: event.target.value as MediaPageConfig['mediaType'] })}
        >
          <option value="video">Video</option>
          <option value="file">File</option>
        </select>
      </label>
      <label className="field">
        <span>Description (optional)</span>
        <textarea
          rows={3}
          value={config.description ?? ''}
          onChange={(event) => onChange({ ...config, description: event.target.value || undefined })}
        />
      </label>
      <label className="field">
        <span>{config.mediaType === 'video' ? 'Video File or Link' : 'File'}</span>
        <input
          value={config.url}
          placeholder={
            config.mediaType === 'video'
              ? 'YouTube/Vimeo link, filename under /assets/, full URL, or upload below'
              : 'Filename under /assets/, full URL, or upload below'
          }
          onChange={(event) => onChange({ ...config, url: event.target.value })}
        />
        <input
          type="file"
          accept={config.mediaType === 'video' ? 'video/mp4,video/webm' : 'application/pdf'}
          onChange={handleFileSelected}
          disabled={isUploading}
        />
        {isUploading && <span className="muted">Uploading...</span>}
        {uploadError && <span className="error-message">{uploadError}</span>}
        {config.url && config.mediaType === 'video' && (
          (() => {
            const embed = resolveVideoEmbed(config.url)
            return embed.kind === 'iframe' ? (
              <iframe
                src={embed.src}
                title="Video preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', aspectRatio: '16 / 9', border: 0, marginTop: '0.5rem', borderRadius: '8px' }}
              />
            ) : (
              <video
                src={embed.src}
                controls
                style={{ maxWidth: '100%', marginTop: '0.5rem', borderRadius: '8px' }}
              />
            )
          })()
        )}
      </label>
    </div>
  )
}

function PageConfigForm({
  page,
  onChange,
  questionSets,
}: {
  page: UpsertPagePayload
  onChange: (config: UpsertPagePayload['config']) => void
  questionSets: QuestionSet[]
}) {
  switch (page.type) {
    case 'slideshow':
      return <SlideshowForm config={page.config as SlideshowPageConfig} onChange={onChange} />
    case 'narration':
      return <NarrationForm config={page.config as NarrationPageConfig} onChange={onChange} />
    case 'content_section':
      return <ContentSectionForm config={page.config as ContentSectionPageConfig} onChange={onChange} />
    case 'interactive_practice':
      return <p className="muted">Renders the PLC simulator. No additional configuration needed.</p>
    case 'quiz':
      return <QuizForm config={page.config as QuizPageConfig} onChange={onChange} questionSets={questionSets} />
    case 'media':
      return <MediaForm config={page.config as MediaPageConfig} onChange={onChange} />
  }
}

export function AdminChapterEditorPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { chapterId } = useParams()
  const parsedChapterId = Number(chapterId)

  const [chapter, setChapter] = useState<CourseChapter | null>(null)
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([])
  const [drafts, setDrafts] = useState<Record<number, UpsertPagePayload>>({})
  const [chapterTitleDraft, setChapterTitleDraft] = useState('')
  const [newPageType, setNewPageType] = useState<ChapterPageType>('narration')
  const [newPageDraft, setNewPageDraft] = useState<UpsertPagePayload>(defaultConfigFor('narration', ''))
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [pendingDeletePageId, setPendingDeletePageId] = useState<number | null>(null)

  const load = () => {
    if (!Number.isInteger(parsedChapterId)) return
    courseApiService
      .getChapter(parsedChapterId)
      .then((loadedChapter) => {
        setChapter(loadedChapter)
        setChapterTitleDraft(loadedChapter.title)
        const nextDrafts: Record<number, UpsertPagePayload> = {}
        for (const page of loadedChapter.pages) {
          nextDrafts[page.id] = { type: page.type, orderNumber: page.orderNumber, config: page.config }
        }
        setDrafts(nextDrafts)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load chapter.'))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    load()
    questionSetService.listAll().then(setQuestionSets)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedChapterId])

  if (isLoading || !chapter) {
    return (
      <AdminLayout title="Chapter Editor" subtitle="Loading chapter...">
        <div>Loading...</div>
      </AdminLayout>
    )
  }

  const pages = [...chapter.pages].sort((a, b) => a.orderNumber - b.orderNumber)

  const handleSaveChapterTitle = async () => {
    const title = chapterTitleDraft.trim()
    if (!title) return

    try {
      await courseApiService.updateChapter(chapter.id, { title })
      setError('')
      load()
      showToast('Chapter title saved.', 'success')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to update chapter.'
      setError(message)
      showToast(message, 'error')
    }
  }

  const handleNewPageTypeChange = (type: ChapterPageType) => {
    setNewPageType(type)
    setNewPageDraft(defaultConfigFor(type, chapter.title))
  }

  const newPageIsValid =
    (newPageDraft.type !== 'quiz' || Boolean((newPageDraft.config as QuizPageConfig).questionSetId)) &&
    (newPageDraft.type !== 'content_section' ||
      (() => {
        const config = newPageDraft.config as ContentSectionPageConfig
        return (
          config.contents.length > 0 &&
          config.contents.every((block) => block.text.trim().length > 0 || Boolean(block.image))
        )
      })()) &&
    (newPageDraft.type !== 'media' ||
      (() => {
        const config = newPageDraft.config as MediaPageConfig
        return config.url.trim().length > 0
      })())

  const handleAddPage = async () => {
    if (!newPageIsValid) return

    try {
      await courseApiService.createPage(chapter.id, newPageDraft)
      setError('')
      setNewPageDraft(defaultConfigFor(newPageType, chapter.title))
      load()
      showToast('Page added.', 'success')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to add page.'
      setError(message)
      showToast(message, 'error')
    }
  }

  const handleSavePage = async (page: ChapterPage) => {
    const draft = drafts[page.id]
    if (!draft) return

    try {
      await courseApiService.updatePage(page.id, draft)
      setError('')
      load()
      showToast('Page saved.', 'success')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to save page.'
      setError(message)
      showToast(message, 'error')
    }
  }

  const handleConfirmDeletePage = async () => {
    if (pendingDeletePageId === null) return

    try {
      await courseApiService.deletePage(pendingDeletePageId)
      setError('')
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete page.')
    } finally {
      setPendingDeletePageId(null)
    }
  }

  const handleMovePage = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= pages.length) return

    const reordered = [...pages]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(targetIndex, 0, moved)

    try {
      await courseApiService.reorderPages(chapter.id, reordered.map((page) => page.id))
      setError('')
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reorder pages.')
    }
  }

  return (
    <AdminLayout
      title={`Editing: ${chapter.title}`}
      subtitle="Manage this chapter's pages."
      actions={
        <button className="btn-outline" type="button" onClick={() => navigate('/admin/course-content')}>
          Back to Chapters
        </button>
      }
    >
      {error ? <p className="error-text">{error}</p> : null}

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Chapter Title</h2>
        </div>
        <div className="admin-panel-body stack">
          <label className="field">
            <span>Chapter Title</span>
            <input value={chapterTitleDraft} onChange={(event) => setChapterTitleDraft(event.target.value)} />
          </label>
          <div className="header-actions wrap">
            <button className="btn" type="button" onClick={handleSaveChapterTitle}>
              Save Chapter Title
            </button>
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Add Page</h2>
        </div>
        <div className="admin-panel-body stack">
          <div className="grid-two">
            <label className="field">
              <span>Page Type</span>
              <select value={newPageType} onChange={(event) => handleNewPageTypeChange(event.target.value as ChapterPageType)}>
                {Object.entries(PAGE_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <PageConfigForm
            page={newPageDraft}
            questionSets={questionSets}
            onChange={(config) => setNewPageDraft((current) => ({ ...current, config }))}
          />

          <div className="header-actions wrap">
            <button className="btn" type="button" onClick={handleAddPage} disabled={!newPageIsValid}>
              Add Page
            </button>
          </div>
        </div>
      </div>

      {pages.map((page, index) => {
        const draft = drafts[page.id] ?? { type: page.type, orderNumber: page.orderNumber, config: page.config }

        return (
          <div className="admin-panel" key={page.id}>
            <div className="admin-panel-header">
              <h2>
                <span className="admin-cell-index" style={{ marginRight: '0.6rem' }}>
                  {page.orderNumber}
                </span>
                {PAGE_TYPE_LABELS[page.type]}
              </h2>
              <div className="header-actions wrap">
                <button
                  className="btn secondary small"
                  type="button"
                  onClick={() => handleMovePage(index, -1)}
                  disabled={index === 0}
                >
                  Move Up
                </button>
                <button
                  className="btn secondary small"
                  type="button"
                  onClick={() => handleMovePage(index, 1)}
                  disabled={index === pages.length - 1}
                >
                  Move Down
                </button>
                <button
                  className="btn danger small"
                  type="button"
                  onClick={() => setPendingDeletePageId(page.id)}
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="admin-panel-body stack">
              <PageConfigForm
                page={draft}
                questionSets={questionSets}
                onChange={(config) =>
                  setDrafts((current) => ({ ...current, [page.id]: { ...draft, config } }))
                }
              />

              <div className="header-actions wrap">
                <button className="btn" type="button" onClick={() => handleSavePage(page)}>
                  Save Page
                </button>
              </div>
            </div>
          </div>
        )
      })}

      {pendingDeletePageId !== null ? (
        <ConfirmModal
          title="Delete page"
          message="Delete this page? This cannot be undone."
          confirmLabel="Delete"
          onConfirm={handleConfirmDeletePage}
          onCancel={() => setPendingDeletePageId(null)}
        />
      ) : null}
    </AdminLayout>
  )
}

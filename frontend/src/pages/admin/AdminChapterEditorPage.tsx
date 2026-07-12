import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '../../components/common/AppShell'
import { courseApiService, type UpsertPagePayload } from '../../services/courseApiService'
import { invalidateCourseCache } from '../../data/course'
import { questionSetService } from '../../services/questionSetService'
import type {
  ChapterPage,
  ChapterPageType,
  ContentSectionPageConfig,
  CourseChapter,
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
}

function defaultConfigFor(type: ChapterPageType, chapterTitle: string): UpsertPagePayload {
  switch (type) {
    case 'slideshow':
      return { type, config: { images: [''], autoAdvanceMs: 3000 } }
    case 'narration':
      return { type, config: { character: '', text: '' } }
    case 'content_section':
      return { type, config: { sectionNumber: 1, sectionTitle: '', chapterTitle, contents: [''] } }
    case 'interactive_practice':
      return { type, config: {} }
    case 'quiz':
      return { type, config: { questionSetId: '' } }
  }
}

function StringListEditor({
  values,
  onChange,
  placeholder,
  rows,
}: {
  values: string[]
  onChange: (values: string[]) => void
  placeholder: string
  rows?: number
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
            disabled={values.length <= 1}
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
        <span>Background Image (optional URL)</span>
        <input
          value={config.backgroundImage ?? ''}
          onChange={(event) => onChange({ ...config, backgroundImage: event.target.value || undefined })}
        />
      </label>
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
        <StringListEditor
          values={config.contents}
          placeholder="Content block text"
          rows={4}
          onChange={(contents) => onChange({ ...config, contents })}
        />
      </label>
      <label className="field">
        <span>Side Image (optional URL)</span>
        <input
          value={config.sideImage ?? ''}
          onChange={(event) => onChange({ ...config, sideImage: event.target.value || undefined })}
        />
      </label>
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
  }
}

export function AdminChapterEditorPage() {
  const navigate = useNavigate()
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
      <AppShell title="Chapter Editor" subtitle="Loading chapter...">
        <div>Loading...</div>
      </AppShell>
    )
  }

  const pages = [...chapter.pages].sort((a, b) => a.orderNumber - b.orderNumber)

  const handleSaveChapterTitle = async () => {
    const title = chapterTitleDraft.trim()
    if (!title) return

    try {
      await courseApiService.updateChapter(chapter.id, { title })
      invalidateCourseCache()
      setError('')
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update chapter.')
    }
  }

  const handleNewPageTypeChange = (type: ChapterPageType) => {
    setNewPageType(type)
    setNewPageDraft(defaultConfigFor(type, chapter.title))
  }

  const newPageIsValid =
    newPageDraft.type !== 'quiz' || Boolean((newPageDraft.config as QuizPageConfig).questionSetId)

  const handleAddPage = async () => {
    if (!newPageIsValid) return

    try {
      await courseApiService.createPage(chapter.id, newPageDraft)
      invalidateCourseCache()
      setError('')
      setNewPageDraft(defaultConfigFor(newPageType, chapter.title))
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add page.')
    }
  }

  const handleSavePage = async (page: ChapterPage) => {
    const draft = drafts[page.id]
    if (!draft) return

    try {
      await courseApiService.updatePage(page.id, draft)
      invalidateCourseCache()
      setError('')
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save page.')
    }
  }

  const handleDeletePage = async (pageId: number) => {
    if (!window.confirm('Delete this page?')) return

    try {
      await courseApiService.deletePage(pageId)
      invalidateCourseCache()
      setError('')
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete page.')
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
      invalidateCourseCache()
      setError('')
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reorder pages.')
    }
  }

  return (
    <AppShell
      title={`Editing: ${chapter.title}`}
      subtitle="Manage this chapter's pages."
      links={[
        { label: 'Dashboard', to: '/admin/dashboard' },
        { label: 'Course Content', to: '/admin/course-content' },
      ]}
    >
      <div className="stack">
        {error ? <p className="error-text">{error}</p> : null}

        <article className="card stack">
          <button className="btn secondary small" type="button" onClick={() => navigate('/admin/course-content')}>
            Back to Chapters
          </button>

          <label className="field">
            <span>Chapter Title</span>
            <input value={chapterTitleDraft} onChange={(event) => setChapterTitleDraft(event.target.value)} />
          </label>
          <div className="header-actions wrap">
            <button className="btn" type="button" onClick={handleSaveChapterTitle}>
              Save Chapter Title
            </button>
          </div>
        </article>

        <article className="card stack">
          <h2>Add Page</h2>
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
        </article>

        {pages.map((page, index) => {
          const draft = drafts[page.id] ?? { type: page.type, orderNumber: page.orderNumber, config: page.config }

          return (
            <article className="card stack" key={page.id}>
              <div className="row-between" style={{ alignItems: 'center' }}>
                <strong>
                  Page {page.orderNumber}: {PAGE_TYPE_LABELS[page.type]}
                </strong>
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
                  <button className="btn danger small" type="button" onClick={() => handleDeletePage(page.id)}>
                    Delete
                  </button>
                </div>
              </div>

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
            </article>
          )
        })}
      </div>
    </AppShell>
  )
}

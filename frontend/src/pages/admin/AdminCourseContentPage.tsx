import { useEffect, useState } from 'react'
import { AppShell } from '../../components/common/AppShell'
import { getCourse, saveCourse } from '../../data/course'
import type { Course, ChapterPage } from '../../types/course'

export function AdminCourseContentPage() {
  const [editableCourse, setEditableCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newChapterTitle, setNewChapterTitle] = useState('')
  const [newSectionTitles, setNewSectionTitles] = useState<Record<number, string>>({})
  const [newContentTitles, setNewContentTitles] = useState<Record<string, string>>({})
  const [saveMessage, setSaveMessage] = useState('')
  const [expandedChapters, setExpandedChapters] = useState<Record<number, boolean>>({})

  useEffect(() => {
    getCourse()
      .then(setEditableCourse)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading || !editableCourse) {
    return (
      <AppShell
        title="Course Content Editor"
        description="Loading course content..."
      >
        <div>Loading...</div>
      </AppShell>
    )
  }

  const withCourseUpdate = (updater: (current: Course) => Course) => {
    setEditableCourse((currentCourse) => {
      if (!currentCourse) return currentCourse
      return updater(currentCourse)
    })
    setSaveMessage('Unsaved changes')
  }

  const handleSave = () => {
    if (!editableCourse) return
    
    try {
      console.log('Saving course data:', editableCourse)
      
      // Verify localStorage is available
      if (typeof window === 'undefined' || !window.localStorage) {
        throw new Error('localStorage is not available')
      }
      
      saveCourse(editableCourse)
      
      // Verify it was saved
      const saved = window.localStorage.getItem('plc-course-content')
      console.log('Verified saved data:', saved ? 'Data saved' : 'Failed to save')
      
      setSaveMessage('✓ Changes saved successfully')
      setTimeout(() => setSaveMessage(''), 5000)
    } catch (error) {
      console.error('Failed to save course:', error)
      setSaveMessage(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleChapterTitleChange = (chapterId: number, title: string) => {
    withCourseUpdate((currentCourse) => ({
      ...currentCourse,
      chapters: currentCourse.chapters.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, title } : chapter,
      ),
    }))
  }

  const handleSectionTitleChange = (chapterId: number, sectionId: number, title: string) => {
    withCourseUpdate((currentCourse) => ({
      ...currentCourse,
      chapters: currentCourse.chapters.map((chapter) =>
        chapter.id !== chapterId
          ? chapter
          : {
              ...chapter,
              sections: chapter.sections.map((section) =>
                section.id === sectionId ? { ...section, title } : section,
              ),
            },
      ),
    }))
  }

  const handleContentChange = (
    chapterId: number,
    sectionId: number,
    contentId: number,
    field: 'title' | 'text' | 'image',
    value: string,
  ) => {
    withCourseUpdate((currentCourse) => ({
      ...currentCourse,
      chapters: currentCourse.chapters.map((chapter) =>
        chapter.id !== chapterId
          ? chapter
          : {
              ...chapter,
              sections: chapter.sections.map((section) =>
                section.id !== sectionId
                  ? section
                  : {
                      ...section,
                      contents: section.contents.map((content) =>
                        content.id === contentId ? { ...content, [field]: value } : content,
                      ),
                    },
              ),
            },
      ),
    }))
  }

  const handleAddChapter = () => {
    const title = newChapterTitle.trim()

    if (!title) return

    const nextChapterId =
      editableCourse.chapters.length > 0
        ? Math.max(...editableCourse.chapters.map((chapter) => chapter.id)) + 1
        : 1

    withCourseUpdate((currentCourse) => ({
      ...currentCourse,
      chapters: [...currentCourse.chapters, { id: nextChapterId, title, sections: [] }],
    }))

    setNewChapterTitle('')
  }

  const handleAddSection = (chapterId: number) => {
    const rawTitle = newSectionTitles[chapterId] ?? ''
    const title = rawTitle.trim()

    if (!title) return

    withCourseUpdate((currentCourse) => ({
      ...currentCourse,
      chapters: currentCourse.chapters.map((chapter) => {
        if (chapter.id !== chapterId) return chapter

        const nextSectionId =
          chapter.sections.length > 0
            ? Math.max(...chapter.sections.map((section) => section.id)) + 1
            : 1

        return {
          ...chapter,
          sections: [...chapter.sections, { id: nextSectionId, title, contents: [] }],
        }
      }),
    }))

    setNewSectionTitles((currentTitles) => ({ ...currentTitles, [chapterId]: '' }))
  }

  const handleAddContent = (chapterId: number, sectionId: number) => {
    const key = `${chapterId}-${sectionId}`
    const rawTitle = newContentTitles[key] ?? ''
    const title = rawTitle.trim()

    if (!title) return

    withCourseUpdate((currentCourse) => ({
      ...currentCourse,
      chapters: currentCourse.chapters.map((chapter) => {
        if (chapter.id !== chapterId) return chapter

        return {
          ...chapter,
          sections: chapter.sections.map((section) => {
            if (section.id !== sectionId) return section

            const nextContentId =
              section.contents.length > 0
                ? Math.max(...section.contents.map((content) => content.id)) + 1
                : 1

            return {
              ...section,
              contents: [
                ...section.contents,
                {
                  id: nextContentId,
                  title,
                  text: '',
                  image: '',
                },
              ],
            }
          }),
        }
      }),
    }))

    setNewContentTitles((currentTitles) => ({ ...currentTitles, [key]: '' }))
  }

  const toggleChapterExpanded = (chapterId: number) => {
    setExpandedChapters((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }))
  }

  const renderPagePreview = (page: ChapterPage) => {
    switch (page.type) {
      case 'slideshow': {
        const config = page.config as any
        return (
          <div className="muted">
            Slideshow: {config.images?.length || 0} images, auto-advance {config.autoAdvanceMs}ms
          </div>
        )
      }
      case 'narration': {
        const config = page.config as any
        return (
          <div className="muted">
            Narration by {config.character}: "{config.text?.substring(0, 60)}..."
          </div>
        )
      }
      case 'content_section': {
        const config = page.config as any
        return (
          <div className="muted">
            Section {config.sectionNumber}: {config.sectionTitle}
            <br />
            {config.contents?.length || 0} content blocks
          </div>
        )
      }
      case 'interactive_practice': {
        return <div className="muted">Interactive Practice (PLC Simulator)</div>
      }
      case 'quiz': {
        const config = page.config as any
        return <div className="muted">Quiz: {config.questionSetTitle}</div>
      }
      default:
        return <div className="muted">Unknown page type</div>
    }
  }

  return (
    <AppShell
      title="Course Content"
      subtitle="Edit chapter and section headers, update content, and create new chapters or sections."
      links={[
        { label: 'Dashboard', to: '/admin/dashboard' },
        { label: 'Question Sets', to: '/admin/question-sets' },
      ]}
    >
      <div className="stack">
        <article className="card stack">
          <h2>Create New Chapter</h2>
          <div className="grid-two">
            <label className="field">
              <span>Chapter Header</span>
              <input
                value={newChapterTitle}
                onChange={(event) => setNewChapterTitle(event.target.value)}
                placeholder="Enter chapter title"
              />
            </label>
          </div>

          <div className="header-actions wrap">
            <button className="btn" type="button" onClick={handleAddChapter}>
              Add Chapter
            </button>
            <button className="btn secondary" type="button" onClick={handleSave}>
              Save Changes
            </button>
          </div>

          {saveMessage && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                backgroundColor: saveMessage.startsWith('✓')
                  ? '#d4edda'
                  : saveMessage.startsWith('✗')
                    ? '#f8d7da'
                    : '#fff3cd',
                color: saveMessage.startsWith('✓')
                  ? '#155724'
                  : saveMessage.startsWith('✗')
                    ? '#721c24'
                    : '#856404',
                border: `1px solid ${
                  saveMessage.startsWith('✓')
                    ? '#c3e6cb'
                    : saveMessage.startsWith('✗')
                      ? '#f5c6cb'
                      : '#ffeeba'
                }`,
                fontWeight: 500,
              }}
            >
              {saveMessage}
            </div>
          )}
        </article>

        {editableCourse.chapters.map((chapter) => (
          <article className="card" key={chapter.id}>
            <label className="field">
              <span>Chapter {chapter.id} Header</span>
              <input
                value={chapter.title}
                onChange={(event) => handleChapterTitleChange(chapter.id, event.target.value)}
              />
            </label>

            {/* Display Pages (New Format) */}
            {chapter.pages && chapter.pages.length > 0 && (
              <div className="stack">
                <div className="row-between" style={{ alignItems: 'center' }}>
                  <p className="muted">
                    <strong>Pages (Flow-based Content):</strong> {chapter.pages.length} pages
                  </p>
                  <button
                    className="btn secondary small"
                    type="button"
                    onClick={() => toggleChapterExpanded(chapter.id)}
                  >
                    {expandedChapters[chapter.id] ? 'Hide Pages' : 'Show Pages'}
                  </button>
                </div>

                {expandedChapters[chapter.id] && (
                  <div className="stack" style={{ paddingLeft: '1rem', borderLeft: '2px solid var(--border-color)' }}>
                    {chapter.pages.map((page) => (
                      <div
                        key={page.id}
                        className="card"
                        style={{ background: 'var(--bg-secondary)' }}
                      >
                        <div className="row-between">
                          <strong>
                            Page {page.orderNumber}: {page.type}
                          </strong>
                          <span className="muted">ID: {page.id}</span>
                        </div>
                        {renderPagePreview(page)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Display Sections (Old Format) */}
            <p className="muted">
              <strong>Sections (Legacy Content):</strong> {chapter.sections.length}
            </p>

            <div className="stack">
              {chapter.sections.map((section) => (
                <section className="card" key={`${chapter.id}-${section.id}`}>
                  <label className="field">
                    <span>
                      Section {section.id} Header
                    </span>
                    <input
                      value={section.title}
                      onChange={(event) =>
                        handleSectionTitleChange(chapter.id, section.id, event.target.value)
                      }
                    />
                  </label>

                  <p className="muted">Contents: {section.contents.length}</p>

                  <div className="stack">
                    {section.contents.map((content) => (
                      <article className="card" key={`${chapter.id}-${section.id}-${content.id}`}>
                        <div className="row-between">
                          <h4>Content #{content.id}</h4>
                          <span className="muted">Content #{content.id}</span>
                        </div>

                        <label className="field">
                          <span>Content Header</span>
                          <input
                            value={content.title}
                            onChange={(event) =>
                              handleContentChange(
                                chapter.id,
                                section.id,
                                content.id,
                                'title',
                                event.target.value,
                              )
                            }
                          />
                        </label>

                        <label className="field">
                          <span>Content</span>
                          <textarea
                            value={content.text}
                            onChange={(event) =>
                              handleContentChange(
                                chapter.id,
                                section.id,
                                content.id,
                                'text',
                                event.target.value,
                              )
                            }
                            rows={4}
                          />
                        </label>

                        <label className="field">
                          <span>Image URL</span>
                          <input
                            value={content.image}
                            onChange={(event) =>
                              handleContentChange(
                                chapter.id,
                                section.id,
                                content.id,
                                'image',
                                event.target.value,
                              )
                            }
                            placeholder="/images/example.png"
                          />
                        </label>
                      </article>
                    ))}

                    <article className="card stack">
                      <label className="field">
                        <span>New Content Header</span>
                        <input
                          value={newContentTitles[`${chapter.id}-${section.id}`] ?? ''}
                          onChange={(event) =>
                            setNewContentTitles((currentTitles) => ({
                              ...currentTitles,
                              [`${chapter.id}-${section.id}`]: event.target.value,
                            }))
                          }
                          placeholder="Enter content title"
                        />
                      </label>

                      <button
                        className="btn secondary"
                        type="button"
                        onClick={() => handleAddContent(chapter.id, section.id)}
                      >
                        Add Content
                      </button>
                    </article>
                  </div>
                </section>
              ))}

              <section className="card stack">
                <label className="field">
                  <span>New Section Header</span>
                  <input
                    value={newSectionTitles[chapter.id] ?? ''}
                    onChange={(event) =>
                      setNewSectionTitles((currentTitles) => ({
                        ...currentTitles,
                        [chapter.id]: event.target.value,
                      }))
                    }
                    placeholder="Enter section title"
                  />
                </label>

                <button className="btn secondary" type="button" onClick={() => handleAddSection(chapter.id)}>
                  Add Section
                </button>
              </section>
            </div>
          </article>
        ))}

        <button className="btn" type="button" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </AppShell>
  )
}
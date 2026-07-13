import { useState, type FormEvent } from 'react'
import type { ManagedUser } from '../../types/user'

export interface StudentFormValue {
  fullName: string
  studentId: string
  pin: string
}

interface StudentFormProps {
  initialValue?: ManagedUser
  onSave: (value: StudentFormValue) => Promise<void>
  onCancel: () => void
  submitLabel: string
}

export function StudentForm({ initialValue, onSave, onCancel, submitLabel }: StudentFormProps) {
  const isEdit = Boolean(initialValue)
  const [value, setValue] = useState<StudentFormValue>({
    fullName: initialValue?.fullName ?? '',
    studentId: initialValue?.studentId ?? '',
    pin: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!value.fullName.trim()) {
      setError('Full name is required.')
      return
    }

    if (!value.studentId.trim()) {
      setError('Student ID is required.')
      return
    }

    if (!isEdit && !value.pin.trim()) {
      setError('PIN is required.')
      return
    }

    setSaving(true)
    setError('')

    try {
      await onSave(value)
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Failed to save student.'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      {error ? <p className="error-text">{error}</p> : null}

      <label className="field">
        <span>Full Name</span>
        <input
          value={value.fullName}
          onChange={(event) => setValue((current) => ({ ...current, fullName: event.target.value }))}
          required
        />
      </label>

      <label className="field">
        <span>Student ID</span>
        <input
          value={value.studentId}
          onChange={(event) => setValue((current) => ({ ...current, studentId: event.target.value }))}
          required
        />
      </label>

      <label className="field">
        <span>{isEdit ? 'New PIN (leave blank to keep current)' : 'PIN'}</span>
        <input
          type="password"
          value={value.pin}
          onChange={(event) => setValue((current) => ({ ...current, pin: event.target.value }))}
        />
      </label>

      <div className="row-between">
        <button type="button" className="btn secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

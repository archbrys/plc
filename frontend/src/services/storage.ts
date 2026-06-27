import type {
  AdminAccount,
  QuestionSet,
  QuizResult,
  StudentAccount,
} from '../types/quiz'

const STORAGE_KEYS = {
  students: 'quiz_students',
  admins: 'quiz_admins',
  questionSets: 'quiz_question_sets',
  results: 'quiz_results',
} as const

function loadFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function saveToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getStudents(): StudentAccount[] {
  return loadFromStorage<StudentAccount[]>(STORAGE_KEYS.students) ?? []
}

export function setStudents(students: StudentAccount[]): void {
  saveToStorage(STORAGE_KEYS.students, students)
}

export function getAdmins(): AdminAccount[] {
  return loadFromStorage<AdminAccount[]>(STORAGE_KEYS.admins) ?? []
}

export function setAdmins(admins: AdminAccount[]): void {
  saveToStorage(STORAGE_KEYS.admins, admins)
}

export function getQuestionSets(): QuestionSet[] {
  return loadFromStorage<QuestionSet[]>(STORAGE_KEYS.questionSets) ?? []
}

export function setQuestionSets(questionSets: QuestionSet[]): void {
  saveToStorage(STORAGE_KEYS.questionSets, questionSets)
}

export function getResults(): QuizResult[] {
  return loadFromStorage<QuizResult[]>(STORAGE_KEYS.results) ?? []
}

export function setResults(results: QuizResult[]): void {
  saveToStorage(STORAGE_KEYS.results, results)
}

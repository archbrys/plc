export type UserRole = 'student' | 'admin'

export type QuestionSetStatus = 'draft' | 'published' | 'archived'

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer'

export interface Choice {
  id: string
  questionId: string
  choiceText: string
  isCorrect: boolean
  orderNumber: number
}

export interface Question {
  id: string
  questionSetId: string
  questionText: string
  questionType: QuestionType
  orderNumber: number
  points: number
  required: boolean
  choices: Choice[]
}

export interface QuestionSet {
  id: string
  title: string
  description: string
  status: QuestionSetStatus
  questions: Question[]
}

export interface StudentAccount {
  id: string
  studentId: string
  pin: string
  fullName: string
}

export interface AdminAccount {
  id: string
  username: string
  password: string
  fullName: string
}

export interface AuthUser {
  id: string
  role: UserRole
  displayName: string
  username?: string
  studentId?: string
}

export interface StudentAnswer {
  questionId: string
  answerText?: string
  selectedChoiceId?: string
  selectedBoolean?: boolean
}

export interface QuestionScore {
  questionId: string
  earnedPoints: number
  maxPoints: number
}

export interface QuizResult {
  id: string
  questionSetId: string
  questionSetTitle: string
  studentId: string
  studentName: string
  totalPoints: number
  earnedPoints: number
  submittedAt: string
  answers: StudentAnswer[]
  scores: QuestionScore[]
}

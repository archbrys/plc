export type UserRole = 'admin' | 'student'

export type QuestionSetStatus = 'draft' | 'published' | 'archived'

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer'

export interface ApiUser {
  id: string
  role: UserRole
  displayName: string
  username?: string
  studentId?: string
}

export interface UserDTO {
  id: string
  role: UserRole
  fullName: string
  username?: string
  studentId?: string
  createdAt: string
  updatedAt: string
}

export interface ChoiceDTO {
  id: string
  questionId: string
  choiceText: string
  isCorrect: boolean
  orderNumber: number
}

export interface QuestionDTO {
  id: string
  questionSetId: string
  questionText: string
  questionType: QuestionType
  orderNumber: number
  points: number
  required: boolean
  choices: ChoiceDTO[]
}

export interface QuestionSetDTO {
  id: string
  title: string
  description: string
  status: QuestionSetStatus
  questions: QuestionDTO[]
}

export interface StudentAnswerDTO {
  questionId: string
  answerText?: string
  selectedChoiceId?: string
  selectedBoolean?: boolean
}

export interface QuestionScoreDTO {
  questionId: string
  earnedPoints: number
  maxPoints: number
}

export interface QuizResultDTO {
  id: string
  questionSetId: string
  questionSetTitle: string
  studentId: string
  studentName: string
  totalPoints: number
  earnedPoints: number
  submittedAt: string
  answers: StudentAnswerDTO[]
  scores: QuestionScoreDTO[]
}

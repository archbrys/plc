import type {
  AdminAccount,
  QuestionSet,
  QuizResult,
  StudentAccount,
} from '../types/quiz'
import {
  getAdmins,
  getQuestionSets,
  getResults,
  getStudents,
  setAdmins,
  setQuestionSets,
  setResults,
  setStudents,
} from './storage'

const studentsSeed: StudentAccount[] = [
  {
    id: 'stu-1',
    studentId: 'S1001',
    pin: '1234',
    fullName: 'Ava Student',
  },
  {
    id: 'stu-2',
    studentId: 'S1002',
    pin: '5678',
    fullName: 'Noah Learner',
  },
]

const adminsSeed: AdminAccount[] = [
  {
    id: 'adm-1',
    username: 'admin',
    password: 'admin123',
    fullName: 'System Admin',
  },
]

const questionSetsSeed: QuestionSet[] = [
  {
    id: 'set-1',
    title: 'Math Basics',
    description: 'Quick arithmetic and logic warm-up.',
    status: 'published',
    questions: [
      {
        id: 'q-1',
        questionSetId: 'set-1',
        questionText: 'What is 2 + 2?',
        questionType: 'multiple_choice',
        orderNumber: 1,
        points: 2,
        required: true,
        choices: [
          {
            id: 'c-1',
            questionId: 'q-1',
            choiceText: '3',
            isCorrect: false,
            orderNumber: 1,
          },
          {
            id: 'c-2',
            questionId: 'q-1',
            choiceText: '4',
            isCorrect: true,
            orderNumber: 2,
          },
        ],
      },
      {
        id: 'q-2',
        questionSetId: 'set-1',
        questionText: 'True or False: 9 is an odd number.',
        questionType: 'true_false',
        orderNumber: 2,
        points: 1,
        required: true,
        choices: [
          {
            id: 'c-3',
            questionId: 'q-2',
            choiceText: 'True',
            isCorrect: true,
            orderNumber: 1,
          },
          {
            id: 'c-4',
            questionId: 'q-2',
            choiceText: 'False',
            isCorrect: false,
            orderNumber: 2,
          },
        ],
      },
      {
        id: 'q-3',
        questionSetId: 'set-1',
        questionText: 'Write a number greater than 10.',
        questionType: 'short_answer',
        orderNumber: 3,
        points: 2,
        required: true,
        choices: [],
      },
    ],
  },
  {
    id: 'set-2',
    title: 'Science Draft Quiz',
    description: 'Draft set for future publishing.',
    status: 'draft',
    questions: [],
  },
  {
    id: 'set-3',
    title: 'Archived Sample',
    description: 'No longer active.',
    status: 'archived',
    questions: [],
  },
]

const resultsSeed: QuizResult[] = []

export function initializeMockData(): void {
  if (getStudents().length === 0) {
    setStudents(studentsSeed)
  }

  if (getAdmins().length === 0) {
    setAdmins(adminsSeed)
  }

  if (getQuestionSets().length === 0) {
    setQuestionSets(questionSetsSeed)
  }

  if (getResults().length === 0) {
    setResults(resultsSeed)
  }
}

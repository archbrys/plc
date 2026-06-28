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
    title: 'PLC Fundamentals',
    description: 'Interactive Digital Learning - Programmable Logic Controller trainer',
    status: 'published',
    questions: [
      {
        id: 'q1',
        questionText: 'What is the primary purpose of a Programmable Logic Controller (PLC)?',
        questionType: 'multiple_choice',
        orderNumber: 1,
        points: 1,
        required: true,
        choices: [
          { id: 'c1-1', choiceText: 'To create computer games', isCorrect: false, orderNumber: 1 },
          { id: 'c1-2', choiceText: 'To control and automate industrial processes', isCorrect: true, orderNumber: 2 },
          { id: 'c1-3', choiceText: 'To browse the internet', isCorrect: false, orderNumber: 3 },
          { id: 'c1-4', choiceText: 'To store multimedia files', isCorrect: false, orderNumber: 4 },
        ],
      },
      {
        id: 'q2',
        questionText: 'Which characteristic makes a PLC more suitable for industrial environments than a personal computer?',
        questionType: 'multiple_choice',
        orderNumber: 2,
        points: 1,
        required: true,
        choices: [
          { id: 'c2-1', choiceText: 'Larger screen size', isCorrect: false, orderNumber: 1 },
          { id: 'c2-2', choiceText: 'Faster internet connection', isCorrect: false, orderNumber: 2 },
          { id: 'c2-3', choiceText: 'Resistance to dust, vibration, and electrical noise', isCorrect: true, orderNumber: 3 },
          { id: 'c2-4', choiceText: 'Ability to run office applications', isCorrect: false, orderNumber: 4 },
        ],
      },
      {
        id: 'q3',
        questionText: 'What does PLC stand for?',
        questionType: 'multiple_choice',
        orderNumber: 3,
        points: 1,
        required: true,
        choices: [
          { id: 'c3-1', choiceText: 'Personal Learning Computer', isCorrect: false, orderNumber: 1 },
          { id: 'c3-2', choiceText: 'Programmable Logic Controller', isCorrect: true, orderNumber: 2 },
          { id: 'c3-3', choiceText: 'Public Library Catalog', isCorrect: false, orderNumber: 3 },
          { id: 'c3-4', choiceText: 'Power Line Communication', isCorrect: false, orderNumber: 4 },
        ],
      },
      {
        id: 'q4',
        questionText: 'PLCs are primarily used in automation and control systems. True or False?',
        questionType: 'true_false',
        orderNumber: 4,
        points: 1,
        required: true,
        choices: [
          { id: 'c4-1', choiceText: 'True', isCorrect: true, orderNumber: 1 },
          { id: 'c4-2', choiceText: 'False', isCorrect: false, orderNumber: 2 },
        ],
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

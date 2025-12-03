export type QuizCategory = 'css' | 'scss' | 'stylus'
export type QuizDifficulty = 'easy' | 'medium' | 'hard'
export type QuizResultCategory = 'css' | 'scss' | 'stylus' | 'mix'

export interface QuizQuestion {
  id: string
  questionText: string
  codeSnippet?: string | null
  answers: string[]
  category: QuizCategory
  difficulty: QuizDifficulty
  createdAt: string
  updatedAt: string
}

export interface QuizQuestionAdmin extends QuizQuestion {
  correctAnswerIndex: number
  explanation?: string | null
}

export interface QuizSettings {
  id: string
  questionsPerTest: number
  timePerQuestion: number
  createdAt: string
  updatedAt: string
}

export interface QuizTest {
  questions: QuizQuestion[]
  timePerQuestion: number
  totalQuestions: number
}

export interface QuizAnswer {
  questionId: string
  answerIndex: number
}

export interface QuizResult {
  id: string
  userId?: string | null
  username: string
  category: QuizResultCategory
  score: number
  totalQuestions: number
  timeTaken: number
  createdAt: string
}

export interface QuizDetailedResult {
  questionId: string
  questionText: string
  codeSnippet?: string | null
  answers: string[]
  userAnswer: number
  correctAnswer: number
  isCorrect: boolean
  explanation?: string | null
}

export interface QuizSubmitResponse {
  result: QuizResult
  detailedResults: QuizDetailedResult[]
}

export interface QuizAttemptLimit {
  allowed: boolean
  remaining: number
  limit: number
  resetAt?: string
}

export interface QuizLeaderboardEntry {
  rank: number
  username: string
  email?: string
  avatarUrl?: string | null
  score: number
  totalQuestions: number
  percentage: number
  timeTaken: number
  category: QuizResultCategory
  createdAt: string
}

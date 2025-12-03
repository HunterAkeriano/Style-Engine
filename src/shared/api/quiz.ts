import apiClient from './client'
import type {
  QuizQuestionAdmin,
  QuizSettings,
  QuizTest,
  QuizAnswer,
  QuizSubmitResponse,
  QuizResult,
  QuizAttemptLimit,
  QuizLeaderboardEntry,
  QuizResultCategory
} from '../types/quiz'

// ====== PUBLIC / USER APIs ======

export async function checkQuizLimit(): Promise<QuizAttemptLimit> {
  const response = await apiClient.get<QuizAttemptLimit>('/quiz/check-limit')
  return response.data
}

export async function getQuizTest(category: QuizResultCategory = 'mix'): Promise<QuizTest> {
  const response = await apiClient.get<QuizTest>(`/quiz/test?category=${category}`)
  return response.data
}

export async function submitQuizTest(
  category: QuizResultCategory,
  answers: QuizAnswer[],
  timeTaken: number,
  username?: string
): Promise<QuizSubmitResponse> {
  const response = await apiClient.post<QuizSubmitResponse>('/quiz/submit', {
    category,
    answers,
    timeTaken,
    username
  })
  return response.data
}

export async function getMyQuizResults(): Promise<QuizResult[]> {
  const response = await apiClient.get<{ results: QuizResult[] }>('/quiz/my-results')
  return response.data.results
}

export async function getQuizLeaderboard(
  category: QuizResultCategory | 'all' = 'all',
  limit = 10
): Promise<QuizLeaderboardEntry[]> {
  const response = await apiClient.get<{ leaderboard: QuizLeaderboardEntry[] }>(
    `/quiz/leaderboard?category=${category}&limit=${limit}`
  )
  return response.data.leaderboard
}

// ====== ADMIN APIs ======

export async function getAllQuestions(): Promise<QuizQuestionAdmin[]> {
  const response = await apiClient.get<{ questions: QuizQuestionAdmin[] }>('/quiz/questions')
  return response.data.questions
}

export async function createQuestion(data: {
  questionText: string
  questionTextUk?: string | null
  codeSnippet?: string | null
  answers: string[]
  answersUk?: string[] | null
  correctAnswerIndex: number
  explanation?: string | null
  explanationUk?: string | null
  category: 'css' | 'scss' | 'stylus'
  difficulty: 'easy' | 'medium' | 'hard'
}): Promise<QuizQuestionAdmin> {
  const response = await apiClient.post<{ question: QuizQuestionAdmin }>('/quiz/questions', data)
  return response.data.question
}

export async function updateQuestion(
  id: string,
  data: Partial<{
    questionText: string
    questionTextUk?: string | null
    codeSnippet?: string | null
    answers: string[]
    answersUk?: string[] | null
    correctAnswerIndex: number
    explanation?: string | null
    explanationUk?: string | null
    category: 'css' | 'scss' | 'stylus'
    difficulty: 'easy' | 'medium' | 'hard'
  }>
): Promise<QuizQuestionAdmin> {
  const response = await apiClient.put<{ question: QuizQuestionAdmin }>(`/quiz/questions/${id}`, data)
  return response.data.question
}

export async function deleteQuestion(id: string): Promise<void> {
  await apiClient.delete(`/quiz/questions/${id}`)
}

export async function getQuizSettings(): Promise<QuizSettings> {
  const response = await apiClient.get<{ settings: QuizSettings }>('/quiz/settings')
  return response.data.settings
}

export async function updateQuizSettings(data: {
  questionsPerTest: number
  timePerQuestion: number
}): Promise<QuizSettings> {
  const response = await apiClient.put<{ settings: QuizSettings }>('/quiz/settings', data)
  return response.data.settings
}

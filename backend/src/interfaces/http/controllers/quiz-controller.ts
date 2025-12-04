import { Router, type Request, type Response } from 'express'
import { z } from 'zod'
import { createAuthMiddleware, createOptionalAuthMiddleware, requireAdmin, type AuthRequest } from '../../../middleware/auth'
import type { Env } from '../../../config/env'
import type { HttpController } from '../api-router'
import type { Models } from '../../../models'
import { QuizService } from '../../../application/services/quiz-service'
import { sendApiError } from '../../../utils/apiError'

const quizCategoryEnum = z.enum(['css', 'scss', 'stylus'])
const quizDifficultyEnum = z.enum(['easy', 'medium', 'hard'])
const quizResultCategoryEnum = z.enum(['css', 'scss', 'stylus', 'mix'])

const createQuestionSchema = z.object({
  questionText: z.string().min(10).max(1000),
  questionTextUk: z.string().min(10).max(1000).optional().nullable(),
  codeSnippet: z.string().max(5000).optional().nullable(),
  answers: z.array(z.string().min(1).max(500)).min(2).max(6),
  answersUk: z.array(z.string().min(1).max(500)).min(2).max(6).optional().nullable(),
  correctAnswerIndex: z.number().int().min(0),
  explanation: z.string().max(2000).optional().nullable(),
  explanationUk: z.string().max(2000).optional().nullable(),
  category: quizCategoryEnum,
  difficulty: quizDifficultyEnum
})

const updateQuestionSchema = createQuestionSchema.partial()

const updateSettingsSchema = z.object({
  questionsPerTest: z.number().int().min(5).max(100),
  timePerQuestion: z.number().int().min(10).max(300)
})

const submitTestSchema = z.object({
  category: quizResultCategoryEnum,
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1).refine(
          (id) => {
            // Accept UUIDs or simple alphanumeric strings
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
            const simpleIdRegex = /^[a-z0-9]+$/i
            return uuidRegex.test(id) || simpleIdRegex.test(id)
          },
          { message: 'Invalid question ID format' }
        ),
        answerIndex: z.number().int().min(0)
      })
    )
    .min(1),
  timeTaken: z.number().int().min(0),
  username: z.string().min(1).max(50).optional().nullable()
})

export class QuizController implements HttpController {
  readonly basePath = '/quiz'

  private readonly auth = createAuthMiddleware(this.env)
  private readonly optionalAuth = createOptionalAuthMiddleware(this.env)
  private readonly service: QuizService

  constructor(private readonly env: Env, models: Models) {
    this.service = new QuizService(env, models)
  }

  register(router: Router) {
    router.get('/questions', this.auth, requireAdmin, async (req: Request, res: Response) => {
      try {
        const lang = this.getPreferredLanguage(req)
        const questions = await this.service.listQuestions(lang)
        res.json({ questions })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to fetch questions')
      }
    })

    router.post('/questions', this.auth, requireAdmin, async (req: Request, res: Response) => {
      const parsed = createQuestionSchema.safeParse(req.body)
      if (!parsed.success) {
        return sendApiError(res, 400, 'Invalid input', { details: parsed.error.issues })
      }
      try {
        if (parsed.data.correctAnswerIndex >= parsed.data.answers.length) {
          return sendApiError(res, 400, 'correctAnswerIndex out of range')
        }
        const lang = this.getPreferredLanguage(req)
        const question = await this.service.createQuestion(parsed.data, lang)
        res.status(201).json({ question })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to create question')
      }
    })

    router.put('/questions/:id', this.auth, requireAdmin, async (req: Request, res: Response) => {
      const parsed = updateQuestionSchema.safeParse(req.body)
      if (!parsed.success) {
        return sendApiError(res, 400, 'Invalid input', { details: parsed.error.issues })
      }
      try {
        const lang = this.getPreferredLanguage(req)
        const question = await this.service.updateQuestion(req.params.id, parsed.data, lang)
        res.json({ question })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to update question')
      }
    })

    router.delete('/questions/:id', this.auth, requireAdmin, async (req: Request, res: Response) => {
      try {
        await this.service.deleteQuestion(req.params.id)
        res.json({ message: 'Question deleted successfully' })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to delete question')
      }
    })

    router.get('/settings', this.auth, requireAdmin, async (_req: Request, res: Response) => {
      try {
        const settings = await this.service.getSettings()
        res.json({ settings })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to fetch settings')
      }
    })

    router.put('/settings', this.auth, requireAdmin, async (req: Request, res: Response) => {
      const parsed = updateSettingsSchema.safeParse(req.body)
      if (!parsed.success) {
        return sendApiError(res, 400, 'Invalid input', { details: parsed.error.issues })
      }
      try {
        const settings = await this.service.updateSettings(parsed.data)
        res.json({ settings })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to update settings')
      }
    })

    router.get('/check-limit', this.optionalAuth, async (req: Request, res: Response) => {
      try {
        const authReq = req as AuthRequest
        const limitInfo = await this.service.checkLimit(authReq.userId || null, this.getClientIp(req))
        res.json(limitInfo)
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to check attempt limit')
      }
    })

    router.get('/test', this.optionalAuth, async (req: Request, res: Response) => {
      try {
        const authReq = req as AuthRequest
        const category = (req.query.category as string) || 'mix'
        const lang = this.getPreferredLanguage(req)
        const test = await this.service.generateTest(category, lang, authReq.userId || null, this.getClientIp(req))
        res.json(test)
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to generate test')
      }
    })

    router.post('/submit', this.optionalAuth, async (req: Request, res: Response) => {
      const parsed = submitTestSchema.safeParse(req.body)
      if (!parsed.success) {
        return sendApiError(res, 400, 'Invalid input', { details: parsed.error.issues })
      }
      try {
        const authReq = req as AuthRequest
        const lang = this.getPreferredLanguage(req)
        const ipAddress = this.getClientIp(req)
        const result = await this.service.submitTest({
          ...parsed.data,
          userId: authReq.userId || null,
          lang,
          ipAddress
        })
        res.json(result)
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to submit test')
      }
    })

    router.get('/my-results', this.auth, async (req: AuthRequest, res: Response) => {
      try {
        const results = await this.service.myResults(req.userId!)
        res.json({ results })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to fetch results')
      }
    })

    router.get('/leaderboard', async (req: Request, res: Response) => {
      try {
        const category = (req.query.category as string) || 'all'
        const limitParam = parseInt((req.query.limit as string) || '10')
        const limit = isNaN(limitParam) ? 10 : limitParam
        const leaderboard = await this.service.leaderboard(category, limit)
        res.json({ leaderboard })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to fetch leaderboard')
      }
    })
  }

  private getPreferredLanguage(req: Request): 'uk' | 'en' {
    const header = (req.headers['accept-language'] || '').toString().toLowerCase()
    if (header.startsWith('uk')) return 'uk'
    return 'en'
  }

  private getClientIp(req: Request): string {
    return (
      ((req.headers['x-forwarded-for'] as string) ?? '').split(',')[0]?.trim() ||
      ((req.headers['x-real-ip'] as string) ?? '') ||
      req.socket.remoteAddress ||
      'unknown'
    )
  }
}

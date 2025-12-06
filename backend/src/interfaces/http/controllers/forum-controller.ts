import { Router } from 'express'
import { z } from 'zod'
import type { Env } from '../../../config/env'
import type { HttpController } from '../api-router'
import type { Models } from '../../../models'
import { createAuthMiddleware, requireAdmin, type AuthRequest } from '../../../middleware/auth'
import { ForumRepository } from '../../../infrastructure/repositories/forum-repository'
import { ForumService, type ForumAttachment } from '../../../application/services/forum-service'
import { sendApiError } from '../../../utils/apiError'
import { uploadForumAttachment } from '../../../middleware/upload'
import { broadcastForumEvent } from '../../ws/forum-ws'

const topicSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  attachments: z
    .array(z.object({ type: z.enum(['image', 'youtube']), url: z.string().url() }))
    .max(10)
    .optional()
})

const nullableParentId = z.preprocess(
  (value) => (value === null || value === '' ? undefined : value),
  z.string().uuid().optional()
)

const messageSchema = z.object({
  content: z.string().min(1).max(4000),
  parentId: nullableParentId,
  attachments: z
    .array(z.object({ type: z.enum(['image', 'youtube']), url: z.string().url() }))
    .max(5)
    .optional()
})

const statusSchema = z.object({
  status: z.enum(['open', 'in_review', 'closed'])
})

export class ForumController implements HttpController {
  readonly basePath = '/forum'

  private readonly auth = createAuthMiddleware(this.env)
  private readonly service: ForumService

  constructor(private readonly env: Env, models: Models) {
    this.service = new ForumService(new ForumRepository(models))
  }

  register(router: Router) {
    router.get('/topics', async (req, res) => {
      const page = Math.max(1, parseInt((req.query.page as string) || '1') || 1)
      const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) || '20') || 20))
      const status = (req.query.status as string) || undefined
      const allowedStatuses = ['open', 'in_review', 'closed']
      const normalizedStatus = allowedStatuses.includes(String(status)) ? (status as any) : undefined

      try {
        const payload = await this.service.listTopics({ page, limit, status: normalizedStatus })
        res.json(payload)
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to load topics')
      }
    })

    router.post('/topics', this.auth, async (req: AuthRequest, res) => {
      const parsed = topicSchema.safeParse(req.body)
      if (!parsed.success) {
        return sendApiError(res, 400, 'Invalid input', { details: parsed.error.issues })
      }
      try {
        const topic = await this.service.createTopic(req.userId!, {
          ...parsed.data,
          attachments: this.sanitizeAttachments(parsed.data.attachments ?? [], true)
        })
        res.status(201).json({ topic })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to create topic')
      }
    })

    router.get('/topics/:id', async (req, res) => {
      try {
        const payload = await this.service.getTopic(req.params.id)
        res.json(payload)
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to load topic')
      }
    })

    router.patch('/topics/:id', this.auth, async (req: AuthRequest, res) => {
      const parsed = topicSchema.partial().safeParse(req.body)
      if (!parsed.success) {
        return sendApiError(res, 400, 'Invalid input', { details: parsed.error.issues })
      }
      try {
        const patch = {
          ...parsed.data,
          attachments: parsed.data.attachments ? this.sanitizeAttachments(parsed.data.attachments, true) : undefined
        }
        const topic = await this.service.updateTopicContent(req.params.id, req.userId!, patch, Boolean(req.authUser?.isAdmin))
        broadcastForumEvent(req.params.id, 'topic-updated', topic)
        res.json({ topic })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to update topic')
      }
    })

    router.patch('/topics/:id/status', this.auth, requireAdmin, async (req: AuthRequest, res) => {
      const parsed = statusSchema.safeParse(req.body)
      if (!parsed.success) {
        return sendApiError(res, 400, 'Invalid status', { details: parsed.error.issues })
      }
      try {
        const topic = await this.service.updateStatus(req.params.id, parsed.data.status, Boolean(req.authUser?.isAdmin))
        broadcastForumEvent(req.params.id, 'status', topic)
        res.json({ topic })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to update status')
      }
    })

    router.post('/topics/:id/messages', this.auth, async (req: AuthRequest, res) => {
      const parsed = messageSchema.safeParse(req.body)
      if (!parsed.success) {
        return sendApiError(res, 400, 'Invalid input', { details: parsed.error.issues })
      }
      if (!req.userId) return sendApiError(res, 401, 'Unauthorized')

      const attachments = this.filterAttachments(parsed.data.attachments ?? [], Boolean(req.authUser?.isAdmin))

      try {
        const payload = await this.service.addMessage({
          topicId: req.params.id,
          userId: req.userId,
          content: parsed.data.content,
          parentId: parsed.data.parentId ?? null,
          attachments,
          isAdmin: Boolean(req.authUser?.isAdmin)
        })
        broadcastForumEvent(req.params.id, 'message', payload.message)
        res.status(201).json(payload)
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to add message')
      }
    })

    router.patch('/topics/:id/messages/:messageId', this.auth, async (req: AuthRequest, res) => {
      const parsed = messageSchema.pick({ content: true }).safeParse(req.body)
      if (!parsed.success) {
        return sendApiError(res, 400, 'Invalid input', { details: parsed.error.issues })
      }
      try {
        const message = await this.service.editMessage({
          topicId: req.params.id,
          messageId: req.params.messageId,
          userId: req.userId!,
          content: parsed.data.content,
          isAdmin: Boolean(req.authUser?.isAdmin)
        })
        broadcastForumEvent(req.params.id, 'message-edit', message)
        res.json({ message })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to update message')
      }
    })

    router.post('/attachments', this.auth, uploadForumAttachment.single('file'), async (req: AuthRequest, res) => {
      if (!req.file) {
        return sendApiError(res, 400, 'No file uploaded')
      }
      const topicId = (req.query.topicId as string) || 'temp'
      const url = `/uploads/forum/${topicId}/${req.file.filename}`
      res.status(201).json({ url })
    })
  }

  private filterAttachments(attachments: ForumAttachment[], isAdmin: boolean): ForumAttachment[] {
    return this.sanitizeAttachments(attachments, isAdmin)
  }

  private sanitizeAttachments(attachments: ForumAttachment[], allowYoutube: boolean): ForumAttachment[] {
    const result: ForumAttachment[] = []
    for (const item of attachments) {
      if (item.type === 'youtube') {
        if (!allowYoutube) continue
        const id = this.extractYoutubeId(item.url)
        if (id) {
          result.push({ type: 'youtube', url: `https://www.youtube.com/embed/${id}` })
        }
      } else {
        result.push(item)
      }
    }
    return result
  }

  private extractYoutubeId(url: string) {
    const match = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/i)
    return match ? match[1] : null
  }

}

import { Router } from 'express'
import { z } from 'zod'
import { getDb } from '../config/db'
import type { Env } from '../config/env'
import { createAuthMiddleware, type AuthRequest } from '../middleware/auth'
import { normalizePayload, stableStringify } from '../utils/payloadNormalization'

const saveSchema = z.object({
  name: z.string().min(1).max(120),
  payload: z.record(z.any())
})

export type Category = 'gradient' | 'shadow' | 'animation' | 'clip-path'

function tableForCategory(category: Category) {
  switch (category) {
    case 'gradient':
      return 'saved_gradients'
    case 'shadow':
      return 'saved_shadows'
    case 'animation':
      return 'saved_animations'
    case 'clip-path':
      return 'saved_clip_paths'
  }
}

export function createSavesRouter(env: Env) {
  const router = Router()
  const auth = createAuthMiddleware(env)
  const db = getDb()

  async function enforceLimit(_category: Category, req: AuthRequest) {
    const totalResult = await db.query(
      `SELECT
         (SELECT COUNT(*)::int FROM saved_gradients WHERE user_id = $1) +
         (SELECT COUNT(*)::int FROM saved_shadows WHERE user_id = $1) +
         (SELECT COUNT(*)::int FROM saved_animations WHERE user_id = $1) +
         (SELECT COUNT(*)::int FROM saved_clip_paths WHERE user_id = $1) AS count`,
      [req.userId]
    )
    const total = Number(totalResult.rows[0]?.count || 0)
    const tier = req.authUser?.subscriptionTier || (req.authUser?.isPayment ? 'pro' : 'free')
    const limit = tier === 'premium' ? Infinity : tier === 'pro' ? 50 : 5
    if (total >= limit) {
      return { message: 'Storage limit reached', limit }
    }
    return null
  }

  async function list(category: Category, req: AuthRequest, res: any) {
    const table = tableForCategory(category)
    const result = await db.query(
      `SELECT id, name, payload, status, is_featured as "isFeatured", approved_at as "approvedAt", created_at as "createdAt"
       FROM ${table}
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.userId]
    )
    res.json({ items: result.rows })
  }

  async function listPublic(category: Category, _req: any, res: any) {
    const table = tableForCategory(category)
    const result = await db.query(
      `SELECT
         s.id,
         s.name,
         s.payload,
         s.status,
         s.is_featured as "isFeatured",
         s.approved_at as "approvedAt",
         s.created_at as "createdAt",
         s.user_id as "userId",
         u.name as "ownerName",
         u.email as "ownerEmail",
         u.avatar_url as "ownerAvatar"
       FROM ${table} s
       LEFT JOIN users u ON u.id = s.user_id
       WHERE s.status = 'approved'
         AND (u.email IS NULL OR LOWER(u.email) != LOWER($1))
       ORDER BY s.is_featured DESC, s.approved_at DESC NULLS LAST, s.created_at DESC
       LIMIT 50`,
      [env.SUPER_ADMIN_EMAIL]
    )
    res.json({ items: result.rows })
  }

  async function create(category: Category, req: AuthRequest, res: any) {
    const parsed = saveSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.issues })
    const limitError = await enforceLimit(category, req)
    if (limitError) return res.status(403).json(limitError)
    const table = tableForCategory(category)
    const { name, payload } = parsed.data
    const duplicateCheck = await db.query(
      `SELECT id FROM ${table} WHERE user_id = $1 AND payload = $2`,
      [req.userId, payload]
    )
    if (duplicateCheck.rowCount) {
      return res.status(409).json({ message: 'Already saved' })
    }
    const result = await db.query(
      `INSERT INTO ${table} (user_id, name, payload, status)
       VALUES ($1, $2, $3, 'private')
       RETURNING id, name, payload, status, is_featured as "isFeatured", approved_at as "approvedAt", created_at as "createdAt"`,
      [req.userId, name, payload]
    )
    res.status(201).json({ item: result.rows[0] })
  }

  async function remove(category: Category, req: AuthRequest, res: any) {
    const table = tableForCategory(category)
    const id = req.params.id
    await db.query(`DELETE FROM ${table} WHERE id = $1 AND user_id = $2`, [id, req.userId])
    res.status(204).send()
  }

  async function requestPublish(category: Category, req: AuthRequest, res: any) {
    const table = tableForCategory(category)
    const id = req.params.id

    // Get the item to publish
    const itemResult = await db.query(
      `SELECT id, payload FROM ${table} WHERE id = $1 AND user_id = $2 AND status = 'private'`,
      [id, req.userId]
    )

    if (!itemResult.rowCount) {
      return res.status(404).json({ message: 'Item not found or already published' })
    }

    const item = itemResult.rows[0]
    const normalizedPayload = normalizePayload(category, item.payload)
    const payloadHash = stableStringify(normalizedPayload)

    // Check for duplicates in approved or pending items
    const allPublicItems = await db.query(
      `SELECT payload FROM ${table} WHERE status IN ('approved', 'pending')`,
      []
    )

    for (const publicItem of allPublicItems.rows) {
      const publicNormalized = normalizePayload(category, publicItem.payload)
      const publicHash = stableStringify(publicNormalized)

      if (payloadHash === publicHash) {
        return res.status(409).json({ message: 'This item already exists in public collection' })
      }
    }

    // Update status to pending
    const result = await db.query(
      `UPDATE ${table}
       SET status = 'pending'
       WHERE id = $1 AND user_id = $2 AND status = 'private'
       RETURNING id, name, payload, status, is_featured as "isFeatured", approved_at as "approvedAt", created_at as "createdAt"`,
      [id, req.userId]
    )

    if (!result.rowCount) {
      return res.status(404).json({ message: 'Item not found' })
    }

    res.json({ item: result.rows[0] })
  }

  /**
   * @swagger
   * /api/saves/gradients:
   *   get:
   *     summary: Получить список сохраненных градиентов
   *     description: Возвращает все сохраненные градиенты текущего пользователя
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Список градиентов успешно получен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SavedItem'
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/gradients', auth, (req, res) => list('gradient', req, res))
  /**
   * @swagger
   * /api/saves/public/gradients:
   *   get:
   *     summary: Получить опубликованные градиенты
   *     description: Возвращает до 50 одобренных градиентов (включая избранные)
   *     tags: [Saves]
   *     responses:
   *       200:
   *         description: Список опубликованных градиентов
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SavedItem'
   */
  router.get('/public/gradients', (req, res) => listPublic('gradient', req, res))

  /**
   * @swagger
   * /api/saves/gradients:
   *   post:
   *     summary: Сохранить градиент
   *     description: Создает новую запись с настройками градиента
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - payload
   *             properties:
   *               name:
   *                 type: string
   *                 minLength: 1
   *                 maxLength: 120
   *                 description: Название градиента
   *                 example: Sunset Gradient
   *               payload:
   *                 type: object
   *                 description: Настройки градиента в JSON формате
   *                 example: { "type": "linear", "angle": 45, "colors": [{"color": "#ff0000", "position": 0}] }
   *     responses:
   *       201:
   *         description: Градиент успешно сохранен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 item:
   *                   $ref: '#/components/schemas/SavedItem'
   *       400:
   *         description: Неверный формат данных
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/gradients', auth, (req, res) => create('gradient', req, res))
  /**
   * @swagger
   * /api/saves/gradients/{id}/publish:
   *   post:
   *     summary: Отправить градиент на модерацию
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           format: uuid
   *         required: true
   *         description: ID сохраненного градиента
   *     responses:
   *       200:
   *         description: Градиент отправлен на модерацию
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 item:
   *                   $ref: '#/components/schemas/SavedItem'
   *       401:
   *         description: Не авторизован
   *       404:
   *         description: Элемент не найден
   */
  router.post('/gradients/:id/publish', auth, (req, res) => requestPublish('gradient', req, res))

  /**
   * @swagger
   * /api/saves/gradients/{id}:
   *   delete:
   *     summary: Удалить сохраненный градиент
   *     description: Удаляет градиент по ID
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID градиента
   *     responses:
   *       204:
   *         description: Градиент успешно удален
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete('/gradients/:id', auth, (req, res) => remove('gradient', req, res))

  /**
   * @swagger
   * /api/saves/shadows:
   *   get:
   *     summary: Получить список сохраненных теней
   *     description: Возвращает все сохраненные тени текущего пользователя
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Список теней успешно получен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SavedItem'
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/shadows', auth, (req, res) => list('shadow', req, res))
  /**
   * @swagger
   * /api/saves/public/shadows:
   *   get:
   *     summary: Получить опубликованные тени
   *     tags: [Saves]
   *     responses:
   *       200:
   *         description: Список опубликованных теней
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SavedItem'
   */
  router.get('/public/shadows', (req, res) => listPublic('shadow', req, res))

  /**
   * @swagger
   * /api/saves/shadows:
   *   post:
   *     summary: Сохранить тень
   *     description: Создает новую запись с настройками тени
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - payload
   *             properties:
   *               name:
   *                 type: string
   *                 minLength: 1
   *                 maxLength: 120
   *                 description: Название тени
   *                 example: Soft Shadow
   *               payload:
   *                 type: object
   *                 description: Настройки тени в JSON формате
   *                 example: { "layers": [{"x": 0, "y": 4, "blur": 8, "spread": 0, "color": "#00000033"}] }
   *     responses:
   *       201:
   *         description: Тень успешно сохранена
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 item:
   *                   $ref: '#/components/schemas/SavedItem'
   *       400:
   *         description: Неверный формат данных
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/shadows', auth, (req, res) => create('shadow', req, res))
  /**
   * @swagger
   * /api/saves/shadows/{id}/publish:
   *   post:
   *     summary: Отправить тень на модерацию
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           format: uuid
   *         required: true
   *         description: ID сохраненной тени
   *     responses:
   *       200:
   *         description: Тень отправлена на модерацию
   *       401:
   *         description: Не авторизован
   *       404:
   *         description: Элемент не найден
   */
  router.post('/shadows/:id/publish', auth, (req, res) => requestPublish('shadow', req, res))

  /**
   * @swagger
   * /api/saves/shadows/{id}:
   *   delete:
   *     summary: Удалить сохраненную тень
   *     description: Удаляет тень по ID
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID тени
   *     responses:
   *       204:
   *         description: Тень успешно удалена
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete('/shadows/:id', auth, (req, res) => remove('shadow', req, res))

  /**
   * @swagger
   * /api/saves/animations:
   *   get:
   *     summary: Получить список сохраненных анимаций
   *     description: Возвращает все сохраненные анимации текущего пользователя
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Список анимаций успешно получен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SavedItem'
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/animations', auth, (req, res) => list('animation', req, res))
  /**
   * @swagger
   * /api/saves/public/animations:
   *   get:
   *     summary: Получить опубликованные анимации
   *     tags: [Saves]
   *     responses:
   *       200:
   *         description: Список опубликованных анимаций
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SavedItem'
   */
  router.get('/public/animations', (req, res) => listPublic('animation', req, res))

  /**
   * @swagger
   * /api/saves/animations:
   *   post:
   *     summary: Сохранить анимацию
   *     description: Создает новую запись с настройками анимации
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - payload
   *             properties:
   *               name:
   *                 type: string
   *                 minLength: 1
   *                 maxLength: 120
   *                 description: Название анимации
   *                 example: Bounce Effect
   *               payload:
   *                 type: object
   *                 description: Настройки анимации в JSON формате
   *                 example: { "name": "bounce", "duration": "1s", "timingFunction": "ease-in-out", "iterationCount": "infinite" }
   *     responses:
   *       201:
   *         description: Анимация успешно сохранена
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 item:
   *                   $ref: '#/components/schemas/SavedItem'
   *       400:
   *         description: Неверный формат данных
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/animations', auth, (req, res) => create('animation', req, res))
  /**
   * @swagger
   * /api/saves/animations/{id}/publish:
   *   post:
   *     summary: Отправить анимацию на модерацию
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           format: uuid
   *         required: true
   *         description: ID сохраненной анимации
   *     responses:
   *       200:
   *         description: Анимация отправлена на модерацию
   *       401:
   *         description: Не авторизован
   *       404:
   *         description: Элемент не найден
   */
  router.post('/animations/:id/publish', auth, (req, res) => requestPublish('animation', req, res))

  /**
   * @swagger
   * /api/saves/animations/{id}:
   *   delete:
   *     summary: Удалить сохраненную анимацию
   *     description: Удаляет анимацию по ID
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID анимации
   *     responses:
   *       204:
   *         description: Анимация успешно удалена
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete('/animations/:id', auth, (req, res) => remove('animation', req, res))

  /**
   * @swagger
   * /api/saves/clip-paths:
   *   get:
   *     summary: Получить список сохраненных clip-path
   *     description: Возвращает все сохраненные clip-path текущего пользователя
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Список clip-path успешно получен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SavedItem'
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/clip-paths', auth, (req, res) => list('clip-path', req, res))
  /**
   * @swagger
   * /api/saves/public/clip-paths:
   *   get:
   *     summary: Получить опубликованные clip-path
   *     tags: [Saves]
   *     responses:
   *       200:
   *         description: Список опубликованных clip-path
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 items:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SavedItem'
   */
  router.get('/public/clip-paths', (req, res) => listPublic('clip-path', req, res))

  /**
   * @swagger
   * /api/saves/clip-paths:
   *   post:
   *     summary: Сохранить clip-path
   *     description: Создает новую запись с настройками clip-path
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - payload
   *             properties:
   *               name:
   *                 type: string
   *                 minLength: 1
   *                 maxLength: 120
   *                 description: Название clip-path
   *                 example: Star Shape
   *               payload:
   *                 type: object
   *                 description: Настройки clip-path в JSON формате
   *                 example: { "layers": [{"type": "polygon", "points": [{"x": 50, "y": 0}]}] }
   *     responses:
   *       201:
   *         description: Clip-path успешно сохранен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 item:
   *                   $ref: '#/components/schemas/SavedItem'
   *       400:
   *         description: Неверный формат данных
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/clip-paths', auth, (req, res) => create('clip-path', req, res))
  /**
   * @swagger
   * /api/saves/clip-paths/{id}/publish:
   *   post:
   *     summary: Отправить clip-path на модерацию
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           format: uuid
   *         required: true
   *         description: ID сохраненного clip-path
   *     responses:
   *       200:
   *         description: Clip-path отправлен на модерацию
   *       401:
   *         description: Не авторизован
   *       404:
   *         description: Элемент не найден
   */
  router.post('/clip-paths/:id/publish', auth, (req, res) => requestPublish('clip-path', req, res))

  /**
   * @swagger
   * /api/saves/clip-paths/{id}:
   *   delete:
   *     summary: Удалить сохраненный clip-path
   *     description: Удаляет clip-path по ID
   *     tags: [Saves]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID clip-path
   *     responses:
   *       204:
   *         description: Clip-path успешно удален
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.delete('/clip-paths/:id', auth, (req, res) => remove('clip-path', req, res))

  return router
}
